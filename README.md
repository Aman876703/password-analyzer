# 🔐 PasswordGuard - AI-Based Password Strength Analyzer

A full-stack application that analyzes password strength using entropy calculations, pattern detection, and ML-based security scoring. Built with **React + Tailwind**, **FastAPI + Python ML**, and **Node.js Express**.

## ✨ Features

- **Real-time Password Analysis**
  - Entropy calculation (Shannon entropy)
  - Security score (0-100)
  - Strength classification (Very Weak → Very Strong)
  
- **Advanced Metrics**
  - Time to crack estimation (brute force resistant)
  - Character composition analysis
  - Pattern detection (keyboard patterns, sequential chars)
  - Common password detection

- **Smart Suggestions**
  - Actionable improvement recommendations
  - AI-generated strong password suggestions
  - Entropy and security scoring for suggestions

- **Performance Metrics**
  - Real-time latency tracking
  - Analysis performance monitoring
  - Network latency measurement

- **Security**
  - Passwords analyzed locally (no server storage)
  - HTTPS-ready architecture
  - CORS protection
  - Rate limiting support

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend (Tailwind)              │
│              (PasswordGuard.jsx Component)               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
┌────────────────────▼────────────────────────────────────┐
│           Node.js/Express Backend (API Gateway)          │
│              (server.js - Port 5000)                     │
│         • Serves React frontend                          │
│         • Proxies requests to FastAPI                    │
│         • Handles CORS & middleware                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
┌────────────────────▼────────────────────────────────────┐
│      FastAPI ML Backend (Port 8000)                      │
│      (password_analyzer_ml.py)                           │
│      • Password entropy calculation                      │
│      • ML-based strength scoring                         │
│      • Pattern detection algorithms                      │
│      • Password suggestion generation                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14+ and npm
- **Python** 3.8+
- **pip** package manager

### 1️⃣ Clone & Setup Repository

```bash
# Create project directory
mkdir password-analyzer && cd password-analyzer

# Copy all project files to this directory
# Files:
# - password_analyzer_ml.py (FastAPI backend)
# - server.js (Express backend)
# - PasswordAnalyzer.jsx (React component)
# - package.json (Node dependencies)
# - requirements.txt (Python dependencies)
```

### 2️⃣ Install Python Dependencies

```bash
# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3️⃣ Install Node.js Dependencies

```bash
npm install
```

### 4️⃣ Create `.env` File

```bash
# Create .env file in project root
cat > .env << EOF
PORT=5000
ML_API_URL=http://localhost:8000
NODE_ENV=development
EOF
```

### 5️⃣ Start FastAPI ML Backend

```bash
# Terminal 1 - FastAPI Server
python password_analyzer_ml.py

# Output:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

### 6️⃣ Start Node.js/Express Server

```bash
# Terminal 2 - Express Server
npm start

# Output:
# ✅ Express server running on http://localhost:5000
# 📡 Connected to ML service at http://localhost:8000
```

### 7️⃣ Open Browser

Visit: **http://localhost:5000**

---

## 📋 API Endpoints

### 1. Analyze Password
**POST** `/api/analyze`

**Request:**
```json
{
  "password": "MyP@ssw0rd123!"
}
```

**Response:**
```json
{
  "password_length": 14,
  "entropy": 92.5,
  "security_score": 78.5,
  "crack_time_seconds": 1.23e+15,
  "crack_time_readable": "39,000,000.0 years",
  "strength_level": "Strong",
  "has_uppercase": true,
  "has_lowercase": true,
  "has_numbers": true,
  "has_special_chars": true,
  "special_chars_count": 1,
  "is_common": false,
  "has_keyboard_pattern": false,
  "has_sequential_chars": false,
  "suggestions": [],
  "estimated_latency_ms": 2.5,
  "network_latency_ms": 45,
  "total_latency_ms": 47.5
}
```

### 2. Get Password Suggestions
**POST** `/api/suggest`

**Request:**
```json
{
  "password": "currentPassword"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "password": "Tr0pic@lThunder#42",
      "entropy": 110.5,
      "security_score": 95.0
    },
    {
      "password": "SilentPhoenix$88",
      "entropy": 108.2,
      "security_score": 92.5
    }
  ],
  "latency_ms": 35,
  "timestamp": "2024-03-27T10:30:00Z"
}
```

### 3. Health Check
**GET** `/api/health`

```json
{
  "status": "healthy",
  "timestamp": "2024-03-27T10:30:00Z",
  "mlService": "http://localhost:8000"
}
```

---

## 📊 Analysis Metrics Explained

### Security Score (0-100)
- **80-100**: Very Strong - Excellent security
- **60-79**: Strong - Good security
- **40-59**: Fair - Moderate security
- **20-39**: Weak - Poor security
- **0-19**: Very Weak - Very vulnerable

### Entropy
- Measured in **bits**
- Based on character set size and length
- Formula: `log₂(charset_size^length)`
- Higher entropy = harder to crack

### Crack Time
- Assumes **1 trillion guesses/second** (GPU brute force)
- Based on: `(2^entropy / 2) / guesses_per_second`
- "Time to crack" uses average attempts

### Character Composition
- **Uppercase**: A-Z (26 possibilities)
- **Lowercase**: a-z (26 possibilities)
- **Numbers**: 0-9 (10 possibilities)
- **Special**: !@#$%^&* (32 possibilities)

---

## 🔧 Configuration

### Customize FastAPI ML Backend

Edit `password_analyzer_ml.py`:

```python
# Adjust common password list
COMMON_PASSWORDS = {
    'password', '123456', '12345678', ...
}

# Modify crack time calculation
guesses_per_second = 1e12  # 1 trillion (change as needed)

# Add custom keyboard patterns
KEYBOARD_PATTERNS = [
    'qwerty', 'asdfgh', ...
]
```

### Customize Express Server

Edit `server.js`:

```javascript
const PORT = process.env.PORT || 5000;
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

// Adjust timeout
timeout: 10000 // milliseconds
```

### Customize React Frontend

Edit `PasswordAnalyzer.jsx`:

```jsx
// Change API endpoints
const response = await fetch('/api/analyze', {
  method: 'POST',
  ...
});

// Customize colors, animations, layout
getStrengthColor = (score) => { ... }
```

---

## 🐳 Docker Deployment

### Dockerfile for FastAPI

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY password_analyzer_ml.py .

CMD ["python", "password_analyzer_ml.py"]
```

### Dockerfile for Express

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY server.js .

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  ml-backend:
    build: ./ml
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1

  node-backend:
    build: ./node
    ports:
      - "5000:5000"
    environment:
      - ML_API_URL=http://ml-backend:8000
    depends_on:
      - ml-backend

  react-frontend:
    build: ./react
    ports:
      - "3000:3000"
```

---

## 📈 Performance Optimization

### For Production:

1. **Add Caching**
   ```python
   # FastAPI with Redis caching
   from aioredis import Redis
   cache = await Redis.from_url("redis://localhost")
   ```

2. **Rate Limiting**
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   ```

3. **Compression**
   ```python
   from fastapi.middleware.gzip import GZipMiddleware
   app.add_middleware(GZipMiddleware, minimum_size=1000)
   ```

4. **Database Caching** (for common passwords)
   ```python
   # Pre-load common passwords into memory
   COMMON_PASSWORDS = load_from_file('common_passwords.txt')
   ```

---

## 🧪 Testing

### Test FastAPI Endpoints

```bash
# Using curl
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"password": "Test@1234"}'

# Using Python requests
import requests
response = requests.post('http://localhost:8000/analyze', 
  json={'password': 'Test@1234'})
print(response.json())
```

### Test Express Server

```bash
curl -X POST "http://localhost:5000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"password": "Test@1234"}'
```

---

## 🔐 Security Best Practices

✅ **Implemented:**
- No password storage on server
- Client-side analysis option available
- CORS protection
- Input validation
- Error handling

✅ **Recommended for Production:**
- Enable HTTPS/SSL
- Implement rate limiting
- Add authentication if needed
- Use environment variables for secrets
- Add audit logging
- Regular security audits

---

## 📦 Project Structure

```
password-analyzer/
├── password_analyzer_ml.py    # FastAPI ML backend
├── server.js                   # Express.js server
├── PasswordAnalyzer.jsx        # React component
├── package.json                # Node.js dependencies
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Docker orchestration
└── README.md                   # This file
```

---

## 🚢 Deployment Options

### Heroku
```bash
git init
git add .
git commit -m "Initial commit"
heroku create password-analyzer
git push heroku main
```

### AWS
- **FastAPI**: AWS Lambda + API Gateway
- **Express**: AWS Elastic Beanstalk
- **React**: AWS S3 + CloudFront

### DigitalOcean
```bash
# Deploy using doctl CLI
doctl apps create --spec app.yaml
```

### Vercel/Netlify (React only)
```bash
npm run build
vercel --prod
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🆘 Troubleshooting

### FastAPI Server Won't Start
```bash
# Check port 8000 is available
lsof -i :8000
# Kill process: kill -9 <PID>

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Express Can't Connect to FastAPI
```bash
# Check ML_API_URL in .env
cat .env

# Test FastAPI manually
curl http://localhost:8000/health

# Check firewall settings
```

### React Frontend Not Loading
```bash
# Clear npm cache
npm cache clean --force

# Reinstall packages
rm -rf node_modules package-lock.json
npm install

# Check Express logs for errors
```

---

## 📞 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check documentation
- Review example API calls

---

## 🎯 Future Enhancements

- [ ] ML model training on password breach datasets
- [ ] Two-factor authentication integration
- [ ] Password strength trends/history
- [ ] Batch password analysis
- [ ] Browser extension
- [ ] API key authentication
- [ ] Advanced visualization dashboard
- [ ] Multi-language support

---

**Built with ❤️ for better password security**
