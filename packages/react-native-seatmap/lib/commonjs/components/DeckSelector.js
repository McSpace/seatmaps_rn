"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeckSelector = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _constants = require("../core/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DeckSelector = ({
  decks,
  activeDeckIndex,
  onDeckChange,
  lang = 'EN',
  style
}) => {
  if (decks.length <= 1) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [styles.container, style],
    children: decks.map((deck, index) => {
      const isActive = index === activeDeckIndex;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
        style: [styles.button, isActive && styles.buttonActive],
        onPress: () => onDeckChange(index),
        activeOpacity: 0.7,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: [styles.label, isActive && styles.labelActive],
          children: deck.number
        })
      }, deck.uniqId);
    })
  });
};
exports.DeckSelector = DeckSelector;
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 8
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: _constants.THEME_DECK_SELECTOR_FILL_COLOR,
    borderWidth: 1,
    borderColor: _constants.THEME_DECK_SELECTOR_STROKE_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonActive: {
    backgroundColor: _constants.THEME_DEFAULT_PASSENGER_BADGE_COLOR,
    borderColor: _constants.THEME_DEFAULT_PASSENGER_BADGE_COLOR
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  labelActive: {
    color: '#fff'
  }
});
//# sourceMappingURL=DeckSelector.js.map