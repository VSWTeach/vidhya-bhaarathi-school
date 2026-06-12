from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from app.models import Student, StudyMaterial, MaterialDistribution, Event, EventRegistration
from app.services.whatsapp_service import whatsapp_service
from app.api.auth import get_current_admin

router = APIRouter()

# Request models
class WhatsAppMessageRequest(BaseModel):
    phone: str
    message: str

class BulkWhatsAppRequest(BaseModel):
    student_ids: List[int]
    message_template: str
    subject: str

class FeeReminderRequest(BaseModel):
    student_id: int
    amount: float
    due_date: str

@router.post("/send")
def send_whatsapp_message(
    request: WhatsAppMessageRequest,
    background_tasks: BackgroundTasks,
    current_admin = Depends(get_current_admin)
):
    """Send a custom WhatsApp message"""
    background_tasks.add_task(
        whatsapp_service.send_message,
        request.phone,
        request.message
    )
    return {"message": "WhatsApp message queued", "to": request.phone}

@router.post("/send-study-material")
def send_study_material_alert(
    student_id: int,
    material_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Send study material alert to student"""
    # Get student
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get material
    material = db.query(StudyMaterial).filter(StudyMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    # Get distribution for due date
    distribution = db.query(MaterialDistribution).filter(
        MaterialDistribution.student_id == student_id,
        MaterialDistribution.material_id == material_id
    ).first()
    
    due_date = distribution.due_date.strftime('%d %B %Y') if distribution and distribution.due_date else None
    
    # Send message
    background_tasks.add_task(
        whatsapp_service.send_study_material_alert,
        f"{student.first_name} {student.last_name}",
        student.phone,
        material.title,
        material.subject,
        due_date
    )
    
    return {
        "message": "Study material alert queued",
        "student": f"{student.first_name} {student.last_name}",
        "material": material.title
    }

@router.post("/send-fee-reminder")
def send_fee_reminder(
    request: FeeReminderRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Send fee reminder to parent"""
    student = db.query(Student).filter(Student.id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    background_tasks.add_task(
        whatsapp_service.send_fee_reminder,
        f"{student.first_name} {student.last_name}",
        student.parent_phone or student.phone,
        request.amount,
        request.due_date,
        student.class_name
    )
    
    return {
        "message": "Fee reminder queued",
        "student": f"{student.first_name} {student.last_name}",
        "amount": request.amount
    }

@router.post("/send-event-reminder")
def send_event_reminder(
    registration_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Send event reminder to registered participants"""
    registration = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    event = db.query(Event).filter(Event.id == registration.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    background_tasks.add_task(
        whatsapp_service.send_event_reminder,
        registration.student_name,
        registration.phone,
        event.title,
        event.event_date.strftime('%d %B %Y'),
        event.venue
    )
    
    return {"message": "Event reminder queued"}

@router.post("/broadcast-to-class")
def broadcast_to_class(
    class_name: str,
    message: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Broadcast WhatsApp message to entire class"""
    students = db.query(Student).filter(Student.class_name == class_name).all()
    
    if not students:
        raise HTTPException(status_code=404, detail="No students found in this class")
    
    for student in students:
        if student.phone:
            background_tasks.add_task(
                whatsapp_service.send_message,
                student.phone,
                f"📢 *Announcement for Class {class_name}*\n\n{message}\n\n- Vidya Bharati Public School"
            )
    
    return {
        "message": f"Broadcast queued for {len(students)} students",
        "class": class_name,
        "students_count": len(students)
    }

@router.post("/broadcast-to-all")
def broadcast_to_all(
    message: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Broadcast WhatsApp message to all students"""
    students = db.query(Student).filter(Student.phone.isnot(None)).all()
    
    for student in students:
        background_tasks.add_task(
            whatsapp_service.send_message,
            student.phone,
            f"📢 *School Announcement*\n\n{message}\n\n- Vidya Bharati Public School"
        )
    
    return {
        "message": f"Broadcast queued for {len(students)} students",
        "students_count": len(students)
    }

@router.get("/status")
def get_whatsapp_status(current_admin = Depends(get_current_admin)):
    """Get WhatsApp integration status"""
    return whatsapp_service.get_status()

@router.post("/test")
def test_whatsapp(current_admin = Depends(get_current_admin)):
    """Test WhatsApp integration (demo mode)"""
    result = whatsapp_service.send_message(
        "9876543210",
        "🔔 *Test Message from Vidya Bharati Public School*\n\n"
        "This is a test message to verify WhatsApp integration.\n\n"
        "Your school ERP system is working correctly! 🎉\n\n"
        f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )
    return result
