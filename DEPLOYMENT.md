# Ecommerce App - Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables Setup

**Create `.env` in the `server/` directory with:**
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=https://yourdomain.com
MAX_FILE_SIZE=5242880
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

**Create `.env.production` in the `client/` directory with:**
```env
VITE_API_URL=https://yourdomain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database cluster
3. **Whitelist your IP address** (or allow access from anywhere for development)
4. Create a database user with credentials
5. Copy the connection string and add to `.env`

### 3. Render.com Deployment

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Set the following:**
   - Name: `ecommerce-app`
   - Root Directory: (leave blank, auto-detected)
   - Runtime: `Node`
   - Build Command: `cd client && npm install && npm run build && cd ../server && npm install`
   - Start Command: `node server/server.js`
   - Plan: Free or Paid (as per needs)

4. **Add Environment Variables in Render Dashboard:**
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a strong secret
   - `CLIENT_URL`: Your Render deployment URL

5. **Deploy:** Push to GitHub, Render will auto-deploy

### 4. Alternative: Vercel for Frontend + Render for Backend

**If deploying frontend and backend separately:**

**Frontend (Vercel):**
- Deploy `client/` folder
- Set env var: `VITE_API_URL=https://your-backend.onrender.com/api`

**Backend (Render):**
- Deploy entire repo with root dir as `server/`
- Build: `npm install`
- Start: `npm start`

## Common Deployment Issues & Fixes

### Issue: MongoDB Connection Failed
**Solution:** Whitelist your IP on MongoDB Atlas → Network Access

### Issue: 404 on Frontend Routes
**Solution:** Already fixed! The server now serves React's index.html for all non-API routes

### Issue: CORS Errors
**Solution:** Update `CLIENT_URL` in server `.env` to match your frontend domain

### Issue: Static Files Not Loading
**Solution:** Check that `client/dist` exists. Run `npm run build` in client folder

## Verification Steps

1. **Test API endpoints:**
   ```bash
   curl https://yourdomain.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running",...}`

2. **Check frontend loads:**
   Visit `https://yourdomain.com` in browser

3. **Test authentication:**
   Try login/register functionality

## Database Seeding (Optional)

For initial data, run locally before deployment:
```bash
cd server
node utils/seeder.js
```

Or modify seeder.js to run on first server startup.

---

**Need help?** Check Render logs in the dashboard for detailed error messages.
