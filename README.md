# 🎓 College Data Collection Application

A production-ready student registration system built with **FastAPI**, **PostgreSQL**, and **Bootstrap 5**. Features automatic registration number generation, image processing, admin dashboard with analytics, and CSV reporting.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [Registration Number Format](#-registration-number-format)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Ngrok Deployment](#-ngrok-deployment-public-access)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🎯 Core Features
- ✅ **Student Registration** with auto-generated registration numbers
- ✅ **Year-based Registration Prefixes** (RA25/24/23 format)
- ✅ **Section Allocation** by year (Year 1-2: A-E, Year 3: A-D)
- ✅ **Image Upload** with drag & drop support
- ✅ **Automatic Image Processing** (resize to 300x300, compress to 70%)
- ✅ **Duplicate Prevention** for registration numbers
- ✅ **Admin Dashboard** with real-time analytics
- ✅ **CSV Report Generation** (all students + weekly reports)
- ✅ **Responsive Design** (mobile, tablet, desktop)

### 🔒 Security & Validation
- Input validation and sanitization
- File type validation (JPG/PNG only)
- File size validation (max 500KB)
- SQL injection prevention (SQLAlchemy ORM)
- Unique registration number constraint

### 📊 Analytics & Reporting
- Total student count
- Year-wise distribution (with charts)
- Section-wise distribution (with charts)
- Weekly registration tracking
- Downloadable CSV reports

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | FastAPI 0.104+ |
| **Database** | PostgreSQL 12+ |
| **ORM** | SQLAlchemy 2.0+ |
| **Image Processing** | Pillow 10.1+ |
| **Data Processing** | Pandas 2.1+ |
| **Frontend** | Bootstrap 5.3, HTML5, CSS3, JavaScript |
| **Charts** | Chart.js 4.4 |
| **Server** | Uvicorn |

---

## 📦 Prerequisites

Before installation, ensure you have:

- **Python 3.8 or higher** ([Download](https://www.python.org/downloads/))
- **PostgreSQL 12 or higher** ([Download](https://www.postgresql.org/download/))
- **Git** (for cloning the repository)
- **pip** (Python package manager)

### Verify Installation:
```bash
python --version
psql --version
git --version
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Data-Collection-Application
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Setup PostgreSQL Database

1. **Start PostgreSQL service**
   - Windows: Services → PostgreSQL → Start
   - Linux: `sudo systemctl start postgresql`
   - Mac: `brew services start postgresql`

2. **Create Database** (using psql or pgAdmin)
   ```sql
   CREATE DATABASE college_registration;
   ```

---

## ⚙️ Configuration

### Step 1: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/college_registration
   APP_HOST=0.0.0.0
   APP_PORT=8000
   MAX_UPLOAD_SIZE=524288
   IMAGE_SIZE=300
   IMAGE_QUALITY=70
   ```

   **Replace `YOUR_PASSWORD`** with your PostgreSQL password.

### Step 2: Initialize Database

Run the database initialization script:

```bash
python init_db.py
```

This will:
- Create the database if it doesn't exist
- Set up all required tables
- Verify the connection

---

## 🎮 Running the Application

### Option 1: Using Automated Script (Windows)

Double-click `setup_and_run.bat` or run:
```bash
setup_and_run.bat
```

### Option 2: Manual Start

```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Run the application
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Access the Application

- **Main Application:** http://localhost:8000
- **Admin Dashboard:** http://localhost:8000/admin
- **API Documentation:** http://localhost:8000/docs (Swagger UI)

---

## 📖 Usage Guide

### For Students - Registration Process

1. **Navigate to** http://localhost:8000

2. **Fill in Student Details:**
   - **Full Name:** Enter student's complete name
   - **Year of Study:** Select 1, 2, or 3
   - **Section:** Auto-populated based on year selection
   - **Registration Number:** Enter last 3 digits only (001-999)

3. **Upload Photo:**
   - Drag & drop or click "Browse Files"
   - Requirements: JPG/PNG, max 500KB, passport size
   - Preview appears after upload

4. **Submit:**
   - Click "Generate ID" button
   - Wait for processing (loading spinner)
   - Success page displays registration number

5. **Registration Number Format:**
   - System auto-generates: `PREFIX + Last3Digits`
   - Example: RA2511026050**001**

### For Admins - Dashboard Access

1. **Navigate to** http://localhost:8000/admin

2. **View Analytics:**
   - Total students registered
   - Year-wise distribution (pie chart)
   - Section-wise distribution (bar chart)
   - Weekly registration count

3. **Download Reports:**
   - **All Students Report:** Complete CSV of all registrations
   - **Weekly Report:** Students registered in last 7 days

4. **Recent Registrations:**
   - View latest 10 registrations
   - Includes name, year, section, reg number, date

---

## 🔢 Registration Number Format

| Year | Prefix | Sections Available | Example |
|------|--------|-------------------|---------|
| **Year 1** | RA2511026050 | A, B, C, D, E | RA2511026050001 |
| **Year 2** | RA2411026050 | A, B, C, D, E | RA2411026050015 |
| **Year 3** | RA2311026050 | A, B, C, D | RA2311026050099 |

**Note:** Students enter only the **last 3 digits** (001-999). The system automatically combines the prefix with the entered digits.

---

## 📁 Project Structure

```
Data-Collection-Application/
├── app/
│   ├── __init__.py              # Package initialization
│   ├── main.py                  # FastAPI application entry point
│   ├── database.py              # Database connection & session
│   ├── models.py                # SQLAlchemy models
│   ├── routes.py                # API route handlers
│   ├── utils.py                 # Utility functions (image, validation)
│   ├── templates/               # HTML templates
│   │   ├── index.html          # Registration form
│   │   ├── success.html        # Success page
│   │   └── admin.html          # Admin dashboard
│   └── static/                  # Static files
│       ├── css/
│       │   └── style.css       # Custom styles
│       └── js/
│           └── script.js       # Frontend JavaScript
├── uploads/                     # Student photos (auto-created)
│   └── {year}/
│       └── {section}/
│           └── {reg_number}.jpg
├── reports/                     # CSV reports (auto-created)
├── venv/                        # Virtual environment
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── requirements.txt             # Python dependencies
├── init_db.py                   # Database initialization script
├── setup_and_run.bat           # Windows automation script
└── README.md                    # This file
```

---

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Homepage (registration form) |
| GET | `/success` | Success page after registration |
| GET | `/admin` | Admin dashboard |
| POST | `/api/register` | Register new student |
| GET | `/api/check-register-number/{number}` | Check if registration number exists |
| GET | `/api/get-prefix/{year}` | Get registration prefix for year |
| GET | `/api/students` | Get all students (JSON) |
| GET | `/api/stats` | Get statistics (JSON) |
| GET | `/api/download-report` | Download all students CSV |
| GET | `/api/download-weekly-report` | Download weekly CSV |
| GET | `/health` | Health check endpoint |
| GET | `/docs` | Swagger API documentation |

### Example API Usage

**Register a Student (cURL):**
```bash
curl -X POST "http://localhost:8000/api/register" \
  -F "name=John Doe" \
  -F "year=1" \
  -F "section=A" \
  -F "last_digits=001" \
  -F "photo=@photo.jpg"
```

**Check Registration Number:**
```bash
curl "http://localhost:8000/api/check-register-number/RA2511026050001"
```

**Get Statistics:**
```bash
curl "http://localhost:8000/api/stats"
```

---

## 🌐 Ngrok Deployment (Public Access)

To make the application accessible over the internet:

### Step 1: Install Ngrok

Download from: https://ngrok.com/download

### Step 2: Run the Application

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Step 3: Start Ngrok (in new terminal)

```bash
ngrok http 8000
```

### Step 4: Share Public URL

Ngrok will provide a public URL like:
```
https://abc123.ngrok.io
```

Share this URL with students and faculty. They can access the application from anywhere!

### Step 5: Update CORS (if needed)

If you encounter CORS issues, the application already has CORS middleware configured to allow all origins.

---

## 🧪 Testing

### Manual Testing Checklist

#### ✅ Registration Flow
- [ ] Open homepage
- [ ] Select different years (1, 2, 3)
- [ ] Verify correct prefixes and sections
- [ ] Upload valid image (JPG/PNG, <500KB)
- [ ] Submit form
- [ ] Verify success page
- [ ] Check image saved in correct folder

#### ✅ Validation Testing
- [ ] Try empty form submission
- [ ] Try invalid file format (PDF, TXT)
- [ ] Try oversized image (>500KB)
- [ ] Try duplicate registration number
- [ ] Try invalid registration digits (non-numeric, <3 digits)

#### ✅ Admin Dashboard
- [ ] Open admin dashboard
- [ ] Verify statistics display
- [ ] Check charts render correctly
- [ ] Download CSV reports
- [ ] Verify recent registrations table

#### ✅ Image Processing
- [ ] Upload image
- [ ] Check `uploads/{year}/{section}/` folder
- [ ] Verify image is 300x300 pixels
- [ ] Verify image is compressed

### Automated Testing

Run the health check:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "application": "College Data Collection Application",
  "version": "1.0.0"
}
```

---

## 🔧 Troubleshooting

### Issue 1: Database Connection Error

**Error:** `password authentication failed for user "postgres"`

**Solution:**
1. Verify PostgreSQL is running
2. Check credentials in `.env` file
3. Test connection: `psql -U postgres -d college_registration`

### Issue 2: Port Already in Use

**Error:** `[Errno 10048] error while attempting to bind on address`

**Solution:** Use a different port:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Issue 3: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
1. Activate virtual environment
2. Reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Issue 4: Image Upload Fails

**Error:** File size or format error

**Solution:**
- Ensure image is JPG or PNG
- Ensure file size < 500KB
- Check `uploads/` folder permissions

### Issue 5: Database Tables Not Created

**Error:** `relation "students" does not exist`

**Solution:**
1. Run database initialization:
   ```bash
   python init_db.py
   ```
2. Restart the application

### Issue 6: Virtual Environment Not Activating

**Windows:**
```bash
# If execution policy error
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\activate
```

**Linux/Mac:**
```bash
chmod +x venv/bin/activate
source venv/bin/activate
```

---

## 📸 Screenshots

### Student Registration Form
Modern, responsive UI with auto-generated registration numbers and drag & drop image upload.

### Admin Dashboard
Real-time analytics with interactive charts showing year-wise and section-wise distribution.

### Success Page
Clean success confirmation with generated registration number.

---

## 🔐 Security Considerations

### Implemented Security Measures:
- ✅ Input validation and sanitization
- ✅ File type and size validation
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Unique constraints on registration numbers
- ✅ Error handling without exposing sensitive data

### Recommended for Production:
- [ ] Add authentication for admin dashboard
- [ ] Implement rate limiting
- [ ] Add HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Add logging and monitoring

---

## 📊 Database Schema

### Students Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | Primary Key, Auto-increment |
| name | String(255) | Not Null |
| year | Integer | Not Null |
| section | String(1) | Not Null |
| register_number | String(50) | Unique, Not Null, Indexed |
| photo_path | String(500) | Not Null |
| created_at | DateTime | Auto-generated, Timezone-aware |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is developed for educational purposes.

---

## 👥 Support

For issues or questions:
1. Check this README
2. Review error messages in terminal
3. Check application logs
4. Open an issue on GitHub

---

## 🎯 Future Enhancements

Potential features for future versions:
- [ ] Student search functionality
- [ ] Bulk student import (CSV/Excel)
- [ ] Email notifications
- [ ] QR code generation for ID cards
- [ ] Student profile editing
- [ ] Advanced filtering and sorting
- [ ] Export to PDF
- [ ] Multi-language support
- [ ] Dark mode theme

---

## 📞 Contact

For support or inquiries, please contact the development team.

---

**Made with ❤️ for College Data Management**

---

## Quick Start Summary

```bash
# 1. Clone repository
git clone <repository-url>
cd Data-Collection-Application

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure database
cp .env.example .env
# Edit .env with your PostgreSQL password

# 5. Initialize database
python init_db.py

# 6. Run application
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 7. Access application
# Open browser: http://localhost:8000
```

---

**🎉 You're all set! Happy coding!**
