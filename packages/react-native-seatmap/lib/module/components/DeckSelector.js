"use strict";

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { THEME_DECK_SELECTOR_FILL_COLOR, THEME_DECK_SELECTOR_STROKE_COLOR, THEME_DEFAULT_PASSENGER_BADGE_COLOR } from '../core/constants';
import { jsx as _jsx } from "react/jsx-runtime";
export const DeckSelector = ({
  decks,
  activeDeckIndex,
  onDeckChange,
  lang = 'EN',
  style
}) => {
  if (decks.length <= 1) return null;
  return /*#__PURE__*/_jsx(View, {
    style: [styles.container, style],
    children: decks.map((deck, index) => {
      const isActive = index === activeDeckIndex;
      return /*#__PURE__*/_jsx(TouchableOpacity, {
        style: [styles.button, isActive && styles.buttonActive],
        onPress: () => onDeckChange(index),
        activeOpacity: 0.7,
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.label, isActive && styles.labelActive],
          children: deck.number
        })
      }, deck.uniqId);
    })
  });
};
const styles = StyleSheet.create({
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
    backgroundColor: THEME_DECK_SELECTOR_FILL_COLOR,
    borderWidth: 1,
    borderColor: THEME_DECK_SELECTOR_STROKE_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonActive: {
    backgroundColor: THEME_DEFAULT_PASSENGER_BADGE_COLOR,
    borderColor: THEME_DEFAULT_PASSENGER_BADGE_COLOR
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