"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSeatMap = useSeatMap;
var _react = require("react");
var _api = require("../core/api");
var _dataPreparer = require("../core/data-preparer");
var _storage = require("../core/storage");
var _dataHelper = require("../core/data-helper");
var _constants = require("../core/constants");
const DEFAULT_CONFIG = {
  width: _constants.DEFAULT_SEAT_MAP_WIDTH,
  lang: _constants.DEFAULT_LANG,
  horizontal: false,
  rightToLeft: false,
  visibleFuselage: _constants.DEFAULT_VISIBLE_HULL,
  visibleWings: _constants.DEFAULT_VISIBLE_WINGS,
  visibleCabinTitles: _constants.DEFAULT_VISIBLE_CABIN_TITLES,
  builtInTooltip: _constants.DEFAULT_BUILT_IN_TOOLTIP,
  tooltipOnHover: _constants.DEFAULT_TOOLTIP_ON_HOVER,
  builtInDeckSelector: _constants.DEFAULT_SHOW_DECK_SELECTOR,
  singleDeckMode: _constants.DEFAULT_SINGLE_DECK_MODE,
  externalPassengerManagement: _constants.DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT,
  scaleType: _constants.DEFAULT_SCALE_TYPE,
  hiddenSeatFeatures: []
};
function useSeatMap(/** Flight object used to fetch seatmap data */
flight, config, callbacks, /** Optional list of passengers; pre-assigned seats are auto-selected */
passengers, /** Optional availability list; overrides seat statuses from the API */
availability) {
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...config
  };
  const [data, setData] = (0, _react.useState)(null);
  const [activeDeckIndex, setActiveDeckIndexState] = (0, _react.useState)(0);
  const [selectedSeats, setSelectedSeats] = (0, _react.useState)({});
  const [loading, setLoading] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const storageRef = (0, _react.useRef)(new _storage.JetsStorageService());
  const apiRef = (0, _react.useRef)(null);
  const preparerRef = (0, _react.useRef)(new _dataPreparer.JetsContentPreparer());

  // seatLabel → passenger for readOnly checks and pre-population
  const passengersByLabel = (0, _react.useMemo)(() => {
    const map = {};
    passengers?.forEach(p => {
      if (p.seat?.seatLabel) map[p.seat.seatLabel] = p;
    });
    return map;
  }, [passengers]);

  // seatLabel → available boolean
  const availabilityMap = (0, _react.useMemo)(() => {
    if (!availability?.length) return null;
    const map = {};
    availability.forEach(a => {
      map[a.seatLabel] = a.available;
    });
    return map;
  }, [availability]);
  (0, _react.useEffect)(() => {
    const lang = _dataHelper.JetsDataHelper.validateLanguage(mergedConfig.lang);
    mergedConfig.lang = lang;
    apiRef.current = new _api.JetsApiService(config.appId, config.apiKey, config.apiUrl, storageRef.current);
    storageRef.current.init().then(() => fetchData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.appId, config.apiKey, config.apiUrl]);

  // Re-fetch when flight id or availability changes
  (0, _react.useEffect)(() => {
    if (!apiRef.current) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight.id, availabilityMap]);
  const fetchData = (0, _react.useCallback)(async () => {
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
  const setActiveDeckIndex = (0, _react.useCallback)(index => {
    setActiveDeckIndexState(index);
    callbacks?.onDeckChange?.(index);
  }, [callbacks]);
  const toggleSeat = (0, _react.useCallback)((seat, passenger) => {
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
  const clearSelection = (0, _react.useCallback)(() => {
    setSelectedSeats({});
  }, []);
  const refresh = (0, _react.useCallback)(() => {
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