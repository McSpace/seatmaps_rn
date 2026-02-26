"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Seat = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _SeatIcon = require("./SeatIcon");
var _constants = require("../core/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const STATUS_COLORS = {
  [_constants.ENTITY_STATUS_MAP.available]: '#4CAF50',
  [_constants.ENTITY_STATUS_MAP.selected]: '#1157ce',
  [_constants.ENTITY_STATUS_MAP.preferred]: '#8BC34A',
  [_constants.ENTITY_STATUS_MAP.extra]: '#FF9800',
  [_constants.ENTITY_STATUS_MAP.unavailable]: _constants.THEME_NOT_AVAILABLE_SEATS_COLOR,
  [_constants.ENTITY_STATUS_MAP.disabled]: 'transparent'
};
const Seat = ({
  seat,
  scale = 1,
  isSelected,
  onPress,
  style
}) => {
  const {
    type,
    status,
    size,
    letter,
    number,
    color,
    seatType
  } = seat;
  const isInteractive = type === 'seat' && status !== _constants.ENTITY_STATUS_MAP.disabled;
  const fillColor = isSelected ? STATUS_COLORS[_constants.ENTITY_STATUS_MAP.selected] : color || STATUS_COLORS[status] || STATUS_COLORS[_constants.ENTITY_STATUS_MAP.available];
  const W = size.width * scale;
  const H = size.height * scale;
  if (type === 'aisle' || type === 'empty' || type === 'index') {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
      style: [{
        width: W,
        height: H,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1 * scale
      }, style],
      disabled: true,
      activeOpacity: 1,
      children: type === 'index' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: [styles.label, {
          fontSize: 10 * scale
        }],
        numberOfLines: 1,
        children: letter
      })
    });
  }
  const opacity = status === _constants.ENTITY_STATUS_MAP.unavailable ? 0.6 : 1;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.TouchableOpacity, {
    style: [{
      width: W,
      height: H,
      margin: 1 * scale,
      opacity
    }, style],
    onPress: isInteractive ? () => onPress?.(seat) : undefined,
    disabled: !isInteractive,
    activeOpacity: 0.75,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_SeatIcon.SeatIcon, {
      seatType: seatType,
      fillColor: fillColor,
      width: W,
      height: H
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: [_reactNative.StyleSheet.absoluteFill, styles.labelContainer],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: [styles.label, {
          fontSize: Math.max(9, 11 * scale)
        }],
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        children: String(number || letter || '')
      }), !!seat.price && H > 30 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: [styles.price, {
          fontSize: Math.max(7, 8 * scale)
        }],
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        children: seat.price
      })]
    })]
  });
};
exports.Seat = Seat;
const styles = _reactNative.StyleSheet.create({
  label: {
    color: _constants.THEME_SEAT_LABEL_COLOR,
    fontWeight: '700',
    textAlign: 'center'
  },
  price: {
    color: _constants.THEME_SEAT_LABEL_COLOR,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.85
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '15%'
  }
});
//# sourceMappingURL=Seat.js.map