# Aman Thakur — AI/ML Engineer & Data Scientist Portfolio

A high-performance, agentic portfolio designed to showcase advanced AI/ML systems and production-ready applications. 

![Aesthetic Preview](assets/img/preview.png)

## 🚀 Key Features

- **Groq AI Terminal**: A live, context-aware CLI powered by Llama 3.1 for interactive site navigation and tech queries.
- **Nexus Agent**: Autonomous multi-agent framework demonstration with simulated architectural insights.
- **LifeOS Integration**: Direct display of professional CV and live system diagnostic demos.
- **Python Backend**: Secure Flask proxy for protected API communication and SMTP mail transit.
- **Modern UI**: Liquid cursor morphing, TextScramble reveal animations, and glassmorphism design.

---

## 📂 Project Structure

```
portfolio/
├── index.html              ← Core UI & Content
├── assets/
│   ├── css/style.css       ← Premium Design System
│   ├── js/main.js          ← Agentic Logic & Animations
│   └── Aman_Thakur_CV.pdf  ← Professional Resume
└── backend/
    ├── app.py              ← Flask API (Mail & AI Proxy)
    ├── requirements.txt    ← Python Dependencies
    └── .env                ← Local Secrets (Hidden)
```

---

## 🛠️ Setup & Local Development

### 1. Frontend
Simply open `index.html` in any modern browser. All animations and styling are handled via Vanilla JS/CSS.

### 2. Backend (Python 3.10+)
To enable the **AI Terminal** and **Contact Form**, you must run the local server:

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure your environment in `.env`:
    ```env
    EMAIL_USER=your_gmail@gmail.com
    EMAIL_PASS=your_16_digit_app_password
    GROQ_API_KEY=your_groq_api_key
    ```
4.  Run the server:
    ```bash
    python app.py
    ```

---

## 🛡️ Git Configuration
The project is pre-configured with a `.gitignore` to ensure your `.env` secrets and `__pycache__` folders are never pushed to public repositories.

---

## 👤 Author
**Aman Thakur**  
AI/ML Engineer | B.Tech Student  
[GitHub](https://github.com/QUANTUMVERSECODER) | [LinkedIn](https://www.linkedin.com/in/aman-thakur7704/)
