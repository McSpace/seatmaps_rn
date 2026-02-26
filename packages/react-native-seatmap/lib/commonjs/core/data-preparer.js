"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SEAT_MEASUREMENTS_ICONS = exports.SEAT_FEATURES_ICONS = exports.JetsContentPreparer = void 0;
var _dataHelper = require("./data-helper");
var _constants = require("./constants");
var _utils = require("./utils");
const DEFAULT_INDEX_ROW_SEAT_HEIGHT = 50;

/**
 * Seat feature SVG icons (kept as SVG strings for potential future use with
 * react-native-svg or WebView-based rendering). Not rendered directly in RN.
 */
const SEAT_FEATURES_ICONS = exports.SEAT_FEATURES_ICONS = {
  '+': '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.31 10.31 3.31 9.68 3.7 9.29C4.09 8.9 4.72 8.9 5.11 9.29L8 12.17L14.88 5.29C15.27 4.9 15.9 4.9 16.29 5.29C16.68 5.68 16.68 6.31 16.29 6.7L8.7 14.29C8.32 14.68 7.68 14.68 7.29 14.29Z" fill="#11d900"></path></svg>',
  '-': '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M11.89 6.7L10 8.59L8.11 6.7C7.72 6.31 7.09 6.31 6.7 6.7C6.31 7.09 6.31 7.72 6.7 8.11L8.59 10L6.7 11.89C6.31 12.28 6.31 12.91 6.7 13.3C7.09 13.69 7.72 13.69 8.11 13.3L10 11.41L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L11.41 10L13.3 8.11C13.69 7.72 13.69 7.09 13.3 6.7C12.91 6.32 12.27 6.32 11.89 6.7ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="red"></path></svg>',
  wifi: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.23 11"><path d="M6.62,9.91A1.08,1.08,0,1,0,7.7,8.82,1.08,1.08,0,0,0,6.62,9.91M7.7,7.64A2.24,2.24,0,0,1,9.84,9.26L11,8a3.76,3.76,0,0,0-6.65.09L5.54,9.32A2.25,2.25,0,0,1,7.7,7.64m0-3.06a5.25,5.25,0,0,1,4.37,2.35l1.08-1.15a6.75,6.75,0,0,0-11,.14L3.25,7A5.26,5.26,0,0,1,7.69,4.58m0-3a8.19,8.19,0,0,1,6.45,3.15l1.08-1.14A9.73,9.73,0,0,0,0,3.78L1.11,4.89A8.22,8.22,0,0,1,7.7,1.56" fill="#4f6f8f"/></svg>',
  dot: '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="#4f6f8f"></path></svg>'
};
const SEAT_MEASUREMENTS_ICONS = exports.SEAT_MEASUREMENTS_ICONS = {
  recline: '',
  width: '',
  pitch: ''
};
class JetsContentPreparer {
  _deckTitleHeight = 0;
  constructor() {
    this._dataHelper = new _dataHelper.JetsDataHelper();
  }
  prepareData = (apiData, config) => {
    if (!apiData) return [];
    const {
      seatDetails,
      plane
    } = apiData;
    const decks = seatDetails?.decks;
    const isDeckExist = decks && decks.length;
    this._deckTitleHeight = decks && decks.length > 1 ? _constants.DEFAULT_DECK_TITLE_HEIGHT : 0;
    const preparedBulks = isDeckExist ? this._prepareBulks(decks) : [];
    const preparedExits = isDeckExist ? this._prepareExits(decks) : [];
    const preparedDecks = isDeckExist ? decks.map((deck, index) => {
      const bulks = preparedBulks[index];
      const exits = preparedExits[index];
      return {
        ...this._prepareDeck(deck, bulks, exits, apiData, config),
        number: index + 1
      };
    }) : [];
    const isWingsExist = Math.max(...preparedDecks.map(deck => deck.wingsInfo.length)) > 0;
    const finalDecks = preparedDecks.map(deck => this._updateDeckWithWings(deck, isWingsExist, config));
    const params = this._dataHelper.getSeatMapParams(finalDecks, config, plane);
    return {
      content: finalDecks,
      params,
      exits: preparedExits,
      bulks: preparedBulks
    };
  };
  _mergeCabinFeatures(cabin, entertainment, power, wifi, bluetooth) {
    const merged = {
      ...cabin
    };
    if (entertainment?.exists && entertainment?.summary) merged['audioVideo'] = entertainment.summary;
    if (power?.exists && power?.summary) merged['power'] = power.summary;
    if (wifi?.exists && wifi?.summary) merged['wifi'] = wifi.summary;
    if (bluetooth?.exists && bluetooth?.summary) merged['bluetooth'] = bluetooth.summary;
    return merged;
  }
  _prepareExits(decks) {
    return this._updateAllDeckItemsTopOffset(decks, 'exits');
  }
  _prepareBulks(decks) {
    return this._updateAllDeckItemsTopOffset(decks, 'bulks');
  }
  _getFirstElementDeckOffset(deck) {
    const bulksMinOffset = deck.bulks.reduce((minimum, item) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);
    const exitsMinOffset = deck.exits.reduce((minimum, item) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);
    const firstRow = deck.rows.sort((a, b) => {
      a.topOffset - b.topOffset; // intentional: matches original source
    }).at(0);
    const seatsMinOffset = firstRow.seats.reduce((minimum, item) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);
    const firstElementOffset = Math.min(bulksMinOffset, exitsMinOffset, seatsMinOffset);
    const offset = firstElementOffset < 0 ? -firstElementOffset : firstElementOffset;
    return offset + this._deckTitleHeight + _constants.DEFAULT_INDEX_ROW_HEIGHT;
  }
  _updateAllDeckItemsTopOffset(decks, itemsName) {
    return decks.map(deck => {
      const firstElementOffset = this._getFirstElementDeckOffset(deck);
      return this._updateDeckItemsTopOffset(deck, itemsName, firstElementOffset);
    });
  }
  _updateDeckItemsTopOffset(deck, itemsName, offset = 0) {
    return deck[itemsName].map(deckItem => {
      const updatedItem = {
        ...deckItem,
        uniqId: _utils.Utils.generateId()
      };
      updatedItem.topOffset = updatedItem.topOffset + offset;
      return updatedItem;
    });
  }
  _prepareDeck(deck, preparedBulks, preparedExits, apiData, config) {
    const rowGroups = this._groupRowsByCabinClass(deck.rows);
    const cabinClassWidths = [];
    for (const rowGroup of rowGroups) {
      const biggestDeckRow = this._dataHelper.findBiggestDeckRow(rowGroup.rows);
      const preparedBiggestDeckRow = this._prepareRow(biggestDeckRow, {}, config);
      cabinClassWidths.push(preparedBiggestDeckRow.width);
    }
    const sum = cabinClassWidths.reduce((acc, d) => acc + d, 0);
    const targetDeckWidth = sum / cabinClassWidths.length;
    const firstElementOffset = this._getFirstElementDeckOffset(deck);
    for (const rowGroup of rowGroups) {
      const {
        cabin,
        entertainment,
        power,
        wifi,
        bluetooth
      } = apiData[rowGroup.classCode] || {};
      const cabinFeatures = this._mergeCabinFeatures(cabin, entertainment, power, wifi, bluetooth);
      const rows = this._prepareRows(rowGroup.rows, cabinFeatures, config, firstElementOffset, targetDeckWidth);
      const firstCabinRow = rows.at(0);
      const lastCabinRow = rows.at(-1);
      firstCabinRow['isFirstInCabin'] = true;
      firstCabinRow['cabinHeight'] = rows.length === 1 ? firstCabinRow.height : lastCabinRow.topOffset - firstCabinRow.topOffset + lastCabinRow.height / 2;
      rowGroup.rows = rows;
    }
    const rows = rowGroups.flatMap(g => g.rows);
    const innerDeckWidth = this._dataHelper.getDeckInnerWidth(targetDeckWidth, config);
    const deckHeight = this._dataHelper.calculateDeckHeight(rows, preparedBulks, preparedExits);
    const preparedWingsInfo = this._prepareWingsForDeck(deck.wingsInfo, rows[0].topOffset, deckHeight);
    return {
      uniqId: _utils.Utils.generateId(),
      width: innerDeckWidth,
      height: deckHeight,
      level: deck.level,
      rows,
      wingsInfo: preparedWingsInfo
    };
  }
  _groupRowsByCabinClass(rows) {
    const groups = [];
    let currentClassCode = null;
    let currentGroup = null;
    for (const row of rows) {
      if (row.classCode !== currentClassCode) {
        currentClassCode = row.classCode;
        currentGroup = {
          rows: [],
          topOffset: row.topOffset,
          classCode: currentClassCode,
          width: 0
        };
        groups.push(currentGroup);
      }
      currentGroup.rows.push(row);
    }
    return groups;
  }
  _updateDeckWithWings(deck, isWingsExist, config) {
    return {
      ...deck,
      width: this._dataHelper.getDeckInnerWidthWithWings(deck, isWingsExist, config)
    };
  }
  _prepareWingsForDeck(wingsInfo, offset, deckHeight) {
    const intersection = {
      start: 0,
      finish: 0,
      length: 0
    };
    if (!wingsInfo) return intersection;
    const {
      topOffset,
      height
    } = wingsInfo;
    const wingA = offset + topOffset;
    const wingB = wingA + height;
    const deckA = 0;
    const deckB = deckHeight;
    const result = {
      start: Math.max(deckA, wingA),
      finish: Math.min(deckB, wingB),
      length: 0,
      visibleWingsLeadings: true
    };
    result.length = Math.max(result.finish - result.start, 0);
    return result;
  }
  _prepareRows = (rows, cabinFeatures, config, offset, maxRowWidth = 0) => {
    if (!rows?.length) return [];
    return rows.map(row => this._prepareRow(row, cabinFeatures, config, offset, maxRowWidth));
  };
  _prepareRow = (row, cabinFeatures, config, offset = 0, maxRowWidth = 0) => {
    const {
      number,
      topOffset,
      seatScheme,
      classCode,
      seatType
    } = row;
    const _topOffset = topOffset + offset;
    const preparedSeats = this._prepareSeats(row, cabinFeatures, config, maxRowWidth);
    const rowWidth = preparedSeats.map(seat => seat.size.width).reduce((a, b) => a + b, 0);
    return {
      seats: preparedSeats,
      uniqId: _utils.Utils.generateId(),
      number,
      topOffset: _topOffset,
      width: rowWidth,
      height: preparedSeats.at(0)?.size.height ?? 0,
      seatScheme,
      classCode,
      seatType
    };
  };
  _prepareSeats = (row, cabinFeatures, config, maxRowWidth = 0) => {
    const {
      seatScheme,
      seats,
      seatType
    } = row;
    if (!seats?.length) return [];
    let seatsCounter = 0;
    const rowElements = seatScheme.split('');
    let aisleWidth = 0;
    if (maxRowWidth) {
      const [width] = _constants.SEAT_SIZE_BY_TYPE[seatType] ?? [100, 100];
      const seatsCount = seatScheme.match(/S|E/g)?.length ?? 0;
      const aislesCount = seatScheme.match(/-/g)?.length || 0;
      const seatsWidth = seatsCount * width;
      const widthDiff = maxRowWidth - seatsWidth;
      const targetAisleWidth = widthDiff / aislesCount;
      aisleWidth = targetAisleWidth > 0 ? Math.min(targetAisleWidth, width) : 1;
    }
    const result = rowElements.reduce((acc, item) => {
      let element = {};
      if (item === _constants.ENTITY_SCHEME_MAP.aisle) {
        element = this._prepareAisle(row, aisleWidth);
      } else if (item === _constants.ENTITY_SCHEME_MAP.empty) {
        element = this._prepareEmpty(row);
      } else if (item === _constants.ENTITY_SCHEME_MAP.seat) {
        element = this._prepareSeat(seats[seatsCounter], row, cabinFeatures, config);
        seatsCounter++;
      }
      acc.push(element);
      return acc;
    }, []);
    return result;
  };
  _prepareSeat = (seat, row, cabinFeatures, config) => {
    const {
      number,
      classCode,
      name: rowName,
      seatType: _rowSeatType
    } = row;
    const prepared = this._prepareSeatFeatures(seat, cabinFeatures, config.lang);
    const classType = (config.customCabinTitles?.[classCode] ?? config.customCabinTitles?.[classCode?.toUpperCase()]) || _constants.CLASS_CODE_MAP[classCode.toLowerCase()] || '';
    const seatNumber = number + (seat?.letter || '');
    const type = _constants.ENTITY_TYPE_MAP.seat;

    // Use status from API data when present; fall back to available.
    // If an availability map is provided (built from the availability prop), apply it.
    let status = seat.status || _constants.ENTITY_STATUS_MAP.available;
    if (config.availabilityMap) {
      if (seatNumber in config.availabilityMap) {
        status = config.availabilityMap[seatNumber] ? _constants.ENTITY_STATUS_MAP.available : _constants.ENTITY_STATUS_MAP.unavailable;
      }
    }
    const seatType = seat.seatType || _rowSeatType;
    const seatClassAndType = `${classCode}-${seatType}`;
    const [seatWidthByRow, seatHeightByRow] = _constants.SEAT_SIZE_BY_TYPE[_rowSeatType] ?? [100, 100];
    const [seatWidth, seatHeight] = _constants.SEAT_SIZE_BY_TYPE[seatType] ?? [100, 100];
    const seatColor = _dataHelper.JetsDataHelper.calculateSeatColorByScore(seat?.score, config.colorTheme?.customSeatColorRanges ?? []) || seat?.color;
    return {
      uniqId: _utils.Utils.generateId(),
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
      size: {
        width: Math.max(seatWidthByRow, seatWidth),
        height: seatHeight
      },
      color: seatColor
    };
  };
  _prepareAisle = (row, maxWidth = 0) => {
    const {
      number: rowNumber,
      seatType
    } = row;
    const [width, height] = _constants.SEAT_SIZE_BY_TYPE[seatType] ?? [100, 100];
    const size = {
      width: maxWidth || width,
      height
    };
    return {
      uniqId: _utils.Utils.generateId(),
      letter: rowNumber,
      type: _constants.ENTITY_TYPE_MAP.aisle,
      status: _constants.ENTITY_STATUS_MAP.disabled,
      size
    };
  };
  _prepareEmpty = row => {
    const [width, height] = _constants.SEAT_SIZE_BY_TYPE[row.seatType] ?? [100, 100];
    return {
      uniqId: _utils.Utils.generateId(),
      letter: '',
      status: _constants.ENTITY_STATUS_MAP.disabled,
      type: _constants.ENTITY_TYPE_MAP.empty,
      size: {
        width,
        height
      }
    };
  };
  _prepareSeatFeatures = (seat, cabin, lang) => {
    const {
      pitch: cabinSeatPitch,
      width: cabinSeatWidth,
      recline: cabinSeatRecline,
      audioVideo,
      power,
      wifi,
      bluetooth
    } = cabin;
    const {
      pitch: seatPitch,
      width: seatWidth,
      recline: seatRecline
    } = seat || {};
    const seatFeaturesKeys = Object.keys(seat.features || {});
    const noReclineKeys = ['doNotRecline', 'limitedRecline', 'prereclinedSeat'];
    const isSeatWithoutRecline = seatFeaturesKeys.some(key => noReclineKeys.includes(key));
    const features = {
      audioVideo,
      power,
      wifi,
      bluetooth,
      ...seat.features
    };
    const measurements = {
      pitch: seatPitch || cabinSeatPitch,
      width: seatWidth || cabinSeatWidth,
      recline: isSeatWithoutRecline ? '- -' : seatRecline || cabinSeatRecline
    };
    const locale = _constants.LOCALES_MAP[lang] || _constants.LOCALES_MAP['EN'];
    const prosOrCons = ['+', '-'];
    const preparedFeatures = Object.entries(features).filter(([key, value]) => !!value && !measurements[key]).map(([key, value]) => {
      const uniqId = _utils.Utils.generateId();
      const localized = locale[key] || key;
      if (prosOrCons.includes(value)) {
        const icon = SEAT_FEATURES_ICONS[value] || '';
        return {
          uniqId,
          title: null,
          icon,
          value: localized,
          key
        };
      } else {
        const icon = SEAT_FEATURES_ICONS[key] || '';
        return {
          uniqId,
          title: localized,
          icon,
          value,
          key
        };
      }
    });
    const preparedMeasurements = Object.entries(measurements).map(([key, value]) => {
      const localized = locale[key] || key;
      const icon = SEAT_MEASUREMENTS_ICONS[key] || '';
      return {
        uniqId: _utils.Utils.generateId(),
        title: localized,
        icon,
        value,
        key
      };
    });
    return {
      features: preparedFeatures,
      measurements: preparedMeasurements
    };
  };
  prepareSeatAdditionalProps = seat => {
    const {
      additionalProps
    } = seat || {};
    return additionalProps?.map(item => ({
      icon: SEAT_FEATURES_ICONS[item?.icon || 'dot'] || '',
      title: null,
      uniqId: _utils.Utils.generateId(),
      value: item?.label,
      cssClass: item?.cssClass
    }));
  };
}
exports.JetsContentPreparer = JetsContentPreparer;
//# sourceMappingURL=data-preparer.js.map