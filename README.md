# Tempo Tarifs - EDF Tempo Price Tracker

An Android app that displays real-time EDF Tempo electricity pricing for France. Compare Tempo rates against the standard EDF Blue (Tarif Réglementé) subscription.

## Features

- **Live Day Colors**: See today's and tomorrow's Tempo color (Blue, White, Red) fetched from the official Tempo API
- **Remaining Days**: Track how many Blue, White, and Red days have been used vs remaining in the season (Sept → Aug)
- **Historical Calendar**: Browse month-by-month calendar showing past day colors
- **Price Comparison**: Compare Tempo rates against EDF Blue Base rate with visual bars and savings percentages
- **Subscription Toggle**: Switch between Tempo and Blue subscription views to understand the differences
- **Pull-to-Refresh**: Swipe down to reload live data

## Data Source

All live data comes from the free **[API Couleur Tempo](https://www.api-couleur-tempo.fr/)** — no authentication required. The API provides:
- Day colors (today, tomorrow, historical)
- Current tariffs
- Season statistics (days consumed/remaining)

## Prices (as of February 2026)

| | Heures Pleines | Heures Creuses |
|---|---|---|
| **Jour Bleu** | 0.1612 €/kWh | 0.1325 €/kWh |
| **Jour Blanc** | 0.1871 €/kWh | 0.1499 €/kWh |
| **Jour Rouge** | 0.7060 €/kWh | 0.1575 €/kWh |
| **EDF Bleu Base** | 0.1940 €/kWh | 0.1940 €/kWh |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on your Android device (or an Android emulator)

### Installation

```bash
# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```

### Running on Android

1. Install **Expo Go** from the Google Play Store
2. Run `npx expo start` in the project directory
3. Scan the QR code with the Expo Go app

Or with an emulator:
```bash
npx expo start --android
```

### Running on Web (for preview)

```bash
npx expo start --web
```

Then open http://localhost:8081 in your browser.

## Project Structure

```
App/
├── App.tsx                          # Main app component
├── src/
│   ├── types.ts                     # TypeScript type definitions
│   ├── constants.ts                 # Theme colors, prices, French locale
│   ├── api.ts                       # API service (api-couleur-tempo.fr)
│   └── components/
│       ├── Header.tsx               # App header + subscription selector
│       ├── CurrentDay.tsx           # Today/Tomorrow day color cards
│       ├── RemainingDays.tsx        # Season progress (days used/remaining)
│       ├── Calendar.tsx             # Historical monthly calendar
│       ├── PriceComparison.tsx      # Tempo vs EDF Blue price comparison
│       └── BlueSubscription.tsx     # EDF Blue subscription view
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

## Tech Stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript**
- **expo-linear-gradient** for gradient backgrounds
- Live data from [api-couleur-tempo.fr](https://www.api-couleur-tempo.fr/)

## License

MIT
