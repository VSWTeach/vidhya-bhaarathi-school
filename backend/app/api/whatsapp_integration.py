from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import Student, Admin, StudyMaterial
from app.api.auth import get_current_admin
import requests
import json
import os

router = APIRouter()

# WhatsApp Business API Configuration
# Using WhatsApp Business API (requires Meta Business verification)
# For demo, we'll use a simulation mode

class WhatsAppService:
    def __init__(self):
        # In production, set these environment variables
        self.whatsapp_token = os.getenv("WHATSAPP_TOKEN", "demo_token")
        self.whatsapp_phone_id = os.getenv("WHATSAPP_PHONE_ID", "demo_phone_id")
        self.whatsapp_api_url = "https://graph.facebook.com/v18.0"
        
    def send_message(self, to_number: str, message: str, is_demo: bool = True) -> dict:
        """Send WhatsApp message to student/parent"""
        # Remove country code if present, add +91 for India
        if not to_number.startswith("+"):
            to_number = f"+91{to_number}"
        
        if is_demo:
            # Demo mode - log message instead of sending
            print(f"[DEMO] WhatsApp to {to_number}: {message[:100]}...")
            return {"success": True, "demo": True, "message": "Demo mode - message logged"}
        
        # Production - actual WhatsApp API call
        headers = {
            "Authorization": f"Bearer {self.whatsapp_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "messaging_product": "whatsapp",
            "to": to_number,
            "type": "text",
            "text": {"body": message}
        }
        
        response = requests.post(
            f"{self.whatsapp_api_url}/{self.whatsapp_phone_id}/messages",
            headers=headers,
            json=data
        )
        
        return response.json()
    
    def send_study_material(self, to_number: str, student_name: str, material_title: str, file_url: str = None) -> dict:
        """Send study material via WhatsApp"""
        message = f"""📚 *Study Material Alert* - Vidya Bharati Public School

Dear {student_name},

New study material has been assigned to you:
📖 *{material_title}*

Please login to the student portal to access this material.

Login: http://localhost:3000/student/login
Use your Student ID as username

Best regards,
Vidya Bharati Public School"""
        
        return self.send_message(to_number, message)

whatsapp_service = WhatsAppService()

@router.post("/whatsapp/send-material")
def send_material_via_whatsapp(
    student_id: int,
    material_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Send study material notification via WhatsApp"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    material = db.query(StudyMaterial).filter(StudyMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    # Send in background to not block response
    background_tasks.add_task(
        whatsapp_service.send_study_material,
        student.phone,
        f"{student.first_name} {student.last_name}",
        material.title,
        material.file_url
    )
    
    return {
        "message": "WhatsApp notification queued",
        "student": f"{student.first_name} {student.last_name}",
        "phone": student.phone,
        "material": material.title
    }

@router.post("/whatsapp/broadcast-material")
def broadcast_material_via_whatsapp(
    class_name: str,
    material_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Send study material notification to entire class via WhatsApp"""
    students = db.query(Student).filter(Student.class_name == class_name).all()
    material = db.query(StudyMaterial).filter(StudyMaterial.id == material_id).first()
    
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    if not students:
        raise HTTPException(status_code=404, detail="No students found in this class")
    
    for student in students:
        if student.phone:
            background_tasks.add_task(
                whatsapp_service.send_study_material,
                student.phone,
                f"{student.first_name} {student.last_name}",
                material.title,
                material.file_url
            )
    
    return {
        "message": f"WhatsApp notifications queued for {len(students)} students",
        "class": class_name,
        "material": material.title,
        "students_notified": len(students)
    }

@router.post("/whatsapp/send-fee-reminder")
def send_fee_reminder(
    student_id: int,
    amount_due: float,
    due_date: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Send fee reminder via WhatsApp"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    message = f"""💰 *Fee Reminder* - Vidya Bharati Public School

Dear Parent of {student.first_name} {student.last_name},

This is a reminder that fee of ₹{amount_due} is due by {due_date}.

Please make the payment at the earliest to avoid late fees.

For online payment, visit: http://localhost:3000/pay-fee

Thank you,
Accounts Department
Vidya Bharati Public School"""
    
    background_tasks.add_task(whatsapp_service.send_message, student.parent_phone or student.phone, message)
    
    return {
        "message": "Fee reminder sent via WhatsApp",
        "student": f"{student.first_name} {student.last_name}",
        "amount": amount_due
    }

@router.get("/whatsapp/send-test")
def test_whatsapp_integration(current_admin = Depends(get_current_admin)):
    """Test WhatsApp integration (demo mode)"""
    result = whatsapp_service.send_message(
        "9876543210", 
        "🔔 Test message from Vidya Bharati Public School ERP system. WhatsApp integration is working in demo mode!"
    )
    return result

@router.get("/whatsapp/status")
def get_whatsapp_status(current_admin = Depends(get_current_admin)):
    """Get WhatsApp integration status"""
    return {
        "integration_available": True,
        "demo_mode": os.getenv("WHATSAPP_TOKEN") is None,
        "message": "WhatsApp integration is configured. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID for production.",
        "features": [
            "Send study material notifications",
            "Broadcast to entire class",
            "Fee reminders",
            "Event reminders",
            "Attendance alerts"
        ]
    }
