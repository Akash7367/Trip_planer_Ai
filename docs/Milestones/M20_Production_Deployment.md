# M20 — Production Deployment

**Milestone:** 20 of 20 | **Duration:** 1 Week | **Depends On:** M19

---

## 1. Objective

Deploy the Aegis platform to production on AWS with a complete infrastructure-as-code setup, CI/CD pipeline, monitoring, logging, and alerting.

---

## 2. Scope

- AWS infrastructure provisioning with Terraform.
- Docker images pushed to ECR.
- ECS Fargate deployment (backend and frontend).
- RDS PostgreSQL Multi-AZ.
- ElastiCache Redis Cluster.
- Application Load Balancer + HTTPS.
- CloudWatch monitoring + alarms.
- GitHub Actions CI/CD pipeline (test → build → deploy).
- SSL certificate via ACM.
- AWS Secrets Manager for sensitive config.

---

## 3. AWS Architecture

```mermaid
graph TB
    subgraph "Internet"
        USER[Users]
        GITHUB[GitHub Actions]
    end

    subgraph "AWS - us-east-1"
        subgraph "CloudFront"
            CF[CloudFront Distribution]
        end

        subgraph "VPC - 10.0.0.0/16"
            subgraph "Public Subnets - AZ-A & AZ-B"
                ALB[Application Load Balancer]
                NAT_A[NAT Gateway AZ-A]
                NAT_B[NAT Gateway AZ-B]
            end

            subgraph "Private App Subnets"
                ECS_BE[ECS Fargate - Backend 1-3 tasks]
                ECS_FE[ECS Fargate - Frontend 1-2 tasks]
            end

            subgraph "Private Data Subnets"
                RDS_PRIMARY[(RDS PostgreSQL Primary)]
                RDS_REPLICA[(RDS Read Replica)]
                REDIS[(ElastiCache Redis)]
            end
        end

        ECR[ECR Container Registry]
        SM[Secrets Manager]
        S3[S3 - PDFs & Assets]
        ACM[ACM - SSL Certificate]
        CW[CloudWatch]
        SES[AWS SES]
        SNS[SNS - Alerts]
    end

    USER --> CF --> ALB
    GITHUB --> ECR --> ECS_BE & ECS_FE
    ALB --> ECS_BE & ECS_FE
    ECS_BE --> RDS_PRIMARY & REDIS & SM & S3 & SES
    ECS_BE & ECS_FE --> CW
    CW --> SNS
```

---

## 4. Terraform Infrastructure

```hcl
# terraform/main.tf

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "aegis-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "aegis-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]
  
  enable_nat_gateway     = true
  single_nat_gateway     = false  # One per AZ for HA
  enable_dns_hostnames   = true
  enable_dns_support     = true
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier        = "aegis-prod-postgres"
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  storage_encrypted = true
  
  db_name  = "trip_planner"
  username = var.db_username
  password = var.db_password
  
  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  backup_retention_period = 7
  skip_final_snapshot     = false
  final_snapshot_identifier = "aegis-final-snapshot"
  
  deletion_protection = true
}

# ElastiCache Redis
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "aegis-redis"
  description          = "Aegis Redis Cache"
  node_type            = "cache.t3.micro"
  num_cache_clusters   = 2
  
  subnet_group_name          = aws_elasticache_subnet_group.main.name
  security_group_ids         = [aws_security_group.redis.id]
  automatic_failover_enabled = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "aegis-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Backend ECS Service
resource "aws_ecs_service" "backend" {
  name            = "aegis-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.backend.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 8000
  }
  
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
}
```

---

## 5. Secrets Management

```hcl
# terraform/secrets.tf
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "aegis/production/app"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    SECRET_KEY           = var.secret_key
    REFRESH_SECRET_KEY   = var.refresh_secret_key
    GEMINI_API_KEY       = var.gemini_api_key
    OPENAI_API_KEY       = var.openai_api_key
    POSTGRES_PASSWORD    = var.db_password
    SMTP_USER            = var.smtp_user
    SMTP_PASSWORD        = var.smtp_password
  })
}
```

```python
# backend/app/core/config.py additions for production
import boto3
import json

def get_aws_secret(secret_name: str) -> dict:
    client = boto3.client("secretsmanager", region_name="us-east-1")
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response["SecretString"])

# In production, override settings from Secrets Manager
if os.getenv("ENVIRONMENT") == "production":
    secrets = get_aws_secret("aegis/production/app")
    os.environ.update(secrets)
```

---

## 6. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: trip_planner_test
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/ --cov=app --cov-report=xml --cov-fail-under=80
        env:
          POSTGRES_SERVER: localhost
          TEST_DATABASE_URL: postgresql+asyncpg://postgres:testpassword@localhost/trip_planner_test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push backend image
        run: |
          docker build -t $ECR_REGISTRY/aegis-backend:${{ github.sha }} ./backend
          docker push $ECR_REGISTRY/aegis-backend:${{ github.sha }}
          docker tag $ECR_REGISTRY/aegis-backend:${{ github.sha }} $ECR_REGISTRY/aegis-backend:latest
          docker push $ECR_REGISTRY/aegis-backend:latest
      
      - name: Build and push frontend image
        run: |
          docker build -t $ECR_REGISTRY/aegis-frontend:${{ github.sha }} ./frontend
          docker push $ECR_REGISTRY/aegis-frontend:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy backend to ECS
        run: |
          aws ecs update-service \
            --cluster aegis-cluster \
            --service aegis-backend \
            --force-new-deployment \
            --region ${{ env.AWS_REGION }}
      
      - name: Deploy frontend to ECS
        run: |
          aws ecs update-service \
            --cluster aegis-cluster \
            --service aegis-frontend \
            --force-new-deployment \
            --region ${{ env.AWS_REGION }}
      
      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster aegis-cluster \
            --services aegis-backend aegis-frontend
      
      - name: Smoke test production
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.aegis.travel/api/v1/health)
          if [ "$STATUS" -ne 200 ]; then
            echo "Smoke test failed! Status: $STATUS"
            exit 1
          fi
      
      - name: Notify Slack on success
        uses: slackapi/slack-github-action@v1.26.0
        with:
          payload: '{"text": "✅ Aegis deployed successfully! SHA: ${{ github.sha }}"}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 7. CloudWatch Monitoring

```hcl
# terraform/monitoring.tf

# API Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "aegis-high-api-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 1.0
  alarm_description   = "API error rate exceeds 1%"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

# Planning Latency Alarm
resource "aws_cloudwatch_metric_alarm" "high_latency" {
  alarm_name          = "aegis-high-planning-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  extended_statistic  = "p95"
  threshold           = 60
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

# ECS Task Health
resource "aws_cloudwatch_metric_alarm" "ecs_tasks_unhealthy" {
  alarm_name          = "aegis-ecs-tasks-unhealthy"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "RunningTaskCount"
  namespace           = "ECS/ContainerInsights"
  period              = 60
  statistic           = "Minimum"
  threshold           = 1
  alarm_actions       = [aws_sns_topic.alerts.arn]
}
```

---

## 8. Local Setup Guide

```markdown
# Local Development Setup

## Prerequisites
- Docker Desktop
- Node.js 20+
- Python 3.12+
- Git

## Setup Steps

1. Clone repository:
   ```bash
   git clone https://github.com/aegis/trip-planner.git
   cd trip-planner
   ```

2. Configure environment:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit .env files with your API keys
   ```

3. Start all services:
   ```bash
   docker compose up --build
   ```

4. Run database migrations:
   ```bash
   docker compose exec backend alembic upgrade head
   ```

5. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Swagger Docs: http://localhost:8000/docs
   - MailHog: http://localhost:8025
```

---

## 9. Rollback Strategy

```bash
# Rollback to previous ECS task definition revision
aws ecs update-service \
  --cluster aegis-cluster \
  --service aegis-backend \
  --task-definition aegis-backend:PREVIOUS_REVISION \
  --region us-east-1

# Verify rollback
aws ecs wait services-stable \
  --cluster aegis-cluster \
  --services aegis-backend
```

---

## 10. Acceptance Criteria

- [ ] `terraform plan` runs without errors on clean AWS account.
- [ ] `terraform apply` provisions all infrastructure.
- [ ] GitHub Actions deploys successfully on push to `main`.
- [ ] `https://api.aegis.travel/api/v1/health` returns `{"status": "healthy"}`.
- [ ] `https://aegis.travel` loads the frontend.
- [ ] SSL certificate valid (HTTPS enforced).
- [ ] CloudWatch alarms configured and reachable.
- [ ] Database Multi-AZ failover tested.
- [ ] Rollback procedure documented and tested.
- [ ] Secrets stored in AWS Secrets Manager (no plaintext in env).

---

## 11. Definition of Done

- All services running on AWS ECS Fargate.
- CI/CD pipeline deployed to production on a test commit.
- Monitoring dashboards live.
- Runbook documented for common operational tasks.
- Team walkthrough of deployment architecture completed.

---

*M20 — Production Deployment | Duration: 1 Week*
