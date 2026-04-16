# 📅 Calendly Clone — Full-Stack Scheduling Application

A feature-rich, full-stack scheduling application inspired by [Calendly](https://calendly.com), built as a **Single Page Application (SPA)** with a modern React frontend and a robust Node.js/Express backend powered by a PostgreSQL database via Prisma ORM.

---

## 🖥️ Live Preview

Once set up, the application runs locally at:

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:3000      |
| API Base | http://localhost:3000/api  |

---

## 🚀 Tech Stack

### Frontend
| Technology        | Purpose                              |
|-------------------|--------------------------------------|
| React 19          | UI component library                 |
| Vite 8            | Build tool & dev server              |
| React Router v7   | Client-side SPA routing              |
| Axios             | HTTP client for API calls            |
| Tailwind CSS v4   | Utility-first CSS framework          |
| react-calendar    | Calendar date picker component       |

### Backend
| Technology        | Purpose                              |
|-------------------|--------------------------------------|
| Node.js           | JavaScript runtime                   |
| Express.js        | Web framework for REST API           |
| Prisma ORM        | Database ORM & query builder         |
| PostgreSQL (Neon) | Cloud-hosted relational database     |
| Nodemailer        | Email notifications (Ethereal/SMTP)  |
| express-validator | Request validation middleware        |
| Nodemon           | Auto-restart on file changes (dev)   |

---

## 📁 Project Structure

```
Scaler/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── BookingForm.jsx
│   │   │   ├── CalendarComponent.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ...
│   │   ├── pages/             # Route-level page components
│   │   │   ├── EventsPage.jsx
│   │   │   ├── AvailabilityPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── MeetingsPage.jsx
│   │   │   ├── ConfirmationPage.jsx
│   │   │   └── ContactsPage.jsx
│   │   ├── services/          # API client (Axios)
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx            # Root component with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles & design system
│   ├── .env                   # Frontend environment variables
│   └── package.json
│
├── controllers/               # Express route handlers
│   ├── eventController.js
│   ├── availabilityController.js
│   ├── bookingController.js
│   ├── dateOverrideController.js
│   └── scheduleController.js
│
├── routes/                    # Express route definitions
│   ├── eventRoutes.js
│   ├── availabilityRoutes.js
│   ├── bookingRoutes.js
│   ├── dateOverrideRoutes.js
│   └── scheduleRoutes.js
│
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.js                # Seed script for sample data
│
├── config/                    # Database connection config
├── middleware/                # Error handling middleware
├── utils/                     # Email service, response helpers
├── server.js                  # Express app entry point
├── .env                       # Backend environment variables
├── package.json               # Backend dependencies
└── README.md                  # This file
```

---

## ⚙️ Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- A **PostgreSQL** database (cloud-hosted on [Neon](https://neon.tech) or local)

### 1. Clone / Extract the Project

```bash
cd /path/to/Scaler/Scaler
```

### 2. Configure Environment Variables

**Backend** (`.env` in root):
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
```

**Frontend** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 4. Set Up the Database

```bash
# Generate Prisma client, run migrations, and seed sample data
npm run setup
```

Or run each step individually:
```bash
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Run database migrations
node prisma/seed.js           # Seed sample data
```

### 5. Start the Application

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
npm run dev
# Server starts at http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App opens at http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint                          | Description                       |
|--------|-----------------------------------|-----------------------------------|
| GET    | `/api/events`                     | List all event types              |
| POST   | `/api/events`                     | Create a new event type           |
| PUT    | `/api/events/:id`                 | Update an event type              |
| DELETE | `/api/events/:id`                 | Delete an event type              |
| GET    | `/api/availability`               | Get availability rules            |
| POST   | `/api/availability`               | Set availability for a day        |
| GET    | `/api/schedules`                  | List all schedules                |
| POST   | `/api/schedules`                  | Create a new schedule             |
| GET    | `/api/date-overrides`             | List date-specific overrides      |
| POST   | `/api/date-overrides`             | Create a date override            |
| DELETE | `/api/date-overrides/:id`         | Delete a date override            |
| GET    | `/api/bookings`                   | List all bookings                 |
| POST   | `/api/bookings`                   | Create a new booking              |
| DELETE | `/api/bookings/:id`               | Cancel a booking                  |
| PUT    | `/api/bookings/:id/reschedule`    | Reschedule an existing booking    |
| GET    | `/api/bookings/slots`             | Get available time slots          |

---

## ✨ Features

### Core Scheduling
- ✅ **Event Type Management** — Create, edit, delete event types with custom durations (15/30/45/60 min)
- ✅ **Calendar-Based Booking** — Invitees select a date, see available slots, and book
- ✅ **Booking Confirmation** — Confirmation page after successful booking

### Advanced Features
- ✅ **Multiple Availability Schedules** — Create separate schedules (e.g., "Working Hours", "Weekend Hours")
- ✅ **Date-Specific Overrides** — Override availability for specific dates (holidays, special hours)
- ✅ **Buffer Time** — Configurable buffer before/after meetings to prevent back-to-back scheduling
- ✅ **Custom Invitee Questions** — Add custom questions to the booking form per event type
- ✅ **Rescheduling Flow** — Reschedule existing meetings with a calendar + slot picker modal
- ✅ **Email Notifications** — Booking confirmation and cancellation emails via Nodemailer (Ethereal in dev)
- ✅ **Copy Booking Link** — One-click copy of public booking URLs

### UI / UX
- ✅ **Single Page Application (SPA)** — Smooth client-side navigation with React Router
- ✅ **Responsive Design** — Works on mobile, tablet, and desktop
- ✅ **Calendly-Inspired UI** — Sidebar navigation, card-based layouts, pill buttons
- ✅ **Micro-Animations** — Fade-in, scale-in, and slide transitions
- ✅ **Toast Notifications** — Success/error feedback for all user actions

---

## 🗄️ Database Schema

The application uses **5 models** with proper foreign key relationships:

```
Schedule (1) ──→ (N) EventType ──→ (N) Booking
    │
    ├──→ (N) Availability   (weekly recurring hours)
    └──→ (N) DateOverride   (date-specific overrides)
```

| Model        | Purpose                                      |
|-------------|----------------------------------------------|
| Schedule     | Named availability schedule (e.g., "Working Hours") |
| EventType    | Meeting type with duration, slug, buffer, questions |
| Availability | Weekly recurring time blocks (day + start/end)      |
| DateOverride | Date-specific availability overrides                |
| Booking      | Confirmed invitee booking with status tracking      |

**Key relationships:**
- `onDelete: Cascade` on Availability, DateOverride, and Booking ensures data cleanup
- `@@unique([scheduleId, date])` on DateOverride prevents duplicate overrides

---

## 📌 Assumptions Made

1. **Single-User Application** — This is designed as a personal scheduling tool (like one person's Calendly). There is no multi-user authentication or user accounts.
2. **Shared Time Slots** — All event types under the same schedule share the same weekly availability hours. Changing availability for a schedule affects all linked event types.
3. **Time Format** — All times are stored in 24-hour `"HH:mm"` format internally and displayed in 12-hour AM/PM format on the frontend.
4. **Email in Development** — In development mode (`NODE_ENV=development`), emails are sent via [Ethereal](https://ethereal.email) (a fake SMTP service). Preview URLs are logged to the terminal console. For production, configure real SMTP credentials.
5. **Cloud Database** — The project is pre-configured to use [Neon](https://neon.tech) serverless PostgreSQL. The database may take a few seconds to "wake up" on the first request if it has been idle (cold start).
6. **No Authentication** — All API endpoints are publicly accessible. In a production environment, authentication middleware (e.g., JWT) should be added.
7. **Timezone** — The default timezone is set to UTC. Users can select their preferred timezone on the Availability page, but timezone conversion for invitees is not yet implemented.

---

## 🛠️ Available Scripts

### Backend (root `package.json`)

| Script              | Command                        | Description                        |
|---------------------|--------------------------------|------------------------------------|
| `npm run dev`       | `nodemon server.js`            | Start backend with auto-reload     |
| `npm start`         | `node server.js`               | Start backend (production)         |
| `npm run setup`     | prisma generate + migrate + seed | Full database setup               |
| `npm run prisma:generate` | `npx prisma generate`    | Generate Prisma client             |
| `npm run prisma:migrate`  | `npx prisma migrate dev` | Run database migrations            |
| `npm run prisma:seed`     | `node prisma/seed.js`    | Seed sample data                   |

### Frontend (`client/package.json`)

| Script              | Command          | Description                    |
|---------------------|------------------|--------------------------------|
| `npm run dev`       | `vite`           | Start dev server (port 5173)   |
| `npm run build`     | `vite build`     | Production build               |
| `npm run preview`   | `vite preview`   | Preview production build       |

---


