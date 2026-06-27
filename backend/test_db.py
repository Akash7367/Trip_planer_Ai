import sys
import os
from sqlalchemy import create_engine, text

# Add the current directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings

def test_connection():
    print("Database URL:", settings.DATABASE_URL)
    try:
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            print("Successfully connected to the database!")
            
            # Check existing tables
            res = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
            tables = [row[0] for row in res]
            print("Existing tables in public schema:", tables)
            
            if "users" in tables or "user" in tables:
                table_name = "users" if "users" in tables else "user"
                user_count = conn.execute(text(f"SELECT COUNT(*) FROM \"{table_name}\"")).scalar()
                print(f"Number of registered users: {user_count}")
                if user_count > 0:
                    users = conn.execute(text(f"SELECT id, name, email FROM \"{table_name}\" LIMIT 5"))
                    print("Sample users:")
                    for u in users:
                        print(f"  ID: {u[0]}, Name: {u[1]}, Email: {u[2]}")
            else:
                print("No user table found. Have migrations been run?")
    except Exception as e:
        print("Database connection failed!")
        print("Error details:", str(e))

if __name__ == "__main__":
    test_connection()
