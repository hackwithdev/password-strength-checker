# Password Strength Checker

A clean, hacker-styled web app for analyzing password strength in real-time.

## Features

- **Real-time strength analysis** — scores passwords from Weak to Excellent
- **Brute-force time estimate** — calculates average crack time at 10 billion guesses/sec
- **Entropy calculation** — shows Shannon entropy in bits
- **Criteria checklist** — tracks lowercase, uppercase, numbers, special characters, and length
- **Password generator** — creates cryptographically secure 16-character passwords
- **Show/Hide toggle** — eye icon toggle to reveal or conceal the password
- **Character counter** — displays current password length

## Tech Stack

- **HTML** — semantic structure
- **CSS** — dark hacker theme with green neon accents, monospace fonts
- **JavaScript** — strength algorithm, entropy, and crack-time estimation

## Getting Started

```bash
# Serve the app locally
python -m http.server 8000

# Open in browser
http://localhost:8000
```

No dependencies or build step required. Just open `index.html` directly or serve via any static server.

## Algorithm

**Strength scoring** (0-4, capped):
- +1 for length ≥ 8
- +1 for length ≥ 12
- +1 for mixed case (upper + lower)
- +1 for numbers
- +1 for special characters
- +1 bonus if length ≥ 12 and 4+ criteria met

**Crack time** is estimated as `(charset^length) / (2 × 10,000,000,000)` seconds, formatted into human-readable units (seconds → minutes → hours → days → months → years → centuries → eons).
