from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import EmailConfig, EmailTemplate, EmailLog, Student
from pydantic import BaseModel
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.api.auth import get_current_admin

router = APIRouter()

class EmailConfigSchema(BaseModel):
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_password: str
    from_email: str

class SendEmailRequest(BaseModel):
    to_email: str
    subject: str
    body: str
    template_id: Optional[str] = None

def send_email_background(config: EmailConfigSchema, to_email: str, subject: str, body: str):
    """Background task to send email"""
    try:
        msg = MIMEMultipart()
        msg['From'] = config.from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(config.smtp_host, config.smtp_port)
        server.starttls()
        server.login(config.smtp_user, config.smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

@router.post("/config")
def save_email_config(config: EmailConfigSchema, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Save email configuration"""
    existing = db.query(EmailConfig).first()
    if existing:
        for key, value in config.dict().items():
            setattr(existing, key, value)
    else:
        existing = EmailConfig(**config.dict())
        db.add(existing)
    
    db.commit()
    return {"message": "Email configuration saved successfully"}

@router.post("/test")
def send_test_email(email: str, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Send test email"""
    config = db.query(EmailConfig).first()
    if not config:
        raise HTTPException(status_code=400, detail="Email configuration not found")
    
    test_body = """
    <h2>Test Email from Vidya Bharati School</h2>
    <p>This is a test email to verify that the email notification system is working correctly.</p>
    <p>If you received this email, your email configuration is correct!</p>
    <br>
    <p>Best regards,<br>Vidya Bharati Public School</p>
    """
    
    success = send_email_background(config, email, "Test Email from School ERP", test_body)
    
    if success:
        return {"message": "Test email sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send test email")

@router.post("/send-fee-reminder")
def send_fee_reminder(student_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Send fee reminder email to parent"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    config = db.query(EmailConfig).first()
    if not config:
        raise HTTPException(status_code=400, detail="Email configuration not found")
    
    subject = f"Fee Reminder for {student.first_name} {student.last_name}"
    body = f"""
    <h2>Fee Payment Reminder</h2>
    <p>Dear {student.parent_name},</p>
    <p>This is a reminder that the fee for your child {student.first_name} {student.last_name} (Class: {student.class_name}) is due.</p>
    <p>Please login to the student portal to make the payment.</p>
    <br>
    <p>Thank you,<br>Vidya Bharati Public School</p>
    """
    
    background_tasks.add_task(send_email_background, config, student.parent_email or student.email, subject, body)
    
    return {"message": "Fee reminder email queued"}

@router.get("/templates")
def get_email_templates(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get all email templates"""
    return db.query(EmailTemplate).all()

@router.put("/templates/{template_id}")
def update_template(template_id: str, is_enabled: bool, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Enable/disable email template"""
    template = db.query(EmailTemplate).filter(EmailTemplate.template_id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    template.is_enabled = is_enabled
    db.commit()
    return {"message": f"Template {template_id} {'enabled' if is_enabled else 'disabled'}"}
