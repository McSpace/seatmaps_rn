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

export const Seat: React.FC<SeatProps> = ({ seat, scale = 1, isSelected, onPress, style }) => {
  const { type, status, size, letter, number, color, seatType } = seat;

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

  return (
    <TouchableOpacity
      style={[{ width: W, height: H, margin: 1 * scale, opacity }, style]}
      onPress={isInteractive ? () => onPress?.(seat) : undefined}
      disabled={!isInteractive}
      activeOpacity={0.75}
    >
      <SeatIcon seatType={seatType} fillColor={fillColor} width={W} height={H} />
      <View style={[StyleSheet.absoluteFill, styles.labelContainer]}>
        <Text
          style={[styles.label, { fontSize: Math.max(9, 11 * scale) }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {String(number || letter || '')}
        </Text>
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
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '15%',
  },
});
