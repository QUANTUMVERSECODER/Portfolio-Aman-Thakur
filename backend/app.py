from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app) # Allow frontend to communicate

# CONFIGURATION
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

SYSTEM_PROMPT = """
You are the personal AI agent for Aman Thakur's portfolio. 
Aman is an AI Engineer and Data Scientist.
Projects:
1. Nexus Agent: A multi-agent system using local LLMs.
2. LifeOS: An AI-powered productivity middleware.
3. Pass Pro: A security/entropy analyzer.
Skills: Python, ML, TensorFlow, GSAP, Three.js.
Your tone is professional, technical, and slightly 'agentic' (cyberpunk/terminal style).
Keep responses concise (1-3 sentences) suitable for a small terminal UI.
"""

@app.route("/")
def home():
    return "Portfolio Backend is Live 🚀"

@app.route('/ai-chat', methods=['POST'])
def ai_chat():
    if not client:
        return jsonify({"message": "Groq API key not configured on backend."}), 500
    
    data = request.json
    query = data.get('query')
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            max_tokens=150,
            temperature=0.7
        )
        response = completion.choices[0].message.content
        return jsonify({"response": response}), 200
    except Exception as e:
        print(f"[ERROR] Groq Failure: {str(e)}")
        return jsonify({"message": "Neural link failed. Try again later."}), 500

@app.route('/ai-sentiment', methods=['POST'])
def ai_sentiment():
    if not client:
        return jsonify({"score": 50, "label": "MODEL_OFFLINE"}), 500
    
    data = request.json
    text = data.get('text')
    
    try:
        prompt = f"Analyze the sentiment of this text: '{text}'. Return ONLY a JSON object with 'score' (0-100, where 0 is very negative and 100 is very positive) and 'label' (one word, uppercase)."
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" },
            max_tokens=50
        )
        import json
        result = json.loads(completion.choices[0].message.content)
        return jsonify(result), 200
    except Exception as e:
        print(f"[ERROR] Sentiment Failure: {str(e)}")
        return jsonify({"score": 50, "label": "ERROR"}), 500

@app.route('/send-api', methods=['POST', 'OPTIONS'])
def send_email():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    print(">>> RECEIVED POST REQUEST")
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not all([name, email, message]):
        print("!!! ERROR: Missing fields")
        return jsonify({"error": "Missing fields"}), 400

    if not EMAIL_USER or not EMAIL_PASS:
        print("!!! ERROR: Credentials missing in .env")
        return jsonify({"error": "Backend credentials not configured"}), 500

    try:
        print(f">>> Composing email from {name}...")
        # Create Email
        msg = MIMEMultipart()
        msg['From'] = f"{name} <{EMAIL_USER}>"
        msg['To'] = EMAIL_USER # Send to yourself
        msg['Subject'] = f"New Portfolio Message from {name}"
        
        body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        msg.attach(MIMEText(body, 'plain'))

        print(">>> Attempting SMTP Handshake (Gmail)...")
        # Send Email with shorter timeout
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10)
        server.starttls()
        print(">>> Logging in...")
        server.login(EMAIL_USER, EMAIL_PASS)
        print(">>> Transmitting data...")
        server.send_message(msg)
        server.quit()

        print(f"[SUCCESS] Message from {name} processed.")
        return jsonify({"status": "success", "message": "Email sent!"}), 200

    except Exception as e:
        print(f"[ERROR] SMTP FAILURE: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Use dynamic port for Render, fallback to 5000 for local dev
    port = int(os.environ.get("PORT", 5000))
    print(f"Agent Backend Active on port {port}...")
    
    # host='0.0.0.0' is required for cloud deployment visibility
    app.run(host='0.0.0.0', port=port, debug=False)
