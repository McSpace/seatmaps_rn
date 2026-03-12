import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Seat } from './Seat';
import { CabinTitle } from './CabinTitle';
import { Nose } from './Nose';
import { Tail } from './Tail';
import { getBulkSvg } from '../core/bulk-templates';
import { getStickerSvg } from '../core/sticker-templates';
import {
  THEME_BULK_BASE_COLOR,
  THEME_BULK_CUT_COLOR,
  THEME_BULK_ICON_COLOR,
  THEME_FLOOR_COLOR,
  THEME_FUSELAGE_OUTLINE_WIDTH,
  THEME_FUSELAGE_OUTLINE_COLOR,
  THEME_CABIN_TITLES_WIDTH,
} from '../core/constants';
import type { PreparedDeck, PreparedSeat } from '../types';

const HEADER_COLOR = 'rgba(180, 210, 240, 0.9)';

// Bulk scaling coefficients — matches JetsBulk.js in the web lib
const DEFAULT_SCALE_BULK_COEFF = 0.7;
const SCALE_TO_BULK_COEFF_MAP: Record<number, number> = { 26: 1, 27: 1, 28: 1 };

const LEFT_ARROW_SVG =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#FF3333" stroke="none"><path d="M635 922 c-115 -85 -269 -198 -341 -251 l-132 -96 344 -252 344 -252 0 129 0 129 95 -54 95 -54 0 354 0 354 -95 -54 -94 -53 -3 127 -3 127 -210 -154z"/></g></svg>';

const RIGHT_ARROW_SVG =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#FF3333" stroke="none"><path d="M290 950 l0 -129 -95 54 -95 54 0 -354 0 -354 95 54 95 54 0 -129 0 -129 344 252 c334 245 343 252 322 268 -11 9 -166 122 -343 252 l-323 236 0 -129z"/></g></svg>';

interface ExitData {
  uniqId: string;
  type: 'left' | 'right';
  topOffset: number;
}

interface BulkData {
  uniqId: string;
  id: string;
  align: 'left' | 'right' | 'center';
  topOffset: number;
  width: number;
  height: number;
  iconType?: string;
}

interface DeckProps {
  deck: PreparedDeck;
  exits?: ExitData[];
  bulks?: BulkData[];
  scale?: number;
  selectedSeats?: Record<string, PreparedSeat>;
  onSeatPress?: (seat: PreparedSeat) => void;
  /** Ref forwarded to the inner ScrollView for programmatic scrolling */
  scrollViewRef?: React.RefObject<ScrollView | null>;
  /** Show nose/tail SVG fuselage caps */
  visibleFuselage?: boolean;
  /** Show cabin class title strips on the sides */
  visibleCabinTitles?: boolean;
  /** Aircraft nose type key, e.g. 'B787', 'A320' (falls back to 'default') */
  noseType?: string;
}

const _deckLogged = new Set<string>();

export const Deck: React.FC<DeckProps> = ({
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
}) => {
  const deckContentWidth = deck.width * scale;
  const totalWidth = deckContentWidth;
  const totalHeight = deck.height * scale;
  const firstRow = deck.rows[0];

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
      console.log(`[Row] #${row.number ?? '?'} top=${row.topOffset} h=${row.height} w=${row.width} → scaled top=${(row.topOffset*scale).toFixed(1)} bottom=${rowBottom.toFixed(1)}`);
      for (const s of row.seats) {
        if (s.type !== 'seat') continue;
        const sTop = row.topOffset + (s.topOffset ?? 0);
        const sBottom = sTop + s.size.height;
        console.log(`  [Seat] #${row.number}${s.letter} seatType=${s.seatType} topOffset=${s.topOffset ?? 0} size=${s.size.width}x${s.size.height} → abs raw [${sTop}, ${sBottom}] scaled [${(sTop*scale).toFixed(1)}, ${(sBottom*scale).toFixed(1)}]`);
      }
    }

    // Log all bulks: id, align, topOffset, height, width + computed render pos
    for (const bulk of bulks) {
      const bW = bulk.width * 0.7 * scale;
      const bH = bulk.height * 0.7 * scale;
      let lp: number;
      if (bulk.align === 'left') lp = contentOffset;
      else if (bulk.align === 'right') lp = deckContentWidth - contentOffset - bW;
      else lp = (deckContentWidth - bW) / 2;
      const scaledTop = bulk.topOffset * scale;
      const scaledBottom = scaledTop + bH;
      console.log(`[Bulk] id=${bulk.id} align=${bulk.align} raw(top=${bulk.topOffset} h=${bulk.height} w=${bulk.width}) → rendered left=${lp.toFixed(1)} top=${scaledTop.toFixed(1)} w=${bW.toFixed(1)} h=${bH.toFixed(1)} bottom=${scaledBottom.toFixed(1)}`);
    }

    // Log all exits
    for (const exit of exits) {
      console.log(`[Exit] type=${exit.type} top=${exit.topOffset} → scaled=${(exit.topOffset*scale).toFixed(1)}`);
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // First-in-cabin rows for CabinTitle rendering
  const cabinFirstRows = visibleCabinTitles
    ? deck.rows.filter(row => row.isFirstInCabin)
    : [];

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ width: totalWidth }}
      showsVerticalScrollIndicator={false}
    >
      {/* Nose */}
      {visibleFuselage && <Nose width={deckContentWidth} noseType={noseType} />}

      <View style={{ width: totalWidth, height: totalHeight }}>

        {/* Floor background */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: deckContentWidth,
            height: totalHeight,
            backgroundColor: THEME_FLOOR_COLOR,
          }}
        />

        {/* Left fuselage wall */}
        <View
          style={{
            position: 'absolute',
            left: cabinTitleScaledWidth,
            top: 0,
            width: fuselageScaledWidth,
            height: totalHeight,
            backgroundColor: THEME_FUSELAGE_OUTLINE_COLOR,
          }}
        />

        {/* Right fuselage wall */}
        <View
          style={{
            position: 'absolute',
            right: cabinTitleScaledWidth,
            top: 0,
            width: fuselageScaledWidth,
            height: totalHeight,
            backgroundColor: THEME_FUSELAGE_OUTLINE_COLOR,
          }}
        />

        {/* Cabin title strips */}
        {cabinFirstRows.map(row => (
          <CabinTitle
            key={`cabin-title-${row.uniqId}`}
            classCode={row.classCode}
            topOffset={row.topOffset * scale}
            cabinHeight={(row.cabinHeight ?? row.height) * scale}
            stripWidth={cabinTitleScaledWidth}
          />
        ))}

        {/* Deck content */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: deckContentWidth,
            height: totalHeight,
          }}
        >
          {/* Letter header — derived from first row */}
          {firstRow && (
            <View
              style={{
                position: 'absolute',
                top: Math.max(0, (firstRow.topOffset - 50) * scale),
                left: contentOffset,
                flexDirection: 'row',
                alignItems: 'flex-end',
                height: 20 * scale,
              }}
            >
              {firstRow.seats.map(seat => (
                <View
                  key={`hdr-${seat.uniqId}`}
                  style={{
                    width: (seat.size.width + 2) * scale,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {seat.type === 'seat' && (
                    <Text
                      style={{
                        fontSize: 9 * scale,
                        color: HEADER_COLOR,
                        fontWeight: '600',
                      }}
                    >
                      {seat.letter}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Rows — rendered first (web lib z-order: rows → exits → bulks) */}
          {deck.rows.map(row => {
            const rowLeft = (deckContentWidth - row.width * scale) / 2;
            return (
            <View
              key={row.uniqId}
              style={{
                position: 'absolute',
                top: row.topOffset * scale,
                left: rowLeft,
                flexDirection: 'row',
                height: row.height * scale,
                alignItems: 'flex-start',
              }}
            >
              {row.seats.map(seat => (
                <Seat
                  key={seat.uniqId}
                  seat={seat}
                  scale={scale}
                  isSelected={!!selectedSeats[seat.uniqId]}
                  onPress={onSeatPress}
                  style={{ marginTop: (seat.topOffset ?? 0) * scale }}
                />
              ))}
            </View>
            );
          })}

          {/* Exit markers */}
          {exits.map(exit => {
            const isLeft = exit.type === 'left';
            const arrowWidth = contentOffset;
            const arrowHeight = 40 * scale;
            return (
              <View
                key={exit.uniqId}
                style={[
                  {
                    position: 'absolute',
                    top: exit.topOffset * scale,
                    width: arrowWidth,
                    height: arrowHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  isLeft
                    ? { left: cabinTitleScaledWidth + fuselageScaledWidth }
                    : { right: cabinTitleScaledWidth + fuselageScaledWidth },
                ]}
              >
                <SvgXml
                  xml={isLeft ? LEFT_ARROW_SVG : RIGHT_ARROW_SVG}
                  width={arrowWidth}
                  height={arrowHeight}
                />
              </View>
            );
          })}

          {/* Bulk markers — rendered last so they appear on top of rows (matches web lib z-order) */}
          {bulks.map(bulk => {
            const bulkId = parseInt(bulk.id, 10);
            const scaleBulkCoeff = SCALE_TO_BULK_COEFF_MAP[bulkId] ?? DEFAULT_SCALE_BULK_COEFF;
            const bWidth = Math.floor(bulk.width * scaleBulkCoeff) * scale;
            const bHeight = Math.floor(bulk.height * scaleBulkCoeff) * scale;
            let leftPos: number;
            if (bulk.align === 'left') {
              leftPos = contentOffset;
            } else if (bulk.align === 'right') {
              leftPos = deckContentWidth - contentOffset - bWidth;
            } else {
              leftPos = (deckContentWidth - bWidth) / 2;
            }
            const bulkSvg = getBulkSvg(bulk.id, THEME_BULK_BASE_COLOR, THEME_BULK_CUT_COLOR);
            const stickerSvg = bulk.iconType
              ? getStickerSvg(bulk.iconType, THEME_BULK_ICON_COLOR)
              : null;
            return (
              <View
                key={bulk.uniqId}
                style={{
                  position: 'absolute',
                  top: bulk.topOffset * scale,
                  left: leftPos,
                  width: bWidth,
                  height: bHeight,
                  ...(bulk.align === 'right' ? { transform: [{ scaleX: -1 }] } : {}),
                }}
              >
                {bulkSvg && (
                  <SvgXml xml={bulkSvg} width={bWidth} height={bHeight} />
                )}
                {stickerSvg && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <SvgXml xml={stickerSvg} width={bWidth * 0.65} height={bHeight * 0.65} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Tail */}
      {visibleFuselage && <Tail width={deckContentWidth} />}
    </ScrollView>
  );
};
