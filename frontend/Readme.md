client/
├── src/
│   ├── main.tsx
│   ├── App.tsx              ← router setup
│   ├── pages/
│   │   ├── Home.tsx         ← shorten URL
│   │   ├── Login.tsx        ← login form
│   │   ├── Register.tsx     ← signup form
│   │   └── Dashboard.tsx    ← user's links
│   ├── components/
│   │   ├── Navbar.tsx       ← nav with login/logout
│   │   ├── ShortenForm.tsx  ← URL input + submit
│   │   └── LinkCard.tsx     ← single link display
│   ├── api/
│   │   ├── auth.api.ts      ← register, login calls
│   │   └── url.api.ts       ← shorten, getLinks, delete calls
│   └── utils/
│       └── axios.ts         ← axios instance with base URL
├── .env
└── vite.config.ts



Pages — What Each Does:
Home.tsx
- ShortenForm component
- Anyone can use it — guest or logged in
- If logged in, send token in header
- If guest, send request without token
- Display the returned short URL
- Copy to clipboard button
Login.tsx
- Email + password form
- On submit → POST /api/auth/login
- On success → save token to localStorage
- Update AuthContext
- Redirect to Dashboard
Register.tsx
- Email + password form
- On submit → POST /api/auth/register
- On success → redirect to Login
Dashboard.tsx
- Protected page — redirect to login if no token
- Fetch GET /api/my/links on mount
- Display all user's links as LinkCards
- Each card has copy + delete button
- Delete → DELETE /api/my/links/:code → refresh list

Components — What Each Does:
Navbar.tsx
- Show logo
- If logged in → show Dashboard link + Logout button
- If guest → show Login + Register links
- Logout → clear token from localStorage + redirect home
ShortenForm.tsx
- Input field for long URL
- Shorten button
- Loading state while waiting for response
- Error state for invalid URL
- Success state — show short URL + copy button
LinkCard.tsx
- Display shortCode, originalUrl, createdAt
- Copy short URL button
- Delete button (only on Dashboard)

API Layer:
utils/axios.ts
typescript- Create axios instance with baseURL = http://localhost:3000
- Interceptor — automatically attach token from localStorage to every request header
api/auth.api.ts
- register(email, password) → POST /api/auth/register
- login(email, password)    → POST /api/auth/login → returns token
api/url.api.ts
- shortenUrl(url)    → POST /api/shorten
- getMyLinks()       → GET /api/my/links
- deleteLink(code)   → DELETE /api/my/links/:code

Auth Context:
Global state that tracks whether user is logged in:
AuthContext holds:
- token
- isLoggedIn boolean
- login(token) function  ← saves token, sets isLoggedIn true
- logout() function      ← clears token, sets isLoggedIn false
Every component that needs to know auth state reads from context instead of directly touching localStorage.

Token Flow:
Login → get token from backend
     ↓
save to localStorage
     ↓
axios interceptor reads it automatically
     ↓
attaches to every request as:
Authorization: Bearer <token>
     ↓
backend middleware verifies it

Protected Route:
Dashboard should not be accessible without a token:
typescript// If no token → redirect to /login
// If token exists → show Dashboard
A simple ProtectedRoute wrapper component handles this.

Routing Setup in App.tsx:
/           → Home       (public)
/login      → Login      (public, redirect to dashboard if already logged in)
/register   → Register   (public)
/dashboard  → Dashboard  (protected)

