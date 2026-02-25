/**
 * Public types for @seatmaps.com/react-native-seatmap
 */
export type SeatStatus = 'available' | 'unavailable' | 'selected' | 'preferred' | 'extra' | 'disabled';
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
export interface Passenger {
    id: string;
    /** Passenger type: 'ADT' | 'CHD' | 'INF' */
    type: string;
    /** Display name */
    name?: string;
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
    /** Called when a seat is tapped */
    onSeatPress?: (seat: PreparedSeat, passenger?: Passenger) => void;
    /** Called when the selected seat is tapped again (deselect) */
    onSeatDeselect?: (seat: PreparedSeat) => void;
    /** Called when the active deck changes */
    onDeckChange?: (deckIndex: number) => void;
}
//# sourceMappingURL=index.d.ts.map