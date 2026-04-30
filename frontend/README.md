# TaskFlow — Team Task Manager

A full-stack team task management application built with Node.js, Express, PostgreSQL, and React.

🌐 **Live Demo:** https://wholesome-exploration-production-5ad0.up.railway.app  
🔗 **API Base URL:** https://taskflow-team-manager-production.up.railway.app

---

## Features

- 🔐 JWT-based Authentication (Signup / Login)
- 👥 Team & Project Management
- ✅ Task Creation with Priority & Status
- 👤 Role-based Access (Admin / Member)
- 📅 Due Date Tracking
- 🔄 Real-time task assignment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Railway |

---

## Project Structure

```
taskflow-team-manager/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── db.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   └── ...
│   └── ...
└── README.md
```

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project Members
CREATE TABLE project_members (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  UNIQUE(project_id, user_id)
);

-- Tasks
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(30) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |

---

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/khushigaur01/taskflow-team-manager.git
cd taskflow-team-manager/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your values:
# DATABASE_URL=postgresql://localhost:5432/taskflow
# JWT_SECRET=your_secret_key
# PORT=5000

# Run server
npm run start
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Run dev server
npm run dev
```

---

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PORT` | Server port (default: 5000) |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Deployment

This project is deployed on **Railway**:

- Backend & Database → Railway
- Frontend → Railway

Auto-deploys on every push to `main` branch.

---

## Author

**Khushi Gaur**  
GitHub: [@khushigaur01](https://github.com/khushigaur01)
