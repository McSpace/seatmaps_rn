import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { Deck } from './Deck';
import { DeckSelector } from './DeckSelector';
import { Tooltip } from './Tooltip';
import type {
  SeatMapConfig,
  SeatMapCallbacks,
  SeatMapRef,
  PreparedSeat,
  Passenger,
  SeatAvailability,
  IFlight,
} from '../types';
import { useSeatMap } from '../hooks/useSeatMap';
import {
  DEFAULT_LANG,
  DEFAULT_SEAT_MAP_WIDTH,
  THEME_BACKGROUND_COLOR,
} from '../core/constants';
import { getNoseAspectRatio } from '../core/nose-templates';

export interface SeatMapProps extends SeatMapConfig, SeatMapCallbacks {
  /** Flight data used to fetch seatmap from the API */
  flight: IFlight;
  /** Width of the seatmap component in pixels */
  width?: number;
  /** Passengers list; pre-assigned seats are auto-selected */
  passengers?: Passenger[];
  /** Availability data; overrides seat statuses */
  availability?: SeatAvailability[];
  /** Controlled deck index; synced to internal state */
  currentDeckIndex?: number;
  /** Open tooltip for this seat label and scroll to it */
  openedTooltipSeatLabel?: string;
  style?: ViewStyle;
}

/**
 * Top-level SeatMap component.
 *
 * Usage:
 * ```tsx
 * const ref = useRef<SeatMapRef>(null);
 *
 * <SeatMap
 *   ref={ref}
 *   flight={{ id: 'UA123' }}
 *   apiUrl="https://api.example.com"
 *   appId="my-app"
 *   apiKey="my-key"
 *   width={350}
 *   lang="EN"
 *   onSeatSelected={(seat) => console.log('Selected:', seat.number)}
 *   onSeatMapInited={() => console.log('Ready')}
 * />
 * ```
 */
export const SeatMap = forwardRef<SeatMapRef, SeatMapProps>((
  {
    flight,
    width = DEFAULT_SEAT_MAP_WIDTH,
    lang = DEFAULT_LANG,
    style,
    passengers,
    availability,
    currentDeckIndex,
    openedTooltipSeatLabel,
    // callbacks
    onSeatMapInited,
    onSeatSelected,
    onSeatUnselected,
    onLayoutUpdated,
    onTooltipRequested,
    onAvailabilityApplied,
    onDeckChange,
    onSeatPress,
    onSeatDeselect,
    ...config
  },
  ref,
) => {
  const [tooltipSeat, setTooltipSeat] = useState<PreparedSeat | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    data,
    loading,
    error,
    activeDeckIndex,
    selectedSeats,
    setActiveDeckIndex,
    toggleSeat,
  } = useSeatMap(
    flight,
    { ...config, width, lang },
    {
      onSeatMapInited,
      onSeatSelected,
      onSeatUnselected,
      onAvailabilityApplied,
      onDeckChange,
      onSeatPress,
      onSeatDeselect,
    },
    passengers,
    availability,
  );

  // Sync external currentDeckIndex → internal state
  useEffect(() => {
    if (currentDeckIndex !== undefined && currentDeckIndex !== activeDeckIndex) {
      setActiveDeckIndex(currentDeckIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDeckIndex]);

  // Handle openedTooltipSeatLabel: scroll + open tooltip
  useEffect(() => {
    if (!openedTooltipSeatLabel || !data) return;
    const deck = data.content[activeDeckIndex];
    if (!deck) return;
    for (const row of deck.rows) {
      const seat = row.seats.find(
        s => s.type === 'seat' && s.number === openedTooltipSeatLabel,
      );
      if (seat) {
        const scale = data.params.scale;
        const noseOffset = data.params.visibleFuselage ? width * getNoseAspectRatio(data.params.noseType ?? 'default') : 0;
        scrollViewRef.current?.scrollTo({ y: noseOffset + row.topOffset * scale, animated: true });
        setTooltipSeat(seat);
        onTooltipRequested?.(seat);
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedTooltipSeatLabel]);

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    seatJumpTo: (seatLabel: string) => {
      if (!data) return;
      const deck = data.content[activeDeckIndex];
      if (!deck) return;
      for (const row of deck.rows) {
        const seat = row.seats.find(
          s => s.type === 'seat' && s.number === seatLabel,
        );
        if (seat) {
          const scale = data.params.scale;
          const noseOffset = data.params.visibleFuselage ? width * getNoseAspectRatio(data.params.noseType ?? 'default') : 0;
          scrollViewRef.current?.scrollTo({ y: noseOffset + row.topOffset * scale, animated: true });
          setTooltipSeat(seat);
          onTooltipRequested?.(seat);
          break;
        }
      }
    },
  }), [data, activeDeckIndex, onTooltipRequested]);

  const handleSeatPress = useCallback(
    (seat: PreparedSeat) => {
      if (config.builtInTooltip !== false) {
        setTooltipSeat(seat);
        onTooltipRequested?.(seat);
      } else {
        toggleSeat(seat);
      }
    },
    [config.builtInTooltip, toggleSeat, onTooltipRequested]
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
    <View
      style={[styles.container, { width, backgroundColor: THEME_BACKGROUND_COLOR }, style]}
      onLayout={e => {
        const { width: w, height: h } = e.nativeEvent.layout;
        onLayoutUpdated?.({ width: w, height: h });
      }}
    >
      {/* Deck selector */}
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
          exits={(data.exits?.[activeDeckIndex] as any[]) ?? []}
          bulks={(data.bulks?.[activeDeckIndex] as any[]) ?? []}
          scale={scale}
          selectedSeats={selectedSeats}
          onSeatPress={handleSeatPress}
          scrollViewRef={scrollViewRef}
          visibleFuselage={params.visibleFuselage}
          visibleCabinTitles={params.visibleCabinTitles}
          noseType={params.noseType}
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
});

SeatMap.displayName = 'SeatMap';

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
