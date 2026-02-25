// Components
export { SeatMap } from './components/SeatMap';
export { Deck } from './components/Deck';
export { Row } from './components/Row';
export { Seat } from './components/Seat';
export { SeatIcon } from './components/SeatIcon';
export { Tooltip } from './components/Tooltip';
export { DeckSelector } from './components/DeckSelector';

// Hooks
export { useSeatMap } from './hooks/useSeatMap';
export type { UseSeatMapState } from './hooks/useSeatMap';

// Types
export type {
  SeatMapConfig,
  SeatMapCallbacks,
  PreparedData,
  PreparedDeck,
  PreparedRow,
  PreparedSeat,
  SeatSize,
  SeatFeature,
  SeatMeasurement,
  SeatStatus,
  SeatEntityType,
  WingsInfo,
  SeatMapParams,
  Passenger,
  ColorTheme,
} from './types';

// Core — exported for advanced use cases
export { JetsApiService } from './core/api';
export { JetsContentPreparer, SEAT_FEATURES_ICONS } from './core/data-preparer';
export { JetsDataHelper } from './core/data-helper';
export { JetsStorageService } from './core/storage';
export { Utils } from './core/utils';

// Constants
export {
  ENTITY_STATUS_MAP,
  ENTITY_TYPE_MAP,
  CLASS_CODE_MAP,
  LOCALES_MAP,
  DEFAULT_LANG,
  DEFAULT_SEAT_MAP_WIDTH,
  SEAT_SIZE_BY_TYPE,
} from './core/constants';
