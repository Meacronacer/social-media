# NextConnect — Social Media App

A full-stack responsive social network built with Next.js and Express.js. Features include JWT & OAuth2 (Google) authentication, email confirmation, password reset, user profiles, posts, comments, likes, real-time one-to-one chat, infinite scrolling, search, and customizable settings.

[![Demo](https://img.shields.io/badge/Live-Demo-green)](https://tik-talk-nine.vercel.app)

---

## 🎯 Features

- **Authentication & Authorization**  
  - JWT-based authentication (access & refresh tokens in `HttpOnly`, `Secure` cookies)  
  - OAuth2 login with Google  
  - Email verification on registration  
  - Password reset via email  

- **User Profiles**  
  - Profile page showing followers & following counts  
  - Display user information: name, surname, bio, skills  
  - Profile picture upload  

- **Posts & Interactions**  
  - Create, edit, and delete posts  
  - Like and comment on any post  
  - Edit your own posts and comments  
  - Emoji support in posts via `emoji-mart/react`  

- **Search & Discovery**  
  - Infinite scrolling through all registered users  
  - Live search by username or name  
  - Navigate to user profiles or initiate chat directly  

- **Real-time Chat**  
  - One-to-one chat interface only (no group chats)  
  - Infinite scroll in chat history for performance  
  - Emoji picker in messages  
  - Search across your chats  

- **Settings**  
  - Update profile details: name, surname, bio, skills  
  - Change profile picture  

---

## 🚀 Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| **Frontend**     | Next.js, React                      |
| **Backend**      | Express.js, Node.js                 |
| **Auth**         | JSON Web Tokens, OAuth2 Google      |
| **Email**        | Nodemailer                          |
| **Real-time**    | Socket.io                           |
| **Database**     | MongoDB                             |
| **Emoji Picker** | emoji-mart/react                    |

---

## 📦 Installation & Environment

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Meacronacer/social-media.git
   cd social-media
   ```

2. **Install dependencies**  
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

3. **Environment variables**  
   Create a `.env` file in the `backend` directory with:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

---

## ⚙️ Backend Setup

1. **Start server**  
   ```bash
   cd server
   npm run dev
   ```
2. **Runs on:** `http://localhost:8000`

---

## 🌐 Frontend Setup

1. **Start client**  
   ```bash
   cd client
   npm run dev
   ```
2. **Runs on:** `http://localhost:3000`

---

## 🔒 Authentication Flow

- **JWT** stored securely in cookies (access + refresh tokens)  
- **Refresh token rotation** on use and blacklist on logout  
- **Google OAuth2** handled via custom backend endpoints  
- **Email confirmation** uses time-limited signed tokens  

---

## 📁 API Documentation

> Documentation is auto-generated via OpenAPI/Swagger  
- Access via `/api/docs` on the backend server  

---

## ☁️ Deployment

### Backend
- Provide a `Procfile`:
  ```
  web: npm run migrate && npm start
  ```
- Set environment variables in your host (e.g., Heroku, Railway)

### Frontend
- Deploy via Vercel or Netlify  
- Set `NEXT_PUBLIC_API_URL` to your backend URL  

---

## 🤝 Contributing

1. Fork this repository  
2. Create your feature branch:  
   ```bash
   git checkout -b feat/awesome-feature
   ```
3. Commit your changes  
4. Push to the branch  
5. Open a Pull Request  

---

## 📜 License

MIT © Your Name
