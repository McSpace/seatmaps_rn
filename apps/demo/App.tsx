/**
 * Demo app for @seatmaps.com/react-native-seatmap
 *
 * NOTE: This demo uses a POST endpoint (sandbox.quicket.io) and therefore
 * calls JetsContentPreparer directly instead of the high-level <SeatMap>
 * component (which assumes a GET endpoint). For apps with a standard REST
 * seatmap API see README.md → "Using <SeatMap>".
 *
 * What this demo shows:
 *  • Fetching and rendering a real seatmap (MUC→SFO, QT777)
 *  • Availability: first 3 seats of each deck marked unavailable
 *  • Passengers: demo passenger pre-assigned to seat 14A
 *  • Multi-deck support with DeckSelector
 *  • Jump-to-seat (scrolls to the row and opens the tooltip)
 *  • Event log showing callbacks firing in real time
 */

import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Deck,
  DeckSelector,
  JetsContentPreparer,
  Tooltip,
} from '@seatmaps.com/react-native-seatmap';
import type {
  Passenger,
  PreparedData,
  PreparedSeat,
} from '@seatmaps.com/react-native-seatmap';

// ─── API config ──────────────────────────────────────────────────────────────

const API_URL = 'https://sandbox.quicket.io/api/v1/flight/features/plane/seatmap';
const API_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImFmZjZlYjVlLTFjODMtNGU1Yy1hMmEyLXNlYXRtYXBzLWNvbSIsImlhdCI6MTc3MjEwODMwNSwiZXhwIjoxNzcyMTk0NzA1fQ.oUlx37RqUrbmUSRcmJ64aSDDFOuegYKJb2lox9O9smA';

const FLIGHT_REQUEST = {
  flight: {
    id: 'demo',
    airlineCode: 'QT',
    flightNo: '777',
    departureDate: '2025-12-01',
    departure: 'MUC',
    arrival: 'SFO',
    cabinClass: 'E',
    planeCode: '',
  },
  lang: 'EN',
  units: 'metric',
};

const SEATMAP_WIDTH = 320;

const preparer = new JetsContentPreparer();

// ─── Demo data ───────────────────────────────────────────────────────────────

/**
 * Demo passenger pre-assigned to seat 14A.
 * In a real app you'd receive this from your booking backend.
 */
const DEMO_PASSENGERS: Passenger[] = [
  {
    id: 'pax-1',
    passengerType: 'ADT',
    passengerLabel: 'Me',
    passengerColor: '#007AFF',
    seat: { seatLabel: '14A', price: 0 },
    readOnly: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * The sandbox API returns cabin features at the top level.
 * prepareData() expects them keyed by cabin classCode.
 */
function buildApiData(raw: any): any {
  const classCodes = new Set<string>(
    (raw.seatDetails?.decks ?? []).flatMap((deck: any) =>
      (deck.rows ?? []).map((row: any) => row.classCode as string),
    ),
  );
  const cabinByClass: Record<string, any> = {};
  for (const code of classCodes) {
    cabinByClass[code] = {
      cabin: raw.cabin,
      entertainment: raw.entertainment,
      wifi: raw.wifi,
      power: raw.power,
      bluetooth: raw.bluetooth,
    };
  }
  return { ...raw, ...cabinByClass };
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState<PreparedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, PreparedSeat>>({});
  const [tooltipSeat, setTooltipSeat] = useState<PreparedSeat | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [jumpInput, setJumpInput] = useState('');

  // Ref to the inner ScrollView inside <Deck> — used for seatJumpTo
  const deckScrollRef = useRef<ScrollView>(null);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('en', { hour12: false });
    setEventLog(prev => [`${time}  ${msg}`, ...prev].slice(0, 6));
  }, []);

  // ── Fetch + prepare ─────────────────────────────────────────────────────

  useEffect(() => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_TOKEN}` },
      body: JSON.stringify(FLIGHT_REQUEST),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((response: any[]) => {
        const apiData = buildApiData(response[0]);

        // Pass 1 — discover seat labels (needed to build availability map)
        const pass1 = preparer.prepareData(apiData, {
          lang: 'EN',
          width: SEATMAP_WIDTH,
          colorTheme: {},
        });

        // Build demo availability map:
        // first 3 seats of each deck → unavailable, rest → available
        const availMap: Record<string, boolean> = {};
        for (const deck of pass1.content) {
          let count = 0;
          for (const row of deck.rows) {
            for (const seat of row.seats) {
              if (seat.type === 'seat') {
                availMap[seat.number] = count >= 3;
                count++;
              }
            }
          }
        }

        // Pass 2 — re-prepare with availability applied
        const prepared = preparer.prepareData(apiData, {
          lang: 'EN',
          width: SEATMAP_WIDTH,
          colorTheme: {},
          availabilityMap: availMap,
        } as any) as PreparedData;

        setData(prepared);

        const availableCount = Object.values(availMap).filter(Boolean).length;
        addLog(`✅ onSeatMapInited  (${availableCount} available seats)`);

        // Pre-select demo passenger seats
        const passengerLabels = new Set(
          DEMO_PASSENGERS.map(p => p.seat?.seatLabel).filter(Boolean),
        );
        const preSelected: Record<string, PreparedSeat> = {};
        for (const deck of prepared.content) {
          for (const row of deck.rows) {
            for (const seat of row.seats) {
              if (seat.type === 'seat' && passengerLabels.has(seat.number)) {
                preSelected[seat.uniqId] = seat;
              }
            }
          }
        }
        if (Object.keys(preSelected).length) {
          setSelectedSeats(preSelected);
          addLog(`👤 passenger pre-assigned: ${[...passengerLabels].join(', ')}`);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [addLog]);

  // ── Callbacks ───────────────────────────────────────────────────────────

  const handleSeatPress = useCallback(
    (seat: PreparedSeat) => {
      addLog(`🖱  onTooltipRequested: ${seat.number} (${seat.status})`);
      setTooltipSeat(seat);
    },
    [addLog],
  );

  const handleSelect = useCallback(
    (seat: PreparedSeat) => {
      addLog(`✅ onSeatSelected: ${seat.number}`);
      setSelectedSeats(prev => ({ ...prev, [seat.uniqId]: { ...seat, status: 'selected' } }));
    },
    [addLog],
  );

  const handleDeselect = useCallback(
    (seat: PreparedSeat) => {
      // Block deselect for demo passenger readOnly seat
      const isReadOnly = DEMO_PASSENGERS.some(p => p.readOnly && p.seat?.seatLabel === seat.number);
      if (isReadOnly) {
        addLog(`🔒 readOnly seat — deselect blocked: ${seat.number}`);
        return;
      }
      addLog(`❌ onSeatUnselected: ${seat.number}`);
      setSelectedSeats(prev => {
        const next = { ...prev };
        delete next[seat.uniqId];
        return next;
      });
    },
    [addLog],
  );

  const handleDeckChange = useCallback(
    (index: number) => {
      addLog(`🔄 onDeckChange: deck ${index + 1}`);
      setActiveDeckIndex(index);
    },
    [addLog],
  );

  // ── seatJumpTo ──────────────────────────────────────────────────────────

  const handleJump = useCallback(() => {
    const label = jumpInput.trim().toUpperCase();
    if (!label || !data) return;

    const deck = data.content[activeDeckIndex];
    if (!deck) return;

    for (const row of deck.rows) {
      const seat = row.seats.find(s => s.type === 'seat' && s.number === label);
      if (seat) {
        const y = row.topOffset * data.params.scale;
        deckScrollRef.current?.scrollTo({ y, animated: true });
        setTooltipSeat(seat);
        addLog(`🎯 seatJumpTo: ${label} (y=${y.toFixed(0)}px)`);
        return;
      }
    }
    addLog(`⚠️  seat not found: ${label}`);
  }, [jumpInput, data, activeDeckIndex, addLog]);

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text style={styles.hint}>Loading seatmap…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const activeDeck = data?.content?.[activeDeckIndex];
  const scale = data?.params?.scale ?? 1;
  const selectedList = Object.values(selectedSeats)
    .map(s => s.number)
    .join(', ');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <Text style={styles.title}>SeatMap Demo</Text>
      <Text style={styles.subtitle}>MUC → SFO · QT777 · Economy</Text>

      {/* Selected seats */}
      {selectedList ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✈ {selectedList}</Text>
        </View>
      ) : (
        <Text style={styles.hint}>Tap a seat to select it</Text>
      )}

      {/* Deck selector — only shown for multi-deck aircraft */}
      {data && data.content.length > 1 && (
        <DeckSelector
          decks={data.content}
          activeDeckIndex={activeDeckIndex}
          onDeckChange={handleDeckChange}
        />
      )}

      {/* Seat map */}
      <View style={styles.mapContainer}>
        {activeDeck ? (
          <Deck
            deck={activeDeck}
            exits={(data?.exits?.[activeDeckIndex] as any[]) ?? []}
            bulks={(data?.bulks?.[activeDeckIndex] as any[]) ?? []}
            scale={scale}
            selectedSeats={selectedSeats}
            onSeatPress={handleSeatPress}
            scrollViewRef={deckScrollRef}
          />
        ) : (
          <Text style={styles.hint}>No deck data</Text>
        )}
      </View>

      {/* Jump to seat */}
      <View style={styles.jumpRow}>
        <TextInput
          style={styles.jumpInput}
          placeholder="Seat label, e.g. 14A"
          placeholderTextColor="#aaa"
          value={jumpInput}
          onChangeText={t => setJumpInput(t.toUpperCase())}
          autoCapitalize="characters"
          returnKeyType="go"
          onSubmitEditing={handleJump}
        />
        <TouchableOpacity style={styles.jumpBtn} onPress={handleJump}>
          <Text style={styles.jumpBtnText}>Jump</Text>
        </TouchableOpacity>
      </View>

      {/* Event log */}
      <View style={styles.logBox}>
        <Text style={styles.logTitle}>Event log</Text>
        {eventLog.length === 0 ? (
          <Text style={styles.logEntry}>—</Text>
        ) : (
          eventLog.map((entry, i) => (
            <Text key={i} style={[styles.logEntry, i === 0 && styles.logEntryNew]}>
              {entry}
            </Text>
          ))
        )}
      </View>

      {/* Tooltip / seat detail */}
      <Tooltip
        seat={tooltipSeat}
        visible={!!tooltipSeat}
        isSelected={!!tooltipSeat && !!selectedSeats[tooltipSeat.uniqId]}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        onClose={() => setTooltipSeat(null)}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    gap: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  badge: {
    backgroundColor: '#1157ce',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  jumpRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  jumpInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#1a1a2e',
  },
  jumpBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingHorizontal: 18,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  logBox: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 1,
  },
  logTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  logEntry: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  logEntryNew: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#c0392b',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
