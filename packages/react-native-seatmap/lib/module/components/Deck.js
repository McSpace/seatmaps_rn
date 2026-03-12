"use strict";

import React from 'react';
import { View, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Seat } from './Seat';
import { CabinTitle } from './CabinTitle';
import { Nose } from './Nose';
import { Tail } from './Tail';
import { getBulkSvg } from '../core/bulk-templates';
import { getStickerSvg } from '../core/sticker-templates';
import { THEME_BULK_BASE_COLOR, THEME_BULK_CUT_COLOR, THEME_BULK_ICON_COLOR, THEME_FLOOR_COLOR, THEME_FUSELAGE_OUTLINE_WIDTH, THEME_FUSELAGE_OUTLINE_COLOR, THEME_CABIN_TITLES_WIDTH } from '../core/constants';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Bulk scaling coefficients — matches JetsBulk.js in the web lib
const DEFAULT_SCALE_BULK_COEFF = 0.7;
const SCALE_TO_BULK_COEFF_MAP = {
  26: 1,
  27: 1,
  28: 1
};
const LEFT_ARROW_SVG = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#FF3333" stroke="none"><path d="M635 922 c-115 -85 -269 -198 -341 -251 l-132 -96 344 -252 344 -252 0 129 0 129 95 -54 95 -54 0 354 0 354 -95 -54 -94 -53 -3 127 -3 127 -210 -154z"/></g></svg>';
const RIGHT_ARROW_SVG = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#FF3333" stroke="none"><path d="M290 950 l0 -129 -95 54 -95 54 0 -354 0 -354 95 54 95 54 0 -129 0 -129 344 252 c334 245 343 252 322 268 -11 9 -166 122 -343 252 l-323 236 0 -129z"/></g></svg>';
const _deckLogged = new Set();
export const Deck = ({
  deck,
  exits = [],
  bulks = [],
  scale = 1,
  selectedSeats = {},
  onSeatPress,
  scrollViewRef,
  visibleFuselage = false,
  visibleCabinTitles = false,
  noseType = 'default',
  passengersByLabel
}) => {
  const deckContentWidth = deck.width * scale;
  const totalWidth = deckContentWidth;
  const totalHeight = deck.height * scale;

  // Compute the horizontal offset so rows are centered within the deck width
  const maxRowWidth = deck.rows.length > 0 ? Math.max(...deck.rows.map(r => r.width)) : 0;
  const contentOffset = (deckContentWidth - maxRowWidth * scale) / 2;

  // Horizontal zones (in scaled pixels)
  const cabinTitleScaledWidth = visibleCabinTitles ? THEME_CABIN_TITLES_WIDTH * scale : 0;
  const fuselageScaledWidth = THEME_FUSELAGE_OUTLINE_WIDTH * scale;

  // ── DEBUG ────────────────────────────────────────────────────────────────
  if (!_deckLogged.has(deck.uniqId)) {
    _deckLogged.add(deck.uniqId);
    console.log(`[Deck] id=${deck.uniqId} deck.width=${deck.width} deck.height=${deck.height} scale=${scale.toFixed(3)}`);
    console.log(`[Deck] deckContentWidth=${deckContentWidth.toFixed(1)} maxRowWidth=${maxRowWidth} contentOffset=${contentOffset.toFixed(1)}`);

    // Log all rows with per-seat absolute bounds
    for (const row of deck.rows) {
      const rowBottom = (row.topOffset + row.height) * scale;
      console.log(`[Row] #${row.number ?? '?'} top=${row.topOffset} h=${row.height} w=${row.width} → scaled top=${(row.topOffset * scale).toFixed(1)} bottom=${rowBottom.toFixed(1)}`);
      for (const s of row.seats) {
        if (s.type !== 'seat') continue;
        const sTop = row.topOffset + (s.topOffset ?? 0);
        const sBottom = sTop + s.size.height;
        console.log(`  [Seat] #${row.number}${s.letter} seatType=${s.seatType} topOffset=${s.topOffset ?? 0} size=${s.size.width}x${s.size.height} → abs raw [${sTop}, ${sBottom}] scaled [${(sTop * scale).toFixed(1)}, ${(sBottom * scale).toFixed(1)}]`);
      }
    }

    // Log all bulks: id, align, topOffset, height, width + computed render pos
    for (const bulk of bulks) {
      const bW = bulk.width * 0.7 * scale;
      const bH = bulk.height * 0.7 * scale;
      let lp;
      if (bulk.align === 'left') lp = contentOffset;else if (bulk.align === 'right') lp = deckContentWidth - contentOffset - bW;else lp = (deckContentWidth - bW) / 2;
      const scaledTop = bulk.topOffset * scale;
      const scaledBottom = scaledTop + bH;
      console.log(`[Bulk] id=${bulk.id} align=${bulk.align} raw(top=${bulk.topOffset} h=${bulk.height} w=${bulk.width}) → rendered left=${lp.toFixed(1)} top=${scaledTop.toFixed(1)} w=${bW.toFixed(1)} h=${bH.toFixed(1)} bottom=${scaledBottom.toFixed(1)}`);
    }

    // Log all exits
    for (const exit of exits) {
      console.log(`[Exit] type=${exit.type} top=${exit.topOffset} → scaled=${(exit.topOffset * scale).toFixed(1)}`);
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // First-in-cabin rows for CabinTitle rendering
  const cabinFirstRows = visibleCabinTitles ? deck.rows.filter(row => row.isFirstInCabin) : [];
  return /*#__PURE__*/_jsxs(ScrollView, {
    ref: scrollViewRef,
    style: {
      width: totalWidth
    },
    showsVerticalScrollIndicator: false,
    children: [visibleFuselage && /*#__PURE__*/_jsx(Nose, {
      width: deckContentWidth,
      noseType: noseType
    }), /*#__PURE__*/_jsxs(View, {
      style: {
        width: totalWidth,
        height: totalHeight
      },
      children: [/*#__PURE__*/_jsx(View, {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: deckContentWidth,
          height: totalHeight,
          backgroundColor: THEME_FLOOR_COLOR
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          position: 'absolute',
          left: cabinTitleScaledWidth,
          top: 0,
          width: fuselageScaledWidth,
          height: totalHeight,
          backgroundColor: THEME_FUSELAGE_OUTLINE_COLOR
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          position: 'absolute',
          right: cabinTitleScaledWidth,
          top: 0,
          width: fuselageScaledWidth,
          height: totalHeight,
          backgroundColor: THEME_FUSELAGE_OUTLINE_COLOR
        }
      }), cabinFirstRows.map(row => /*#__PURE__*/_jsx(CabinTitle, {
        classCode: row.classCode,
        topOffset: row.topOffset * scale,
        cabinHeight: (row.cabinHeight ?? row.height) * scale,
        stripWidth: cabinTitleScaledWidth
      }, `cabin-title-${row.uniqId}`)), /*#__PURE__*/_jsxs(View, {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: deckContentWidth,
          height: totalHeight
        },
        children: [deck.rows.map(row => {
          const rowLeft = (deckContentWidth - row.width * scale) / 2;
          return /*#__PURE__*/_jsx(View, {
            style: {
              position: 'absolute',
              top: row.topOffset * scale,
              left: rowLeft,
              flexDirection: 'row',
              height: row.height * scale,
              alignItems: 'flex-start'
            },
            children: row.seats.map(seat => /*#__PURE__*/_jsx(Seat, {
              seat: seat,
              scale: scale,
              isSelected: !!selectedSeats[seat.uniqId],
              onPress: onSeatPress,
              style: {
                marginTop: (seat.topOffset ?? 0) * scale
              },
              passenger: seat.type === 'seat' ? passengersByLabel?.[seat.number] : undefined
            }, seat.uniqId))
          }, row.uniqId);
        }), exits.map(exit => {
          const isLeft = exit.type === 'left';
          const arrowWidth = contentOffset;
          const arrowHeight = 40 * scale;
          return /*#__PURE__*/_jsx(View, {
            style: [{
              position: 'absolute',
              top: exit.topOffset * scale,
              width: arrowWidth,
              height: arrowHeight,
              justifyContent: 'center',
              alignItems: 'center'
            }, isLeft ? {
              left: cabinTitleScaledWidth + fuselageScaledWidth
            } : {
              right: cabinTitleScaledWidth + fuselageScaledWidth
            }],
            children: /*#__PURE__*/_jsx(SvgXml, {
              xml: isLeft ? LEFT_ARROW_SVG : RIGHT_ARROW_SVG,
              width: arrowWidth,
              height: arrowHeight
            })
          }, exit.uniqId);
        }), bulks.map(bulk => {
          const bulkId = parseInt(bulk.id, 10);
          const scaleBulkCoeff = SCALE_TO_BULK_COEFF_MAP[bulkId] ?? DEFAULT_SCALE_BULK_COEFF;
          const bWidth = Math.floor(bulk.width * scaleBulkCoeff) * scale;
          const bHeight = Math.floor(bulk.height * scaleBulkCoeff) * scale;
          let leftPos;
          if (bulk.align === 'left') {
            leftPos = contentOffset;
          } else if (bulk.align === 'right') {
            leftPos = deckContentWidth - contentOffset - bWidth;
          } else {
            leftPos = (deckContentWidth - bWidth) / 2;
          }
          const bulkSvg = getBulkSvg(bulk.id, THEME_BULK_BASE_COLOR, THEME_BULK_CUT_COLOR);
          const stickerSvg = bulk.iconType ? getStickerSvg(bulk.iconType, THEME_BULK_ICON_COLOR) : null;
          return /*#__PURE__*/_jsxs(View, {
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
            children: [bulkSvg && /*#__PURE__*/_jsx(SvgXml, {
              xml: bulkSvg,
              width: bWidth,
              height: bHeight
            }), stickerSvg && /*#__PURE__*/_jsx(View, {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center'
              },
              children: /*#__PURE__*/_jsx(SvgXml, {
                xml: stickerSvg,
                width: bWidth * 0.65,
                height: bHeight * 0.65
              })
            })]
          }, bulk.uniqId);
        })]
      })]
    }), visibleFuselage && /*#__PURE__*/_jsx(Tail, {
      width: deckContentWidth
    })]
  });
};
//# sourceMappingURL=Deck.js.map