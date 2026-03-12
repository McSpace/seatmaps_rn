"use strict";

import React from 'react';
import { SvgXml } from 'react-native-svg';
import { THEME_FLOOR_COLOR, THEME_FUSELAGE_FILL_COLOR, THEME_FUSELAGE_OUTLINE_COLOR } from '../core/constants';

// Tail SVG original viewBox: 200 × 80
import { jsx as _jsx } from "react/jsx-runtime";
export const TAIL_ASPECT_RATIO = 80 / 200;
export const Tail = ({
  width,
  floorColor = THEME_FLOOR_COLOR,
  fuselageColor = THEME_FUSELAGE_FILL_COLOR,
  strokeColor = THEME_FUSELAGE_OUTLINE_COLOR
}) => {
  const height = Math.round(width * TAIL_ASPECT_RATIO);
  const svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
<path fill="${floorColor}" stroke="${strokeColor}" stroke-width="1" stroke-miterlimit="10" d="M2.4,38.5c-0.6-3.5-0.9-7.1-0.9-10.7V0h197v27.4c0,3.8-0.3,7.6-1,11.4c-1.3,7.4-3.9,21.3-7.6,37.5H9.7C6.1,59.8,3.6,45.8,2.4,38.5z"/>
<path fill="${fuselageColor}" fill-rule="evenodd" clip-rule="evenodd" d="M9.7,76.3C4.5,52.2,1.5,33.1,1.5,33.1V29H5c0.2,0,0.4-0.1,0.6-0.1c8.7-1.4,32.4-5.4,42-5.5c6.7,0,16.4,3.8,26.1,7.7c9.7,3.8,19.3,7.7,26,7.7c6.4,0,15.7-3.8,25.1-7.6c9.5-3.9,18.9-7.7,25.4-7.7c10,0.1,35.2,4.1,44.2,5.5l0.5,0.1h3.6v4.1c0,0-3.1,19-8.6,43.1H9.7z"/>
<path fill="none" stroke="none" d="M5,29c8.1-1.4,32.7-5.5,42.6-5.6c13.3-0.1,38.8,15.4,52.1,15.4c12.8,0,37.6-15.4,50.5-15.4c10.2,0.1,36.2,4.2,44.7,5.6"/>
<path fill="none" stroke="${strokeColor}" stroke-width="1" stroke-miterlimit="10" d="M9.7,76.1h180.2"/>
<path fill="none" stroke="${strokeColor}" stroke-width="1" stroke-miterlimit="10" d="M12.9,76.3H9.7C6.1,59.8,3.6,45.8,2.4,38.5c-0.6-3.5-0.9-7.1-0.9-10.7V0 M186.7,76.3h3.3c3.6-16.2,6.3-30.1,7.6-37.5c0.7-3.8,1-7.5,1-11.4V0"/>
</svg>`;
  return /*#__PURE__*/_jsx(SvgXml, {
    xml: svg,
    width: width,
    height: height
  });
};
//# sourceMappingURL=Tail.js.map