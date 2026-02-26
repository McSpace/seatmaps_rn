"use strict";

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Seat } from './Seat';
import { jsx as _jsx } from "react/jsx-runtime";
export const Row = ({
  row,
  scale = 1,
  selectedSeats = {},
  onSeatPress,
  style
}) => {
  return /*#__PURE__*/_jsx(View, {
    style: [styles.row, {
      height: row.height * scale
    }, style],
    children: row.seats.map(seat => /*#__PURE__*/_jsx(Seat, {
      seat: seat,
      scale: scale,
      isSelected: !!selectedSeats[seat.uniqId],
      onPress: onSeatPress
    }, seat.uniqId))
  });
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
//# sourceMappingURL=Row.js.map