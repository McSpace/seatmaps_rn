"use strict";

import React from 'react';
import { SvgXml } from 'react-native-svg';
import { THEME_FLOOR_COLOR, THEME_FUSELAGE_FILL_COLOR, THEME_FUSELAGE_OUTLINE_COLOR } from '../core/constants';
import { getNoseSvg, getNoseAspectRatio } from '../core/nose-templates';
import { jsx as _jsx } from "react/jsx-runtime";
export const Nose = ({
  width,
  noseType = 'default',
  floorColor = THEME_FLOOR_COLOR,
  fuselageColor = THEME_FUSELAGE_FILL_COLOR,
  strokeColor = THEME_FUSELAGE_OUTLINE_COLOR
}) => {
  const height = Math.round(width * getNoseAspectRatio(noseType));
  const svg = getNoseSvg(noseType, {
    floorColor,
    fuselageColor,
    strokeColor
  });
  return /*#__PURE__*/_jsx(SvgXml, {
    xml: svg,
    width: width,
    height: height
  });
};
//# sourceMappingURL=Nose.js.map