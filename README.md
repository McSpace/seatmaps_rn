# SeatMap — Demo App

A React Native demo application built with Expo that showcases the
`@seatmaps.com/react-native-seatmap` library — a fully native seat-map
component for airline booking flows.

This app is purely a **demonstration**: it exercises every public API of the
library (availability, passengers, multi-deck, jump-to-seat, event callbacks)
so you can see the component in action before integrating it into your own
project.

---

## Monorepo structure

```
ReactNative/
├── apps/
│   └── demo/                      ← this app
└── packages/
    └── react-native-seatmap/      ← the library source
        └── README.md              ← full library API reference
```

---

## Running the demo

The best way to experience the app is on a real device using **Expo Go**:

1. Install the [Expo CLI](https://docs.expo.dev/get-started/installation/) on your computer:
   ```sh
   npm install -g expo-cli
   ```
2. Install **Expo Go** on your iPhone or Android phone from the App Store / Google Play.
3. From the monorepo root, start the dev server:
   ```sh
   npm install        # install all workspace dependencies
   cd apps/demo
   npx expo start
   ```
4. Scan the QR code shown in the terminal with your phone — the app opens in Expo Go instantly.

You can also run it in the iOS Simulator or Android Emulator if you have them set up.

---

## What the demo shows

| Feature | How to see it |
|---------|---------------|
| Seat map render | Launch the app |
| Availability (unavailable seats) | First 3 seats of each deck are grey — `unavailable` |
| Passenger with a pre-assigned seat | Seat **14A** is pre-selected (demo passenger) |
| Jump to seat | Type a seat label (e.g. `22C`) and tap **Jump** |
| Callback log | Bottom of the screen — all events in real time |
| Multi-deck | DeckSelector appears automatically for aircraft with two decks |
| Tooltip with details | Tap any seat |
| Fuselage (nose + tail) | Rounded SVG cap at top and bottom of the cabin |
| Cabin class titles | Colored strips on the sides labelled "Economy", "Business", etc. |
| Emergency exits | Red arrow markers in the lateral margin at each exit row |
| Galley / lavatory icons | Overhead-view shapes with amenity sticker icons (coffee, fish, restroom) |

---

## Using `<SeatMap>` in your app

### Installation

```sh
npm install @seatmaps.com/react-native-seatmap react-native-svg @react-native-async-storage/async-storage
```

### Minimal example

```tsx
import { SeatMap } from '@seatmaps.com/react-native-seatmap';

export default function BookingScreen() {
  return (
    <SeatMap
      flight={{ id: 'UA123' }}
      apiUrl="https://api.example.com"
      appId="your-app-id"
      apiKey="your-api-key"
      width={350}
      lang="EN"
      onSeatMapInited={() => console.log('Map ready')}
      onSeatSelected={(seat) => console.log('Selected:', seat.number)}
    />
  );
}
```

---

## `<SeatMap>` props

### Required

| Prop | Type | Description |
|------|------|-------------|
| `flight` | `IFlight` | Flight object. `flight.id` is used to build the API request URL |
| `apiUrl` | `string` | Base API URL |
| `appId` | `string` | Application ID for authentication |
| `apiKey` | `string` | API key |

### Data

| Prop | Type | Description |
|------|------|-------------|
| `passengers` | `Passenger[]` | Passenger list. If a passenger has `seat.seatLabel` set, that seat is pre-selected. `readOnly: true` prevents deselecting it |
| `availability` | `SeatAvailability[]` | Array of `{ seatLabel, available }`. Overrides seat statuses from the API |
| `currentDeckIndex` | `number` | Controlled active deck index (for external deck management) |
| `openedTooltipSeatLabel` | `string` | When changed, scrolls to the seat and opens its tooltip |

### Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `400` | Component width in pixels |
| `lang` | `string` | `'EN'` | Language (`'EN'`, `'RU'`, `'DE'`, `'FR'`, etc.) |
| `units` | `'metric' \| 'imperials'` | — | Unit system |
| `horizontal` | `boolean` | `false` | Horizontal layout mode |
| `rightToLeft` | `boolean` | `false` | Right-to-left direction |
| `visibleFuselage` | `boolean` | `false` | Show fuselage outline |
| `visibleWings` | `boolean` | `false` | Show wings |
| `visibleCabinTitles` | `boolean` | `false` | Show cabin class titles |
| `customCabinTitles` | `Record<string, string>` | — | Override class names: `{ F: 'First', B: 'Business' }` |
| `builtInTooltip` | `boolean` | `true` | Show built-in tooltip on seat tap |
| `builtInDeckSelector` | `boolean` | `true` | Show built-in deck selector |
| `singleDeckMode` | `boolean` | `false` | Render only one deck at a time |
| `colorTheme` | `ColorTheme` | — | Color overrides |

### Callbacks

| Callback | Signature | When fired |
|----------|-----------|------------|
| `onSeatMapInited` | `() => void` | After data loads — map is ready |
| `onSeatSelected` | `(seat, passenger?) => void` | A seat was selected |
| `onSeatUnselected` | `(seat) => void` | A seat was deselected |
| `onLayoutUpdated` | `({ width, height }) => void` | Component dimensions changed |
| `onTooltipRequested` | `(seat) => void` | Tooltip is about to open |
| `onAvailabilityApplied` | `(count) => void` | Availability applied; `count` = number of available seats |
| `onDeckChange` | `(deckIndex) => void` | Active deck changed |

> **Deprecated names** (still work, but not recommended):
> `onSeatPress` → use `onSeatSelected`,
> `onSeatDeselect` → use `onSeatUnselected`

---

## Imperative API — `SeatMapRef`

```tsx
import { useRef } from 'react';
import { SeatMap } from '@seatmaps.com/react-native-seatmap';
import type { SeatMapRef } from '@seatmaps.com/react-native-seatmap';

function BookingScreen() {
  const mapRef = useRef<SeatMapRef>(null);

  return (
    <>
      <SeatMap
        ref={mapRef}
        flight={{ id: 'UA123' }}
        apiUrl="..."
        appId="..."
        apiKey="..."
      />
      <Button
        title="Jump to seat 22C"
        onPress={() => mapRef.current?.seatJumpTo('22C')}
      />
    </>
  );
}
```

| Method | Description |
|--------|-------------|
| `seatJumpTo(seatLabel)` | Scrolls to the seat with the given label and opens its tooltip |

---

## Types

### `IFlight`

```ts
interface IFlight {
  id: string;             // required — used in the API request URL
  airlineIata?: string;   // airline IATA code, e.g. "UA"
  flightNumber?: string;  // flight number, e.g. "123"
  cabinCode?: string;     // cabin class, e.g. "E", "B", "F"
  origin?: string;        // departure airport
  destination?: string;   // arrival airport
  departureDate?: string; // departure date (ISO string)
}
```

### `Passenger`

```ts
interface Passenger {
  readonly id: string;
  seat?: {
    seatLabel: string; // pre-assigned seat label, e.g. "14A"
    price: number;
  };
  passengerType?: string;   // 'ADT' | 'CHD' | 'INF'
  passengerLabel?: string;  // display label (initial, name, etc.)
  passengerColor?: string;  // seat highlight color
  readOnly?: boolean;       // true — prevent deselecting this seat
}
```

### `SeatAvailability`

```ts
interface SeatAvailability {
  seatLabel: string;  // seat label, e.g. "14A"
  available: boolean; // true = available, false = unavailable
}
```

---

## Full example with passengers and availability

```tsx
import { SeatMap } from '@seatmaps.com/react-native-seatmap';
import type { SeatMapRef, Passenger, SeatAvailability } from '@seatmaps.com/react-native-seatmap';
import { useRef } from 'react';

const passengers: Passenger[] = [
  {
    id: 'p1',
    passengerType: 'ADT',
    passengerLabel: 'Alice',
    seat: { seatLabel: '14A', price: 0 },
    readOnly: true,  // cannot be deselected
  },
  {
    id: 'p2',
    passengerType: 'CHD',
    passengerLabel: 'Bob',
  },
];

// Received from your booking backend
const availability: SeatAvailability[] = [
  { seatLabel: '1A', available: false },
  { seatLabel: '1B', available: false },
  { seatLabel: '14A', available: true },
  // ...
];

export default function BookingScreen() {
  const mapRef = useRef<SeatMapRef>(null);

  return (
    <SeatMap
      ref={mapRef}
      flight={{ id: 'UA123', airlineIata: 'UA', origin: 'JFK', destination: 'LAX' }}
      apiUrl="https://api.example.com"
      appId="my-app"
      apiKey="my-key"
      width={360}
      lang="EN"
      passengers={passengers}
      availability={availability}
      builtInDeckSelector
      builtInTooltip
      onSeatMapInited={() => console.log('Map loaded')}
      onSeatSelected={(seat, passenger) =>
        console.log(`Passenger ${passenger?.id ?? '?'} selected ${seat.number}`)
      }
      onSeatUnselected={(seat) => console.log(`Seat ${seat.number} deselected`)}
      onAvailabilityApplied={(count) => console.log(`Available seats: ${count}`)}
      onDeckChange={(index) => console.log(`Active deck: ${index + 1}`)}
    />
  );
}
```

---

## Why does the demo use `Deck`/`Tooltip` directly?

The `<SeatMap>` component expects a `GET ${apiUrl}/flight/${flight.id}` endpoint.
The sandbox API (quicket.io) uses a `POST` request with a body — an incompatible format.

For that reason the demo performs its own `fetch()` and passes the prepared data
directly into the lower-level `<Deck>` and `<Tooltip>` components.

When using `<Deck>` directly, `exits` and `bulks` must be passed per-deck from
`PreparedData.exits[i]` and `PreparedData.bulks[i]` — they are separate from the
deck object itself.

If your backend follows the standard GET scheme, use `<SeatMap>` directly.
