import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  SeatMapCallbacks,
  PreparedData,
  PreparedSeat,
  Passenger,
  SeatAvailability,
  IFlight,
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
  /** Flight object used to fetch seatmap data */
  flight: IFlight,
  config: SeatMapConfig,
  callbacks?: SeatMapCallbacks,
  /** Optional list of passengers; pre-assigned seats are auto-selected */
  passengers?: Passenger[],
  /** Optional availability list; overrides seat statuses from the API */
  availability?: SeatAvailability[],
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
  // Tracks whether the first effect has completed initialization (async storage.init)
  const initializedRef = useRef(false);

  // seatLabel → passenger for readOnly checks and pre-population
  const passengersByLabel = useMemo(() => {
    const map: Record<string, Passenger> = {};
    passengers?.forEach(p => {
      if (p.seat?.seatLabel) map[p.seat.seatLabel] = p;
    });
    return map;
  }, [passengers]);

  // seatLabel → available boolean
  const availabilityMap = useMemo(() => {
    if (!availability?.length) return null;
    const map: Record<string, boolean> = {};
    availability.forEach(a => { map[a.seatLabel] = a.available; });
    return map;
  }, [availability]);

  useEffect(() => {
    const lang = JetsDataHelper.validateLanguage(mergedConfig.lang);
    mergedConfig.lang = lang;

    apiRef.current = new JetsApiService(
      config.appId,
      config.apiKey,
      config.apiUrl,
      storageRef.current
    );

    storageRef.current.init().then(() => {
      initializedRef.current = true;
      fetchData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.appId, config.apiKey, config.apiUrl]);

  // Re-fetch when flight id or availability changes (skip the initial mount —
  // the first effect already calls fetchData after storage initialises)
  useEffect(() => {
    if (!initializedRef.current) return;
    if (!apiRef.current) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight.id, availabilityMap]);

  const fetchData = useCallback(async () => {
    if (!apiRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const apiData = await apiRef.current.getData(`flight/${flight.id}`);

      // Pass availabilityMap into config so _prepareSeat can apply it
      const internalConfig = availabilityMap
        ? { ...mergedConfig, availabilityMap }
        : mergedConfig;

      const prepared = preparerRef.current.prepareData(apiData, internalConfig);
      setData(prepared);

      // Pre-populate selectedSeats from passengers with pre-assigned seats
      if (passengers?.length) {
        const preSelected: Record<string, PreparedSeat> = {};
        for (const deck of prepared.content) {
          for (const row of deck.rows) {
            for (const seat of row.seats) {
              if (seat.type === 'seat' && passengersByLabel[seat.number]) {
                preSelected[seat.uniqId] = seat;
              }
            }
          }
        }
        if (Object.keys(preSelected).length) {
          setSelectedSeats(prev => ({ ...prev, ...preSelected }));
        }
      }

      // Fire onAvailabilityApplied when availability data was used
      if (availabilityMap) {
        const availableCount = prepared.content
          .flatMap((d: any) => d.rows)
          .flatMap((r: any) => r.seats)
          .filter((s: any) => s.type === 'seat' && s.status === 'available').length;
        callbacks?.onAvailabilityApplied?.(availableCount);
      }

      callbacks?.onSeatMapInited?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight.id, availabilityMap, passengers, callbacks]);

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
          // Prevent deselecting readOnly pre-assigned seats
          if (passengersByLabel[seat.number]?.readOnly) return prev;
          const next = { ...prev };
          delete next[seat.uniqId];
          callbacks?.onSeatUnselected?.(seat);
          callbacks?.onSeatDeselect?.(seat); // deprecated alias
          return next;
        }
        callbacks?.onSeatSelected?.(seat, passenger);
        callbacks?.onSeatPress?.(seat, passenger); // deprecated alias
        return { ...prev, [seat.uniqId]: seat };
      });
    },
    [callbacks, passengersByLabel]
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
