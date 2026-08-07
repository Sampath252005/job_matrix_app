# Job Matrix

**Job Matrix** is a full-stack recruitment platform that streamlines the hiring process — from job posting and candidate applications to shortlisting, assessments, and real-time video interviews.

## 🚀 Features

* 🔐 Secure authentication using **Supabase Auth**
* 👥 **Role-Based Access Control (RBAC)** for Candidates and Recruiters
* 💼 Job creation, management, and application tracking
* 📄 Candidate application management
* 📝 Candidate assessments
* ✅ Candidate shortlisting
* 📅 Interview scheduling and management
* 🎥 Real-time video interviews using **LiveKit WebRTC**
* 💬 Live announcements, candidate Q&A, and notifications using **Socket.IO**
* 🔗 RESTful APIs with modular backend architecture

## 🛠️ Tech Stack

| Area           | Technologies                    |
| -------------- | ------------------------------- |
| Frontend       | Next.js, TypeScript             |
| Backend        | Node.js, Express.js, TypeScript |
| Database       | PostgreSQL, Supabase            |
| Authentication | Supabase Auth, RBAC             |
| Video          | LiveKit WebRTC                  |
| Real-Time      | Socket.IO                       |
| API            | RESTful APIs                    |

## 🔄 Recruitment Workflow

```text
Job Posted
    ↓
Candidate Applies
    ↓
Assessment
    ↓
Recruiter Reviews Applications
    ↓
Candidate Shortlisted
    ↓
Interview Scheduled
    ↓
Live Video Interview
    ↓
Hiring Decision
```

## 🎥 Real-Time Interview System

Job Matrix includes an integrated video interview system powered by **LiveKit WebRTC**.

* Secure audio/video communication
* Interview-specific rooms
* Secure participant token generation
* Candidate and recruiter access
* Real-time announcements and Q&A through Socket.IO

## 🏗️ Backend Architecture

The backend follows a modular **Route → Controller → Service** architecture.

```text
Client
  ↓
REST API
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Supabase / PostgreSQL
```

This keeps business logic separated and makes the backend easier to maintain and scale.

## 📂 Project Structure

```text
job_matrix/
├── frontend/        # Next.js frontend
├── backend/         # Express.js backend
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd job_matrix
```

### 2. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create the required `.env` files and configure:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```

> Never commit actual API keys or secrets to GitHub.

### 4. Run the project

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

## 👨‍💻 Author

**Sampath Naik**

Full-Stack Developer

---

⭐ If you find this project useful, consider giving the repository a star.
