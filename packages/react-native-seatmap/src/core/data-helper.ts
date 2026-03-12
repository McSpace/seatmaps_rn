import {
  DEFAULT_DECK_PADDING_SIZE,
  THEME_FUSELAGE_OUTLINE_WIDTH,
  FUSELAGE_HEIGHT_TO_WIDTH_RATIO,
  THEME_CABIN_TITLES_WIDTH,
  ENTITY_TYPE_MAP,
  SCALE_TYPES,
  DEFAULT_LANG,
  LOCALES_MAP,
} from './constants';

export interface SeatSize {
  width: number;
  height: number;
}

export interface SeatMapParams {
  scale: number;
  antiScale: number;
  innerWidth: number;
  isTouchDevice: boolean;
  tooltipOnHover: boolean;
  builtInTooltip: boolean;
  externalPassengerManagement: boolean;
  builtInDeckSelector: boolean;
  singleDeckMode: boolean;
  totalDecksHeight: number;
  separateDeckHeights: number[];
  visibleFuselage: boolean;
  visibleWings: boolean;
  visibleCabinTitles: boolean;
  /** Scaled total height in pixels (numeric, unlike the web string version). */
  scaledTotalDecksHeight: number;
  hiddenSeatFeatures: unknown;
  noseType: string;
  rotation: string;
  offset: string;
  antiRotation: string;
  isHorizontal: boolean;
  rightToLeft: boolean;
}

export class JetsDataHelper {
  getSeatMapParams = (decks: any[], config: any, plane?: any): SeatMapParams => {
    const decksWidths = decks.map((deck: any) => deck.width);
    const maxDeckWidth =
      Math.max(...decksWidths) + (config?.colorTheme?.fuselageStrokeWidth ?? 0) * 2 || 0;

    const decksWings = decks.map((deck: any) => deck.wingsInfo.length);
    const isWingsExist = Math.max(...decksWings) > 0;

    const scaleCoefs = this._calculateSeatMapScale(maxDeckWidth, config.width);
    const rotationCoefs = this._calculateSeatMapRotation(
      config.horizontal,
      config.rightToLeft,
      scaleCoefs.scale,
      config.scaleType
    );

    const hullSize = config.visibleFuselage ? maxDeckWidth * FUSELAGE_HEIGHT_TO_WIDTH_RATIO : 0;
    const deckSpacings = (config?.colorTheme?.deckHeightSpacing ?? 0) * decks.length * 2;
    const separatorSize = config.singleDeckMode
      ? 0
      : (decks.length - 1) * (config?.colorTheme?.deckSeparation || 0);

    const totalDecksHeight =
      decks.map((deck: any) => deck.height).reduce((a: number, b: number) => a + b, 0) +
      hullSize +
      separatorSize +
      deckSpacings;

    const separateDeckHeights = decks.map(
      (deck: any) => deck.height + hullSize + separatorSize + deckSpacings
    );

    // React Native: all devices are touch devices.
    const isTouchDevice = true;

    return {
      ...scaleCoefs,
      ...rotationCoefs,
      innerWidth: maxDeckWidth,

      isTouchDevice,
      tooltipOnHover: config.tooltipOnHover,

      builtInTooltip: config?.builtInTooltip,
      externalPassengerManagement: config?.externalPassengerManagement,

      builtInDeckSelector: config?.builtInDeckSelector,
      singleDeckMode: config?.singleDeckMode,

      totalDecksHeight,
      separateDeckHeights,

      visibleFuselage: config.visibleFuselage,
      visibleWings: config.visibleWings && isWingsExist,
      visibleCabinTitles: config.visibleCabinTitles,
      // React Native: return number instead of CSS string
      scaledTotalDecksHeight: totalDecksHeight ? totalDecksHeight * (scaleCoefs.scale || 1) : 0,
      hiddenSeatFeatures: config.hiddenSeatFeatures,
      noseType: plane?.noseType || 'default',
    };
  };

  getDeckInnerWidth(biggestRowWidth: number, config: any): number {
    return (
      biggestRowWidth +
      DEFAULT_DECK_PADDING_SIZE * 2 +
      THEME_FUSELAGE_OUTLINE_WIDTH * 2 || config.width
    );
  }

  getDeckInnerWidthWithWings(deck: any, isWingsExist: boolean, config: any): number {
    const wingsSpace =
      config?.visibleWings && isWingsExist ? config.colorTheme.wingsWidth : 0;
    const cabinTitlesSpace = config?.visibleCabinTitles
      ? (config.colorTheme?.cabinTitlesWidth ?? THEME_CABIN_TITLES_WIDTH)
      : 0;

    return deck.width + Math.max(wingsSpace, cabinTitlesSpace) * 2;
  }

  findWidestDeckRow = (rows: any[]): any => {
    const sorted = [...rows]
      .filter((r: any) => !!r.number)
      .sort((a: any, b: any) => b.width - a.width);

    return sorted[0];
  };

  findBiggestDeckRow = (rows: any[]): any => {
    const sorted = [...rows].sort((a: any, b: any) => {
      const seatsRegex = /S/g;
      const bSeatsCount = (b.seatScheme.match(seatsRegex) || []).length;
      const aSeatsCount = (a.seatScheme.match(seatsRegex) || []).length;
      return bSeatsCount - aSeatsCount;
    });

    return this.assignAllLettersForBiggestRow(sorted[0], rows);
  };

  assignAllLettersForBiggestRow = (biggestRow: any, rows: any[]): any => {
    const biggestRowCopy = {
      ...biggestRow,
      seats: biggestRow.seats.map((seat: any) => ({ ...seat })),
    };
    try {
      const biggestRowLetters = this.rowLetters(biggestRowCopy);

      const otherLettersRow = rows.find((row: any) => {
        if (row.seatScheme === biggestRowCopy.seatScheme) {
          const rowLetters = this.rowLetters(row);
          if (biggestRowLetters !== rowLetters) {
            return row;
          }
        }
      });

      if (otherLettersRow) {
        biggestRowCopy.seats.forEach((element: any, index: number) => {
          element.letter = `${element.letter} - ${otherLettersRow.seats[index].letter}`;
        });
      }
    } catch (error) {
      console.error('Error at assignAllLettersForBiggestRow', error);
    }

    return biggestRowCopy;
  };

  rowLetters = (row: any): string => {
    const knownElementTypes: Record<string, string> = {
      [ENTITY_TYPE_MAP.aisle]: '-',
      [ENTITY_TYPE_MAP.empty]: ' ',
    };
    return row.seats
      .map((element: any) => knownElementTypes[element.type] || element.letter)
      .join();
  };

  _calculateSeatMapRotation = (
    isHorizontal: boolean,
    isRtl: boolean,
    scale: number,
    scaleType: string
  ) => {
    let rotation = '';
    let offset = '';
    let antiRotation = '';

    if (isHorizontal) {
      rotation = 'rotate(90deg)';
      offset =
        scaleType === SCALE_TYPES.ZOOM
          ? `translateY(${-100 / scale}%)`
          : 'translateY(-100%)';
      antiRotation = 'rotate(-90deg)';
    }

    return { rotation, offset, antiRotation, isHorizontal, rightToLeft: isRtl };
  };

  _calculateSeatMapScale = (innerWidth: number, outerWidth: number) => {
    const scale = outerWidth / innerWidth || 1;
    const antiScale = innerWidth / outerWidth || 1;

    return { scale, antiScale };
  };

  calculateDeckHeight = (rows: any[], deckBulks: any[], deckExits: any[]): number => {
    if (!rows.length) return 0;

    const lastRow = rows[rows.length - 1];
    const { topOffset: lastRowTopOffset, seats: lastRowSeats } = lastRow;
    const lowestSeat = this._findLowestSeat(lastRowSeats);
    const { height: lastBulkHeight, topOffset: lastBulkTopOffset } =
      this._calculateLastElementHeight(deckBulks);

    const { height: lastExitHeight, topOffset: lastExitTopOffset } =
      this._calculateLastElementHeight(deckExits);

    const lowestSeatBoundary =
      lastRowTopOffset + lowestSeat.topOffset + lowestSeat.size.height;
    const lowestBulkBoundary = lastBulkTopOffset + lastBulkHeight;
    const lowestExitBoundary = lastExitTopOffset + lastExitHeight;

    const maxElementTopOffset = Math.max(
      lowestSeatBoundary,
      lowestBulkBoundary,
      lowestExitBoundary
    );
    return Math.round(maxElementTopOffset);
  };

  _findLowestSeat = (seats: any[]): any => {
    let lowestBottomBoundary = 0;
    const filteredSeats = seats.filter(
      (seat: any) => seat.letter && !Number.isInteger(seat.letter)
    );
    let lowest = filteredSeats[0];

    for (const seat of filteredSeats) {
      const { height } = seat.size;
      const seatBottomBoundary = (seat.topOffset || 0) + height;
      if (lowestBottomBoundary < seatBottomBoundary) {
        lowestBottomBoundary = seatBottomBoundary;
        lowest = seat;
      }
    }

    return lowest;
  };

  _calculateLastElementHeight = (
    elements?: any[]
  ): { topOffset: number; height: number } => {
    const initialAcc = { topOffset: 0, height: 0 };

    return (
      elements?.reduce(
        (acc: { topOffset: number; height: number }, { topOffset, height }: any) => {
          if (topOffset > acc.topOffset) {
            acc.topOffset = topOffset;
            acc.height = height || 150;
          }
          return acc;
        },
        initialAcc
      ) ?? initialAcc
    );
  };

  /**
   * React Native color validation — accepts hex, rgb/rgba/hsl/hsla strings
   * and a broad set of CSS named colors.
   * The web version used `new Option().style` DOM trick which is unavailable in RN.
   */
  static validateColor(strColor: string, defaultColor: string): string {
    return this._isColor(strColor) ? strColor : defaultColor;
  }

  static validateLanguage = (lang?: string): string => {
    if (!lang) return DEFAULT_LANG;
    const _lang = lang.toUpperCase();
    return LOCALES_MAP[_lang] ? _lang : DEFAULT_LANG;
  };

  static _isColor(strColor: string): boolean {
    if (!strColor || typeof strColor !== 'string') return false;
    // Accept hex (#RGB, #RRGGBB, #RRGGBBAA)
    if (/^#[0-9A-Fa-f]{3,8}$/.test(strColor)) return true;
    // Accept rgb/rgba/hsl/hsla functional notation
    if (/^(rgb|rgba|hsl|hsla)\s*\(/.test(strColor)) return true;
    // Accept a broad list of CSS named colors (sampled)
    const namedColors = new Set([
      'red', 'blue', 'green', 'black', 'white', 'transparent', 'dimgrey',
      'dimgray', 'lightgray', 'lightgrey', 'darkgrey', 'darkgray', 'grey',
      'gray', 'orange', 'yellow', 'purple', 'pink', 'brown', 'cyan',
      'magenta', 'lime', 'navy', 'teal', 'silver', 'gold', 'indigo',
      'violet', 'coral', 'salmon', 'khaki', 'ivory', 'beige', 'tan',
    ]);
    return namedColors.has(strColor.toLowerCase());
  }

  static mergeColorThemeWithConstraints = (
    defaultTheme: Record<string, unknown>,
    theme: Record<string, unknown>
  ): Record<string, unknown> => {
    const merged = { ...defaultTheme, ...this._filterInvalidColors(theme) };

    for (const k in _colorThemeConstraints) {
      (merged as any)[k] = (_colorThemeConstraints as any)[k]((merged as any)[k]);
    }

    (merged as any).customSeatColorRanges = this._applyColorRangesConstraints(
      (merged as any).customSeatColorRanges
    );

    return merged;
  };

  static _applyColorRangesConstraints(
    colorRanges: unknown
  ): unknown[] {
    if (!Array.isArray(colorRanges) || !colorRanges.length) return [];

    return colorRanges.filter((rangeItem: any) => {
      if (!rangeItem || !Array.isArray(rangeItem.range) || rangeItem.range.length !== 2)
        return false;
      const [min, max] = rangeItem.range;
      if (typeof min !== 'number' || typeof max !== 'number' || min > max) return false;
      return typeof rangeItem.color === 'string' && this._isColor(rangeItem.color);
    });
  }

  static _filterInvalidColors(theme: Record<string, unknown>): Record<string, unknown> {
    Object.keys(theme).reduce((acc: Record<string, unknown>, key: string) => {
      const isNamedAsColor = key.toLowerCase().endsWith('color');
      if (!isNamedAsColor) {
        acc[key] = theme[key];
        return acc;
      }
      if (this._isColor(theme[key] as string)) {
        acc[key] = theme[key];
      } else {
        console.warn('config.colorTheme', key, 'has invalid color', theme[key]);
      }
      return acc;
    }, {});

    return theme;
  }

  static calculateSeatColorByScore(
    score: unknown,
    colorRanges: Array<{ range: [number, number]; color: string }>
  ): string | null {
    if (typeof score !== 'number' || score < 1 || score > 10) return null;

    const foundRange = colorRanges.find(rangeItem => {
      const [min, max] = rangeItem.range;
      return (score as number) >= min && (score as number) <= max;
    });

    return foundRange?.color || null;
  }
}

const _colorThemeConstraints: Record<string, (value: number) => number> = {
  fuselageStrokeWidth: value => Math.min(Math.max(10, value), 18),
};
