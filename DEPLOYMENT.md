# Deployment Guide

This project is split into two deployments:

- `backend` on Render
- `frontend` on Vercel

## 1) Deploy Backend to Render

1. Create a new **Web Service** on Render.
2. Connect this repository.
3. Set the **Root Directory** to `backend`.
4. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add these environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

Suggested `FRONTEND_URL` value:

- your Vercel production URL, for example `https://your-project.vercel.app`

The backend CORS setup also allows `https://*.vercel.app` for preview deployments.

## 2) Deploy Frontend to Vercel

1. Create a new project in Vercel.
2. Import this repository.
3. Set the **Root Directory** to `frontend`.
4. Vercel should detect Vite automatically.
5. Add these environment variables:
   - `VITE_API_URL` = your Render backend URL
   - `VITE_STRIPE_PUBLISHABLE_KEY`

Example:

- `VITE_API_URL=https://shopease-backend.onrender.com`

## 3) After Both Deployments

1. Update `FRONTEND_URL` in Render if your Vercel production domain changes.
2. Re-deploy the frontend if you change `VITE_API_URL`.
3. If login or checkout fails, check:
   - backend Render logs
   - frontend Vercel build logs
   - browser console for CORS or network errors

## Local Environment Files

Use the example files as a template:

- `backend/.env.example`
- `frontend/.env.example`

Never commit real secrets into `.env` files.
