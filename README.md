# 🎬 Movie Review Website

A full-stack web application that allows users to create post to write review movies, rate films and comment post.

## ✨ Features

- **User Authentication**: Secure signup and login.
- **Movie Reviews & Ratings**: Users can create posts to review and rate movies.
- **Community Interaction**: Users can like posts and leave comments.
- **Real-time Updates**: Live interactions using Socket.io.
- **Caching**: Improved performance and reduced database load using Redis.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Forms**: React Hook Form

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma ORM
- **Database**: MongoDB
- **Validation**: Zod
- **Caching**: Redis
- **Real-time**: Socket.io

## 🔐 Authentication & JWT Note

This project uses **JSON Web Tokens (JWT)** for user authentication.

**Why not cookies?**
Initially, the authentication flow was designed to use HTTP-only cookies, which is generally considered best practice for web applications to prevent XSS attacks. However, during the deployment phase, **Vercel** was used to host the frontend (Next.js) and **Render's free tier** was used for the backend (Node.js/Express). 

Because these two services provide different free default domains (e.g., `yourapp.vercel.app` and `yourapp.onrender.com`), the application was placed in a cross-site context. Browsers strictly block third-party cookies across completely different domains for security and privacy reasons (to prevent cross-site tracking). 

To overcome this cross-domain cookie limitation on free hosting tiers without setting up a custom domain for both, the authentication strategy was adapted to pass the JWT via the standard 

## ⚙️ Getting Started 

### 1. Clone the repository
```bash
git clone https://github.com/your-username/movie-review-system.git
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
*Note: Make sure to set up your `.env` file in the backend directory for MongoDB, Redis, and JWT secrets.*

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*Note: Set up your `.env.local` or `.env` in the frontend directory with your backend API URL.*

### 4. Running with Docker (Backend)
If you prefer running the backend using Docker:
```bash
cd backend
docker-compose up --build
```

---

