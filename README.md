# Grocify

Grocify is a grocery planning android mobile app built with Expo and React Native. Users can create and organize grocery items, mark items as purchased, review shopping insights, and securely access their own data from a mobile device.

The repository contains the Expo mobile application, a standalone Next.js API service, and Drizzle database definitions for Neon PostgreSQL.

## Main features

- Create, edit, delete, and purchase grocery items.
- Organize items by category, quantity, and priority.
- Review completion, category, and priority insights.
- Clerk authentication with email/password, email verification, Google OAuth, and new-device trust verification.
- Per-user data isolation through Clerk bearer-token authentication.
- Sentry error reporting for the mobile application.
- EAS development, preview, production, and OTA update profiles.
- Android keyboard handling for the planner form.

## Demonstration

1. Launch the app and create an account with email verification, or continue with Google.
2. Add grocery items from the planner.
3. Edit quantities, categories, priorities, or purchased status.
4. Open Insights to review list statistics and categories.
5. Sign in on another device to confirm that only that user's grocery items are returned.

## Technologies

### Mobile application

- Expo SDK 57 and React Native 0.86
- Expo Router and TypeScript
- NativeWind
- Zustand
- Clerk Expo SDK
- Sentry React Native
- React Native Keyboard Controller

### API and data

- Next.js 16 and TypeScript
- Neon PostgreSQL
- Drizzle ORM
- Clerk backend token verification
- Vercel-compatible deployment

### Build and delivery

- EAS Build for Android development, preview, and production builds
- EAS Update for JavaScript-only OTA updates
- Google OAuth for native authentication

## Project structure

```text
1-grocify/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Sign-in and sign-up routes
│   │   ├── (tabs)/          # Planner, grocery list, and insights routes
│   │   └── sso-callback.tsx # Native OAuth callback
│   ├── components/          # Reusable UI and insights components
│   ├── hooks/               # Authentication and application hooks
│   ├── lib/                 # API client and shared utilities
│   └── store/               # Zustand grocery state
├── api-server/
│   ├── src/app/api/items/   # Grocery CRUD API routes
│   ├── src/lib/             # Auth, database, and response helpers
│   └── drizzle/             # SQL migrations
├── assets/                  # App icons, splash screen, and images
├── app.json                 # Expo and native configuration
└── eas.json                 # EAS build and update profiles
```

## Prerequisites

- Node.js 20 or newer
- npm
- An Expo/EAS account for cloud builds
- A Clerk application
- A Neon PostgreSQL database
- Android Studio and an Android SDK for local Android builds

## Installation

### Mobile application

```powershell
git clone <repository-url>
cd 1-grocify
npm install
```

Create the root `.env` file with public client configuration:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_or_pk_live_...
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:3000
EXPO_PUBLIC_SENTRY_DSN=https://...
```

For a physical Android device, use the computer's LAN IP instead of `localhost`. Android emulators commonly use `http://10.0.2.2:3000`.

Start the Expo development server:

```powershell
npm run start
```

Run the local Android application:

```powershell
npm run android
```

### API server

```powershell
cd api-server
npm install
```

Set the private server variables in `api-server/.env`:

```env
DATABASE_URL=your-private-neon-connection-string
CLERK_SECRET_KEY=sk_test_or_sk_live_...
ALLOWED_ORIGIN=*
```

Apply the database migration and start the API:

```powershell
npm run db:push
npm run dev
```

The mobile app should use the API server's reachable URL through `EXPO_PUBLIC_API_URL`.

## API and database

The API server verifies the Clerk bearer token before handling requests. Every grocery query is scoped by the authenticated Clerk user ID, preventing users from reading or modifying another user's items.

Available endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/items` | List the signed-in user's items |
| `POST` | `/api/items` | Create an item |
| `PATCH` | `/api/items/:id` | Update an item |
| `DELETE` | `/api/items/:id` | Delete an item |
| `POST` | `/api/items/clear-purchased` | Remove purchased items |

The main `grocery_items` table stores:

- `id`
- `user_id`
- `name`
- `category`
- `quantity`
- `purchased`
- `priority`
- `updated_at`

Keep `DATABASE_URL`, `CLERK_SECRET_KEY`, OAuth client secrets, and Sentry authentication tokens on the server or in the relevant deployment secret manager. Do not prefix private values with `EXPO_PUBLIC_`.

## EAS builds and updates

```powershell
# Internal development build
npx eas-cli@latest build --platform android --profile development

# Installable preview APK
npx eas-cli@latest build --platform android --profile preview

# Production store build, an Android App Bundle
npx eas-cli@latest build --platform android --profile production

# Production-configured APK for direct installation
npx eas-cli@latest build --platform android --profile production-apk
```

Use EAS Update only for JavaScript and asset changes:

```powershell
npx eas-cli@latest update --channel preview --message "Describe the update"
```

Changes to `app.json`, the URL scheme, native dependencies, Android settings, or native authentication configuration require a new build.

## Challenges and solutions

### Separate mobile and production server environments

Mobile bundles cannot host Next.js API routes, and a physical Android device cannot reach the developer machine through `localhost`. The app uses a centralized API client with `EXPO_PUBLIC_API_URL`, while the API runs as its own Next.js service and can be deployed to Vercel.

### Protecting user data

Client-side database access would expose credentials and would not reliably enforce ownership. The API verifies Clerk tokens server-side and adds the authenticated `user_id` to every query.

### Preview and production OAuth differences

Development, preview, and production builds can use different Clerk instances, redirect configuration, and Android signing certificates. The OAuth setup keeps the Clerk Web client credentials and native Android application configuration separate, with each build's package name and signing fingerprint registered where required.

### New-device email verification

Clerk can return `needs_client_trust` even when the password is correct. The sign-in flow detects that status, sends an email verification code, verifies the code, and then finalizes the session.

### Keyboard behavior on Android

The planner form uses keyboard-aware scrolling and the Android `softwareKeyboardLayoutMode` is configured as `pan` to keep fields visible while typing.

## Validation

Run the TypeScript check before building:

```powershell
npx tsc --noEmit
```

Run the mobile lint command:

```powershell
npm run lint
```
