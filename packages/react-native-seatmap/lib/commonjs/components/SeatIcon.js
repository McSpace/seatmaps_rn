"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeatIcon = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeSvg = require("react-native-svg");
var _seatTemplates = require("../core/seat-templates");
var _constants = require("../core/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const SeatIcon = ({
  seatType,
  fillColor,
  width,
  height
}) => {
  const xml = (0, _seatTemplates.getSeatSvg)(seatType, {
    fillColor,
    armrestColor: _constants.THEME_SEAT_ARMREST_COLOR,
    strokeColor: _constants.THEME_SEAT_STROKE_COLOR,
    strokeWidth: _constants.THEME_SEAT_STROKE_WIDTH
  });
  if (!xml) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSvg.SvgXml, {
    xml: xml,
    width: width,
    height: height
  });
};
exports.SeatIcon = SeatIcon;
//# sourceMappingURL=SeatIcon.js.map