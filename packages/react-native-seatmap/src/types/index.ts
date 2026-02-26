/**
 * Public types for @seatmaps.com/react-native-seatmap
 */

export type SeatStatus =
  | 'available'
  | 'unavailable'
  | 'selected'
  | 'preferred'
  | 'extra'
  | 'disabled';

export type SeatEntityType = 'seat' | 'aisle' | 'empty' | 'index';

export interface SeatSize {
  width: number;
  height: number;
}

export interface SeatFeature {
  uniqId: string;
  key: string;
  title: string | null;
  icon: string;
  value: string;
}

export interface SeatMeasurement {
  uniqId: string;
  key: string;
  title: string;
  icon: string;
  value: string | number;
}

export interface PreparedSeat {
  uniqId: string;
  letter: string;
  number: string;
  type: SeatEntityType;
  status: SeatStatus;
  size: SeatSize;
  color?: string;
  originalColor?: string;
  classCode: string;
  classType: string;
  seatType: string;
  seatIconType: number;
  rowName?: string;
  topOffset?: number;
  features: SeatFeature[];
  measurements: SeatMeasurement[];
  price?: string;
  priceValue?: number;
  currency?: string;
}

export interface PreparedRow {
  uniqId: string;
  number: string | number;
  topOffset: number;
  width: number;
  height: number;
  seatScheme: string;
  classCode: string;
  seatType: number;
  seats: PreparedSeat[];
  isFirstInCabin?: boolean;
  cabinHeight?: number;
}

export interface WingsInfo {
  start: number;
  finish: number;
  length: number;
  visibleWingsLeadings?: boolean;
}

export interface PreparedDeck {
  uniqId: string;
  number: number;
  width: number;
  height: number;
  level: number;
  rows: PreparedRow[];
  wingsInfo: WingsInfo;
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
  scaledTotalDecksHeight: number;
  hiddenSeatFeatures: unknown;
  noseType: string;
  rotation: string;
  offset: string;
  antiRotation: string;
  isHorizontal: boolean;
  rightToLeft: boolean;
}

export interface PreparedData {
  content: PreparedDeck[];
  params: SeatMapParams;
  exits: unknown[][];
  bulks: unknown[][];
}

/** Seat pre-assigned to a passenger */
export interface PassengerSeat {
  price: number;
  seatLabel: string;
}

/** Passenger record passed to the seat map */
export interface Passenger {
  readonly id: string;
  /** Pre-assigned seat, if any */
  seat?: PassengerSeat;
  /** Passenger type code: 'ADT' | 'CHD' | 'INF' */
  passengerType?: string;
  /** Display label shown on the seat (e.g. passenger name initial) */
  passengerLabel?: string;
  /** Color used to highlight the passenger's seat */
  passengerColor?: string;
  /** When true, the pre-assigned seat cannot be unselected */
  readOnly?: boolean;
}

/** Single seat availability record */
export interface SeatAvailability {
  /** Seat label matching PreparedSeat.number, e.g. "12A" */
  seatLabel: string;
  /** Whether this seat is available for selection */
  available: boolean;
}

/** Flight information used to fetch seatmap data from the API */
export interface IFlight {
  /** Unique flight identifier used to build the API endpoint */
  id: string;
  /** IATA airline code, e.g. "UA" */
  airlineIata?: string;
  /** Flight number, e.g. "123" */
  flightNumber?: string;
  /** Cabin class code, e.g. "E", "B", "F" */
  cabinCode?: string;
  /** Origin airport IATA code */
  origin?: string;
  /** Destination airport IATA code */
  destination?: string;
  /** Flight departure date (ISO string) */
  departureDate?: string;
}

export interface ColorTheme {
  fuselageStrokeWidth?: number;
  deckHeightSpacing?: number;
  deckSeparation?: number;
  wingsWidth?: number;
  cabinTitlesWidth?: number;
  customSeatColorRanges?: Array<{
    range: [number, number];
    color: string;
  }>;
  [key: string]: unknown;
}

export interface SeatMapConfig {
  /** API base URL */
  apiUrl: string;
  /** Application ID for authentication */
  appId: string;
  /** API key */
  apiKey: string;
  /** Display width of the seatmap in pixels */
  width?: number;
  /** Language code (e.g., 'EN', 'RU', 'DE') */
  lang?: string;
  /** Measurement units */
  units?: 'metric' | 'imperials';
  /** Show horizontal layout */
  horizontal?: boolean;
  /** Right-to-left direction */
  rightToLeft?: boolean;
  /** Show fuselage outline */
  visibleFuselage?: boolean;
  /** Show wing indicators */
  visibleWings?: boolean;
  /** Show cabin class titles */
  visibleCabinTitles?: boolean;
  /** Custom cabin class title overrides, e.g. { F: 'First', B: 'Business' } */
  customCabinTitles?: Record<string, string>;
  /** Show built-in seat tooltip */
  builtInTooltip?: boolean;
  /** Show tooltip on hover (vs. on tap) */
  tooltipOnHover?: boolean;
  /** Show built-in deck selector widget */
  builtInDeckSelector?: boolean;
  /** Only show one deck at a time */
  singleDeckMode?: boolean;
  /** External passenger management (consumers handle seat assignment) */
  externalPassengerManagement?: boolean;
  /** Scale type: 'zoom' | 'scale' */
  scaleType?: string;
  /** Color theme overrides */
  colorTheme?: ColorTheme;
  /** List of hidden seat feature keys */
  hiddenSeatFeatures?: string[];
  /** Allowed passenger types */
  passengerTypes?: string[];
}

export interface SeatMapCallbacks {
  /** Called when the seatmap has fully initialised (data loaded and rendered) */
  onSeatMapInited?: () => void;
  /** Called when a seat is selected */
  onSeatSelected?: (seat: PreparedSeat, passenger?: Passenger) => void;
  /** Called when a seat is unselected */
  onSeatUnselected?: (seat: PreparedSeat) => void;
  /** Called when the layout dimensions change */
  onLayoutUpdated?: (layout: { width: number; height: number }) => void;
  /** Called when a tooltip is about to be shown for a seat */
  onTooltipRequested?: (seat: PreparedSeat) => void;
  /** Called after availability data has been applied; receives count of available seats */
  onAvailabilityApplied?: (availableCount: number) => void;
  /** Called when the active deck changes */
  onDeckChange?: (deckIndex: number) => void;
  /**
   * @deprecated Use onSeatSelected
   */
  onSeatPress?: (seat: PreparedSeat, passenger?: Passenger) => void;
  /**
   * @deprecated Use onSeatUnselected
   */
  onSeatDeselect?: (seat: PreparedSeat) => void;
}

/** Imperative handle exposed via forwardRef on SeatMap */
export interface SeatMapRef {
  /** Scroll to the seat with the given label and open its tooltip */
  seatJumpTo: (seatLabel: string) => void;
}
