import { JetsDataHelper } from './data-helper';
import {
  CLASS_CODE_MAP,
  LOCALES_MAP,
  ENTITY_SCHEME_MAP,
  ENTITY_STATUS_MAP,
  ENTITY_TYPE_MAP,
  DEFAULT_DECK_TITLE_HEIGHT,
  DEFAULT_INDEX_ROW_HEIGHT,
  SEAT_SIZE_BY_TYPE,
} from './constants';
import { Utils } from './utils';

const DEFAULT_INDEX_ROW_SEAT_HEIGHT = 50;

/**
 * Seat feature SVG icons (kept as SVG strings for potential future use with
 * react-native-svg or WebView-based rendering). Not rendered directly in RN.
 */
export const SEAT_FEATURES_ICONS: Record<string, string> = {
  '+': '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.31 10.31 3.31 9.68 3.7 9.29C4.09 8.9 4.72 8.9 5.11 9.29L8 12.17L14.88 5.29C15.27 4.9 15.9 4.9 16.29 5.29C16.68 5.68 16.68 6.31 16.29 6.7L8.7 14.29C8.32 14.68 7.68 14.68 7.29 14.29Z" fill="#11d900"></path></svg>',
  '-': '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M11.89 6.7L10 8.59L8.11 6.7C7.72 6.31 7.09 6.31 6.7 6.7C6.31 7.09 6.31 7.72 6.7 8.11L8.59 10L6.7 11.89C6.31 12.28 6.31 12.91 6.7 13.3C7.09 13.69 7.72 13.69 8.11 13.3L10 11.41L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L11.41 10L13.3 8.11C13.69 7.72 13.69 7.09 13.3 6.7C12.91 6.32 12.27 6.32 11.89 6.7ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="red"></path></svg>',
  wifi: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.23 11"><path d="M6.62,9.91A1.08,1.08,0,1,0,7.7,8.82,1.08,1.08,0,0,0,6.62,9.91M7.7,7.64A2.24,2.24,0,0,1,9.84,9.26L11,8a3.76,3.76,0,0,0-6.65.09L5.54,9.32A2.25,2.25,0,0,1,7.7,7.64m0-3.06a5.25,5.25,0,0,1,4.37,2.35l1.08-1.15a6.75,6.75,0,0,0-11,.14L3.25,7A5.26,5.26,0,0,1,7.69,4.58m0-3a8.19,8.19,0,0,1,6.45,3.15l1.08-1.14A9.73,9.73,0,0,0,0,3.78L1.11,4.89A8.22,8.22,0,0,1,7.7,1.56" fill="#4f6f8f"/></svg>',
  dot: '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="#4f6f8f"></path></svg>',
};

export const SEAT_MEASUREMENTS_ICONS: Record<string, string> = {
  recline: '',
  width: '',
  pitch: '',
};

export class JetsContentPreparer {
  private _dataHelper: JetsDataHelper;
  private _deckTitleHeight: number = 0;

  constructor() {
    this._dataHelper = new JetsDataHelper();
  }

  prepareData = (apiData: any, config: any): any => {
    if (!apiData) return [];

    const { seatDetails, plane } = apiData;
    const decks = seatDetails?.decks;

    const isDeckExist = decks && decks.length;
    this._deckTitleHeight = decks && decks.length > 1 ? DEFAULT_DECK_TITLE_HEIGHT : 0;

    const preparedBulks = isDeckExist ? this._prepareBulks(decks) : [];
    const preparedExits = isDeckExist ? this._prepareExits(decks) : [];

    const preparedDecks = isDeckExist
      ? decks.map((deck: any, index: number) => {
          const bulks = preparedBulks[index];
          const exits = preparedExits[index];
          return {
            ...this._prepareDeck(deck, bulks, exits, apiData, config),
            number: index + 1,
          };
        })
      : [];

    const isWingsExist =
      Math.max(...preparedDecks.map((deck: any) => deck.wingsInfo.length)) > 0;

    const finalDecks = preparedDecks.map((deck: any) =>
      this._updateDeckWithWings(deck, isWingsExist, config)
    );

    const params = this._dataHelper.getSeatMapParams(finalDecks, config, plane);

    return {
      content: finalDecks,
      params,
      exits: preparedExits,
      bulks: preparedBulks,
    };
  };

  private _mergeCabinFeatures(
    cabin: any,
    entertainment: any,
    power: any,
    wifi: any,
    bluetooth: any
  ): any {
    const merged = { ...cabin };

    if (entertainment?.exists && entertainment?.summary) merged['audioVideo'] = entertainment.summary;
    if (power?.exists && power?.summary) merged['power'] = power.summary;
    if (wifi?.exists && wifi?.summary) merged['wifi'] = wifi.summary;
    if (bluetooth?.exists && bluetooth?.summary) merged['bluetooth'] = bluetooth.summary;

    return merged;
  }

  private _prepareExits(decks: any[]): any[] {
    return this._updateAllDeckItemsTopOffset(decks, 'exits');
  }

  private _prepareBulks(decks: any[]): any[] {
    return this._updateAllDeckItemsTopOffset(decks, 'bulks');
  }

  private _getFirstElementDeckOffset(deck: any): number {
    const bulksMinOffset = deck.bulks.reduce((minimum: number, item: any) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);
    const exitsMinOffset = deck.exits.reduce((minimum: number, item: any) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);

    const firstRow = deck.rows
      .sort((a: any, b: any) => {
        a.topOffset - b.topOffset; // intentional: matches original source
      })
      .at(0);

    const seatsMinOffset = firstRow.seats.reduce((minimum: number, item: any) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);

    const firstElementOffset = Math.min(bulksMinOffset, exitsMinOffset, seatsMinOffset);
    const offset = firstElementOffset < 0 ? -firstElementOffset : firstElementOffset;
    return offset + this._deckTitleHeight + DEFAULT_INDEX_ROW_HEIGHT;
  }

  private _updateAllDeckItemsTopOffset(decks: any[], itemsName: string): any[] {
    return decks.map(deck => {
      const firstElementOffset = this._getFirstElementDeckOffset(deck);
      return this._updateDeckItemsTopOffset(deck, itemsName, firstElementOffset);
    });
  }

  private _updateDeckItemsTopOffset(deck: any, itemsName: string, offset: number = 0): any[] {
    return deck[itemsName].map((deckItem: any) => {
      const updatedItem = { ...deckItem, uniqId: Utils.generateId() };
      updatedItem.topOffset = updatedItem.topOffset + offset;
      return updatedItem;
    });
  }

  private _prepareDeck(deck: any, preparedBulks: any[], preparedExits: any[], apiData: any, config: any): any {
    const rowGroups = this._groupRowsByCabinClass(deck.rows);

    const cabinClassWidths: number[] = [];
    for (const rowGroup of rowGroups) {
      const biggestDeckRow = this._dataHelper.findBiggestDeckRow(rowGroup.rows);
      const preparedBiggestDeckRow = this._prepareRow(biggestDeckRow, {}, config);
      cabinClassWidths.push(preparedBiggestDeckRow.width);
    }

    const sum = cabinClassWidths.reduce((acc, d) => acc + d, 0);
    const targetDeckWidth = sum / cabinClassWidths.length;
    const firstElementOffset = this._getFirstElementDeckOffset(deck);

    for (const rowGroup of rowGroups) {
      const { cabin, entertainment, power, wifi, bluetooth } = apiData[rowGroup.classCode] || {};
      const cabinFeatures = this._mergeCabinFeatures(cabin, entertainment, power, wifi, bluetooth);

      const rows = this._prepareRows(
        rowGroup.rows,
        cabinFeatures,
        config,
        firstElementOffset,
        targetDeckWidth
      );

      const firstCabinRow = rows.at(0);
      const lastCabinRow = rows.at(-1);
      firstCabinRow['isFirstInCabin'] = true;
      firstCabinRow['cabinHeight'] =
        rows.length === 1
          ? firstCabinRow.height
          : lastCabinRow.topOffset - firstCabinRow.topOffset + lastCabinRow.height / 2;

      rowGroup.rows = rows;
    }

    const rows: any[] = rowGroups.flatMap((g: any) => g.rows);

    const innerDeckWidth = this._dataHelper.getDeckInnerWidth(targetDeckWidth, config);
    const deckHeight = this._dataHelper.calculateDeckHeight(rows, preparedBulks, preparedExits);

    const preparedWingsInfo = this._prepareWingsForDeck(
      deck.wingsInfo,
      rows[0].topOffset,
      deckHeight
    );

    return {
      uniqId: Utils.generateId(),
      width: innerDeckWidth,
      height: deckHeight,
      level: deck.level,
      rows,
      wingsInfo: preparedWingsInfo,
    };
  }

  private _groupRowsByCabinClass(rows: any[]): any[] {
    const groups: any[] = [];
    let currentClassCode: string | null = null;
    let currentGroup: any = null;

    for (const row of rows) {
      if (row.classCode !== currentClassCode) {
        currentClassCode = row.classCode;
        currentGroup = {
          rows: [],
          topOffset: row.topOffset,
          classCode: currentClassCode,
          width: 0,
        };
        groups.push(currentGroup);
      }
      currentGroup.rows.push(row);
    }

    return groups;
  }

  private _updateDeckWithWings(deck: any, isWingsExist: boolean, config: any): any {
    return {
      ...deck,
      width: this._dataHelper.getDeckInnerWidthWithWings(deck, isWingsExist, config),
    };
  }

  private _prepareWingsForDeck(
    wingsInfo: any,
    offset: number,
    deckHeight: number
  ): { start: number; finish: number; length: number; visibleWingsLeadings?: boolean } {
    const intersection = { start: 0, finish: 0, length: 0 };

    if (!wingsInfo) return intersection;

    const { topOffset, height } = wingsInfo;
    const wingA = offset + topOffset;
    const wingB = wingA + height;

    const deckA = 0;
    const deckB = deckHeight;

    const result = {
      start: Math.max(deckA, wingA),
      finish: Math.min(deckB, wingB),
      length: 0,
      visibleWingsLeadings: true,
    };
    result.length = Math.max(result.finish - result.start, 0);

    return result;
  }

  private _prepareRows = (
    rows: any[],
    cabinFeatures: any,
    config: any,
    offset: number,
    maxRowWidth: number = 0
  ): any[] => {
    if (!rows?.length) return [];
    return rows.map(row => this._prepareRow(row, cabinFeatures, config, offset, maxRowWidth));
  };

  private _prepareRow = (
    row: any,
    cabinFeatures: any,
    config: any,
    offset: number = 0,
    maxRowWidth: number = 0
  ): any => {
    const { number, topOffset, seatScheme, classCode, seatType } = row;
    const _topOffset = topOffset + offset;
    const preparedSeats = this._prepareSeats(row, cabinFeatures, config, maxRowWidth);
    const rowWidth = preparedSeats
      .map((seat: any) => seat.size.width)
      .reduce((a: number, b: number) => a + b, 0);

    return {
      seats: preparedSeats,
      uniqId: Utils.generateId(),
      number,
      topOffset: _topOffset,
      width: rowWidth,
      height: preparedSeats.at(0)?.size.height ?? 0,
      seatScheme,
      classCode,
      seatType,
    };
  };

  private _prepareSeats = (
    row: any,
    cabinFeatures: any,
    config: any,
    maxRowWidth: number = 0
  ): any[] => {
    const { seatScheme, seats, seatType } = row;

    if (!seats?.length) return [];

    let seatsCounter = 0;
    const rowElements = seatScheme.split('');

    let aisleWidth = 0;

    if (maxRowWidth) {
      const [width] = SEAT_SIZE_BY_TYPE[seatType] ?? [100, 100];
      const seatsCount = seatScheme.match(/S|E/g)?.length ?? 0;
      const aislesCount = seatScheme.match(/-/g)?.length || 0;
      const seatsWidth = seatsCount * width;
      const widthDiff = maxRowWidth - seatsWidth;
      const targetAisleWidth = widthDiff / aislesCount;
      aisleWidth = targetAisleWidth > 0 ? Math.min(targetAisleWidth, width) : 1;
    }

    const result = rowElements.reduce((acc: any[], item: string) => {
      let element: any = {};

      if (item === ENTITY_SCHEME_MAP.aisle) {
        element = this._prepareAisle(row, aisleWidth);
      } else if (item === ENTITY_SCHEME_MAP.empty) {
        element = this._prepareEmpty(row);
      } else if (item === ENTITY_SCHEME_MAP.seat) {
        element = this._prepareSeat(seats[seatsCounter], row, cabinFeatures, config);
        seatsCounter++;
      }

      acc.push(element);
      return acc;
    }, []);

    return result;
  };

  private _prepareSeat = (seat: any, row: any, cabinFeatures: any, config: any): any => {
    const { number, classCode, name: rowName, seatType: _rowSeatType } = row;
    const prepared = this._prepareSeatFeatures(seat, cabinFeatures, config.lang);
    const classType =
      (config.customCabinTitles?.[classCode] ?? config.customCabinTitles?.[classCode?.toUpperCase()]) ||
      CLASS_CODE_MAP[classCode.toLowerCase()] || '';
    const seatNumber = number + (seat?.letter || '');
    const type = ENTITY_TYPE_MAP.seat;

    // Use status from API data when present; fall back to available.
    // If an availability map is provided (built from the availability prop), apply it.
    let status: string = seat.status || ENTITY_STATUS_MAP.available;
    if (config.availabilityMap) {
      if (seatNumber in config.availabilityMap) {
        status = config.availabilityMap[seatNumber]
          ? ENTITY_STATUS_MAP.available
          : ENTITY_STATUS_MAP.unavailable;
      }
    }

    const seatType = seat.seatType || _rowSeatType;
    const seatClassAndType = `${classCode}-${seatType}`;

    const [seatWidthByRow, seatHeightByRow] = SEAT_SIZE_BY_TYPE[_rowSeatType] ?? [100, 100];
    const [seatWidth, seatHeight] = SEAT_SIZE_BY_TYPE[seatType] ?? [100, 100];
    const seatColor =
      JetsDataHelper.calculateSeatColorByScore(
        seat?.score,
        config.colorTheme?.customSeatColorRanges ?? []
      ) || seat?.color;

    return {
      uniqId: Utils.generateId(),
      ...seat,
      originalColor: seatColor,
      features: prepared.features,
      measurements: prepared.measurements,
      status,
      type,
      number: seatNumber,
      classType,
      classCode,
      rowName,
      seatType: seatClassAndType,
      seatIconType: seatType,
      size: { width: Math.max(seatWidthByRow, seatWidth), height: seatHeight },
      color: seatColor,
    };
  };

  private _prepareAisle = (row: any, maxWidth: number = 0): any => {
    const { number: rowNumber, seatType } = row;
    const [width, height] = SEAT_SIZE_BY_TYPE[seatType] ?? [100, 100];
    const size = { width: maxWidth || width, height };
    return {
      uniqId: Utils.generateId(),
      letter: rowNumber,
      type: ENTITY_TYPE_MAP.aisle,
      status: ENTITY_STATUS_MAP.disabled,
      size,
    };
  };

  private _prepareEmpty = (row: any): any => {
    const [width, height] = SEAT_SIZE_BY_TYPE[row.seatType] ?? [100, 100];
    return {
      uniqId: Utils.generateId(),
      letter: '',
      status: ENTITY_STATUS_MAP.disabled,
      type: ENTITY_TYPE_MAP.empty,
      size: { width, height },
    };
  };

  private _prepareSeatFeatures = (seat: any, cabin: any, lang: string): any => {
    const {
      pitch: cabinSeatPitch,
      width: cabinSeatWidth,
      recline: cabinSeatRecline,
      audioVideo,
      power,
      wifi,
      bluetooth,
    } = cabin;
    const { pitch: seatPitch, width: seatWidth, recline: seatRecline } = seat || {};

    const seatFeaturesKeys = Object.keys(seat.features || {});
    const noReclineKeys = ['doNotRecline', 'limitedRecline', 'prereclinedSeat'];
    const isSeatWithoutRecline = seatFeaturesKeys.some(key => noReclineKeys.includes(key));

    const features = { audioVideo, power, wifi, bluetooth, ...seat.features };
    const measurements = {
      pitch: seatPitch || cabinSeatPitch,
      width: seatWidth || cabinSeatWidth,
      recline: isSeatWithoutRecline ? '- -' : seatRecline || cabinSeatRecline,
    };

    const locale = LOCALES_MAP[lang] || LOCALES_MAP['EN'];
    const prosOrCons = ['+', '-'];

    const preparedFeatures = Object.entries(features)
      .filter(([key, value]) => !!value && !measurements[key as keyof typeof measurements])
      .map(([key, value]) => {
        const uniqId = Utils.generateId();
        const localized = locale[key] || key;
        if (prosOrCons.includes(value as string)) {
          const icon = SEAT_FEATURES_ICONS[value as string] || '';
          return { uniqId, title: null, icon, value: localized, key };
        } else {
          const icon = SEAT_FEATURES_ICONS[key] || '';
          return { uniqId, title: localized, icon, value, key };
        }
      });

    const preparedMeasurements = Object.entries(measurements).map(([key, value]) => {
      const localized = locale[key] || key;
      const icon = SEAT_MEASUREMENTS_ICONS[key] || '';
      return { uniqId: Utils.generateId(), title: localized, icon, value, key };
    });

    return { features: preparedFeatures, measurements: preparedMeasurements };
  };

  prepareSeatAdditionalProps = (seat: any): any[] | undefined => {
    const { additionalProps } = seat || {};

    return additionalProps?.map((item: any) => ({
      icon: SEAT_FEATURES_ICONS[item?.icon || 'dot'] || '',
      title: null,
      uniqId: Utils.generateId(),
      value: item?.label,
      cssClass: item?.cssClass,
    }));
  };
}
