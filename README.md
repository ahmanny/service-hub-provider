# Proxxi Provider App

This is the provider-facing mobile app for Service Hub / Proxxi. It helps service professionals complete onboarding, receive booking requests, manage their schedule, update their service profile, track jobs, and view earnings.

## What It Does

- Phone OTP authentication for providers.
- Multi-step provider onboarding for basic info, service category, services/pricing, service mode, availability, service area, shop address, and verification.
- Provider profile management for personal info, bio, profile photo, delivery mode, service area, shop location, services/prices, availability, and payout details.
- Home dashboard with booking requests, provider stats, availability/online state, quick actions, and upcoming schedule.
- Booking tabs for pending, upcoming, and past jobs.
- Booking details with customer information, process tracking, status alerts, financial breakdowns, ratings, and contextual actions.
- Earnings dashboard with balances, charts, transactions, and withdrawal flow.
- Bank picker and payout account support.
- Location and map support through Expo Location and Mapbox.
- Push notification token registration.
- Offline/network state handling.

## Tech Stack

- Expo React Native
- Expo Router
- React 19
- React Native 0.81
- TypeScript
- Zustand
- TanStack Query
- React Hook Form and Zod
- Expo Secure Store
- Expo Notifications
- Expo Location
- Mapbox React Native
- React Native Paper

## Folder Structure

- `app`: Expo Router routes for auth, onboarding, tabs, profile editing, booking details, and modals.
- `components`: Reusable UI, dashboard, booking, earnings, onboarding, profile, map, skeleton, and screen components.
- `services`: API calls for auth, bookings, dashboard, and profile.
- `hooks`: Query hooks and app behavior hooks.
- `stores`: Zustand stores for auth, tokens, onboarding, network state, and map state.
- `constants`: Shared constants and theme values.
- `types`: Shared TypeScript types.
- `assets`: App icons, splash images, fonts, and static assets.

## Getting Started

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run web preview:

```bash
npm run web
```

Lint:

```bash
npm run lint
```

## Build Notes

The app is configured for EAS with Android and iOS targets. It uses the Expo project configured in `app.json`, including the app name `Proxxi Provider`, native identifiers, Mapbox, notifications, secure storage, and splash/icon assets.

## API Dependency

This app depends on the Service Hub backend for auth, onboarding, provider profile data, bookings, earnings, payout data, notifications, and booking lifecycle state.
