import numpy as np
import string
import math
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# ---------- LOAD DATA ----------
COMMON_PASSWORDS = set()
with open("rockyou.txt", "r", encoding="latin-1") as f:
    for i, line in enumerate(f):
        if i >= 100000:
            break
        COMMON_PASSWORDS.add(line.strip())

# ---------- HELPERS ----------
def has_sequence(password):
    password = password.lower()
    for i in range(len(password) - 2):
        if ord(password[i]) + 1 == ord(password[i+1]) and ord(password[i+1]) + 1 == ord(password[i+2]):
            return True
        if ord(password[i]) - 1 == ord(password[i+1]) and ord(password[i+1]) - 1 == ord(password[i+2]):
            return True
    return False

def has_keyboard_pattern(password):
    patterns = ["qwerty", "asdfgh", "zxcvbn", "qaz", "wsx", "edc"]
    password = password.lower()
    return any(p in password for p in patterns)

# ---------- FEATURE ----------
def extract_features(password):
    length = len(password)

    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in string.punctuation for c in password)

    special_count = sum(1 for c in password if c in string.punctuation)

    charset = 0
    if has_upper: charset += 26
    if has_lower: charset += 26
    if has_digit: charset += 10
    if has_special: charset += 32

    entropy = length * math.log2(charset) if charset > 0 else 0

    is_common = password.lower() in COMMON_PASSWORDS
    seq = has_sequence(password)
    keyboard = has_keyboard_pattern(password)

    return [
        length,
        entropy,
        int(has_upper),
        int(has_lower),
        int(has_digit),
        int(has_special),
        special_count,
        int(is_common),
        int(seq),
        int(keyboard)
    ]

# ---------- DATA ----------
passwords = []
with open("rockyou.txt", "r", encoding="latin-1") as f:
    for i, line in enumerate(f):
        if i >= 80000:
            break
        pwd = line.strip()
        if pwd:
            passwords.append(pwd)

# ---------- BUILD DATASET ----------
X = []
y = []

for pwd in passwords:
    X.append(extract_features(pwd))

    # labeling
    if len(pwd) < 8:
        y.append(0)
    elif len(pwd) < 12:
        y.append(1)
    else:
        y.append(2)

X = np.array(X)
y = np.array(y)

# ---------- SCALE ----------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ---------- TRAIN ----------
model = RandomForestClassifier(n_estimators=200, max_depth=12)
model.fit(X_scaled, y)

print("Model trained")

# ---------- SAVE ----------
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(scaler, open("scaler.pkl", "wb"))

print("Saved successfully")

