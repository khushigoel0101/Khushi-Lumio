# 🎙️ Meeting Assistant

An AI-powered meeting management platform that helps teams and individuals generate meeting summaries, extract action items, track decisions, and share reports efficiently.

---

## 🚀 Features

### 📄 AI Meeting Summarization

* Generate concise summaries from meeting notes
* Extract key discussion points automatically
* Reduce manual documentation effort

###  Action Item Extraction

* Identify tasks and responsibilities from meetings
* Organize follow-ups efficiently
* Improve team accountability

### 🎯 Decision Tracking

* Capture important decisions made during meetings
* Maintain a searchable decision history

### 📚 Meeting History

* Save generated summaries
* Access previous meetings anytime
* Review discussions and outcomes

### 📧 Email Reports

* Send meeting summaries via email
* Share reports with stakeholders instantly

### 🔐 Authentication

* Secure user registration and login
* JWT-based authentication
* Google OAuth integration

### 📊 Dashboard

* View meeting statistics
* Track generated summaries
* Monitor activity at a glance

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT Authentication
* Google OAuth

### AI Integration

* Google Gemini API

### Email Service

* Nodemailer

---

## 📁 Project Structure

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── email/
│   │   ├── layout/
│   │   ├── landing/
│   │   └── summary/
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Generate.jsx
│   │   ├── Meetings.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
backend/
│
├── routes/
├── controllers/
├── models/
├── middleware/
├── config/
└── server.js
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/khushigoel0101/Khushi-Lumio.git
cd Khushi-Lumio
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_gemini_api_key

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

GOOGLE_CLIENT_ID=your_google_client_id
```

Start the backend server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend server:

```bash
npm run dev
```

---

## 🔑 Environment Variables

### Backend

| Variable         | Description                 |
| ---------------- | --------------------------- |
| PORT             | Backend server port         |
| MONGO_URI        | MongoDB connection string   |
| JWT_SECRET       | JWT secret key              |
| GROQ_API_KEY   | Gemini API key              |
| EMAIL_USER       | Email address for reports   |
| EMAIL_PASS       | Email password/app password |
| GOOGLE_CLIENT_ID | Google OAuth Client ID      |

### Frontend

| Variable              | Description            |
| --------------------- | ---------------------- |
| VITE_API_URL          | Backend API URL        |
| VITE_GOOGLE_CLIENT_ID | Google OAuth Client ID |

---

## 📸 Application Modules

### Landing Page

Modern introduction to the platform and its capabilities.

### Dashboard

Displays meeting statistics, quick actions, and overall activity.

### Generate Summary

Generate AI-powered meeting summaries from notes or uploaded content.

### Meetings

View, manage, and revisit saved meeting reports.

### Profile

View account information and meeting-related statistics.

---


## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Khushi Goel**

B.Tech CSE Student | Full Stack Developer

Built to simplify meeting documentation and improve productivity through AI-powered automation.
