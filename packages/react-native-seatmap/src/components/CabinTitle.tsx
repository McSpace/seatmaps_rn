import React from 'react';
import { View, Text } from 'react-native';
import {
  THEME_CABIN_TITLES_HIGHLIGHT_COLORS,
} from '../core/constants';
import { CLASS_CODE_MAP } from '../core/constants';

const HIGHLIGHT_BORDER_WIDTH = 3;

interface CabinTitleProps {
  classCode: string;
  topOffset: number;   // scaled top offset (pixels)
  cabinHeight: number; // scaled cabin height (pixels)
  stripWidth: number;  // scaled strip width (pixels)
}

export const CabinTitle: React.FC<CabinTitleProps> = ({
  classCode,
  topOffset,
  cabinHeight,
  stripWidth,
}) => {
  const code = classCode.toUpperCase();
  const highlightColor = THEME_CABIN_TITLES_HIGHLIGHT_COLORS[code] ?? '#888';
  const classType = CLASS_CODE_MAP[classCode.toLowerCase()] ?? classCode;

  const stripBase = {
    position: 'absolute' as const,
    top: topOffset,
    height: cabinHeight,
    width: stripWidth,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
  };

  const fontSize = Math.max(8, stripWidth * 0.55);

  const textStyle = {
    color: highlightColor,
    fontSize,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    // Width = cabinHeight so the rotated text spans the full strip height
    width: cabinHeight,
  };

  return (
    <>
      {/* Left strip */}
      <View
        style={[
          stripBase,
          {
            left: 0,
            borderRightWidth: HIGHLIGHT_BORDER_WIDTH,
            borderRightColor: highlightColor,
          },
        ]}
      >
        <Text style={[textStyle, { transform: [{ rotate: '-90deg' }] }]} numberOfLines={1}>
          {classType}
        </Text>
      </View>

      {/* Right strip */}
      <View
        style={[
          stripBase,
          {
            right: 0,
            borderLeftWidth: HIGHLIGHT_BORDER_WIDTH,
            borderLeftColor: highlightColor,
          },
        ]}
      >
        <Text style={[textStyle, { transform: [{ rotate: '90deg' }] }]} numberOfLines={1}>
          {classType}
        </Text>
      </View>
    </>
  );
};
