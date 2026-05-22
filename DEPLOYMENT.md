# Ecommerce App - Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables Setup

Create `.env` in the `server/` directory with:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=https://yourdomain.com
MAX_FILE_SIZE=5242880
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

Create `.env.production` in the `client/` directory with:

```env
VITE_API_URL=https://yourdomain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 2. MongoDB Atlas Setup

1. Go to MongoDB Atlas and create a cluster.
2. Add your current IP to **Network Access** (or `0.0.0.0/0` for wide access during development).
3. Create a database user and copy the connection string into `server/.env`.

### 3. Deployment Options

Option A — Single service (Render):
- Build both client and server in one service, serve static files from `client/dist` via Express in production.
- Example `render.yaml` can run `cd client && npm install && npm run build && cd ../server && npm install` and start `node server/server.js`.

Option B — Frontend on Vercel / Backend on Render:
- Frontend: Deploy `client/` to Vercel. Set `VITE_API_URL` to your backend URL (e.g., `https://api.yourdomain.com/api`).
- Backend: Deploy `server/` to Render (or another Node host). Add `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` as env vars in the service settings.

### 4. Server Configuration Notes

- `server/server.js` should serve built frontend files when `NODE_ENV === 'production'`:

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/dist', 'index.html')));
}
```

- Ensure `CLIENT_URL` matches your deployed frontend domain to avoid CORS issues.

### 5. Build & Deploy Steps (one-service approach)

1. Push changes to GitHub.
2. On Render, create a Web Service pointing to your repository.
3. Build command:

```bash
cd client && npm install && npm run build && cd ../server && npm install
```

4. Start command:

```bash
node server/server.js
```

5. Add environment variables in the Render dashboard (including `MONGO_URI` and `JWT_SECRET`).

### 6. Troubleshooting

- `Cannot find module @rollup/rollup-linux-x64-gnu`: Remove committed `package-lock.json` and `node_modules`, then reinstall so CI can resolve platform-specific optional deps.
- MongoDB connection errors: verify `MONGO_URI` and whitelist IP on Atlas.
- Static files 404 or React Router 404s: ensure Express serves `client/dist/index.html` for unknown routes in production.

### 7. Seeding the Database (local)

Run locally after configuring `server/.env`:

```bash
cd server
node utils/seeder.js
```

### 8. Verify Deployment

- Health check:

```bash
curl https://yourdomain.com/api/health
```

- Frontend: Visit `https://yourdomain.com` in browser.

---

If you want, I can also:
- Add a `render.yaml` template to this repo.
- Re-run the seeder once your Atlas IP is whitelisted.
- Watch the next Vercel/Render build logs and debug any remaining errors.
