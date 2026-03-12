"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Nose = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeSvg = require("react-native-svg");
var _constants = require("../core/constants");
var _noseTemplates = require("../core/nose-templates");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Nose = ({
  width,
  noseType = 'default',
  floorColor = _constants.THEME_FLOOR_COLOR,
  fuselageColor = _constants.THEME_FUSELAGE_FILL_COLOR,
  strokeColor = _constants.THEME_FUSELAGE_OUTLINE_COLOR
}) => {
  const height = Math.round(width * (0, _noseTemplates.getNoseAspectRatio)(noseType));
  const svg = (0, _noseTemplates.getNoseSvg)(noseType, {
    floorColor,
    fuselageColor,
    strokeColor
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSvg.SvgXml, {
    xml: svg,
    width: width,
    height: height
  });
};
exports.Nose = Nose;
//# sourceMappingURL=Nose.js.map