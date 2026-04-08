from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests 
import string
import math
import pickle
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")  # 🔥 important

print("OPENROUTER_API_KEY:", os.getenv("OPENROUTER_API_KEY"))  # 🔥 debu    g
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- LOAD MODEL ----------
model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

# ---------- LOAD COMMON PASSWORDS ----------
COMMON_PASSWORDS = set()
COMMON_LIST = []

class PasswordRequest(BaseModel):
    password: str

# ---------- HELPERS ----------
def has_sequence(password):
    password = password.lower()
    for i in range(len(password) - 2):
        if ord(password[i]) + 1 == ord(password[i+1]) and ord(password[i+1]) + 1 == ord(password[i+2]):
            return True
    return False

def has_keyboard_pattern(password):
    patterns = ["qwerty", "asdfgh", "zxcvbn", "1234", "abcd"]
    return any(p in password.lower() for p in patterns)

def repetition_penalty(password):
    return len(password) - len(set(password))

def partial_common(password):
    pwd = password.lower()
    for p in COMMON_LIST[:5000]:   # limit for performance
        if pwd in p or p in pwd:
            return True
    return False

# ---------- OPENROUTER AI ----------

def get_ai_feedback(password):
    try:
        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Password Analyzer"
        }

        data = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": f"""
Generate 3 strong passwords based on: {password}

Also give 3 improvement tips for my {password}.

Rules:
- Output ONLY 6 lines
- First 3 lines must be passwords
- Next 3 lines must be improvement tips
- Do NOT add headings
- Do NOT add bullets
- Do NOT add numbering
- Each item must be on new line
"""
                }
            ]
        }

        res = requests.post(url, headers=headers, json=data)

        print("STATUS:", res.status_code)
        print("RESPONSE:", res.text)

        result = res.json()

        if "choices" not in result:
            raise Exception(result)

        text = result["choices"][0]["message"]["content"]

        suggestions = []
        improvements = []

        for line in text.split("\n"):
            line = line.strip()

            if not line:
                continue

            if line[0].isdigit():
                line = line.split(".", 1)[-1].strip()

            if len(suggestions) < 3:
                suggestions.append(line)
            else:
                improvements.append(line)

        suggestions = suggestions[:3]
        improvements = improvements[:3]

        # fallback safety
        if not suggestions:
            suggestions = [
                password + "@123",
                password.capitalize() + "#Secure",
                password + "XyZ!"
            ]

        if not improvements:
            improvements = [
                "Increase password length",
                "Use uppercase and lowercase letters",
                "Add numbers and special characters"
            ]

        return suggestions, improvements

    except Exception as e:
        print("❌ OpenRouter failed:", e)

        return [
            password + "@123",
            password.capitalize() + "#Secure",
            password + "XyZ!"
        ], [
            "Increase password length",
            "Add uppercase letters",
            "Include numbers",
            "Add special characters"
        ]
        
# ---------- ENTROPY ----------
def calculate_entropy(password):
    charset = 0
    if any(c.islower() for c in password): charset += 26
    if any(c.isupper() for c in password): charset += 26
    if any(c.isdigit() for c in password): charset += 10
    if any(c in string.punctuation for c in password): charset += 32

    if charset == 0:
        return 0

    return len(password) * math.log2(charset)

# ---------- ADJUSTED ENTROPY ----------
def adjusted_entropy(password, entropy):
    e = entropy

    if password.lower() in COMMON_PASSWORDS:
        e *= 0.3

    if has_sequence(password):
        e *= 0.7

    if has_keyboard_pattern(password):
        e *= 0.7

    return e

# ---------- FEATURE ----------
def extract_features(password):
    return [
        len(password),
        calculate_entropy(password),
        int(any(c.isupper() for c in password)),
        int(any(c.islower() for c in password)),
        int(any(c.isdigit() for c in password)),
        int(any(c in string.punctuation for c in password)),
        sum(1 for c in password if c in string.punctuation),
        int(password.lower() in COMMON_PASSWORDS),
        int(has_sequence(password)),
        int(has_keyboard_pattern(password))
    ]

def similarity(password):
    pwd = password.lower()
    for p in COMMON_LIST[:2000]:
        if abs(len(pwd) - len(p)) > 2:
            continue
        if sum(a != b for a, b in zip(pwd, p)) <= 2:
            return True
    return False

import re

def common_structure(password):
    return bool(re.match(r'[A-Za-z]+[@#]?\d+$', password))

# ---------- ML PREDICTION ----------
def predict_strength(password):
    features = extract_features(password)
    scaled = scaler.transform([features])
    pred = model.predict(scaled)[0]
    return ["Weak", "Medium", "Strong"][pred]

# ---------- SCORE ----------
def calculate_score(password):
    entropy = calculate_entropy(password)
    entropy = adjusted_entropy(password, entropy)

    score = 0
    length = len(password)

    # Length
    score += min(length * 4, 40)

    # Entropy
    score += min(entropy * 0.6, 40)

    # Diversity
    if any(c.isupper() for c in password): score += 5
    if any(c.islower() for c in password): score += 5
    if any(c.isdigit() for c in password): score += 5
    if any(c in string.punctuation for c in password): score += 5

    # 🔥 PENALTIES
    if password.lower() in COMMON_PASSWORDS:
        score -= 25

    if partial_common(password):
        score -= 25

    if has_sequence(password):
        score -= 15

    if has_keyboard_pattern(password):
        score -= 20

    if common_structure(password):
        score -= 10

    score -= repetition_penalty(password) * 1

    # Predictable patterns
    pwd = password.lower()
    if pwd.startswith("password"):
        score -= 15
    if pwd.endswith("123"):
        score -= 20

    # 🔥 ML INFLUENCE
    ml_pred = predict_strength(password)

    if ml_pred == "Weak":
        score -= 18
    elif ml_pred == "Strong":
        score += 10

    return max(0, min(int(score), 100)), entropy

# ---------- CRACK TIME ----------
def estimate_crack_time(password, entropy):
    if password.lower() in COMMON_PASSWORDS:
        return "Instantly"

    guesses = 2 ** entropy

    # Adjust guesses based on patterns
    if has_sequence(password) or has_keyboard_pattern(password):
        guesses /= 1000

    if partial_common(password):
        guesses /= 500

    guesses_per_sec = 1e10
    seconds = guesses / guesses_per_sec

    if seconds < 1:
        return "Instantly"
    elif seconds < 60:
        return "Seconds"
    elif seconds < 3600:
        return "Minutes"
    elif seconds < 86400:
        return "Hours"
    elif seconds < 2592000:
        return "Days"
    elif seconds < 31536000:
        return "Months"
    else:
        return "Years"

# ---------- API ----------
@app.post("/analyze")
def analyze(data: PasswordRequest):
    password = data.password

    if not password:
        return {}

    score, entropy = calculate_score(password)
    strength = predict_strength(password)
    crack_time = estimate_crack_time(password, entropy)

    suggestions, improvements = get_ai_feedback(password)

    return {
        "password_length": len(password),
        "entropy": round(entropy, 2),
        "security_score": score,
        "strength_level": strength,
        "crack_time_readable": crack_time,
        "is_common": password.lower() in COMMON_PASSWORDS,

        # 🔥 ADDED (DON'T REMOVE)
        "suggestions": suggestions,
        "improvements": improvements
    }

# ---------- RUN ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)