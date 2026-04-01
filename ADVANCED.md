# 🚀 Advanced Development Guide

This guide covers advanced setup, ML model training, performance optimization, and production deployment.

---

## 📚 Table of Contents

1. [Advanced Configuration](#advanced-configuration)
2. [ML Model Training](#ml-model-training)
3. [Performance Optimization](#performance-optimization)
4. [Production Deployment](#production-deployment)
5. [Monitoring & Logging](#monitoring--logging)
6. [Security Hardening](#security-hardening)

---

## Advanced Configuration

### 1. FastAPI with Database Integration

Install additional dependencies:
```bash
pip install sqlalchemy psycopg2-binary alembic
```

Add to `password_analyzer_ml.py`:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Store analysis history
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class PasswordAnalysisHistory(Base):
    __tablename__ = "analysis_history"
    
    id = Column(Integer, primary_key=True, index=True)
    password_hash = Column(String, unique=True, index=True)
    security_score = Column(Float)
    strength_level = Column(String)
    analyzed_at = Column(DateTime, default=datetime.utcnow)
```

### 2. Caching with Redis

Install Redis client:
```bash
pip install redis aioredis
```

Add caching:
```python
from aioredis import Redis

redis = None

async def startup_event():
    global redis
    redis = await Redis.from_url("redis://localhost")

app.add_event_handler("startup", startup_event)

@app.post("/analyze", response_model=PasswordAnalysis)
async def analyze_password(request: PasswordRequest):
    # Check cache
    cache_key = f"analysis:{hash(request.password)}"
    cached = await redis.get(cache_key)
    
    if cached:
        return json.loads(cached)
    
    # ... perform analysis ...
    
    # Cache result
    await redis.setex(cache_key, 3600, json.dumps(result))
    return result
```

### 3. Rate Limiting

```bash
pip install slowapi
```

Add to FastAPI:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/analyze")
@limiter.limit("100/minute")
async def analyze_password(request: PasswordRequest, request_obj: Request):
    # ... your code ...
```

---

## ML Model Training

### Advanced ML Model for Password Classification

```python
# train_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

def extract_features(password: str) -> dict:
    """Extract features from password for ML model"""
    features = {
        'length': len(password),
        'uppercase_ratio': sum(1 for c in password if c.isupper()) / len(password),
        'lowercase_ratio': sum(1 for c in password if c.islower()) / len(password),
        'digit_ratio': sum(1 for c in password if c.isdigit()) / len(password),
        'special_ratio': sum(1 for c in password if not c.isalnum()) / len(password),
        'entropy': calculate_entropy(password),
        'has_sequential': 1 if has_sequential_chars(password) else 0,
        'has_keyboard_pattern': 1 if has_keyboard_pattern(password) else 0,
    }
    return features

def train_model():
    """Train ML model on password dataset"""
    # Load data (you would use a real dataset like rockyou.txt)
    # This is pseudocode - implement with actual data
    
    passwords = pd.read_csv('passwords.csv')
    
    X = passwords.apply(lambda row: pd.Series(extract_features(row['password'])), axis=1)
    y = passwords['is_strong']  # Binary classification
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train models
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=20)
    rf_model.fit(X_train_scaled, y_train)
    
    gb_model = GradientBoostingClassifier(n_estimators=100)
    gb_model.fit(X_train_scaled, y_train)
    
    # Evaluate
    rf_score = rf_model.score(X_test_scaled, y_test)
    gb_score = gb_model.score(X_test_scaled, y_test)
    
    print(f"Random Forest Accuracy: {rf_score:.3f}")
    print(f"Gradient Boosting Accuracy: {gb_score:.3f}")
    
    # Save models
    with open('rf_model.pkl', 'wb') as f:
        pickle.dump((rf_model, scaler), f)
    
    with open('gb_model.pkl', 'wb') as f:
        pickle.dump((gb_model, scaler), f)

if __name__ == "__main__":
    train_model()
```

### Use Trained Model in FastAPI

```python
import pickle

with open('rf_model.pkl', 'rb') as f:
    rf_model, scaler = pickle.load(f)

@app.post("/predict")
async def predict_strength(request: PasswordRequest):
    """Use ML model to predict password strength"""
    features = extract_features(request.password)
    feature_vector = np.array(list(features.values())).reshape(1, -1)
    
    X_scaled = scaler.transform(feature_vector)
    prediction = rf_model.predict(X_scaled)[0]
    probability = rf_model.predict_proba(X_scaled)[0][1]
    
    return {
        "is_strong": bool(prediction),
        "confidence": float(probability),
        "features": features
    }
```

---

## Performance Optimization

### 1. Compression Middleware

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### 2. Async Processing

```python
import asyncio

@app.post("/analyze-batch")
async def analyze_batch(passwords: List[str]):
    """Analyze multiple passwords concurrently"""
    tasks = [analyze_password_async(pwd) for pwd in passwords]
    results = await asyncio.gather(*tasks)
    return results
```

### 3. Optimized Entropy Calculation

```python
import math

def calculate_entropy_fast(password: str) -> float:
    """Optimized entropy calculation"""
    charset_size = 0
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)
    
    charset_size = (26 if has_upper else 0) + \
                   (26 if has_lower else 0) + \
                   (10 if has_digit else 0) + \
                   (32 if has_special else 0)
    
    return len(password) * math.log2(charset_size) if charset_size > 0 else 0
```

### 4. Pre-computed Common Passwords

```python
# Load common passwords once at startup
import mmap

def load_common_passwords_fast():
    """Load common passwords using memory mapping"""
    with open('common_passwords.txt', 'r') as f:
        with mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mmapped:
            common = set(mmapped.read().decode().split('\n'))
    return common

COMMON_PASSWORDS = load_common_passwords_fast()
```

---

## Production Deployment

### 1. AWS Deployment

**Using AWS Elastic Beanstalk:**

```bash
# Install AWS CLI
pip install awsebcli

# Initialize EB application
eb init -p python-3.11 password-analyzer --region us-east-1

# Create environment
eb create production

# Deploy
eb deploy

# Monitor logs
eb logs
```

**Using AWS Lambda + API Gateway:**

```python
# For serverless FastAPI deployment
from mangum import Asgi

handler = Asgi(app)
```

### 2. Google Cloud Deployment

```bash
# Deploy to Cloud Run
gcloud run deploy password-analyzer \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 3. Kubernetes Deployment

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: password-analyzer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: password-analyzer
  template:
    metadata:
      labels:
        app: password-analyzer
    spec:
      containers:
      - name: ml-backend
        image: password-analyzer-ml:latest
        ports:
        - containerPort: 8000
        
      - name: node-backend
        image: password-analyzer-node:latest
        ports:
        - containerPort: 5000
        env:
        - name: ML_API_URL
          value: http://localhost:8000
```

Deploy:
```bash
kubectl apply -f k8s-deployment.yaml
kubectl scale deployment password-analyzer --replicas=5
```

---

## Monitoring & Logging

### 1. Sentry Integration (Error Tracking)

```bash
pip install sentry-sdk
```

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0
)
```

### 2. Prometheus Metrics

```bash
pip install prometheus-client
```

```python
from prometheus_client import Counter, Histogram, generate_latest

request_count = Counter('password_analyzer_requests_total', 'Total requests')
request_duration = Histogram('password_analyzer_request_duration_seconds', 'Request duration')

@app.post("/analyze")
async def analyze_password(request: PasswordRequest):
    with request_duration.time():
        request_count.inc()
        # ... your code ...

@app.get("/metrics")
async def metrics():
    return generate_latest()
```

### 3. Structured Logging

```bash
pip install python-json-logger
```

```python
import logging
import json
from pythonjsonlogger import jsonlogger

logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

logger.info("Password analyzed", extra={
    "password_length": len(password),
    "entropy": entropy,
    "security_score": score
})
```

---

## Security Hardening

### 1. HTTPS/SSL Configuration

```python
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app.add_middleware(HTTPSRedirectMiddleware)
```

### 2. CORS Hardening

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
    max_age=600
)
```

### 3. Security Headers

```python
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)
```

### 4. Input Validation & Sanitization

```python
from pydantic import Field, validator

class PasswordRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=256)
    
    @validator('password')
    def validate_password(cls, v):
        # Prevent injection attacks
        if any(char in v for char in ['<', '>', '"', "'"]):
            raise ValueError('Invalid characters')
        return v
```

---

## Testing

### Load Testing with Locust

```bash
pip install locust
```

```python
# locustfile.py
from locust import HttpUser, task, between

class PasswordAnalyzerUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def analyze_password(self):
        self.client.post("/api/analyze", 
            json={"password": "Test@1234567"})
```

Run:
```bash
locust -f locustfile.py --host=http://localhost:5000
```

---

## 🎯 Next Steps

1. **Data Collection**: Gather password breach datasets for training
2. **Model Improvement**: Implement ensemble methods for better predictions
3. **Real-time Monitoring**: Set up dashboards with Grafana
4. **Auto-scaling**: Configure load balancers for high availability
5. **CI/CD Pipeline**: Set up GitHub Actions for automated testing and deployment

