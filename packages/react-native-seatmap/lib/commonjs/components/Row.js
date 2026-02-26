"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Row = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _Seat = require("./Seat");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Row = ({
  row,
  scale = 1,
  selectedSeats = {},
  onSeatPress,
  style
}) => {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [styles.row, {
      height: row.height * scale
    }, style],
    children: row.seats.map(seat => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Seat.Seat, {
      seat: seat,
      scale: scale,
      isSelected: !!selectedSeats[seat.uniqId],
      onPress: onSeatPress
    }, seat.uniqId))
  });
};
exports.Row = Row;
const styles = _reactNative.StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
//# sourceMappingURL=Row.js.map