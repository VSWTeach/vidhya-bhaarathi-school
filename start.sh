#!/bin/bash
echo "========================================"
echo "  VIDYA BHARATI SCHOOL ERP"
echo "  Starting Application..."
echo "========================================"
echo ""

echo "[1/2] Starting Backend Server..."
cd backend
source venv/bin/activate
python init_db.py
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Waiting for backend to initialize..."
sleep 3

echo "[2/2] Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Application Started Successfully!"
echo "========================================"
echo ""
echo "   Website: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin/login"
echo "   Student: http://localhost:3000/student/login"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "   Admin Login: admin / admin123"
echo ""
echo "========================================"
echo "Press Ctrl+C to stop all servers"
echo "========================================"

wait $BACKEND_PID $FRONTEND_PID
