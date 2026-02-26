"use strict";

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { SeatIcon } from './SeatIcon';
import { THEME_SEAT_LABEL_COLOR, THEME_NOT_AVAILABLE_SEATS_COLOR, ENTITY_STATUS_MAP } from '../core/constants';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_COLORS = {
  [ENTITY_STATUS_MAP.available]: '#4CAF50',
  [ENTITY_STATUS_MAP.selected]: '#1157ce',
  [ENTITY_STATUS_MAP.preferred]: '#8BC34A',
  [ENTITY_STATUS_MAP.extra]: '#FF9800',
  [ENTITY_STATUS_MAP.unavailable]: THEME_NOT_AVAILABLE_SEATS_COLOR,
  [ENTITY_STATUS_MAP.disabled]: 'transparent'
};
export const Seat = ({
  seat,
  scale = 1,
  isSelected,
  onPress,
  style
}) => {
  const {
    type,
    status,
    size,
    letter,
    number,
    color,
    seatType
  } = seat;
  const isInteractive = type === 'seat' && status !== ENTITY_STATUS_MAP.disabled;
  const fillColor = isSelected ? STATUS_COLORS[ENTITY_STATUS_MAP.selected] : color || STATUS_COLORS[status] || STATUS_COLORS[ENTITY_STATUS_MAP.available];
  const W = size.width * scale;
  const H = size.height * scale;
  if (type === 'aisle' || type === 'empty' || type === 'index') {
    return /*#__PURE__*/_jsx(TouchableOpacity, {
      style: [{
        width: W,
        height: H,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1 * scale
      }, style],
      disabled: true,
      activeOpacity: 1,
      children: type === 'index' && /*#__PURE__*/_jsx(Text, {
        style: [styles.label, {
          fontSize: 10 * scale
        }],
        numberOfLines: 1,
        children: letter
      })
    });
  }
  const opacity = status === ENTITY_STATUS_MAP.unavailable ? 0.6 : 1;
  return /*#__PURE__*/_jsxs(TouchableOpacity, {
    style: [{
      width: W,
      height: H,
      margin: 1 * scale,
      opacity
    }, style],
    onPress: isInteractive ? () => onPress?.(seat) : undefined,
    disabled: !isInteractive,
    activeOpacity: 0.75,
    children: [/*#__PURE__*/_jsx(SeatIcon, {
      seatType: seatType,
      fillColor: fillColor,
      width: W,
      height: H
    }), /*#__PURE__*/_jsxs(View, {
      style: [StyleSheet.absoluteFill, styles.labelContainer],
      children: [/*#__PURE__*/_jsx(Text, {
        style: [styles.label, {
          fontSize: Math.max(9, 11 * scale)
        }],
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        children: String(number || letter || '')
      }), !!seat.price && H > 30 && /*#__PURE__*/_jsx(Text, {
        style: [styles.price, {
          fontSize: Math.max(7, 8 * scale)
        }],
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        children: seat.price
      })]
    })]
  });
};
const styles = StyleSheet.create({
  label: {
    color: THEME_SEAT_LABEL_COLOR,
    fontWeight: '700',
    textAlign: 'center'
  },
  price: {
    color: THEME_SEAT_LABEL_COLOR,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.85
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '15%'
  }
});
//# sourceMappingURL=Seat.js.map