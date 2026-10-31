# Grocify API

This is the production API for the Expo mobile app. It verifies Clerk session
tokens, scopes every grocery item query to the authenticated Clerk user, and
keeps `DATABASE_URL` on the server.

## Local setup

```powershell
cd api-server
copy .env.example .env.local
npm install
npm run db:push
npm run dev
```

Set `DATABASE_URL` and `CLERK_SECRET_KEY` in `api-server/.env.local`. The
database migration adds `user_id`; existing rows with no owner are intentionally
not returned to users and should be migrated or deleted before production.

For local mobile development, add the API URL to the Expo app's root `.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:3000
```

Do not use `localhost` from a physical Android device.

## Production deployment

Deploy this `api-server` directory to a Node-compatible host. Configure these
server environment variables there:

```env
DATABASE_URL=your-private-neon-connection-string
CLERK_SECRET_KEY=sk_live_...
ALLOWED_ORIGIN=*
```

Then configure the Expo app before building the release:

```env
EXPO_PUBLIC_API_URL=https://your-api-domain.example
```

`EXPO_PUBLIC_API_URL`, the Clerk publishable key, and the Sentry DSN are safe
to include in the mobile bundle. Never expose `DATABASE_URL` or
`CLERK_SECRET_KEY` with an `EXPO_PUBLIC_` prefix.

The API endpoints are:

- `GET /api/items`
- `POST /api/items`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- `POST /api/items/clear-purchased`
