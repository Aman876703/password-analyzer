# 🎯 Quick Reference Guide

## 📦 Installation & Setup (5 minutes)

```bash
# 1. Python Setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Node Setup
npm install

# 3. Create .env file
cp .env.example .env

# 4. Start FastAPI (Terminal 1)
python password_analyzer_ml.py

# 5. Start Express (Terminal 2)
npm start

# 6. Open Browser
# Visit: http://localhost:5000
```

---

## 🚀 Quick Start Commands

| Task | Command |
|------|---------|
| Start FastAPI | `python password_analyzer_ml.py` |
| Start Express | `npm start` |
| Start with Docker | `docker-compose up` |
| Install deps | `pip install -r requirements.txt && npm install` |
| Test API | `curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d '{"password":"Test@123"}'` |
| Check health | `curl http://localhost:5000/api/health` |

---

## 🧪 API Quick Test

### Using cURL

```bash
# Analyze password
curl -X POST "http://localhost:5000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"password": "MySecurePass@123"}'

# Get suggestions
curl -X POST "http://localhost:5000/api/suggest" \
  -H "Content-Type: application/json" \
  -d '{"password": "weakpass"}'

# Health check
curl "http://localhost:5000/api/health"
```

### Using Python

```python
import requests

# Analyze
response = requests.post('http://localhost:5000/api/analyze',
    json={'password': 'Test@1234'})
print(response.json())

# Suggest
response = requests.post('http://localhost:5000/api/suggest',
    json={'password': 'test'})
print(response.json())
```

### Using JavaScript/Fetch

```javascript
// Analyze
fetch('/api/analyze', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({password: 'Test@1234'})
})
.then(r => r.json())
.then(data => console.log(data));

// Suggest
fetch('/api/suggest', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({password: 'weak'})
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🐛 Troubleshooting Cheat Sheet

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `lsof -i :5000` then `kill -9 <PID>` |
| Port 8000 in use | `lsof -i :8000` then `kill -9 <PID>` |
| Module not found | `pip install -r requirements.txt` |
| npm install fails | `npm cache clean --force && npm install` |
| CORS error | Check `.env` ML_API_URL matches FastAPI port |
| FastAPI won't start | Ensure Python 3.8+ with `python --version` |
| React won't load | Check Express server running on port 5000 |

---

## 📁 Project Structure

```
password-analyzer/
├── password_analyzer_ml.py        ← FastAPI backend (port 8000)
├── server.js                       ← Express server (port 5000)
├── PasswordAnalyzer.jsx            ← React component
├── package.json                    ← Node dependencies
├── requirements.txt                ← Python dependencies
├── .env                            ← Configuration
├── docker-compose.yml              ← Docker setup
├── Dockerfile.ml                   ← FastAPI Docker
├── Dockerfile.node                 ← Express Docker
├── README.md                       ← Main docs
├── ADVANCED.md                     ← Advanced setup
└── .gitignore                      ← Git ignore
```

---

## 🔑 Key Endpoints

### FastAPI (Port 8000)

```
POST /analyze              → Analyze password strength
POST /suggest              → Get password suggestions
GET  /health               → Health check
```

### Express (Port 5000)

```
POST /api/analyze          → Analyze password (proxied to FastAPI)
POST /api/suggest          → Get suggestions (proxied to FastAPI)
GET  /api/health           → Health check
GET  /                     → React frontend
```

---

## 📊 Response Examples

### Analyze Response

```json
{
  "password_length": 14,
  "entropy": 92.5,
  "security_score": 78.5,
  "crack_time_readable": "39,000,000.0 years",
  "strength_level": "Strong",
  "has_uppercase": true,
  "has_lowercase": true,
  "has_numbers": true,
  "has_special_chars": true,
  "suggestions": ["Your password is strong!"],
  "estimated_latency_ms": 2.5
}
```

### Suggest Response

```json
{
  "suggestions": [
    {
      "password": "Tr0pic@lThunder#42",
      "entropy": 110.5,
      "security_score": 95.0
    }
  ],
  "latency_ms": 35
}
```

---

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f ml-backend

# Restart services
docker-compose restart

# Remove volumes
docker-compose down -v
```

---

## 🔐 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong environment variables
- [ ] Enable rate limiting
- [ ] Add authentication if needed
- [ ] Use CORS whitelist
- [ ] Validate all inputs
- [ ] Regular security updates
- [ ] Monitor logs for attacks
- [ ] Use secrets manager for credentials

---

## 📈 Performance Tips

1. **Enable Caching**: Add Redis for frequently analyzed passwords
2. **Optimize Entropy**: Use fast math operations
3. **Database Indexing**: Index common passwords
4. **Load Balancing**: Use Nginx for multiple instances
5. **CDN**: Serve static React files from CDN
6. **Compression**: Enable Gzip middleware
7. **Async Processing**: Use async/await patterns
8. **Batch Requests**: Support multiple passwords per request

---

## 🚀 Deployment Quick Links

- **Heroku**: `heroku create app-name && git push heroku main`
- **AWS**: Use Elastic Beanstalk or Lambda + API Gateway
- **GCP**: Use Cloud Run: `gcloud run deploy app-name --source .`
- **DigitalOcean**: Use App Platform or Droplets
- **Docker Hub**: `docker build -t username/password-analyzer . && docker push`

---

## 📚 File Quick Reference

| File | Purpose | Language |
|------|---------|----------|
| `password_analyzer_ml.py` | Core ML & analysis logic | Python |
| `server.js` | API gateway & frontend server | Node.js |
| `PasswordAnalyzer.jsx` | UI component | React/JSX |
| `requirements.txt` | Python dependencies | Text |
| `package.json` | Node.js dependencies | JSON |
| `.env` | Configuration variables | Shell |
| `docker-compose.yml` | Container orchestration | YAML |

---

## 🎓 Learning Path

1. **Beginner**: Run locally, understand API responses
2. **Intermediate**: Modify ML parameters, add features
3. **Advanced**: Train custom ML models, deploy to cloud
4. **Expert**: Implement distributed systems, add ML pipeline

---

## 🆘 Get Help

```bash
# Check logs
docker-compose logs -f

# Test connectivity
curl http://localhost:8000/health
curl http://localhost:5000/api/health

# Verify ports
lsof -i :5000
lsof -i :8000

# Clear everything and restart
docker-compose down -v
docker-compose up --build
```

---

## 💾 Backup & Recovery

```bash
# Backup database (if using PostgreSQL)
pg_dump password_analyzer > backup.sql

# Restore database
psql password_analyzer < backup.sql

# Backup Docker volumes
docker run --rm -v password-analyzer_volume:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

---

## 🎯 Next Steps

1. **Customize**: Edit colors, text, and settings
2. **Extend**: Add more analysis algorithms
3. **Deploy**: Push to production server
4. **Monitor**: Set up logging and alerts
5. **Scale**: Handle thousands of requests/second

---

## 📞 Common Issues & Solutions

```
Q: API returns 502 Bad Gateway
A: FastAPI service might be down. Check: `curl http://localhost:8000/health`

Q: Frontend shows "Cannot reach server"
A: Express not running. Start with: `npm start`

Q: Passwords not being analyzed
A: Check network tab in browser DevTools for errors

Q: Services slow to respond
A: Check CPU/memory usage. Optimize or scale horizontally.

Q: Docker containers won't start
A: Check logs: `docker-compose logs` and verify port availability
```

---

**Need more help?** Check the full README.md or ADVANCED.md files!
