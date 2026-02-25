import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Seat } from './Seat';
import type { PreparedRow, PreparedSeat } from '../types';

interface RowProps {
  row: PreparedRow;
  scale?: number;
  selectedSeats?: Record<string, PreparedSeat>;
  onSeatPress?: (seat: PreparedSeat) => void;
  style?: ViewStyle;
}

export const Row: React.FC<RowProps> = ({
  row,
  scale = 1,
  selectedSeats = {},
  onSeatPress,
  style,
}) => {
  return (
    <View style={[styles.row, { height: row.height * scale }, style]}>
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
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
