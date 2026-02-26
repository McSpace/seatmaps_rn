"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deck = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeSvg = require("react-native-svg");
var _Seat = require("./Seat");
var _bulkTemplates = require("../core/bulk-templates");
var _constants = require("../core/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HEADER_COLOR = '#546E7A';
const LEFT_ARROW_SVG = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#d00434" stroke="none"><path d="M635 922 c-115 -85 -269 -198 -341 -251 l-132 -96 344 -252 344 -252 0 129 0 129 95 -54 95 -54 0 354 0 354 -95 -54 -94 -53 -3 127 -3 127 -210 -154z"/></g></svg>';
const RIGHT_ARROW_SVG = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#d00434" stroke="none"><path d="M290 950 l0 -129 -95 54 -95 54 0 -354 0 -354 95 54 95 54 0 -129 0 -129 344 252 c334 245 343 252 322 268 -11 9 -166 122 -343 252 l-323 236 0 -129z"/></g></svg>';
const Deck = ({
  deck,
  exits = [],
  bulks = [],
  scale = 1,
  selectedSeats = {},
  onSeatPress,
  scrollViewRef
}) => {
  const deckContentWidth = deck.width * scale;
  const totalWidth = deckContentWidth;
  const totalHeight = deck.height * scale;
  const firstRow = deck.rows[0];
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
    ref: scrollViewRef,
    style: {
      width: totalWidth
    },
    showsVerticalScrollIndicator: false,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        width: totalWidth,
        height: totalHeight
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: deckContentWidth,
          height: totalHeight
        },
        children: [firstRow && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: {
            position: 'absolute',
            top: Math.max(0, (firstRow.topOffset - 50) * scale),
            flexDirection: 'row',
            alignItems: 'flex-end',
            height: 20 * scale
          },
          children: firstRow.seats.map(seat => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: {
              width: (seat.size.width + 2) * scale,
              alignItems: 'center',
              justifyContent: 'flex-end'
            },
            children: seat.type === 'seat' && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: {
                fontSize: 9 * scale,
                color: HEADER_COLOR,
                fontWeight: '600'
              },
              children: seat.letter
            })
          }, `hdr-${seat.uniqId}`))
        }), deck.rows.map(row => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: {
            position: 'absolute',
            top: row.topOffset * scale,
            flexDirection: 'row',
            height: row.height * scale,
            alignItems: 'center'
          },
          children: row.seats.map(seat => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Seat.Seat, {
            seat: seat,
            scale: scale,
            isSelected: !!selectedSeats[seat.uniqId],
            onPress: onSeatPress
          }, seat.uniqId))
        }, row.uniqId)), exits.map(exit => {
          const isLeft = exit.type === 'left';
          const arrowSize = 36 * scale;
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: [{
              position: 'absolute',
              top: exit.topOffset * scale,
              width: arrowSize,
              height: arrowSize,
              justifyContent: 'center',
              alignItems: 'center'
            }, isLeft ? {
              left: 0
            } : {
              right: 0
            }],
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSvg.SvgXml, {
              xml: isLeft ? LEFT_ARROW_SVG : RIGHT_ARROW_SVG,
              width: arrowSize,
              height: arrowSize
            })
          }, exit.uniqId);
        }), bulks.map(bulk => {
          const bWidth = bulk.width * 0.7 * scale;
          const bHeight = bulk.height * 0.7 * scale;
          let leftPos;
          if (bulk.align === 'left') {
            leftPos = 0;
          } else if (bulk.align === 'right') {
            leftPos = deckContentWidth - bWidth;
          } else {
            leftPos = (deckContentWidth - bWidth) / 2;
          }
          const bulkSvg = (0, _bulkTemplates.getBulkSvg)(bulk.id, _constants.THEME_BULK_BASE_COLOR, _constants.THEME_BULK_CUT_COLOR);
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: {
              position: 'absolute',
              top: bulk.topOffset * scale,
              left: leftPos,
              width: bWidth,
              height: bHeight,
              ...(bulk.align === 'right' ? {
                transform: [{
                  scaleX: -1
                }]
              } : {})
            },
            children: bulkSvg ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSvg.SvgXml, {
              xml: bulkSvg,
              width: bWidth,
              height: bHeight
            }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
              style: {
                width: bWidth,
                height: bHeight,
                backgroundColor: _constants.THEME_BULK_BASE_COLOR,
                borderRadius: 4
              }
            })
          }, bulk.uniqId);
        })]
      })
    })
  });
};
exports.Deck = Deck;
//# sourceMappingURL=Deck.js.map