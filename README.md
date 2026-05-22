# 🛍️ ShopLux — Full-Stack MERN E-Commerce App

A production-ready, full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js), featuring a modern UI, JWT authentication, admin dashboard, shopping cart, order management, and more.

---

## 🚀 Features

### Customer Features
- 🔐 JWT Authentication (Register / Login / Logout)
- 🛒 Shopping Cart (Add, Update, Remove, Persist)
- 💳 Checkout with 3-step wizard (Address → Payment → Review)
- 📦 Order Management & Real-time Status Tracking
- ❤️ Wishlist (Add/Remove products)
- ⭐ Product Reviews & Ratings
- 🔍 Product Search, Filter (Category, Price), and Sort
- 🌙 Dark / Light Mode

### Admin Features
- 📊 Admin Dashboard with Revenue & Order Analytics
- 📦 Product CRUD (Add / Edit / Delete with Image Upload)
- 🗂️ Order Management (Update Status, View Details)
- 👥 User Management (Role Toggle, Deactivate, Delete)

### Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT + bcrypt
- **Upload:** Multer (local) / Cloudinary (optional)

---

## 📁 Project Structure

```
ecommerce-app/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth, Cart, Theme contexts
│   │   ├── layouts/          # MainLayout, AdminLayout
│   │   ├── pages/            # All page components
│   │   │   ├── admin/        # Admin pages
│   │   │   └── user/         # User pages
│   │   ├── services/         # Axios API service
│   │   └── styles/           # Global CSS
│   └── package.json
├── server/                   # Express backend
│   ├── config/               # DB config
│   ├── controllers/          # Route controllers
│   ├── middleware/            # Auth, error, upload middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Seeder
│   └── server.js
├── .env.example
└── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

---

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app

# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run install-all
```

---

### 2. Environment Setup

**Server `.env`** — create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

**Client `.env`** — create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> Copy from `.env.example` and fill in your values.

---

### 3. MongoDB Setup

**Option A: MongoDB Atlas (Recommended)**
1. Go to [mongodb.com](https://www.mongodb.com) → Create a free account
2. Create a new cluster → Click "Connect" → "Connect your application"
3. Copy the connection string and paste into `MONGO_URI`
4. Whitelist your IP: Network Access → Add IP → `0.0.0.0/0`

**Option B: Local MongoDB**
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
```

---

### 4. Seed the Database

```bash
cd server
node utils/seeder.js
```

This creates:
- **Admin:** `admin@store.com` / `admin123`
- **User:** `user@store.com` / `user123`
- 8 sample products

---

### 5. Run the App

```bash
# From root — runs both frontend & backend concurrently
npm run dev

# OR run separately:
npm run server   # http://localhost:5000
npm run client   # http://localhost:5173
```

Open: **http://localhost:5173**

---

## 🔑 Admin Access

1. Login at `/login` with `admin@store.com` / `admin123`
2. You'll be redirected to `/admin` dashboard
3. From the navbar dropdown → "Admin Dashboard"

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user (🔒) |
| PUT | `/api/auth/profile` | Update profile (🔒) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List (search/filter/sort) |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/top` | Top-rated products |
| POST | `/api/products` | Create (🔒 Admin) |
| PUT | `/api/products/:id` | Update (🔒 Admin) |
| DELETE | `/api/products/:id` | Delete (🔒 Admin) |
| POST | `/api/products/:id/reviews` | Add review (🔒) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart (🔒) |
| POST | `/api/cart` | Add item (🔒) |
| PUT | `/api/cart/:productId` | Update quantity (🔒) |
| DELETE | `/api/cart/:productId` | Remove item (🔒) |
| DELETE | `/api/cart/clear` | Clear cart (🔒) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order (🔒) |
| GET | `/api/orders/my` | My orders (🔒) |
| GET | `/api/orders/:id` | Order detail (🔒) |
| GET | `/api/orders` | All orders (🔒 Admin) |
| PUT | `/api/orders/:id` | Update status (🔒 Admin) |
| GET | `/api/orders/stats` | Dashboard stats (🔒 Admin) |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# Push to GitHub first, then:
# 1. Go to vercel.com → Import your repo
# 2. Set Root Directory: client
# 3. Add environment variable:
#    VITE_API_URL = https://your-backend.onrender.com/api
# 4. Deploy!
```

### Backend → Render

```bash
# 1. Go to render.com → New Web Service → Connect repo
# 2. Root Directory: server
# 3. Build Command: npm install
# 4. Start Command: node server.js
# 5. Add environment variables from server/.env
# 6. Deploy!
```

### Backend → Railway

```bash
# 1. Go to railway.app → New Project → Deploy from GitHub
# 2. Set Root Directory: server
# 3. Add environment variables
# 4. Deploy!
```

---

## 🐙 Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit - full stack ecommerce app"
git branch -M main
git remote add origin https://github.com/yourusername/ecommerce-app.git
git push -u origin main
```

---

## 🧪 Testing the App

1. **Register** a new account at `/register`
2. **Browse** products at `/products`
3. **Add to cart**, then checkout
4. **Login as admin** to manage products/orders
5. **Place an order** and track its status from `/orders`
6. **Leave a review** on any product page

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT License — free to use and modify.
