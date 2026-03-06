🧠 Empathy Engine
AI-Powered Intelligent Outreach Workflow Automation Platform
Empathy Engine is a B2B sales outreach platform built for the Coherence Hackathon. It replaces static email sequences with adaptive AI-driven relationship management — profiling each lead's personality, tracking engagement in real time, and writing a unique personalized message for every single person.

💡 The Problem
Most outreach tools send the same templated email to everyone on a fixed timer. Leads ignore them. Reply rates stay under 4%. Sales reps waste hours manually following up.
✅ Our Solution
Empathy Engine analyzes who each lead is, how they prefer to communicate, and how engaged they are — then decides the smartest next action and writes the perfect message automatically.

🔑 Key Features

AI Lead Finder — describe your ideal customer, AI finds and enriches leads
DISC Persona Detection — every lead profiled as Dominant, Influential, Steady, or Conscientious
Relationship Intelligence — Interest, Trust, and Fatigue scores tracked live per lead
AI Decision Engine — adapts the workflow based on lead behavior, not a fixed sequence
Persona-Matched Emails — Claude writes a unique email for every lead in their communication style
Visual Workflow Builder — drag and drop nodes, no code required
Human Behavior Simulation — randomized send times, jitter delays, quiet hours
Lead Heatmap — scatter plot of every lead by Trust vs Interest score
Live Activity Feed — real-time stream of every outreach action
Human Override — edit any AI decision, message, score, or stage at any time
Two Dashboards — Admin console + Client company portal


🛠️ Built With

Frontend — Lovable / Base44, React Flow, Tailwind CSS
Backend — Python, FastAPI, MongoDB Atlas
AI — Anthropic Claude API
Email — Gmail SMTP
Real-time — Socket.io WebSocket


🏃 Run Locally
bashgit clone https://github.com/yourteam/empathy-engine.git
cd empathy-engine/backend

pip install -r requirements.txt

# Create .env with:
# MONGODB_URL, ANTHROPIC_API_KEY, GMAIL_ADDRESS, GMAIL_APP_PASSWORD

uvicorn main:app --reload

"Not automation. Relationship intelligence."
