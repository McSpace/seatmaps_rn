"use strict";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { JetsApiService } from '../core/api';
import { JetsContentPreparer } from '../core/data-preparer';
import { JetsStorageService } from '../core/storage';
import { JetsDataHelper } from '../core/data-helper';
import { DEFAULT_LANG, DEFAULT_SEAT_MAP_WIDTH, DEFAULT_BUILT_IN_TOOLTIP, DEFAULT_SHOW_DECK_SELECTOR, DEFAULT_SINGLE_DECK_MODE, DEFAULT_TOOLTIP_ON_HOVER, DEFAULT_VISIBLE_HULL, DEFAULT_VISIBLE_WINGS, DEFAULT_VISIBLE_CABIN_TITLES, DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT, DEFAULT_SCALE_TYPE } from '../core/constants';
const DEFAULT_CONFIG = {
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
  hiddenSeatFeatures: []
};
export function useSeatMap(/** Flight object used to fetch seatmap data */
flight, config, callbacks, /** Optional list of passengers; pre-assigned seats are auto-selected */
passengers, /** Optional availability list; overrides seat statuses from the API */
availability) {
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...config
  };
  const [data, setData] = useState(null);
  const [activeDeckIndex, setActiveDeckIndexState] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storageRef = useRef(new JetsStorageService());
  const apiRef = useRef(null);
  const preparerRef = useRef(new JetsContentPreparer());

  // seatLabel → passenger for readOnly checks and pre-population
  const passengersByLabel = useMemo(() => {
    const map = {};
    passengers?.forEach(p => {
      if (p.seat?.seatLabel) map[p.seat.seatLabel] = p;
    });
    return map;
  }, [passengers]);

  // seatLabel → available boolean
  const availabilityMap = useMemo(() => {
    if (!availability?.length) return null;
    const map = {};
    availability.forEach(a => {
      map[a.seatLabel] = a.available;
    });
    return map;
  }, [availability]);
  useEffect(() => {
    const lang = JetsDataHelper.validateLanguage(mergedConfig.lang);
    mergedConfig.lang = lang;
    apiRef.current = new JetsApiService(config.appId, config.apiKey, config.apiUrl, storageRef.current);
    storageRef.current.init().then(() => fetchData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.appId, config.apiKey, config.apiUrl]);

  // Re-fetch when flight id or availability changes
  useEffect(() => {
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
      const internalConfig = availabilityMap ? {
        ...mergedConfig,
        availabilityMap
      } : mergedConfig;
      const prepared = preparerRef.current.prepareData(apiData, internalConfig);
      setData(prepared);

      // Pre-populate selectedSeats from passengers with pre-assigned seats
      if (passengers?.length) {
        const preSelected = {};
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
          setSelectedSeats(prev => ({
            ...prev,
            ...preSelected
          }));
        }
      }

      // Fire onAvailabilityApplied when availability data was used
      if (availabilityMap) {
        const availableCount = prepared.content.flatMap(d => d.rows).flatMap(r => r.seats).filter(s => s.type === 'seat' && s.status === 'available').length;
        callbacks?.onAvailabilityApplied?.(availableCount);
      }
      callbacks?.onSeatMapInited?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight.id, availabilityMap, passengers, callbacks]);
  const setActiveDeckIndex = useCallback(index => {
    setActiveDeckIndexState(index);
    callbacks?.onDeckChange?.(index);
  }, [callbacks]);
  const toggleSeat = useCallback((seat, passenger) => {
    setSelectedSeats(prev => {
      if (prev[seat.uniqId]) {
        // Prevent deselecting readOnly pre-assigned seats
        if (passengersByLabel[seat.number]?.readOnly) return prev;
        const next = {
          ...prev
        };
        delete next[seat.uniqId];
        callbacks?.onSeatUnselected?.(seat);
        callbacks?.onSeatDeselect?.(seat); // deprecated alias
        return next;
      }
      callbacks?.onSeatSelected?.(seat, passenger);
      callbacks?.onSeatPress?.(seat, passenger); // deprecated alias
      return {
        ...prev,
        [seat.uniqId]: seat
      };
    });
  }, [callbacks, passengersByLabel]);
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
    refresh
  };
}
//# sourceMappingURL=useSeatMap.js.map