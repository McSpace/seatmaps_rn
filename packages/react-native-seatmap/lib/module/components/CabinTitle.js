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
  const fontSize = Math.max(8, stripWidth * 0.55);

  // The inner rotation container has dimensions (cabinHeight × stripWidth) — swapped
  // relative to the strip. Positioned so its center aligns with the strip's center:
  //   left = (stripWidth  − cabinHeight) / 2   ← negative, extends outside strip bounds
  //   top  = (cabinHeight − stripWidth)  / 2   ← positive, pushed into the strip
  // After ±90° rotation the visual bounding box becomes exactly (stripWidth × cabinHeight),
  // filling the strip perfectly. No overflow:hidden is needed (and must NOT be set —
  // RN clips based on pre-transform layout bounds, which would cut the text).
  const innerLeft = (stripWidth - cabinHeight) / 2;
  const innerTop = (cabinHeight - stripWidth) / 2;

  // For −90° rotation: pre-rotation "right" becomes visual "top".
  //   → justifyContent: 'flex-end' + paddingRight puts the label at the top of the strip.
  // For +90° rotation: pre-rotation "left" becomes visual "top".
  //   → justifyContent: 'flex-start' + paddingLeft puts the label at the top of the strip.
  const renderStrip = isLeft => /*#__PURE__*/_jsx(View, {
    style: {
      position: 'absolute',
      top: topOffset,
      [isLeft ? 'left' : 'right']: 0,
      width: stripWidth,
      height: cabinHeight,
      [isLeft ? 'borderRightWidth' : 'borderLeftWidth']: HIGHLIGHT_BORDER_WIDTH,
      [isLeft ? 'borderRightColor' : 'borderLeftColor']: highlightColor,
      overflow: 'hidden'
    },
    children: /*#__PURE__*/_jsx(View, {
      style: {
        position: 'absolute',
        width: cabinHeight,
        height: stripWidth,
        left: innerLeft,
        top: innerTop,
        transform: [{
          rotate: isLeft ? '-90deg' : '90deg'
        }],
        // flexDirection:'row' makes justifyContent control the horizontal axis
        // (= visual top/bottom after rotation).
        // −90°: pre-rotation right → visual top → flex-end + paddingRight
        // +90°: pre-rotation left  → visual top → flex-start + paddingLeft
        flexDirection: 'row',
        justifyContent: isLeft ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        [isLeft ? 'paddingRight' : 'paddingLeft']: 8
      },
      children: /*#__PURE__*/_jsx(Text, {
        style: {
          color: highlightColor,
          fontSize,
          fontWeight: '600',
          textAlign: 'center'
        },
        numberOfLines: 1,
        children: classType
      })
    })
  });
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [renderStrip(true), renderStrip(false)]
  });
};
//# sourceMappingURL=CabinTitle.js.map