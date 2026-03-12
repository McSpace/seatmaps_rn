import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from 'react-native';
import type { PreparedSeat } from '../types';
import { SeatIcon } from './SeatIcon';
import {
  THEME_SEAT_LABEL_COLOR,
  THEME_NOT_AVAILABLE_SEATS_COLOR,
  ENTITY_STATUS_MAP,
} from '../core/constants';

interface SeatProps {
  seat: PreparedSeat;
  scale?: number;
  isSelected?: boolean;
  onPress?: (seat: PreparedSeat) => void;
  style?: ViewStyle;
}

const STATUS_COLORS: Record<string, string> = {
  [ENTITY_STATUS_MAP.available]: '#4CAF50',
  [ENTITY_STATUS_MAP.selected]: '#1157ce',
  [ENTITY_STATUS_MAP.preferred]: '#8BC34A',
  [ENTITY_STATUS_MAP.extra]: '#FF9800',
  [ENTITY_STATUS_MAP.unavailable]: THEME_NOT_AVAILABLE_SEATS_COLOR,
  [ENTITY_STATUS_MAP.disabled]: 'transparent',
};

interface LabelZone {
  /** top edge of label box as fraction of icon height */
  topFrac: number;
  /** height of label box as fraction of icon height */
  heightFrac: number;
  /** left margin as fraction of icon WIDTH (aligns label with seat body) */
  leftFrac: number;
  /** right margin as fraction of icon WIDTH */
  rightFrac: number;
  /** base font size multiplier against icon WIDTH */
  fontMult: number;
}

/**
 * Returns the label zone for a given seatType string.
 *
 * seatType format: 'B-1', 'E-2', 'B-10', 'B-12' … (matches getSeatSvg split('-'))
 * Parsing MUST use the full numeric part after '-', NOT slice(-1), to handle
 * two-digit types like 10, 11, 12, 13 correctly.
 *
 * Horizontal margins (leftFrac/rightFrac) are needed when the seat body
 * occupies only a portion of the total icon width (types 10-13 include a
 * partition/divider panel alongside the seat).
 */
function getLabelZone(seatType?: string): LabelZone {
  const parts = seatType?.split('-') ?? [];
  const svgNum = parts[1] ? parseInt(parts[1], 10) : NaN;
  const classChar = (parts[0]?.[0] ?? 'E').toUpperCase();

  if (!isNaN(svgNum) && svgNum > 4) {
    switch (svgNum) {
      case 5:
      case 6:
        // Diagonal herringbone 200×200, seat-back x≈13-91%, y≈1-74%, center (52%,37%)
        return { topFrac: 0.16, heightFrac: 0.42, leftFrac: 0.10, rightFrac: 0.05, fontMult: 0.22 };
      case 7:
        // Tall upright 140×200, back y=9–49%
        return { topFrac: 0.07, heightFrac: 0.46, leftFrac: 0, rightFrac: 0, fontMult: 0.25 };
      case 22:
      case 23:
        // 200×400 flatbed first class suite
        // Main seat cushion y=211.9-309.5 (53-77%), seat back y=309.5-362.6 (77-91%)
        // Seat body x=32.7-165.2 (16-83%)
        return { topFrac: 0.53, heightFrac: 0.38, leftFrac: 0.16, rightFrac: 0.17, fontMult: 0.22 };
      case 26:
        // 200×200 herringbone, seat back x=9.9-133.6 (5-67%), y=50-111 (25-56%)
        return { topFrac: 0.25, heightFrac: 0.31, leftFrac: 0.04, rightFrac: 0.33, fontMult: 0.22 };
      case 27:
        // Mirrored type 26: seat back x=66.4-190 (33-95%)
        return { topFrac: 0.25, heightFrac: 0.31, leftFrac: 0.33, rightFrac: 0.04, fontMult: 0.22 };
      case 34:
        // 200×200 diagonal mirrored, fillColor y=46-188 (23-94%)
        return { topFrac: 0.22, heightFrac: 0.52, leftFrac: 0.27, rightFrac: 0.12, fontMult: 0.22 };
      case 35:
        // 200×200 diagonal base orientation
        return { topFrac: 0.22, heightFrac: 0.52, leftFrac: 0.12, rightFrac: 0.27, fontMult: 0.22 };
      case 10:
        // 200×150, seat back x=81-178 (40-89%), y=2-93 (1-62%), center (65%, 32%)
        return { topFrac: 0.02, heightFrac: 0.60, leftFrac: 0.38, rightFrac: 0.08, fontMult: 0.22 };
      case 11:
        // Mirrored type 10: seat back x=22-119 (11-60%), y same
        return { topFrac: 0.02, heightFrac: 0.60, leftFrac: 0.08, rightFrac: 0.38, fontMult: 0.22 };
      case 12:
        // 200×185, seat back x=4-88 (2-44%), y=27-97 (15-52%), center (23%, 34%)
        return { topFrac: 0.14, heightFrac: 0.38, leftFrac: 0.02, rightFrac: 0.54, fontMult: 0.22 };
      case 13:
        // Mirrored type 12: seat back x=112-195 (56-98%), y same
        return { topFrac: 0.14, heightFrac: 0.38, leftFrac: 0.54, rightFrac: 0.02, fontMult: 0.22 };
      default:
        // types 8-9: recline/flat-bed, back y=7.5–57.5%
        return { topFrac: 0.05, heightFrac: 0.55, leftFrac: 0, rightFrac: 0, fontMult: 0.25 };
    }
  }

  // Standard upright seats (svgNum 1–4 or no numeric suffix)
  if (classChar === 'B') {
    // B-1 upright: 150×150 viewBox, back y=9.2–59.6%, center≈34%
    return { topFrac: 0.09, heightFrac: 0.50, leftFrac: 0, rightFrac: 0, fontMult: 0.22 };
  }
  if (classChar === 'F') {
    return { topFrac: 0.05, heightFrac: 0.48, leftFrac: 0, rightFrac: 0, fontMult: 0.20 };
  }
  // Economy / premium economy: back at ~0–64%
  return { topFrac: 0.02, heightFrac: 0.50, leftFrac: 0, rightFrac: 0, fontMult: 0.38 };
}

const _loggedTypes = new Set<string>();

export const Seat: React.FC<SeatProps> = ({ seat, scale = 1, isSelected, onPress, style }) => {
  const { type, status, size, letter, number, color, seatType } = seat;

  // DEBUG: log unique seatType values with their dimensions
  if (type === 'seat' && seatType && !_loggedTypes.has(seatType)) {
    _loggedTypes.add(seatType);
    console.log(`[Seat] seatType="${seatType}" size=${size.width}x${size.height} number=${number}`);
  }

  const isInteractive = type === 'seat' && status !== ENTITY_STATUS_MAP.disabled;

  const fillColor = isSelected
    ? STATUS_COLORS[ENTITY_STATUS_MAP.selected]
    : color || STATUS_COLORS[status] || STATUS_COLORS[ENTITY_STATUS_MAP.available];

  const W = size.width * scale;
  const H = size.height * scale;

  if (type === 'aisle' || type === 'empty' || type === 'index') {
    return (
      <TouchableOpacity
        style={[{ width: W, height: H, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', margin: 1 * scale }, style]}
        disabled
        activeOpacity={1}
      >
        {type === 'index' && (
          <Text style={[styles.label, { fontSize: 10 * scale }]} numberOfLines={1}>
            {letter}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  const opacity = status === ENTITY_STATUS_MAP.unavailable ? 0.6 : 1;
  const { topFrac, heightFrac, leftFrac, rightFrac, fontMult } = getLabelZone(seatType);

  return (
    <TouchableOpacity
      style={[{ width: W, height: H, margin: 1 * scale, opacity }, style]}
      onPress={isInteractive ? () => onPress?.(seat) : undefined}
      disabled={!isInteractive}
      activeOpacity={0.75}
    >
      <SeatIcon seatType={seatType} fillColor={fillColor} width={W} height={H} />
      <View
        style={{
          position: 'absolute',
          top: H * topFrac,
          left: W * leftFrac,
          right: W * rightFrac,
          height: H * heightFrac,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={[styles.label, { fontSize: Math.max(7, W * fontMult) }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {String(number || letter || '')}
        </Text>
        {!!seat.price && H > 40 && (
          <Text
            style={[styles.price, { fontSize: Math.max(5, W * fontMult * 0.65) }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {seat.price}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    color: THEME_SEAT_LABEL_COLOR,
    fontWeight: '700',
    textAlign: 'center',
  },
  price: {
    color: THEME_SEAT_LABEL_COLOR,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.85,
  },
});
