import React, { useState, useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Deck } from './Deck';
import { DeckSelector } from './DeckSelector';
import { Tooltip } from './Tooltip';
import type { SeatMapConfig, SeatMapCallbacks, PreparedSeat, Passenger } from '../types';
import { useSeatMap } from '../hooks/useSeatMap';
import {
  DEFAULT_LANG,
  DEFAULT_SEAT_MAP_WIDTH,
  THEME_BACKGROUND_COLOR,
} from '../core/constants';

export interface SeatMapProps extends SeatMapConfig, SeatMapCallbacks {
  /** Flight identifier used to fetch seat data */
  flightId: string;
  /** Width of the seatmap component in pixels */
  width?: number;
  style?: ViewStyle;
}

/**
 * Top-level SeatMap component.
 *
 * Usage:
 * ```tsx
 * <SeatMap
 *   flightId="UA123"
 *   apiUrl="https://api.example.com"
 *   appId="my-app"
 *   apiKey="my-key"
 *   width={350}
 *   lang="EN"
 *   onSeatPress={(seat) => console.log('Selected:', seat.number)}
 * />
 * ```
 */
export const SeatMap: React.FC<SeatMapProps> = ({
  flightId,
  width = DEFAULT_SEAT_MAP_WIDTH,
  lang = DEFAULT_LANG,
  style,
  onSeatPress,
  onSeatDeselect,
  onDeckChange,
  ...config
}) => {
  const [tooltipSeat, setTooltipSeat] = useState<PreparedSeat | null>(null);

  const {
    data,
    loading,
    error,
    activeDeckIndex,
    selectedSeats,
    setActiveDeckIndex,
    toggleSeat,
  } = useSeatMap(
    flightId,
    { ...config, width, lang },
    {
      onSeatPress,
      onSeatDeselect,
      onDeckChange,
    }
  );

  const handleSeatPress = useCallback(
    (seat: PreparedSeat) => {
      if (config.builtInTooltip !== false) {
        setTooltipSeat(seat);
      } else {
        toggleSeat(seat);
      }
    },
    [config.builtInTooltip, toggleSeat]
  );

  const handleTooltipSelect = useCallback(
    (seat: PreparedSeat, passenger?: Passenger) => {
      toggleSeat(seat, passenger);
      setTooltipSeat(null);
    },
    [toggleSeat]
  );

  const handleTooltipDeselect = useCallback(
    (seat: PreparedSeat) => {
      toggleSeat(seat);
      setTooltipSeat(null);
    },
    [toggleSeat]
  );

  if (loading) {
    return (
      <View style={[styles.center, { width }, style]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { width }, style]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data || !data.content.length) {
    return (
      <View style={[styles.center, { width }, style]}>
        <Text style={styles.emptyText}>No seat data available.</Text>
      </View>
    );
  }

  const { content: decks, params } = data;
  const activeDeck = decks[activeDeckIndex];
  const scale = params.scale;

  return (
    <View style={[styles.container, { width, backgroundColor: THEME_BACKGROUND_COLOR }, style]}>
      {/* Deck selector — shown when there are multiple decks */}
      {config.builtInDeckSelector !== false && decks.length > 1 && (
        <DeckSelector
          decks={decks}
          activeDeckIndex={activeDeckIndex}
          onDeckChange={setActiveDeckIndex}
          lang={lang}
        />
      )}

      {/* Active deck */}
      {activeDeck && (
        <Deck
          deck={activeDeck}
          scale={scale}
          selectedSeats={selectedSeats}
          onSeatPress={handleSeatPress}
        />
      )}

      {/* Built-in tooltip */}
      {config.builtInTooltip !== false && (
        <Tooltip
          seat={tooltipSeat}
          visible={!!tooltipSeat}
          isSelected={tooltipSeat ? !!selectedSeats[tooltipSeat.uniqId] : false}
          lang={lang}
          onSelect={handleTooltipSelect}
          onDeselect={handleTooltipDeselect}
          onClose={() => setTooltipSeat(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
