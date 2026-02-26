"use strict";

import React from 'react';
import { SvgXml } from 'react-native-svg';
import { getSeatSvg } from '../core/seat-templates';
import { THEME_SEAT_ARMREST_COLOR, THEME_SEAT_STROKE_COLOR, THEME_SEAT_STROKE_WIDTH } from '../core/constants';
import { jsx as _jsx } from "react/jsx-runtime";
export const SeatIcon = ({
  seatType,
  fillColor,
  width,
  height
}) => {
  const xml = getSeatSvg(seatType, {
    fillColor,
    armrestColor: THEME_SEAT_ARMREST_COLOR,
    strokeColor: THEME_SEAT_STROKE_COLOR,
    strokeWidth: THEME_SEAT_STROKE_WIDTH
  });
  if (!xml) return null;
  return /*#__PURE__*/_jsx(SvgXml, {
    xml: xml,
    width: width,
    height: height
  });
};
//# sourceMappingURL=SeatIcon.js.map