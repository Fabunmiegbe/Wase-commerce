# Deploying the WASÉ backend

This is a Medusa v2 commerce backend, scaffolded from the official
starter and customised with WASÉ's categories, two warehouses (UK and
Nigeria), and GBP/USD/NGN regions in src/scripts/seed.ts.

Medusa needs a real Postgres database and Redis instance running
somewhere, so this is not something to run directly on a phone. The
workflow below fits how you already work from Termux: edit and push
from your device, let a host build and run it.

## 1. Push this project to GitHub

From Termux:

    cd wase-backend
    git init
    git add .
    git commit -m "Initial WASE Medusa backend"
    git remote add origin https://github.com/<you>/wase-backend.git
    git push -u origin main

## 2. Deploy on Railway (recommended starting point)

Railway gives you a managed Postgres and Redis instance plus
git-connected deploys, so this stays close to your existing workflow.

1. Create a project at railway.app, connect it to the wase-backend
   GitHub repo.
2. Add a Postgres plugin and a Redis plugin to the project.
3. Copy the values from .env.template into Railway's environment
   variables panel. Railway auto-fills DATABASE_URL and REDIS_URL
   once you add those plugins, you mainly need to fill in JWT_SECRET,
   COOKIE_SECRET, and (later) the Stripe/PayPal keys.
4. Set the start command to: yarn build && yarn start
5. Once the first deploy is live, run the seed script once, either
   through Railway's one-off command runner or by adding a temporary
   release command: yarn seed

From then on, every git push to main triggers a new deploy. That
means your existing Termux workflow (edit, commit, push) is the whole
deployment process going forward.

## 3. Alternative: Render or a small VPS (DigitalOcean, Hetzner)

Same idea: managed Postgres, managed Redis, git-connected deploys.
Railway is the fastest to set up first; the others are worth
comparing on price once you have real traffic.

## 4. After the backend is live

- The Medusa Admin dashboard is served automatically, log in there to
  manage products, orders, and inventory day to day.
- Connect the WASÉ storefront prototype to this backend's API and
  publishable key instead of its mock data.
- Add Stripe and PayPal once you have real merchant accounts, the
  keys go in the same environment variables panel.
