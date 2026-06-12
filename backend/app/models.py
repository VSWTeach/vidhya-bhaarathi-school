from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(20), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20))
    class_name = Column("class", String(50), nullable=False)
    section = Column(String(10))
    roll_number = Column(String(20))
    parent_name = Column(String(200))
    parent_phone = Column(String(20))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=func.now())

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(200))
    role = Column(String(50), default="admin")
    created_at = Column(DateTime, default=func.now())

class FeePayment(Base):
    __tablename__ = "fee_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    amount = Column(Float, nullable=False)
    payment_date = Column(Date, default=func.current_date())
    payment_mode = Column(String(50))
    receipt_number = Column(String(50), unique=True)
    payment_for = Column(String(100))
    status = Column(String(20), default="completed")
    created_at = Column(DateTime, default=func.now())

class StudyMaterial(Base):
    __tablename__ = "study_materials"
    
    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(String(50), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    subject = Column(String(100))
    class_name = Column("class", String(50))
    material_type = Column(String(50))
    file_url = Column(String(500))
    uploaded_by = Column(Integer, ForeignKey("admins.id"))
    upload_date = Column(DateTime, default=func.now())
    total_downloads = Column(Integer, default=0)

class MaterialDistribution(Base):
    __tablename__ = "material_distributions"
    
    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("study_materials.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    distributed_by = Column(Integer, ForeignKey("admins.id"))
    distribution_date = Column(DateTime, default=func.now())
    due_date = Column(Date)
    status = Column(String(50), default="distributed")
    completion_percentage = Column(Integer, default=0)
    last_accessed = Column(DateTime)
