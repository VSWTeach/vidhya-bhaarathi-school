from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db

router = APIRouter()

# Sample gallery images
gallery_images = [
    {"id": 1, "title": "School Building", "category": "campus", "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=400", "description": "Our beautiful campus"},
    {"id": 2, "title": "Library", "category": "campus", "image_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400", "description": "State-of-the-art library"},
    {"id": 3, "title": "Annual Day 2024", "category": "events", "image_url": "https://images.unsplash.com/photo-1517457373110-98d50a27e7ad?w=400", "description": "Annual Day celebration"},
]

# Sample events
events_list = [
    {"id": 1, "title": "Annual Sports Day", "description": "Inter-school competition", "event_date": "2025-01-15T10:00:00", "venue": "Sports Complex", "event_type": "sports"},
    {"id": 2, "title": "Parent-Teacher Meeting", "description": "Quarterly review", "event_date": "2024-12-20T09:00:00", "venue": "Auditorium", "event_type": "academic"},
]

# Sample notices
notices_list = [
    {"id": 1, "title": "Winter Break Announcement", "content": "School closed from Dec 25 to Jan 1", "notice_type": "holiday", "priority": 1, "views_count": 150},
    {"id": 2, "title": "Admissions Open", "content": "Applications for 2025-26 are now open", "notice_type": "important", "priority": 2, "views_count": 300},
]

# Sample achievements
achievements_list = [
    {"id": 1, "title": "National Science Olympiad Winner", "description": "Gold medal in Physics", "student_name": "Rahul Sharma", "class_name": "10", "achievement_type": "academic"},
    {"id": 2, "title": "State Level Football Champion", "description": "Best Player Award", "student_name": "Amit Kumar", "class_name": "9", "achievement_type": "sports"},
]

@router.get("/gallery/images")
def get_gallery_images(category: Optional[str] = None, db: Session = Depends(get_db)):
    if category and category != "all":
        return [img for img in gallery_images if img["category"] == category]
    return gallery_images

@router.get("/events")
def get_events(db: Session = Depends(get_db)):
    return events_list

@router.get("/notices")
def get_notices(db: Session = Depends(get_db)):
    return notices_list

@router.get("/achievements")
def get_achievements(db: Session = Depends(get_db)):
    return achievements_list

@router.get("/content-stats")
def get_content_stats(db: Session = Depends(get_db)):
    return {
        "total_images": len(gallery_images),
        "total_events": len(events_list),
        "active_notices": len(notices_list),
        "total_achievements": len(achievements_list)
    }
