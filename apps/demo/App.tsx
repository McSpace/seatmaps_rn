import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Deck,
  JetsContentPreparer,
  Tooltip,
} from '@seatmaps.com/react-native-seatmap';
import type { PreparedData, PreparedSeat } from '@seatmaps.com/react-native-seatmap';

const API_URL = 'https://sandbox.quicket.io/api/v1/flight/features/plane/seatmap';
const API_TOKEN =
  //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImFmZjZlYjVlLTFjODMtNGU1Yy1hMmEyLXNlYXRtYXBzLWNvbSIsImlhdCI6MTc3MTQyMjc1MSwiZXhwIjoxNzcxNTA5MTUxfQ.V7c2DZ216kSGkU3gGYFBvaviFj6G8M7euIhhe1wJsw4';
  //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImFmZjZlYjVlLTFjODMtNGU1Yy1hMmEyLXNlYXRtYXBzLWNvbSIsImlhdCI6MTc3MTU4NDQ4MiwiZXhwIjoxNzcxNjcwODgyfQ.5yvh8qf1ry8XqkcQnz564K6k0U4foi3HgZ3o8eq9glM'
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImFmZjZlYjVlLTFjODMtNGU1Yy1hMmEyLXNlYXRtYXBzLWNvbSIsImlhdCI6MTc3MTg2NTU2NiwiZXhwIjoxNzcxOTUxOTY2fQ.CWIyL2QifKY8M-8Zy_oO-ioUXSumvh5YpnF-w5xGNv8';

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

const PREPARER_CONFIG = {
  lang: 'EN',
  width: 320,
  colorTheme: {},
};

const preparer = new JetsContentPreparer();

function buildApiData(raw: any): any {
  const classCodes = new Set<string>(
    (raw.seatDetails?.decks ?? []).flatMap((deck: any) =>
      (deck.rows ?? []).map((row: any) => row.classCode as string)
    )
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

export default function App() {
  const [data, setData] = useState<PreparedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, PreparedSeat>>({});
  const [tooltipSeat, setTooltipSeat] = useState<PreparedSeat | null>(null);

  useEffect(() => {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(FLIGHT_REQUEST),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((response: any[]) => {
        const raw = response[0];
        const apiData = buildApiData(raw);
        const prepared = preparer.prepareData(apiData, PREPARER_CONFIG) as PreparedData;
        console.log('[SeatMap] data prepared — decks:', prepared.content.length, '| scale:', prepared.params.scale);
        setData(prepared);
      })
      .catch(err => {
        console.error('[SeatMap] fetch error:', err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Open the popup for any seat (including unavailable)
  const handleSeatPress = (seat: PreparedSeat) => {
    console.log('[SeatMap] seat pressed:', seat.number, '| status:', seat.status, '| cabin:', seat.classType);
    setTooltipSeat(seat);
  };

  const handleSeatSelect = (seat: PreparedSeat) => {
    console.log('[SeatMap] seat selected:', seat.number);
    setSelectedSeats(prev => ({ ...prev, [seat.uniqId]: { ...seat, status: 'selected' } }));
  };

  const handleSeatDeselect = (seat: PreparedSeat) => {
    console.log('[SeatMap] seat deselected:', seat.number);
    setSelectedSeats(prev => {
      const next = { ...prev };
      delete next[seat.uniqId];
      return next;
    });
  };

  const handleTooltipClose = () => {
    console.log('[SeatMap] tooltip closed');
    setTooltipSeat(null);
  };

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

  const deck = data?.content?.[0];
  const scale = data?.params?.scale ?? 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SeatMap Demo</Text>
      <Text style={styles.subtitle}>MUC → SFO · QT777 · Economy</Text>

      {Object.keys(selectedSeats).length > 0 && (
        <Text style={styles.hint}>
          Selected: {Object.values(selectedSeats).map(s => s.number).join(', ')}
        </Text>
      )}

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {deck ? (
          <Deck
            deck={deck}
            exits={(data?.exits?.[0] as any[]) ?? []}
            bulks={(data?.bulks?.[0] as any[]) ?? []}
            scale={scale}
            selectedSeats={selectedSeats}
            onSeatPress={handleSeatPress}
          />
        ) : (
          <Text style={styles.hint}>No deck data</Text>
        )}
      </ScrollView>

      {/* Seat detail popup */}
      <Tooltip
        seat={tooltipSeat}
        visible={!!tooltipSeat}
        isSelected={!!tooltipSeat && !!selectedSeats[tooltipSeat.uniqId]}
        onSelect={handleSeatSelect}
        onDeselect={handleSeatDeselect}
        onClose={handleTooltipClose}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    gap: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#c0392b',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
