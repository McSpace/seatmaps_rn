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
export declare class JetsDataHelper {
    getSeatMapParams: (decks: any[], config: any, plane?: any) => SeatMapParams;
    getDeckInnerWidth(biggestRowWidth: number, config: any): number;
    getDeckInnerWidthWithWings(deck: any, isWingsExist: boolean, config: any): number;
    findWidestDeckRow: (rows: any[]) => any;
    findBiggestDeckRow: (rows: any[]) => any;
    assignAllLettersForBiggestRow: (biggestRow: any, rows: any[]) => any;
    rowLetters: (row: any) => string;
    _calculateSeatMapRotation: (isHorizontal: boolean, isRtl: boolean, scale: number, scaleType: string) => {
        rotation: string;
        offset: string;
        antiRotation: string;
        isHorizontal: boolean;
        rightToLeft: boolean;
    };
    _calculateSeatMapScale: (innerWidth: number, outerWidth: number) => {
        scale: number;
        antiScale: number;
    };
    calculateDeckHeight: (rows: any[], deckBulks: any[], deckExits: any[]) => number;
    _findLowestSeat: (seats: any[]) => any;
    _calculateLastElementHeight: (elements?: any[]) => {
        topOffset: number;
        height: number;
    };
    /**
     * React Native color validation — accepts hex, rgb/rgba/hsl/hsla strings
     * and a broad set of CSS named colors.
     * The web version used `new Option().style` DOM trick which is unavailable in RN.
     */
    static validateColor(strColor: string, defaultColor: string): string;
    static validateLanguage: (lang?: string) => string;
    static _isColor(strColor: string): boolean;
    static mergeColorThemeWithConstraints: (defaultTheme: Record<string, unknown>, theme: Record<string, unknown>) => Record<string, unknown>;
    static _applyColorRangesConstraints(colorRanges: unknown): unknown[];
    static _filterInvalidColors(theme: Record<string, unknown>): Record<string, unknown>;
    static calculateSeatColorByScore(score: unknown, colorRanges: Array<{
        range: [number, number];
        color: string;
    }>): string | null;
}
//# sourceMappingURL=data-helper.d.ts.map