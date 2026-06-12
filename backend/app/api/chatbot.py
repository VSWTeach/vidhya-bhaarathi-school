from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
import re

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    intent: str
    quick_replies: list = []

# School Information
SCHOOL_INFO = {
    "name": "Vidya Bharati Public School",
    "address": "123 Education Street, Civil Lines, New Delhi - 110001",
    "phone": "+91 1234567890",
    "email": "info@vidyabharati.edu.in",
    "timing": "8:00 AM - 2:30 PM",
    "established": 1995,
    "affiliation": "CBSE",
    "principal": "Dr. Mrs. S. Radhakrishnan"
}

# Fee Structure
FEE_STRUCTURE = {
    "Pre-Nursery": 45000,
    "Nursery": 48000,
    "KG": 50000,
    "1": 55000,
    "2": 58000,
    "3": 60000,
    "4": 62000,
    "5": 65000,
    "6": 70000,
    "7": 72000,
    "8": 75000,
    "9": 80000,
    "10": 85000,
    "11": 95000,
    "12": 100000
}

# Upcoming Events
UPCOMING_EVENTS = [
    {"name": "Annual Sports Day", "date": "January 15, 2025", "venue": "Sports Complex"},
    {"name": "Parent-Teacher Meeting", "date": "December 20, 2024", "venue": "School Auditorium"},
    {"name": "Winter Break", "date": "December 25 - January 1, 2025", "venue": "School Closed"},
    {"name": "Annual Science Exhibition", "date": "January 10, 2025", "venue": "Science Block"},
]

# Admission Requirements
ADMISSION_REQUIREMENTS = [
    "Birth Certificate",
    "Previous School Report Card",
    "Transfer Certificate (if applicable)",
    "Passport size photographs (4 copies)",
    "Aadhar Card copy",
    "Medical Certificate"
]

def get_intent(message: str) -> str:
    """Detect user intent from message"""
    message_lower = message.lower()
    
    # Greeting intents
    if any(word in message_lower for word in ['hi', 'hello', 'hey', 'namaste', 'greetings']):
        return 'greeting'
    
    # School info intents
    if any(word in message_lower for word in ['about school', 'information', 'tell me about', 'school details']):
        return 'school_info'
    
    # Admission intents
    if any(word in message_lower for word in ['admission', 'apply', 'enroll', 'registration', 'form']):
        return 'admission'
    
    # Fee intents
    if any(word in message_lower for word in ['fee', 'fees', 'cost', 'price', 'tuition', 'payment']):
        return 'fee'
    
    # Event intents
    if any(word in message_lower for word in ['event', 'activities', 'sports day', 'function', 'celebration']):
        return 'event'
    
    # Contact intents
    if any(word in message_lower for word in ['contact', 'phone', 'email', 'address', 'location', 'reach']):
        return 'contact'
    
    # Timings
    if any(word in message_lower for word in ['timing', 'schedule', 'working hours', 'open']):
        return 'timing'
    
    # Transport
    if any(word in message_lower for word in ['bus', 'transport', 'van', 'pickup', 'drop']):
        return 'transport'
    
    # Facilities
    if any(word in message_lower for word in ['facility', 'lab', 'library', 'sports', 'campus']):
        return 'facility'
    
    # Result
    if any(word in message_lower for word in ['result', 'marks', 'percentage', 'grade']):
        return 'result'
    
    # Thanks
    if any(word in message_lower for word in ['thank', 'thanks', 'appreciate']):
        return 'thanks'
    
    return 'unknown'

def generate_response(intent: str, message: str = "") -> Dict:
    """Generate response based on intent"""
    
    responses = {
        'greeting': {
            'response': f"👋 Namaste! Welcome to {SCHOOL_INFO['name']}! How can I help you today?",
            'quick_replies': ['About School', 'Admissions', 'Fee Structure', 'Upcoming Events', 'Contact Us']
        },
        'school_info': {
            'response': f"""🏫 *About {SCHOOL_INFO['name']}*

📅 Established: {SCHOOL_INFO['established']}
🎓 Affiliation: {SCHOOL_INFO['affiliation']}
👩‍🏫 Principal: {SCHOOL_INFO['principal']}
📍 Location: {SCHOOL_INFO['address']}

We provide quality education with modern facilities and experienced faculty.""",
            'quick_replies': ['Admissions', 'Fee Structure', 'Facilities', 'Contact']
        },
        'admission': {
            'response': f"""📝 *Admission Information*

📅 Academic Year: 2025-26
✅ Status: Open

*Required Documents:*
{chr(10).join(['• ' + doc for doc in ADMISSION_REQUIREMENTS])}

*Process:*
1. Fill online application form
2. Document verification
3. Interaction/Assessment
4. Fee payment
5. Confirmation of admission

For more details, visit our admissions page or contact the office.""",
            'quick_replies': ['Fee Structure', 'Contact School', 'Online Application']
        },
        'fee': {
            'response': f"""💰 *Fee Structure (Annual)*

{chr(10).join([f'• Class {cls}: ₹{amount:,}/year' for cls, amount in list(FEE_STRUCTURE.items())[:8]])}

*Payment Options:*
• Online Banking
• Credit/Debit Card
• Cash at School Office

*Additional Fees:* (if applicable)
• Transport Fee: ₹15,000-25,000/year
• Hostel Fee: ₹80,000-1,20,000/year

For class-specific fee details, mention the class number.""",
            'quick_replies': ['Transport Fee', 'Hostel Fee', 'Admission Process']
        },
        'event': {
            'response': f"""🎉 *Upcoming Events*

{chr(10).join([f'📅 {event["name"]}: {event["date"]} at {event["venue"]}' for event in UPCOMING_EVENTS])}

Stay connected for more updates!""",
            'quick_replies': ['Register for Event', 'School Calendar', 'Contact']
        },
        'contact': {
            'response': f"""📞 *Contact Information*

📍 Address: {SCHOOL_INFO['address']}
📞 Phone: {SCHOOL_INFO['phone']}
✉️ Email: {SCHOOL_INFO['email']}

*Office Hours:*
Monday-Saturday: 9:00 AM - 4:00 PM

Follow us on social media for updates!""",
            'quick_replies': ['Get Directions', 'WhatsApp Us', 'Call Now']
        },
        'timing': {
            'response': f"""⏰ *School Timings*

🏫 School Hours: {SCHOOL_INFO['timing']}
📋 Office Hours: 9:00 AM - 4:00 PM
📅 Working Days: Monday to Saturday

*Break Timings:*
Morning Break: 10:30 AM - 10:45 AM
Lunch Break: 12:30 PM - 1:00 PM

Sunday: Closed""",
            'quick_replies': ['Admissions', 'Contact', 'Facilities']
        },
        'transport': {
            'response': f"""🚌 *Transport Facility*

We provide bus facility across the city.

• AC Buses with GPS tracking
• Trained drivers and attendants
• First-aid equipped buses

*Annual Transport Fee:*
• Up to 5 km: ₹12,000
• 5-10 km: ₹18,000
• 10-15 km: ₹22,000
• Above 15 km: ₹25,000

Contact transport department for route details.""",
            'quick_replies': ['Fee Structure', 'Contact Transport', 'Admissions']
        },
        'facility': {
            'response': f"""🏆 *Our Facilities*

• Smart Classrooms with Digital Boards
• Well-stocked Library (15,000+ books)
• Science, Computer & Language Labs
• Indoor & Outdoor Sports Facilities
• Auditorium with 500+ capacity
• Medical Room with Nurse
• Canteen with Healthy Food
• CCTV Surveillance

We ensure holistic development of every student!""",
            'quick_replies': ['Admissions', 'Fee Structure', 'Contact']
        },
        'result': {
            'response': f"""📊 *Results Information*

Board Results 2024:
• CBSE Class X: 98.5%
• CBSE Class XII: 97.8%
• 15 students scored 95%+
• 45 students scored 90%+

Student results are available on the student portal.
Contact the examination department for detailed results.""",
            'quick_replies': ['Admissions', 'Contact', 'Fee Structure']
        },
        'thanks': {
            'response': "You're welcome! 😊 Is there anything else I can help you with?",
            'quick_replies': ['Admissions', 'Fee Structure', 'Contact', 'Events']
        },
        'unknown': {
            'response': f"I'm here to help you with information about {SCHOOL_INFO['name']}. You can ask me about:\n\n• Admissions & Fee Structure\n• Upcoming Events\n• School Facilities\n• Contact Information\n• Transport & Timings\n\nHow can I assist you today?",
            'quick_replies': ['Admissions', 'Fee Structure', 'Events', 'Contact']
        }
    }
    
    return responses.get(intent, responses['unknown'])

@router.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """Process chat message and return response"""
    try:
        intent = get_intent(chat_message.message)
        response_data = generate_response(intent, chat_message.message)
        
        return ChatResponse(
            response=response_data['response'],
            intent=intent,
            quick_replies=response_data.get('quick_replies', [])
        )
    except Exception as e:
        return ChatResponse(
            response="I'm having trouble processing your request. Please try again or contact the school directly.",
            intent="error",
            quick_replies=['Contact School', 'Admissions']
        )

@router.get("/whatsapp-link")
def get_whatsapp_link():
    """Get WhatsApp contact link"""
    phone = SCHOOL_INFO['phone'].replace('+', '').replace(' ', '')
    message = "Hello, I would like to know more about Vidya Bharati Public School."
    whatsapp_url = f"https://wa.me/{phone}?text={message.replace(' ', '%20')}"
    
    return {
        "whatsapp_url": whatsapp_url,
        "phone": SCHOOL_INFO['phone'],
        "message": message
    }
