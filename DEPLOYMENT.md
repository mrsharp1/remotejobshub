# Deployment Blueprint

Details on deploying Remote Jobs Hub to production environments.

## 1. Target Infrastructure
- **Frontend Hosting**: Vercel or Netlify.
- **Backend Database**: Supabase (PostgreSQL with RLS policy locks).

## 2. Environment Configurations
Verify the following variables are declared:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Build & Release Commands
```bash
# Clean install
npm ci

# Production build bundle
npm run build
```
