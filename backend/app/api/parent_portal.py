from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Student, ParentMessage, StudentProgress
from pydantic import BaseModel
from datetime import datetime
from app.api.auth import get_current_admin

router = APIRouter()

class MessageCreate(BaseModel):
    student_id: int
    message: str
    parent_name: str

class MessageResponse(BaseModel):
    id: int
    message: str
    sent_by: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/students")
def get_parent_students(parent_email: str, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get all students linked to a parent email"""
    students = db.query(Student).filter(Student.parent_email == parent_email).all()
    return students

@router.post("/messages")
def send_message(message: MessageCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Send message from parent to teacher"""
    student = db.query(Student).filter(Student.id == message.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db_message = ParentMessage(
        student_id=message.student_id,
        parent_name=message.parent_name,
        message=message.message,
        sent_by="parent"
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/messages/{student_id}", response_model=List[MessageResponse])
def get_messages(student_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get all messages for a student"""
    messages = db.query(ParentMessage).filter(ParentMessage.student_id == student_id).order_by(ParentMessage.created_at.desc()).all()
    return messages

@router.get("/progress/{student_id}")
def get_student_progress(student_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get student progress report"""
    progress = db.query(StudentProgress).filter(StudentProgress.student_id == student_id).all()
    
    # Calculate overall stats
    if progress:
        avg_attendance = sum(p.attendance_percentage for p in progress) / len(progress)
        avg_completion = sum(p.assignment_completion for p in progress) / len(progress)
        avg_scores = sum(p.test_scores for p in progress) / len(progress)
        
        return {
            "subjects": progress,
            "summary": {
                "average_attendance": round(avg_attendance, 2),
                "average_assignment_completion": round(avg_completion, 2),
                "average_test_scores": round(avg_scores, 2)
            }
        }
    
    return {"subjects": [], "summary": {}}
