# Voicehelden — AI Voice Assistant

AI-powered voice assistant and lead capture system built for Voicehelden.

## Features
- **Vapi Voice AI** — "Gwen" handles inbound calls 24/7
- **AI Webchat** — Knowledge-based chat widget on the landing page
- **Lead Capture** — Captures name, phone, interest via n8n webhook
- **Google Sheets Sync** — Leads auto-append to a Google Sheet
- **Live Dashboard** — Real-time admin panel at `/admin`

## Tech Stack
- Node.js + Express (server)
- Vapi.ai (voice assistant)
- n8n (workflow automation)
- Google Sheets (lead storage)

## Quick Start
```bash
npm install
node server.js
```
- Landing Page: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`

## Project Structure
```
├── server.js          # Express server + Google Sheet proxy
├── public/
│   ├── index.html     # Premium landing page + chat + voice widget
│   └── admin.html     # Admin dashboard with live leads
├── vapi_config.json   # Vapi assistant configuration
├── n8n_workflow.json  # n8n workflow for lead capture
└── package.json
```

## Contact
Voicehelden — 020-7820049
