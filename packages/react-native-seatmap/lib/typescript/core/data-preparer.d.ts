/**
 * Seat feature SVG icons (kept as SVG strings for potential future use with
 * react-native-svg or WebView-based rendering). Not rendered directly in RN.
 */
export declare const SEAT_FEATURES_ICONS: Record<string, string>;
export declare const SEAT_MEASUREMENTS_ICONS: Record<string, string>;
export declare class JetsContentPreparer {
    private _dataHelper;
    private _deckTitleHeight;
    constructor();
    prepareData: (apiData: any, config: any) => any;
    private _mergeCabinFeatures;
    private _prepareExits;
    private _prepareBulks;
    private _getFirstElementDeckOffset;
    private _updateAllDeckItemsTopOffset;
    private _updateDeckItemsTopOffset;
    private _prepareDeck;
    private _groupRowsByCabinClass;
    private _updateDeckWithWings;
    private _prepareWingsForDeck;
    private _prepareRows;
    private _prepareRow;
    private _prepareSeats;
    private _prepareSeat;
    private _prepareAisle;
    private _prepareEmpty;
    private _prepareSeatFeatures;
    prepareSeatAdditionalProps: (seat: any) => any[] | undefined;
}
//# sourceMappingURL=data-preparer.d.ts.map