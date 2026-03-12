"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CabinTitle = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _constants = require("../core/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HIGHLIGHT_BORDER_WIDTH = 3;
const CabinTitle = ({
  classCode,
  topOffset,
  cabinHeight,
  stripWidth
}) => {
  const code = classCode.toUpperCase();
  const highlightColor = _constants.THEME_CABIN_TITLES_HIGHLIGHT_COLORS[code] ?? '#888';
  const classType = _constants.CLASS_CODE_MAP[classCode.toLowerCase()] ?? classCode;
  const stripBase = {
    position: 'absolute',
    top: topOffset,
    height: cabinHeight,
    width: stripWidth,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  };
  const fontSize = Math.max(8, stripWidth * 0.55);
  const textStyle = {
    color: highlightColor,
    fontSize,
    fontWeight: '600',
    textAlign: 'center',
    // Width = cabinHeight so the rotated text spans the full strip height
    width: cabinHeight
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [stripBase, {
        left: 0,
        borderRightWidth: HIGHLIGHT_BORDER_WIDTH,
        borderRightColor: highlightColor
      }],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: [textStyle, {
          transform: [{
            rotate: '-90deg'
          }]
        }],
        numberOfLines: 1,
        children: classType
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [stripBase, {
        right: 0,
        borderLeftWidth: HIGHLIGHT_BORDER_WIDTH,
        borderLeftColor: highlightColor
      }],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: [textStyle, {
          transform: [{
            rotate: '90deg'
          }]
        }],
        numberOfLines: 1,
        children: classType
      })
    })]
  });
};
exports.CabinTitle = CabinTitle;
//# sourceMappingURL=CabinTitle.js.map