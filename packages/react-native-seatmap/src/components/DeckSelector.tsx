import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import type { PreparedDeck } from '../types';
import {
  THEME_DECK_SELECTOR_FILL_COLOR,
  THEME_DECK_SELECTOR_STROKE_COLOR,
  THEME_DEFAULT_PASSENGER_BADGE_COLOR,
} from '../core/constants';

interface DeckSelectorProps {
  decks: PreparedDeck[];
  activeDeckIndex: number;
  onDeckChange: (index: number) => void;
  lang?: string;
  style?: ViewStyle;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({
  decks,
  activeDeckIndex,
  onDeckChange,
  lang = 'EN',
  style,
}) => {
  if (decks.length <= 1) return null;

  return (
    <View style={[styles.container, style]}>
      {decks.map((deck, index) => {
        const isActive = index === activeDeckIndex;
        return (
          <TouchableOpacity
            key={deck.uniqId}
            style={[
              styles.button,
              isActive && styles.buttonActive,
            ]}
            onPress={() => onDeckChange(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
              ]}
            >
              {deck.number}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_DECK_SELECTOR_FILL_COLOR,
    borderWidth: 1,
    borderColor: THEME_DECK_SELECTOR_STROKE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: THEME_DEFAULT_PASSENGER_BADGE_COLOR,
    borderColor: THEME_DEFAULT_PASSENGER_BADGE_COLOR,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  labelActive: {
    color: '#fff',
  },
});
