"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeatMap = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _Deck = require("./Deck");
var _DeckSelector = require("./DeckSelector");
var _Tooltip = require("./Tooltip");
var _useSeatMap = require("../hooks/useSeatMap");
var _constants = require("../core/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
const SeatMap = exports.SeatMap = /*#__PURE__*/(0, _react.forwardRef)(({
  flight,
  width = _constants.DEFAULT_SEAT_MAP_WIDTH,
  lang = _constants.DEFAULT_LANG,
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
}, ref) => {
  const [tooltipSeat, setTooltipSeat] = (0, _react.useState)(null);
  const scrollViewRef = (0, _react.useRef)(null);
  const {
    data,
    loading,
    error,
    activeDeckIndex,
    selectedSeats,
    setActiveDeckIndex,
    toggleSeat
  } = (0, _useSeatMap.useSeatMap)(flight, {
    ...config,
    width,
    lang
  }, {
    onSeatMapInited,
    onSeatSelected,
    onSeatUnselected,
    onAvailabilityApplied,
    onDeckChange,
    onSeatPress,
    onSeatDeselect
  }, passengers, availability);

  // Sync external currentDeckIndex → internal state
  (0, _react.useEffect)(() => {
    if (currentDeckIndex !== undefined && currentDeckIndex !== activeDeckIndex) {
      setActiveDeckIndex(currentDeckIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDeckIndex]);

  // Handle openedTooltipSeatLabel: scroll + open tooltip
  (0, _react.useEffect)(() => {
    if (!openedTooltipSeatLabel || !data) return;
    const deck = data.content[activeDeckIndex];
    if (!deck) return;
    for (const row of deck.rows) {
      const seat = row.seats.find(s => s.type === 'seat' && s.number === openedTooltipSeatLabel);
      if (seat) {
        const scale = data.params.scale;
        scrollViewRef.current?.scrollTo({
          y: row.topOffset * scale,
          animated: true
        });
        setTooltipSeat(seat);
        onTooltipRequested?.(seat);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedTooltipSeatLabel]);

  // Expose imperative handle
  (0, _react.useImperativeHandle)(ref, () => ({
    seatJumpTo: seatLabel => {
      if (!data) return;
      const deck = data.content[activeDeckIndex];
      if (!deck) return;
      for (const row of deck.rows) {
        const seat = row.seats.find(s => s.type === 'seat' && s.number === seatLabel);
        if (seat) {
          const scale = data.params.scale;
          scrollViewRef.current?.scrollTo({
            y: row.topOffset * scale,
            animated: true
          });
          setTooltipSeat(seat);
          onTooltipRequested?.(seat);
          break;
        }
      }
    }
  }), [data, activeDeckIndex, onTooltipRequested]);
  const handleSeatPress = (0, _react.useCallback)(seat => {
    if (config.builtInTooltip !== false) {
      setTooltipSeat(seat);
      onTooltipRequested?.(seat);
    } else {
      toggleSeat(seat);
    }
  }, [config.builtInTooltip, toggleSeat, onTooltipRequested]);
  const handleTooltipSelect = (0, _react.useCallback)((seat, passenger) => {
    toggleSeat(seat, passenger);
    setTooltipSeat(null);
  }, [toggleSeat]);
  const handleTooltipDeselect = (0, _react.useCallback)(seat => {
    toggleSeat(seat);
    setTooltipSeat(null);
  }, [toggleSeat]);
  if (loading) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [styles.center, {
        width
      }, style],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
        size: "large"
      })
    });
  }
  if (error) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [styles.center, {
        width
      }, style],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.errorText,
        children: error
      })
    });
  }
  if (!data || !data.content.length) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [styles.center, {
        width
      }, style],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.emptyText,
        children: "No seat data available."
      })
    });
  }
  const {
    content: decks,
    params
  } = data;
  const activeDeck = decks[activeDeckIndex];
  const scale = params.scale;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [styles.container, {
      width,
      backgroundColor: _constants.THEME_BACKGROUND_COLOR
    }, style],
    onLayout: e => {
      const {
        width: w,
        height: h
      } = e.nativeEvent.layout;
      onLayoutUpdated?.({
        width: w,
        height: h
      });
    },
    children: [config.builtInDeckSelector !== false && decks.length > 1 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_DeckSelector.DeckSelector, {
      decks: decks,
      activeDeckIndex: activeDeckIndex,
      onDeckChange: setActiveDeckIndex,
      lang: lang
    }), activeDeck && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Deck.Deck, {
      deck: activeDeck,
      scale: scale,
      selectedSeats: selectedSeats,
      onSeatPress: handleSeatPress,
      scrollViewRef: scrollViewRef
    }), config.builtInTooltip !== false && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.Tooltip, {
      seat: tooltipSeat,
      visible: !!tooltipSeat,
      isSelected: tooltipSeat ? !!selectedSeats[tooltipSeat.uniqId] : false,
      lang: lang,
      onSelect: handleTooltipSelect,
      onDeselect: handleTooltipDeselect,
      onClose: () => setTooltipSeat(null)
    })]
  });
});
SeatMap.displayName = 'SeatMap';
const styles = _reactNative.StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center'
  }
});
//# sourceMappingURL=SeatMap.js.map