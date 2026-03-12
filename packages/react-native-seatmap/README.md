# @seatmaps.com/react-native-seatmap

React Native port of the Jets SeatMap library. Renders an interactive aircraft seat map with availability, passenger assignment, tooltips, and multi-deck support.

## Installation

```sh
npm install @seatmaps.com/react-native-seatmap react-native-svg @react-native-async-storage/async-storage
```

## Quick Start

```tsx
import React, { useRef } from 'react';
import { SeatMap } from '@seatmaps.com/react-native-seatmap';
import type { SeatMapRef } from '@seatmaps.com/react-native-seatmap';

export default function App() {
  const seatMapRef = useRef<SeatMapRef>(null);

  return (
    <SeatMap
      ref={seatMapRef}
      flight={{ id: 'flight-abc123' }}
      apiUrl="https://api.seatmaps.com"
      appId="your-app-id"
      apiKey="your-api-key"
      width={350}
      lang="EN"
      passengers={[{ id: 'p1', passengerType: 'ADT' }]}
      onSeatMapInited={() => console.log('Map ready')}
      onSeatSelected={(seat) => console.log('Selected', seat.number)}
      onSeatUnselected={(seat) => console.log('Unselected', seat.number)}
      onAvailabilityApplied={(count) => console.log(`${count} available seats`)}
    />
  );
}
```

## Props

### Required

| Prop | Type | Description |
|------|------|-------------|
| `flight` | `IFlight` | Flight object. `flight.id` is used to build the API endpoint. |
| `apiUrl` | `string` | Base API URL |
| `appId` | `string` | Application ID for authentication |
| `apiKey` | `string` | API key |

### Optional Data Props

| Prop | Type | Description |
|------|------|-------------|
| `passengers` | `Passenger[]` | Passenger list. Pre-assigned seats (`passenger.seat.seatLabel`) are auto-selected. `readOnly: true` prevents unselecting. |
| `availability` | `SeatAvailability[]` | Array of `{ seatLabel, available }`. Overrides seat status from the API. |
| `currentDeckIndex` | `number` | Controlled deck index for external deck switching. |
| `openedTooltipSeatLabel` | `string` | Scroll to this seat and open its tooltip. |

### Config Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `400` | Component width in pixels |
| `lang` | `string` | `'EN'` | Language code |
| `units` | `'metric' \| 'imperials'` | — | Measurement units |
| `horizontal` | `boolean` | `false` | Horizontal layout |
| `rightToLeft` | `boolean` | `false` | RTL direction |
| `visibleFuselage` | `boolean` | `false` | Show fuselage outline |
| `visibleWings` | `boolean` | `false` | Show wing indicators |
| `visibleCabinTitles` | `boolean` | `false` | Show cabin class titles |
| `customCabinTitles` | `Record<string, string>` | — | Override cabin titles, e.g. `{ F: 'First', B: 'Business' }` |
| `builtInTooltip` | `boolean` | `true` | Show built-in seat tooltip |
| `builtInDeckSelector` | `boolean` | `true` | Show deck selector widget |
| `singleDeckMode` | `boolean` | `false` | Show one deck at a time |
| `colorTheme` | `ColorTheme` | — | Custom color overrides |

## Callbacks

| Callback | Signature | Description |
|----------|-----------|-------------|
| `onSeatMapInited` | `() => void` | Fired after data loads and the map is ready |
| `onSeatSelected` | `(seat, passenger?) => void` | Seat selected |
| `onSeatUnselected` | `(seat) => void` | Seat unselected |
| `onLayoutUpdated` | `({ width, height }) => void` | Component layout changed |
| `onTooltipRequested` | `(seat) => void` | Tooltip is about to open |
| `onAvailabilityApplied` | `(availableCount) => void` | Fired after applying availability data |
| `onDeckChange` | `(deckIndex) => void` | Active deck changed |

> **Deprecated:** `onSeatPress` → use `onSeatSelected`. `onSeatDeselect` → use `onSeatUnselected`.

## Imperative API — `SeatMapRef`

```tsx
const ref = useRef<SeatMapRef>(null);

// Scroll to seat "14A" and open its tooltip
ref.current?.seatJumpTo('14A');
```

| Method | Description |
|--------|-------------|
| `seatJumpTo(seatLabel)` | Scroll to the seat and open its tooltip |

## Low-level API

Use this when your API format doesn't match what `<SeatMap>` expects (e.g. POST body, custom auth). Fetch data yourself and pass the prepared result directly into `<Deck>`.

### `JetsContentPreparer`

```ts
import { JetsContentPreparer } from '@seatmaps.com/react-native-seatmap';
import type { PreparedData } from '@seatmaps.com/react-native-seatmap';

const preparer = new JetsContentPreparer();
const data: PreparedData = preparer.prepareData(rawApiResponse, {
  lang: 'EN',
  width: 320,
  colorTheme: {},
  visibleFuselage: true,
  visibleCabinTitles: true,
});
```

### `PreparedData` shape

```ts
interface PreparedData {
  content: PreparedDeck[];  // one entry per deck (main / upper)
  params: SeatMapParams;    // scale, noseType, visibleFuselage, …
  exits: unknown[][];       // exits[deckIndex] → ExitData[]
  bulks: unknown[][];       // bulks[deckIndex] → BulkData[]
}
```

### `<Deck>` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `deck` | `PreparedDeck` | — | Deck data (`PreparedData.content[i]`) |
| `exits` | `ExitData[]` | `[]` | Emergency exit arrows (`PreparedData.exits[i]`) |
| `bulks` | `BulkData[]` | `[]` | Galley/lavatory objects (`PreparedData.bulks[i]`) |
| `scale` | `number` | `1` | `PreparedData.params.scale` |
| `selectedSeats` | `Record<string, PreparedSeat>` | `{}` | Selected seats keyed by `uniqId` |
| `onSeatPress` | `(seat: PreparedSeat) => void` | — | Seat tap handler |
| `scrollViewRef` | `React.RefObject<ScrollView>` | — | Ref for programmatic scroll |
| `visibleFuselage` | `boolean` | `false` | Nose/tail SVG caps |
| `visibleCabinTitles` | `boolean` | `false` | Cabin class title strips |
| `noseType` | `string` | `'default'` | Aircraft nose shape key (`PreparedData.params.noseType`) |

### Full low-level example

```tsx
import { Deck, JetsContentPreparer, Tooltip, DeckSelector } from '@seatmaps.com/react-native-seatmap';
import type { PreparedData, PreparedSeat } from '@seatmaps.com/react-native-seatmap';
import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';

const preparer = new JetsContentPreparer();

export default function CustomSeatMap({ rawApiData }: { rawApiData: any }) {
  const data: PreparedData = preparer.prepareData(rawApiData, {
    lang: 'EN', width: 320, colorTheme: {},
    visibleFuselage: true, visibleCabinTitles: true,
  });

  const [deckIndex, setDeckIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, PreparedSeat>>({});
  const [tooltip, setTooltip] = useState<PreparedSeat | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <>
      {data.content.length > 1 && (
        <DeckSelector decks={data.content} activeDeckIndex={deckIndex} onDeckChange={setDeckIndex} />
      )}
      <Deck
        deck={data.content[deckIndex]}
        exits={(data.exits[deckIndex] as any[]) ?? []}
        bulks={(data.bulks[deckIndex] as any[]) ?? []}
        scale={data.params.scale}
        selectedSeats={selected}
        onSeatPress={setTooltip}
        scrollViewRef={scrollRef}
        visibleFuselage={data.params.visibleFuselage}
        visibleCabinTitles={data.params.visibleCabinTitles}
        noseType={data.params.noseType}
      />
      <Tooltip
        seat={tooltip}
        visible={!!tooltip}
        isSelected={!!tooltip && !!selected[tooltip.uniqId]}
        onSelect={(seat) => {
          setSelected(prev => ({ ...prev, [seat.uniqId]: seat }));
          setTooltip(null);
        }}
        onDeselect={(seat) => {
          setSelected(prev => { const n = { ...prev }; delete n[seat.uniqId]; return n; });
          setTooltip(null);
        }}
        onClose={() => setTooltip(null)}
      />
    </>
  );
}
```

## `IFlight` Type

```ts
interface IFlight {
  id: string;            // required — used in API endpoint
  airlineIata?: string;
  flightNumber?: string;
  cabinCode?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
}
```

## `Passenger` Type

```ts
interface Passenger {
  readonly id: string;
  seat?: { price: number; seatLabel: string };  // pre-assigned seat
  passengerType?: string;   // 'ADT' | 'CHD' | 'INF'
  passengerLabel?: string;  // display label
  passengerColor?: string;  // highlight color
  readOnly?: boolean;       // prevent unselecting this seat
}
```

## License

Apache 2.0 — see [LICENSE](../../LICENSE)
