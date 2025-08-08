@echo off
echo Starting Yu-Gi-Oh Deck Builder...

REM Start backend in a new window
start "Backend Server" cmd /k "cd BackEnd && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start "Frontend Server" cmd /k "node server.js"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause > nul 