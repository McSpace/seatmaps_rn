import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Seat } from './Seat';
import { getBulkSvg } from '../core/bulk-templates';
import { THEME_BULK_BASE_COLOR, THEME_BULK_CUT_COLOR } from '../core/constants';
import type { PreparedDeck, PreparedSeat } from '../types';

const HEADER_COLOR = '#546E7A';

const LEFT_ARROW_SVG =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#d00434" stroke="none"><path d="M635 922 c-115 -85 -269 -198 -341 -251 l-132 -96 344 -252 344 -252 0 129 0 129 95 -54 95 -54 0 354 0 354 -95 -54 -94 -53 -3 127 -3 127 -210 -154z"/></g></svg>';

const RIGHT_ARROW_SVG =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#d00434" stroke="none"><path d="M290 950 l0 -129 -95 54 -95 54 0 -354 0 -354 95 54 95 54 0 -129 0 -129 344 252 c334 245 343 252 322 268 -11 9 -166 122 -343 252 l-323 236 0 -129z"/></g></svg>';

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
}

interface DeckProps {
  deck: PreparedDeck;
  exits?: ExitData[];
  bulks?: BulkData[];
  scale?: number;
  selectedSeats?: Record<string, PreparedSeat>;
  onSeatPress?: (seat: PreparedSeat) => void;
}

export const Deck: React.FC<DeckProps> = ({
  deck,
  exits = [],
  bulks = [],
  scale = 1,
  selectedSeats = {},
  onSeatPress,
}) => {
  const deckContentWidth = deck.width * scale;
  const totalWidth = deckContentWidth;
  const totalHeight = deck.height * scale;
  const firstRow = deck.rows[0];

  return (
    <ScrollView
      style={{ width: totalWidth }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width: totalWidth, height: totalHeight }}>

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

          {/* Rows — absolutely positioned by topOffset */}
          {deck.rows.map(row => (
            <View
              key={row.uniqId}
              style={{
                position: 'absolute',
                top: row.topOffset * scale,
                flexDirection: 'row',
                height: row.height * scale,
                alignItems: 'center',
              }}
            >
              {row.seats.map(seat => (
                <Seat
                  key={seat.uniqId}
                  seat={seat}
                  scale={scale}
                  isSelected={!!selectedSeats[seat.uniqId]}
                  onPress={onSeatPress}
                />
              ))}
            </View>
          ))}

          {/* Exit markers */}
          {exits.map(exit => {
            const isLeft = exit.type === 'left';
            const arrowSize = 36 * scale;
            return (
              <View
                key={exit.uniqId}
                style={[
                  {
                    position: 'absolute',
                    top: exit.topOffset * scale,
                    width: arrowSize,
                    height: arrowSize,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  isLeft ? { left: 0 } : { right: 0 },
                ]}
              >
                <SvgXml
                  xml={isLeft ? LEFT_ARROW_SVG : RIGHT_ARROW_SVG}
                  width={arrowSize}
                  height={arrowSize}
                />
              </View>
            );
          })}

          {/* Bulk markers */}
          {bulks.map(bulk => {
            const bWidth = bulk.width * 0.7 * scale;
            const bHeight = bulk.height * 0.7 * scale;
            let leftPos: number;
            if (bulk.align === 'left') {
              leftPos = 0;
            } else if (bulk.align === 'right') {
              leftPos = deckContentWidth - bWidth;
            } else {
              leftPos = (deckContentWidth - bWidth) / 2;
            }
            const bulkSvg = getBulkSvg(bulk.id, THEME_BULK_BASE_COLOR, THEME_BULK_CUT_COLOR);
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
                {bulkSvg ? (
                  <SvgXml xml={bulkSvg} width={bWidth} height={bHeight} />
                ) : (
                  <View
                    style={{
                      width: bWidth,
                      height: bHeight,
                      backgroundColor: THEME_BULK_BASE_COLOR,
                      borderRadius: 4,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
