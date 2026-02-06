# 🚀 Deployment Guide - Setting Up on Another System

This guide will help you set up the College Data Collection Application on a new system.

---

## 📋 Prerequisites

Before starting, ensure the new system has:

- ✅ **Python 3.8+** installed
- ✅ **PostgreSQL 12+** installed and running
- ✅ **Git** installed
- ✅ Internet connection (for downloading dependencies)

---

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Srevarshan05/Data-Collection-Application.git
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

This will install:
- FastAPI
- Uvicorn
- SQLAlchemy
- psycopg2-binary
- Pillow
- Pandas
- And all other required packages

### Step 4: Configure PostgreSQL

1. **Start PostgreSQL Service:**
   - **Windows:** Services → PostgreSQL → Start
   - **Linux:** `sudo systemctl start postgresql`
   - **Mac:** `brew services start postgresql`

2. **Create Database:**
   
   Open PostgreSQL command line (psql) or pgAdmin and run:
   ```sql
   CREATE DATABASE college_registration;
   ```

### Step 5: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/college_registration
   ```
   
   Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### Step 6: Initialize Database

```bash
python init_db.py
```

Expected output:
```
============================================================
College Data Collection Application - Database Setup
============================================================

📊 Database Configuration:
   Host: localhost
   Port: 5432
   User: postgres
   Database: college_registration

🔌 Connecting to PostgreSQL server...
✅ Database 'college_registration' created successfully!
✅ Database setup completed successfully!
```

### Step 7: Run the Application

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Started server process
INFO:     Waiting for application startup.
🚀 Starting College Data Collection Application...
📊 Initializing database...
✅ Database tables created successfully!
✅ Application started successfully!
🌐 Access the application at: http://localhost:8000
👨‍💼 Admin dashboard at: http://localhost:8000/admin
INFO:     Application startup complete.
```

### Step 8: Access the Application

Open your browser and navigate to:
- **Main App:** http://localhost:8000
- **Admin Dashboard:** http://localhost:8000/admin

---

## 🌐 Network Access (LAN)

To make the application accessible to other computers on the same network:

### Step 1: Find Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Linux/Mac:**
```bash
ifconfig
```
or
```bash
ip addr show
```

### Step 2: Run Application on All Interfaces

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Step 3: Access from Other Computers

Other computers on the same network can access using:
```
http://YOUR_IP_ADDRESS:8000
```

Example: `http://192.168.1.100:8000`

### Step 4: Configure Firewall (if needed)

**Windows:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Add Python to allowed apps
4. Allow port 8000

**Linux:**
```bash
sudo ufw allow 8000
```

---

## 🌍 Public Internet Access (Ngrok)

To make the application accessible from anywhere on the internet:

### Step 1: Install Ngrok

Download from: https://ngrok.com/download

**Windows:**
1. Download ngrok.exe
2. Extract to a folder
3. Add to PATH (optional)

**Linux/Mac:**
```bash
# Using snap (Linux)
sudo snap install ngrok

# Using brew (Mac)
brew install ngrok
```

### Step 2: Sign Up for Ngrok (Free)

1. Go to https://ngrok.com/
2. Sign up for free account
3. Get your auth token

### Step 3: Configure Ngrok

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 4: Run Application

In terminal 1:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Step 5: Start Ngrok

In terminal 2:
```bash
ngrok http 8000
```

### Step 6: Share Public URL

Ngrok will display:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:8000
```

Share the `https://abc123.ngrok.io` URL with anyone!

**Note:** Free Ngrok URLs change each time you restart. For permanent URLs, upgrade to paid plan.

---

## 🔒 Production Deployment Checklist

For production deployment on a server:

### Security
- [ ] Change default PostgreSQL password
- [ ] Set strong database credentials
- [ ] Configure HTTPS/SSL
- [ ] Add authentication for admin dashboard
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable firewall rules

### Performance
- [ ] Use production ASGI server (Gunicorn + Uvicorn)
- [ ] Set up database connection pooling
- [ ] Configure caching
- [ ] Optimize image storage
- [ ] Set up CDN for static files

### Monitoring
- [ ] Set up logging
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure database backups
- [ ] Set up alerts

### Deployment Options

**Option 1: VPS (DigitalOcean, AWS, etc.)**
```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip postgresql nginx

# Clone repository
git clone https://github.com/Srevarshan05/Data-Collection-Application.git
cd Data-Collection-Application

# Setup and run
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_db.py

# Run with Gunicorn
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Option 2: Docker**
```dockerfile
# Create Dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Option 3: Heroku**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create your-app-name
heroku addons:create heroku-postgresql
git push heroku main
```

---

## 🐛 Common Issues & Solutions

### Issue 1: PostgreSQL Connection Failed

**Error:** `password authentication failed`

**Solution:**
1. Check PostgreSQL is running
2. Verify password in `.env` file
3. Test connection: `psql -U postgres -d college_registration`

### Issue 2: Port Already in Use

**Error:** `Address already in use`

**Solution:** Use different port:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Issue 3: Module Not Found

**Error:** `ModuleNotFoundError`

**Solution:**
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 4: Permission Denied (Linux)

**Error:** `Permission denied: 'uploads'`

**Solution:**
```bash
chmod -R 755 uploads/
chmod -R 755 reports/
```

### Issue 5: Database Tables Not Created

**Error:** `relation "students" does not exist`

**Solution:**
```bash
python init_db.py
```

---

## 📊 Verification Steps

After setup, verify everything works:

### 1. Check Application Health
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

### 2. Test Registration
1. Open http://localhost:8000
2. Fill in student details
3. Upload a photo
4. Submit form
5. Verify success page

### 3. Check Database
```bash
psql -U postgres -d college_registration
\dt  # List tables
SELECT * FROM students;  # View data
```

### 4. Test Admin Dashboard
1. Open http://localhost:8000/admin
2. Verify statistics display
3. Download CSV report

### 5. Verify Image Storage
Check that images are saved in:
```
uploads/
├── 1/
│   ├── A/
│   │   └── RA2511026050001.jpg
│   └── B/
├── 2/
└── 3/
```

---

## 📝 Maintenance

### Daily Tasks
- Monitor application logs
- Check disk space (uploads folder)
- Verify database backups

### Weekly Tasks
- Review error logs
- Check performance metrics
- Update dependencies (if needed)

### Monthly Tasks
- Database optimization
- Security updates
- Backup verification

### Backup Database
```bash
# Backup
pg_dump -U postgres college_registration > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres college_registration < backup_20240101.sql
```

---

## 🎯 Quick Reference

### Start Application
```bash
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Stop Application
Press `Ctrl + C` in terminal

### Update Code
```bash
git pull origin main
pip install -r requirements.txt
# Restart application
```

### View Logs
Application logs are displayed in the terminal where you run uvicorn.

---

## 📞 Support

For issues or questions:
1. Check this deployment guide
2. Review the main README.md
3. Check error messages in terminal
4. Open an issue on GitHub

---

**Repository:** https://github.com/Srevarshan05/Data-Collection-Application

**🎉 Happy Deploying!**
