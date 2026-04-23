# shrt.ly — URL Shortener

A full-stack URL shortener built with React, Node.js, TypeScript, and PostgreSQL. Supports guest shortening, user accounts, link management dashboard, and a Chrome extension for quick shortening from any webpage.

---

## Features

- Shorten any URL instantly — no account required
- User registration and login with JWT authentication
- Personal dashboard to view, copy, and delete your links
- Chrome extension — shorten URLs via popup or right-click context menu
- Links owned by users persist across sessions
- Guest links work without an account

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + bcrypt |
| Extension | Chrome Manifest V3 |

---

## Project Structure

```
url-shortener/
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/         # Home, Login, Register, Dashboard
│   │   ├── components/    # Reusable UI components
│   │   ├── api/           # Axios API calls
│   │   └── utils/         # Axios instance
│   └── public/
│       └── extension.zip  # Chrome extension download
│
├── backend/               # Node + Express + TypeScript
│   ├── src/
│   │   ├── routes/        # Auth and URL routes
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Auth middleware
│   │   └── utils/         # Token generation
│   └── prisma/
│       └── schema.prisma  # Database schema
│
└── chrome-extension/      # Chrome Extension
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    └── background.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (local or cloud via [Neon](https://neon.tech) or [Railway](https://railway.app))

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=3000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/urlshortener
JWT_SECRET=your_long_random_secret_key
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Start the development server:

```bash
npm run dev
```

Backend runs on `http://localhost:3000`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

### Chrome Extension Setup

**Option 1 — Download from website:**
1. Visit the app and click **Download Chrome Extension**
2. Unzip the downloaded file
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer Mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the unzipped folder
7. Extension is installed

**Option 2 — Manual from source:**
1. Clone the repository
2. Follow steps 3–7 above using the `chrome-extension/` folder

---

## API Endpoints

### Auth
```
POST /api/auth/register    Create a new account
POST /api/auth/login       Login and receive JWT token
```

### URLs
```
POST /api/shorten          Shorten a URL (guest or authenticated)
GET  /:code                Redirect to original URL
GET  /api/my/links         Get all links for logged in user
DELETE /api/my/links/:code Delete a link (owner only)
```

---

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default: 3000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  urls      Url[]
}

model Url {
  id          Int      @id @default(autoincrement())
  originalUrl String
  shortCode   String   @unique
  createdAt   DateTime @default(now())
  userId      Int?
  user        User?    @relation(fields: [userId], references: [id])
}
```

---

## Screenshots
![Alt Text](website.png)
![Alt Text](extension.png)!
---


## License

MITESH_PATIL