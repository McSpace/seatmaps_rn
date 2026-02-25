import { useState, useEffect, useCallback, useRef } from 'react';
import { JetsApiService } from '../core/api';
import { JetsContentPreparer } from '../core/data-preparer';
import { JetsStorageService } from '../core/storage';
import { JetsDataHelper } from '../core/data-helper';
import {
  DEFAULT_LANG,
  DEFAULT_SEAT_MAP_WIDTH,
  DEFAULT_BUILT_IN_TOOLTIP,
  DEFAULT_SHOW_DECK_SELECTOR,
  DEFAULT_SINGLE_DECK_MODE,
  DEFAULT_TOOLTIP_ON_HOVER,
  DEFAULT_VISIBLE_HULL,
  DEFAULT_VISIBLE_WINGS,
  DEFAULT_VISIBLE_CABIN_TITLES,
  DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT,
  DEFAULT_SCALE_TYPE,
} from '../core/constants';
import type {
  SeatMapConfig,
  PreparedData,
  PreparedSeat,
  Passenger,
} from '../types';

export interface UseSeatMapState {
  /** Prepared seatmap content */
  data: PreparedData | null;
  /** Currently active deck index (0-based) */
  activeDeckIndex: number;
  /** Seats currently selected, keyed by seat uniqId */
  selectedSeats: Record<string, PreparedSeat>;
  /** Whether data is being loaded */
  loading: boolean;
  /** Error message if the last fetch failed */
  error: string | null;
  /** Change active deck */
  setActiveDeckIndex: (index: number) => void;
  /** Select or deselect a seat */
  toggleSeat: (seat: PreparedSeat, passenger?: Passenger) => void;
  /** Deselect all seats */
  clearSelection: () => void;
  /** Re-fetch data */
  refresh: () => void;
}

const DEFAULT_CONFIG: Partial<SeatMapConfig> = {
  width: DEFAULT_SEAT_MAP_WIDTH,
  lang: DEFAULT_LANG,
  horizontal: false,
  rightToLeft: false,
  visibleFuselage: DEFAULT_VISIBLE_HULL,
  visibleWings: DEFAULT_VISIBLE_WINGS,
  visibleCabinTitles: DEFAULT_VISIBLE_CABIN_TITLES,
  builtInTooltip: DEFAULT_BUILT_IN_TOOLTIP,
  tooltipOnHover: DEFAULT_TOOLTIP_ON_HOVER,
  builtInDeckSelector: DEFAULT_SHOW_DECK_SELECTOR,
  singleDeckMode: DEFAULT_SINGLE_DECK_MODE,
  externalPassengerManagement: DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT,
  scaleType: DEFAULT_SCALE_TYPE,
  hiddenSeatFeatures: [],
};

export function useSeatMap(
  /** Flight identifier (passed to the API endpoint) */
  flightId: string,
  config: SeatMapConfig,
  callbacks?: {
    onSeatPress?: (seat: PreparedSeat, passenger?: Passenger) => void;
    onSeatDeselect?: (seat: PreparedSeat) => void;
    onDeckChange?: (deckIndex: number) => void;
  }
): UseSeatMapState {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const [data, setData] = useState<PreparedData | null>(null);
  const [activeDeckIndex, setActiveDeckIndexState] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, PreparedSeat>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageRef = useRef<JetsStorageService>(new JetsStorageService());
  const apiRef = useRef<JetsApiService | null>(null);
  const preparerRef = useRef<JetsContentPreparer>(new JetsContentPreparer());

  useEffect(() => {
    const lang = JetsDataHelper.validateLanguage(mergedConfig.lang);
    mergedConfig.lang = lang;

    apiRef.current = new JetsApiService(
      config.appId,
      config.apiKey,
      config.apiUrl,
      storageRef.current
    );

    // Hydrate token cache from persisted storage
    storageRef.current.init().then(() => fetchData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.appId, config.apiKey, config.apiUrl]);

  const fetchData = useCallback(async () => {
    if (!apiRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const apiData = await apiRef.current.getData(`flight/${flightId}`);
      const prepared = preparerRef.current.prepareData(apiData, mergedConfig);
      setData(prepared);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [flightId, mergedConfig]);

  const setActiveDeckIndex = useCallback(
    (index: number) => {
      setActiveDeckIndexState(index);
      callbacks?.onDeckChange?.(index);
    },
    [callbacks]
  );

  const toggleSeat = useCallback(
    (seat: PreparedSeat, passenger?: Passenger) => {
      setSelectedSeats(prev => {
        if (prev[seat.uniqId]) {
          const next = { ...prev };
          delete next[seat.uniqId];
          callbacks?.onSeatDeselect?.(seat);
          return next;
        }
        callbacks?.onSeatPress?.(seat, passenger);
        return { ...prev, [seat.uniqId]: seat };
      });
    },
    [callbacks]
  );

  const clearSelection = useCallback(() => {
    setSelectedSeats({});
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    activeDeckIndex,
    selectedSeats,
    loading,
    error,
    setActiveDeckIndex,
    toggleSeat,
    clearSelection,
    refresh,
  };
}
