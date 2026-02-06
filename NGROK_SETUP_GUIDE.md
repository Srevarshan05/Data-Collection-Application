# 🌐 Ngrok Deployment Guide - AIML Student Registration System

## Complete guide to expose your application to the internet using Ngrok

---

## 📋 What is Ngrok?

Ngrok creates a secure tunnel from a public URL to your local application, allowing:
- ✅ Remote access from anywhere
- ✅ Share your app with others
- ✅ Test on mobile devices
- ✅ Demo to clients/faculty

---

## 🚀 Step-by-Step Setup

### Step 1: Download and Install Ngrok

#### 1.1 Create Ngrok Account (Free)
1. Go to: https://ngrok.com/
2. Click "Sign up" (top right)
3. Sign up with Google/GitHub or email
4. Verify your email

#### 1.2 Download Ngrok
1. After login, go to: https://dashboard.ngrok.com/get-started/setup
2. Download for Windows
3. Extract the `ngrok.exe` file

#### 1.3 Place Ngrok in Easy Location
```bash
# Recommended: Place in a folder like:
C:\ngrok\ngrok.exe

# Or add to PATH for easy access
```

---

### Step 2: Get Your Authtoken

1. **Login to Ngrok Dashboard:** https://dashboard.ngrok.com/
2. **Go to "Your Authtoken":** https://dashboard.ngrok.com/get-started/your-authtoken
3. **Copy your authtoken** (looks like: `2abc123def456ghi789jkl012mno345_6pqr789stu012vwx345yz`)

---

### Step 3: Configure Ngrok

#### 3.1 Open Command Prompt
```bash
# Press Win + R
# Type: cmd
# Press Enter
```

#### 3.2 Navigate to Ngrok Directory
```bash
cd C:\ngrok
```

#### 3.3 Add Your Authtoken
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

**Example:**
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl012mno345_6pqr789stu012vwx345yz
```

**Success Message:**
```
Authtoken saved to configuration file: C:\Users\YourName\.ngrok2\ngrok.yml
```

---

### Step 4: Start Your Application

#### 4.1 Open First Command Prompt Window
```bash
# Navigate to your project
cd C:\Users\Srevarshan\OneDrive\Desktop\Projects\Data-Collection-Application

# Run the application
setup_and_run.bat
```

**Wait for:**
```
INFO:     Uvicorn running on http://0.0.0.0:8002
```

#### 4.2 Keep This Window Open
- ⚠️ **DO NOT CLOSE** this window
- Your application is now running on port 8002

---

### Step 5: Start Ngrok Tunnel

#### 5.1 Open Second Command Prompt Window
```bash
# Press Win + R again
# Type: cmd
# Press Enter
```

#### 5.2 Navigate to Ngrok
```bash
cd C:\ngrok
```

#### 5.3 Start Ngrok Tunnel
```bash
ngrok http 8002
```

**You'll see:**
```
ngrok                                                                    

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:8002

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

---

### Step 6: Access Your Application

#### 6.1 Copy the Public URL
From the Ngrok output, copy the HTTPS URL:
```
https://abc123def456.ngrok-free.app
```

#### 6.2 Share This URL
Anyone can now access your application:
- **Registration:** `https://abc123def456.ngrok-free.app`
- **Admin Dashboard:** `https://abc123def456.ngrok-free.app/admin`

---

## 🎯 Quick Reference Commands

### Start Application (Terminal 1)
```bash
cd C:\Users\Srevarshan\OneDrive\Desktop\Projects\Data-Collection-Application
setup_and_run.bat
```

### Start Ngrok (Terminal 2)
```bash
cd C:\ngrok
ngrok http 8002
```

---

## 🔧 Advanced Configuration

### Custom Subdomain (Paid Plans Only)
```bash
ngrok http 8002 --subdomain=aiml-registration
# URL will be: https://aiml-registration.ngrok.app
```

### Basic Authentication
```bash
ngrok http 8002 --basic-auth="username:password"
```

### Custom Region
```bash
# Asia Pacific
ngrok http 8002 --region=ap

# Europe
ngrok http 8002 --region=eu

# Australia
ngrok http 8002 --region=au
```

---

## 📱 Testing on Mobile

1. **Start Ngrok** as described above
2. **Copy the public URL**
3. **Open on your phone's browser**
4. **Test registration and photo capture**

---

## 🔍 Monitoring Traffic

### Ngrok Web Interface
While Ngrok is running, access:
```
http://localhost:4040
```

**Features:**
- View all HTTP requests
- Inspect request/response details
- Replay requests
- See traffic statistics

---

## ⚠️ Important Notes

### Free Plan Limitations:
- ✅ Random URL each time (changes when you restart)
- ✅ HTTPS included
- ✅ 40 connections/minute
- ❌ No custom subdomain
- ❌ Session expires after 2 hours (need to restart)

### Paid Plans Benefits:
- ✅ Custom subdomain
- ✅ Reserved domains
- ✅ No session timeout
- ✅ More connections
- ✅ Multiple tunnels

---

## 🛡️ Security Best Practices

### 1. Use HTTPS Only
- Ngrok provides HTTPS by default
- Never share HTTP URL for production

### 2. Add Authentication (Optional)
```bash
ngrok http 8002 --basic-auth="admin:secure_password_123"
```

### 3. Monitor Access
- Check Ngrok dashboard regularly
- Review traffic in web interface (localhost:4040)

### 4. Temporary Use
- Use Ngrok for demos/testing
- For production, use proper hosting

---

## 🔄 Keeping Ngrok Running

### Option 1: Keep Terminal Open
- Simplest method
- Terminal must stay open

### Option 2: Run as Background Service (Advanced)
Create `start_ngrok.bat`:
```batch
@echo off
start /B ngrok http 8002
```

---

## 📊 Complete Workflow

### Daily Usage:

**Morning Setup:**
```bash
# Terminal 1: Start Application
cd C:\Users\Srevarshan\OneDrive\Desktop\Projects\Data-Collection-Application
setup_and_run.bat

# Terminal 2: Start Ngrok
cd C:\ngrok
ngrok http 8002

# Copy the public URL and share with users
```

**During the Day:**
- Keep both terminals open
- Monitor traffic at http://localhost:4040
- Share the public URL with students/faculty

**End of Day:**
- Press Ctrl+C in Ngrok terminal
- Press Ctrl+C in Application terminal
- URLs will change next time you start

---

## 🆘 Troubleshooting

### Issue 1: "command not found: ngrok"

**Solution:**
```bash
# Use full path
C:\ngrok\ngrok.exe http 8002

# Or add to PATH:
# 1. Right-click "This PC" → Properties
# 2. Advanced system settings → Environment Variables
# 3. Edit "Path" → Add "C:\ngrok"
```

---

### Issue 2: "Failed to start tunnel"

**Possible Causes:**

**A. Authtoken not configured**
```bash
ngrok config add-authtoken YOUR_TOKEN
```

**B. Port already in use**
```bash
# Check if app is running on 8002
netstat -ano | findstr :8002

# If not, start your application first
```

**C. Internet connection issue**
```bash
# Check internet connection
ping google.com
```

---

### Issue 3: "ERR_NGROK_108"

**Solution:**
```bash
# Free plan session expired (2 hours)
# Just restart ngrok:
ngrok http 8002
# You'll get a new URL
```

---

### Issue 4: Slow Performance

**Solutions:**
1. **Choose closer region:**
   ```bash
   ngrok http 8002 --region=ap  # For Asia
   ```

2. **Check internet speed**

3. **Upgrade to paid plan** for better performance

---

### Issue 5: "This site can't be reached"

**Checklist:**
- [ ] Is your application running? (Check Terminal 1)
- [ ] Is Ngrok running? (Check Terminal 2)
- [ ] Copy the HTTPS URL (not HTTP)
- [ ] Check if URL is still valid (free plan expires)

---

## 📱 Mobile Access Example

### For Students Using Phones:

1. **Share this URL:** `https://abc123def456.ngrok-free.app`

2. **Students open on phone**

3. **They can:**
   - Register with camera
   - Upload photos
   - Submit forms

4. **Admin can:**
   - View dashboard
   - Download Excel reports
   - Monitor registrations

---

## 🎓 Faculty Demo Setup

### Before Demo:

1. **Start application** (30 minutes before)
2. **Start Ngrok**
3. **Test the public URL** yourself
4. **Share URL** with faculty
5. **Keep laptop plugged in** (don't let it sleep)

### During Demo:

- Show registration process
- Demonstrate camera capture
- Show admin dashboard
- Download Excel report
- Show embedded photos

### After Demo:

- Stop Ngrok (Ctrl+C)
- Stop application (Ctrl+C)
- Save any important data

---

## 💡 Pro Tips

### 1. Save Your URL
```bash
# Create a text file with current URL
echo https://abc123def456.ngrok-free.app > current_url.txt
```

### 2. QR Code for Easy Access
- Go to: https://www.qr-code-generator.com/
- Paste your Ngrok URL
- Generate QR code
- Students can scan to access

### 3. Monitor in Real-Time
- Keep http://localhost:4040 open
- Watch registrations happen live

### 4. Backup Plan
- Have LAN access ready (http://YOUR_IP:8002)
- In case Ngrok fails

---

## 📋 Checklist Before Going Public

- [ ] Application running on port 8002
- [ ] Database connected and working
- [ ] Tested locally (http://localhost:8002)
- [ ] Ngrok authtoken configured
- [ ] Ngrok tunnel started
- [ ] Public URL copied
- [ ] Tested public URL in browser
- [ ] Tested on mobile device
- [ ] Admin dashboard accessible
- [ ] Excel download working

---

## 🎉 Success Indicators

You're ready when:
- ✅ Application runs locally
- ✅ Ngrok shows "Session Status: online"
- ✅ Public URL opens your app
- ✅ Can register a student via public URL
- ✅ Can access admin via public URL
- ✅ Mobile devices can access

---

## 📞 Support Resources

### Ngrok Documentation:
- https://ngrok.com/docs

### Ngrok Dashboard:
- https://dashboard.ngrok.com/

### Check Status:
- https://status.ngrok.com/

---

## 🔐 Security Reminder

**For Production Use:**
- ⚠️ Ngrok is great for demos/testing
- ⚠️ For long-term production, use proper hosting
- ⚠️ Consider adding authentication
- ⚠️ Monitor access logs
- ⚠️ Don't share URLs publicly on social media

---

## 📝 Example Session

```bash
# Terminal 1
C:\Users\Srevarshan\OneDrive\Desktop\Projects\Data-Collection-Application>setup_and_run.bat
[Application starts...]
INFO:     Uvicorn running on http://0.0.0.0:8002

# Terminal 2
C:\ngrok>ngrok http 8002
Forwarding: https://abc123def456.ngrok-free.app -> http://localhost:8002

# Share with users:
"Please visit: https://abc123def456.ngrok-free.app"
```

---

**Your AIML Student Registration System is now accessible from anywhere in the world! 🌍🎓**
