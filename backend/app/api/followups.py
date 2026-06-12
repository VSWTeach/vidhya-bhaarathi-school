from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import Student, Admin
from pydantic import BaseModel

router = APIRouter()

class FollowUpCreate(BaseModel):
    student_id: int
    follow_up_type: str
    title: str
    description: Optional[str] = None
    scheduled_date: datetime
    priority: str = "medium"

class FollowUpResponse(BaseModel):
    id: int
    student_id: int
    follow_up_type: str
    title: str
    description: Optional[str] = None
    scheduled_date: datetime
    priority: str
    status: str
    
    class Config:
        from_attributes = True

# In-memory storage for demo (since we don't have the table yet)
followups_db = []
next_id = 1

@router.post("/followups", response_model=FollowUpResponse)
def create_followup(followup: FollowUpCreate, db: Session = Depends(get_db)):
    global next_id
    student = db.query(Student).filter(Student.id == followup.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    new_followup = {
        "id": next_id,
        "student_id": followup.student_id,
        "follow_up_type": followup.follow_up_type,
        "title": followup.title,
        "description": followup.description,
        "scheduled_date": followup.scheduled_date,
        "priority": followup.priority,
        "status": "scheduled"
    }
    followups_db.append(new_followup)
    next_id += 1
    
    return new_followup

@router.get("/followups", response_model=List[FollowUpResponse])
def get_followups(limit: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    results = followups_db
    if status:
        results = [f for f in results if f["status"] == status]
    if limit:
        results = results[:limit]
    return results

@router.put("/followups/{followup_id}/complete")
def complete_followup(followup_id: int, outcome: str, db: Session = Depends(get_db)):
    for f in followups_db:
        if f["id"] == followup_id:
            f["status"] = "completed"
            f["outcome"] = outcome
            return {"message": "Follow-up completed", "outcome": outcome}
    raise HTTPException(status_code=404, detail="Follow-up not found")
