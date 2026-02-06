@echo off
echo ============================================================
echo College Data Collection Application - Setup and Run
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/
    pause
    exit /b 1
)

echo [1/6] Checking Python installation...
python --version
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo [2/6] Creating virtual environment...
    python -m venv venv
    echo Virtual environment created successfully!
) else (
    echo [2/6] Virtual environment already exists
)
echo.

REM Activate virtual environment
echo [3/6] Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Install dependencies
echo [4/6] Installing dependencies...
pip install -r requirements.txt
echo.

REM Initialize database
echo [5/6] Initializing database...
python init_db.py
echo.

REM Create necessary directories
if not exist "uploads" mkdir uploads
if not exist "reports" mkdir reports
if not exist "app\static\css" mkdir app\static\css
if not exist "app\static\js" mkdir app\static\js

echo [6/6] Starting the application...
echo.
echo ============================================================
echo Application is starting...
echo Access the application at: http://localhost:8000
echo Admin Dashboard at: http://localhost:8000/admin
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

REM Run the application
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
