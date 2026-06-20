# M17 — Dynamic Replanning

**Milestone:** 17 of 20 | **Duration:** 1 Week | **Depends On:** M11

---

## 1. Objective

Implement the `ReplanningAgent` and the complete replanning workflow enabling users to adapt their trip plans in response to disruptions (weather changes, flight cancellations, budget changes, preference changes) without regenerating the entire plan.

---

## 2. Scope

- `ReplanningAgent` extending `BaseAgent`.
- `POST /api/v1/trips/{id}/replan` endpoint.
- LangGraph conditional routing to replanning node.
- Diff tracking — clearly mark changed elements.
- Frontend `ReplanPanel` component for disruption reporting.
- Change history storage in `trips.final_plan`.

---

## 3. Disruption Types

| Type | Trigger | Affected Elements |
|---|---|---|
| `weather` | Storm, extreme heat, monsoon | Specific day activities, outdoor plans |
| `flight_cancellation` | Flight cancelled or rescheduled | Transport plan, arrival/departure days |
| `budget_change` | User increases or decreases budget | Budget allocation, hotel tier, activity choices |
| `preference_change` | User changes dietary, activity preferences | Meal suggestions, activity selections |
| `hotel_change` | Hotel unavailable or user rejects | Hotel recommendation, neighborhood-based logistics |
| `date_change` | Trip dates shift | Full itinerary re-date, weather re-check |

---

## 4. ReplanningAgent Implementation

```python
# backend/app/agents/replanning.py

REPLANNING_SYSTEM_PROMPT = """You are a crisis travel advisor specializing in rapid, minimal itinerary adaptation.

ORIGINAL PLAN SUMMARY:
{original_summary}

DISRUPTION EVENT:
Type: {disruption_type}
Description: {disruption_description}
Affected Dates/Elements: {affected_elements}

REPLANNING PRINCIPLES:
1. MINIMUM CHANGE PRINCIPLE: Change only what is necessary. Preserve everything else.
2. Identify ALL elements impacted by this disruption (direct and indirect).
3. For each changed element, provide exactly 2 alternatives and recommend one.
4. Clearly tag every change with:
   - CHANGED: <original> → <new>
   - ADDED: <new element>
   - REMOVED: <element>
5. Explain WHY each change was made in one sentence.
6. If budget increases are required, state the additional amount and ask for confirmation.
7. Maintain the spirit and goals of the original trip.

Output JSON with:
- changes_summary: list of {type, element, original, updated, reason}
- updated_days: only the days that changed (delta, not full itinerary)
- updated_budget: only if budget changed
- updated_transport: only if transport changed
- recommendation_note: overall note to the traveler
"""

class ReplanningAgent(BaseAgent):
    agent_name = "ReplanningAgent"
    
    async def run(self, state: TripPlanningState) -> TripPlanningState:
        disruption = state.get("disruption_context", {})
        original_plan = state.get("final_plan", {})
        
        if not disruption or not original_plan:
            self.logger.error("Replanning attempted without disruption context or original plan")
            return state
        
        disruption_type = disruption.get("disruption_type")
        
        # Fetch only what we need to replan
        affected_reports = await self._fetch_affected_data(disruption_type, state)
        
        # Call LLM with focused context
        response = await self.llm.generate_structured(
            system=REPLANNING_SYSTEM_PROMPT.format(
                original_summary=self._summarize_plan(original_plan),
                disruption_type=disruption_type,
                disruption_description=disruption.get("disruption_description", ""),
                affected_elements=json.dumps(disruption.get("affected_dates", []))
            ),
            user=f"Affected data: {json.dumps(affected_reports)}",
            output_schema=REPLANNING_OUTPUT_SCHEMA
        )
        
        # Apply changes to original plan
        updated_plan = self._apply_changes(original_plan, response)
        
        # Save updated plan and changes to memory
        await self.call_tool("save_user_memory", {
            "user_id": state["user_id"],
            "memory_type": "feedback",
            "content": {
                "disruption_type": disruption_type,
                "trip_destination": original_plan.get("destination")
            }
        })
        
        state["final_plan"] = updated_plan
        state["current_phase"] = "replanned"
        return state
    
    async def _fetch_affected_data(self, disruption_type: str, state: TripPlanningState) -> dict:
        """Only fetch data relevant to this disruption type."""
        affected = {}
        
        if disruption_type == "weather":
            # Re-fetch weather for affected dates
            params = state["trip_params"]
            weather = await self.call_tool("get_weather_forecast", {
                "destination": params.get("destination"),
                "start_date": str(params.get("start_date")),
                "end_date": str(params.get("end_date"))
            })
            affected["weather"] = weather.data if weather.success else {}
        
        elif disruption_type == "flight_cancellation":
            # Re-search flights
            transport = await self.call_tool("search_flights", {
                "origin_iata": "JFK",  # Would come from original transport plan
                "destination_iata": "NRT",
                "departure_date": str(state["trip_params"].get("start_date")),
                "passengers": state["trip_params"].get("num_travelers", 1),
                "cabin_class": "economy"
            })
            affected["flights"] = transport.data if transport.success else {}
        
        elif disruption_type == "budget_change":
            affected["new_budget"] = state.get("disruption_context", {}).get("new_budget")
        
        return affected
    
    def _apply_changes(self, original_plan: dict, replan_response: dict) -> dict:
        """Apply delta changes to original plan."""
        updated = original_plan.copy()
        
        # Apply itinerary day changes
        updated_days = replan_response.get("updated_days", [])
        if updated_days:
            day_map = {d["day"]: d for d in updated.get("itinerary", [])}
            for changed_day in updated_days:
                day_map[changed_day["day"]] = changed_day
            updated["itinerary"] = list(day_map.values())
        
        # Apply budget changes
        if replan_response.get("updated_budget"):
            updated["budget_breakdown"] = {
                **updated.get("budget_breakdown", {}),
                **replan_response["updated_budget"]
            }
        
        # Apply transport changes
        if replan_response.get("updated_transport"):
            updated["transport_plan"] = {
                **updated.get("transport_plan", {}),
                **replan_response["updated_transport"]
            }
        
        # Track change history
        changes = replan_response.get("changes_summary", [])
        history = updated.get("change_history", [])
        history.append({
            "replanned_at": datetime.utcnow().isoformat(),
            "disruption_type": original_plan.get("disruption_type"),
            "changes": changes
        })
        updated["change_history"] = history
        updated["changes_summary"] = changes
        updated["recommendation_note"] = replan_response.get("recommendation_note", "")
        
        return updated
```

---

## 5. FastAPI Endpoint

```python
# backend/app/api/v1/trips.py

@router.post("/{trip_id}/replan", response_model=ReplanResponse)
async def replan_trip(
    trip_id: str,
    request: ReplanRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = TripRepository(db)
    trip = await repo.get_by_id(trip_id, str(current_user.id))
    
    if not trip:
        raise HTTPException(404, "Trip not found")
    if trip.status != "completed":
        raise HTTPException(400, "Can only replan completed trips")
    
    # Start replanning
    await repo.update_status(trip_id, "replanning")
    
    try:
        orchestrator = PlanningOrchestrator()
        final_state = await orchestrator.run_replanning(
            existing_trip_id=trip_id,
            existing_plan=trip.final_plan,
            trip_params=trip.trip_params,
            disruption_context={
                "disruption_type": request.disruption_type,
                "disruption_description": request.disruption_description,
                "affected_dates": request.affected_dates,
                "constraints": request.constraints.dict() if request.constraints else {}
            }
        )
        
        # Update trip
        updated_plan = final_state["final_plan"]
        trip.final_plan = updated_plan
        trip.status = "completed"
        trip.updated_at = datetime.utcnow()
        await db.commit()
        
        return ReplanResponse(
            trip_id=trip_id,
            status="replanned",
            changes_summary=updated_plan.get("changes_summary", []),
            updated_plan=updated_plan,
            recommendation_note=updated_plan.get("recommendation_note", "")
        )
    
    except Exception as e:
        await repo.update_status(trip_id, "completed")  # Revert to completed on failure
        raise HTTPException(500, f"Replanning failed: {str(e)}")
```

---

## 6. Request/Response Schemas

```python
class ReplanRequest(BaseModel):
    disruption_type: Literal["weather", "flight_cancellation", "budget_change", 
                              "preference_change", "hotel_change", "date_change"]
    disruption_description: str = Field(..., max_length=500)
    affected_dates: list[str] = []
    constraints: Optional[ReplanConstraints] = None

class ReplanConstraints(BaseModel):
    budget_change: float = 0  # Positive = increase, negative = decrease
    date_change: bool = False
    new_start_date: Optional[str] = None
    new_end_date: Optional[str] = None

class ChangeSummaryItem(BaseModel):
    type: Literal["CHANGED", "ADDED", "REMOVED"]
    element: str  # e.g., "Day 3 morning activity"
    original: Optional[str] = None
    updated: Optional[str] = None
    reason: str

class ReplanResponse(BaseModel):
    trip_id: str
    status: str
    changes_summary: list[ChangeSummaryItem]
    updated_plan: dict
    recommendation_note: str
```

---

## 7. Frontend ReplanPanel

```typescript
// src/components/dashboard/ReplanPanel.tsx
'use client';

const DISRUPTION_TYPES = [
  { value: 'weather', label: '🌩️ Weather disruption', description: 'Storm, extreme heat, or unexpected weather' },
  { value: 'flight_cancellation', label: '✈️ Flight cancelled/changed', description: 'Your flight has been cancelled or rescheduled' },
  { value: 'budget_change', label: '💰 Budget changed', description: 'Need to increase or decrease spending' },
  { value: 'preference_change', label: '🎯 Preference changed', description: 'Want to change activities or dining' },
];

export function ReplanPanel({ tripId, tripPlan, onReplanned }: Props) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isReplanning, setIsReplanning] = useState(false);

  const handleReplan = async () => {
    setIsReplanning(true);
    try {
      const response = await apiClient.post(`/trips/${tripId}/replan`, {
        disruption_type: type,
        disruption_description: description,
        affected_dates: []
      });
      
      onReplanned(response.data);
      toast.success('Trip has been replanned!');
    } catch {
      toast.error('Replanning failed. Please try again.');
    } finally {
      setIsReplanning(false);
    }
  };

  return (
    <div className="replan-panel">
      <h3>🔄 Replan Your Trip</h3>
      <p className="muted">Something changed? Let Aegis adapt your plan.</p>
      
      <div className="disruption-types">
        {DISRUPTION_TYPES.map(dt => (
          <button
            key={dt.value}
            className={`disruption-btn ${type === dt.value ? 'active' : ''}`}
            onClick={() => setType(dt.value)}
          >
            {dt.label}
            <small>{dt.description}</small>
          </button>
        ))}
      </div>
      
      {type && (
        <>
          <textarea
            placeholder="Describe what happened..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button onClick={handleReplan} disabled={isReplanning || !description}>
            {isReplanning ? '🤔 Replanning...' : '⚡ Replan My Trip'}
          </button>
        </>
      )}
    </div>
  );
}
```

---

## 8. Changes Visualization

```typescript
// Display changes with diff-style highlighting
export function ChangeSummary({ changes }: { changes: ChangeSummaryItem[] }) {
  return (
    <div className="changes-summary">
      <h3>What Changed</h3>
      {changes.map((change, i) => (
        <div key={i} className={`change-item change-${change.type.toLowerCase()}`}>
          <span className="change-badge">{change.type}</span>
          <div className="change-element">{change.element}</div>
          {change.original && (
            <div className="change-original">❌ {change.original}</div>
          )}
          {change.updated && (
            <div className="change-updated">✅ {change.updated}</div>
          )}
          <div className="change-reason">{change.reason}</div>
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Edge Cases

| Scenario | Behavior |
|---|---|
| Replan of non-completed trip | `400` error |
| Disruption affects entire trip | Full agent pipeline re-run |
| No changes needed for disruption | Return original plan with note: "No changes required" |
| Budget decrease makes plan unaffordable | Present minimum budget required |
| Date change shifts to different season | Re-run weather and destination agents |
| Simultaneous replan requests | Queue — only one active replan per trip |

---

## 10. Acceptance Criteria

- [ ] `POST /trips/{id}/replan` returns updated plan with changes highlighted.
- [ ] `changes_summary` includes type, original, updated, and reason for each change.
- [ ] Weather disruption replaces outdoor activities on affected days with indoor alternatives.
- [ ] Budget change updates budget allocation and affects hotel/activity recommendations.
- [ ] Change history preserved in `final_plan.change_history`.
- [ ] Replanning completes within 30 seconds.
- [ ] Frontend `ReplanPanel` allows disruption selection and submission.

---

## 11. Definition of Done

- ReplanningAgent unit-tested (mocked LLM and MCP).
- All disruption types tested in integration test.
- Change history correctly stored and retrieved.
- Frontend ReplanPanel and ChangeSummary manually tested.

---

*M17 — Dynamic Replanning | Duration: 1 Week*
