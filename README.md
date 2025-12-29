# Medusa v2.12.3 - Vercel + Railway Template

A production-ready monorepo template for Medusa v2.12.3 with:
- **Backend**: Medusa v2.12.3 (Railway deployment)
- **Storefront**: Next.js storefront (Vercel deployment)
- **Database**: PostgreSQL (Railway)
- **Cache**: Redis (Railway)

## Structure

```
.
├── backend/          # Medusa backend
└── storefront/       # Next.js storefront
```

## Backend Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens (generate random)
- `COOKIE_SECRET` - Secret for cookies (generate random)
- `PORT` - Server port (default: 9000)

### CORS Configuration
- `STORE_CORS` - Comma-separated list of storefront origins (e.g., `https://store.example.com`)
- `ADMIN_CORS` - Comma-separated list of admin origins (e.g., `https://admin.example.com`)
- `AUTH_CORS` - Comma-separated list of auth origins (e.g., `https://store.example.com`)

### Bootstrap (One-time)
- `BOOTSTRAP_TOKEN` - Token for one-time bootstrap endpoint (must be set before first use)

### Optional
- `MEDUSA_ADMIN_ONBOARDING_TYPE` - Onboarding type (default: `default`)
- `MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY` - Next.js directory for admin

## Storefront Environment Variables

### Required
- `MEDUSA_BACKEND_URL` - Backend API URL (e.g., `https://backend.railway.app`)
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Public backend URL (same as above)
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - Publishable API key from Medusa

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Storefront
```bash
cd storefront
npm install
npm run dev
```

## Deployment

### Railway (Backend)
1. Connect GitHub repo
2. Set root directory to `/backend`
3. Configure environment variables
4. Deploy

### Vercel (Storefront)
1. Connect GitHub repo
2. Set root directory to `/storefront`
3. Configure environment variables
4. Deploy

## Bootstrap Endpoint

The backend includes a one-time bootstrap endpoint at `/bootstrap` that:
1. Creates an admin user (if not exists)
2. Creates a publishable API key (if not exists)
3. Returns the publishable key

**Security**: This endpoint requires `BOOTSTRAP_TOKEN` in the Authorization header and is disabled after first successful use.

## License

MIT

