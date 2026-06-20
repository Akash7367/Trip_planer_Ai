# M15 — PDF Export

**Milestone:** 15 of 20 | **Duration:** 1 Week | **Depends On:** M11, M14

---

## 1. Objective

Implement PDF generation for trip plans, producing a professionally formatted downloadable document with cover page, day-by-day itinerary, hotel and transport summaries, budget breakdown, and packing list.

---

## 2. Scope

- `generate_pdf` MCP tool (full implementation).
- PDF generation using `reportlab` or `weasyprint`.
- PDF stored in local filesystem (dev) / AWS S3 (production).
- Signed download URL generation (24-hour expiry).
- `GET /api/v1/trips/{id}/export/pdf` endpoint.
- Frontend PDF download button in trip detail view.

---

## 3. PDF Structure

```
Page 1: Cover Page
  - Aegis logo + trip title
  - Destination, dates, travelers, budget
  - Snapshot of signature experiences
  
Page 2: Destination Overview
  - Description, top attractions, practical info
  
Pages 3-N: Day-by-Day Itinerary (1 page per day)
  - Weather summary
  - Morning / Afternoon / Evening activities
  - Meal suggestions
  - Daily budget and logistics

Page N+1: Hotel Recommendations
  - 3 options with pros/cons table

Page N+2: Transport Plan  
  - Flight options, local transport guide

Page N+3: Budget Breakdown
  - Visual allocation table, savings tips

Page N+4: Practical Tips & Packing List
  - Cultural tips, emergency contacts, apps
  - Packing checklist by category
```

---

## 4. Implementation

```python
# mcp_server/tools/pdf_generator.py
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
import tempfile, os
from pathlib import Path

class GeneratePDFTool(BaseMCPTool):
    name = "generate_pdf"
    description = "Generate a formatted PDF trip plan document"
    cacheable = False
    
    # Aegis brand colors
    PRIMARY_COLOR = HexColor('#3B5BFF')
    DARK_BG = HexColor('#0D1117')
    LIGHT_TEXT = HexColor('#F5F5F5')
    ACCENT = HexColor('#FFB400')
    
    async def _execute(self, inputs: dict) -> dict:
        trip_plan = inputs["trip_plan"]
        trip_id = inputs["trip_id"]
        
        # Generate PDF bytes
        pdf_bytes = await self._generate_pdf(trip_plan)
        
        # Save to filesystem (dev) or S3 (production)
        pdf_path = await self._save_pdf(trip_id, pdf_bytes)
        
        # Generate download URL
        download_url = self._generate_download_url(pdf_path, trip_id)
        
        return {
            "pdf_url": download_url,
            "file_size_bytes": len(pdf_bytes),
            "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }
    
    async def _generate_pdf(self, plan: dict) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=20*mm, leftMargin=20*mm,
            topMargin=25*mm, bottomMargin=25*mm
        )
        
        styles = self._build_styles()
        story = []
        
        # Cover page
        story.extend(self._build_cover_page(plan, styles))
        
        # Destination overview
        story.extend(self._build_destination_section(plan.get("destination_report", {}), styles))
        
        # Day-by-day itinerary
        for day in plan.get("itinerary", []):
            story.extend(self._build_day_page(day, styles))
        
        # Hotel recommendations
        story.extend(self._build_hotels_section(plan.get("hotel_recommendations", []), styles))
        
        # Budget breakdown
        story.extend(self._build_budget_section(plan.get("budget_breakdown", {}), styles))
        
        # Practical tips
        story.extend(self._build_tips_section(plan, styles))
        
        doc.build(story)
        return buffer.getvalue()
    
    def _build_cover_page(self, plan: dict, styles) -> list:
        elements = []
        elements.append(Spacer(1, 30*mm))
        
        # Title
        elements.append(Paragraph(
            f"<font color='#{self.PRIMARY_COLOR.hexval()}'>✈ Aegis Travel</font>",
            styles['logo']
        ))
        elements.append(Spacer(1, 10*mm))
        elements.append(Paragraph(plan.get("title", "Your Trip"), styles['cover_title']))
        elements.append(Spacer(1, 5*mm))
        elements.append(Paragraph(
            f"{plan.get('destination', '')} • {plan.get('dates', '')}",
            styles['cover_subtitle']
        ))
        
        return elements
    
    def _build_day_page(self, day: dict, styles) -> list:
        elements = []
        elements.append(Paragraph(
            f"Day {day['day']} — {day.get('theme', '')}",
            styles['day_header']
        ))
        elements.append(Paragraph(
            f"📅 {day.get('date', '')} | 🌤 {day.get('weather', '')}",
            styles['day_meta']
        ))
        
        for period, label in [('morning', '🌅 Morning'), ('afternoon', '☀️ Afternoon'), ('evening', '🌙 Evening')]:
            activity = day.get(period, {})
            if activity:
                elements.append(Paragraph(label, styles['period_header']))
                elements.append(Paragraph(
                    f"{activity.get('activity', '')} — {activity.get('venue', '')}",
                    styles['activity']
                ))
                elements.append(Paragraph(
                    f"⏱ {activity.get('duration_hours', '')}h | 💰 ${activity.get('cost_usd', 0)}",
                    styles['activity_meta']
                ))
        
        return elements
```

---

## 5. FastAPI Endpoint

```python
# backend/app/api/v1/trips.py

@router.get("/{trip_id}/export/pdf")
async def export_pdf(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = TripRepository(db)
    trip = await repo.get_by_id(trip_id, str(current_user.id))
    
    if not trip:
        raise HTTPException(404, "Trip not found")
    if trip.status != "completed":
        raise HTTPException(400, "Trip planning must be completed before exporting")
    
    # Check for existing cached PDF
    if trip.pdf_url:
        # Verify URL hasn't expired (stored expiry in JSONB)
        return {"pdf_url": trip.pdf_url, "cached": True}
    
    # Generate fresh PDF via MCP
    mcp = get_mcp_client()
    result = await mcp.call_tool("generate_pdf", {
        "trip_id": trip_id,
        "trip_plan": trip.final_plan,
        "user_profile": {"full_name": current_user.full_name}
    })
    
    if not result.success:
        raise HTTPException(500, "PDF generation failed")
    
    # Cache PDF URL
    await repo.update_pdf_url(trip_id, result.data["pdf_url"])
    
    return result.data
```

---

## 6. Frontend PDF Button

```typescript
// src/components/dashboard/ExportButtons.tsx
'use client';

export function ExportButtons({ tripId }: { tripId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      const response = await apiClient.get(`/trips/${tripId}/export/pdf`);
      const { pdf_url } = response.data;
      window.open(pdf_url, '_blank');
    } catch (error) {
      toast.error('PDF generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="export-buttons">
      <button onClick={downloadPDF} disabled={isGenerating} className="btn-primary">
        {isGenerating ? (
          <><span className="spinner-sm" /> Generating PDF...</>
        ) : (
          <><DownloadIcon /> Download PDF</>
        )}
      </button>
    </div>
  );
}
```

---

## 7. Edge Cases

| Scenario | Behavior |
|---|---|
| Trip still planning | `400` with clear message |
| PDF library crashes | Return structured error, frontend shows "try again" |
| Very long itinerary (30+ days) | PDF generated with page limit warning; offer partial export |
| Missing fields in plan | Omit section with "Data unavailable" placeholder |
| S3 unavailable (production) | Fall back to local temp file with warning |

---

## 8. Acceptance Criteria

- [ ] PDF generated within 10 seconds for a 7-day trip.
- [ ] PDF contains: cover page, all itinerary days, hotels, budget, tips.
- [ ] PDF download URL valid for 24 hours.
- [ ] PDF is readable on mobile (no text cut-off on A4).
- [ ] `GET /trips/{id}/export/pdf` returns `400` for non-completed trips.
- [ ] Frontend button triggers download correctly.
- [ ] Generated PDF is ≤ 5MB for a standard 7-day trip.

---

## 9. Definition of Done

- PDF tool integration-tested with a real trip fixture.
- PDF structure validated (correct section count).
- Frontend download flow manually tested.
- PDF file size within limits.

---

*M15 — PDF Export | Duration: 1 Week*
