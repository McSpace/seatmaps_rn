"use strict";

import React from 'react';
import { View, Text } from 'react-native';
import { THEME_CABIN_TITLES_HIGHLIGHT_COLORS } from '../core/constants';
import { CLASS_CODE_MAP } from '../core/constants';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const HIGHLIGHT_BORDER_WIDTH = 3;
export const CabinTitle = ({
  classCode,
  topOffset,
  cabinHeight,
  stripWidth
}) => {
  const code = classCode.toUpperCase();
  const highlightColor = THEME_CABIN_TITLES_HIGHLIGHT_COLORS[code] ?? '#888';
  const classType = CLASS_CODE_MAP[classCode.toLowerCase()] ?? classCode;
  const stripBase = {
    position: 'absolute',
    top: topOffset,
    height: cabinHeight,
    width: stripWidth,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  };
  const fontSize = Math.max(8, stripWidth * 0.55);
  const textStyle = {
    color: highlightColor,
    fontSize,
    fontWeight: '600',
    textAlign: 'center',
    // Width = cabinHeight so the rotated text spans the full strip height
    width: cabinHeight
  };
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(View, {
      style: [stripBase, {
        left: 0,
        borderRightWidth: HIGHLIGHT_BORDER_WIDTH,
        borderRightColor: highlightColor
      }],
      children: /*#__PURE__*/_jsx(Text, {
        style: [textStyle, {
          transform: [{
            rotate: '-90deg'
          }]
        }],
        numberOfLines: 1,
        children: classType
      })
    }), /*#__PURE__*/_jsx(View, {
      style: [stripBase, {
        right: 0,
        borderLeftWidth: HIGHLIGHT_BORDER_WIDTH,
        borderLeftColor: highlightColor
      }],
      children: /*#__PURE__*/_jsx(Text, {
        style: [textStyle, {
          transform: [{
            rotate: '90deg'
          }]
        }],
        numberOfLines: 1,
        children: classType
      })
    })]
  });
};
//# sourceMappingURL=CabinTitle.js.map