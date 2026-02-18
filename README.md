# SmartTasker: AI-Powered Task Management System

SmartTasker is a modern, full-stack task management application that leverages Artificial Intelligence to streamline productivity. It features real-time notifications, intelligent task prioritization, and natural language task generation.

---

## System Architecture

The project is built using a decoupled service-oriented architecture:

*   **Frontend (`/client`):** Next.js 16 application providing a sleek, responsive user interface.
*   **Core Backend (`/server`):** Express.js server handling authentication, business logic, and real-time communication.
*   **AI Service (`/ai-service`):** Python FastAPI service dedicated to NLP-based task extraction and priority prediction.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **State/Form:** React Hook Form + Zod
- **Real-time:** Socket.io-client
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Real-time:** Socket.io
- **Security:** JWT, BcryptJS, Helmet, Rate Limiting
- **Email:** Nodemailer

### AI Service
- **Language:** Python 3.10+
- **Framework:** FastAPI
- **Library:** Spacy (NLP)
- **Server:** Uvicorn

---

## Features

- **Intelligent Task Generation:** Input natural language (e.g., "Buy milk tomorrow") and let the AI extract titles and due dates.
- **AI Priority Prediction:** Automatically predicts task priority based on description and deadlines.
- **Real-time Notifications:** Instant alerts for task reminders via WebSockets.
- **Secure Authentication:** JWT-based user login and registration system.
- **Responsive Design:** Optimized for both desktop and mobile views.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 1. AI Service Setup
```bash
cd ai-service
python -m venv venv
.\venv\Scripts\activate  
pip install -r requirements.txt
python -m spacy download en_core_web_sm

python -m uvicorn main:app --reload --port 8000
```

### 2. Backend Server Setup
```bash
cd server
npm install

npm run dev
```

### 3. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```

---

## Security Measures
- **Rate Limiting:** Protects against brute force attacks.
- **HTTP Headers:** Secured via Helmet.
- **Password Hashing:** Industry-standard BcryptJS encryption.
- **Input Validation:** Strict schema validation using Zod.

---

## Contact & Support
For inquiries, please contact the development team at:
- **Website:** [Oshadha Pathiraja](https://my-portfolio-one-wine-22.vercel.app/)
- **Email:** [oshadhanipun093@gmail.com]
