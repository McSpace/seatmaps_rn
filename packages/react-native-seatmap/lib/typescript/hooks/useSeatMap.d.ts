import type { SeatMapConfig, PreparedData, PreparedSeat, Passenger } from '../types';
export interface UseSeatMapState {
    /** Prepared seatmap content */
    data: PreparedData | null;
    /** Currently active deck index (0-based) */
    activeDeckIndex: number;
    /** Seats currently selected, keyed by seat uniqId */
    selectedSeats: Record<string, PreparedSeat>;
    /** Whether data is being loaded */
    loading: boolean;
    /** Error message if the last fetch failed */
    error: string | null;
    /** Change active deck */
    setActiveDeckIndex: (index: number) => void;
    /** Select or deselect a seat */
    toggleSeat: (seat: PreparedSeat, passenger?: Passenger) => void;
    /** Deselect all seats */
    clearSelection: () => void;
    /** Re-fetch data */
    refresh: () => void;
}
export declare function useSeatMap(
/** Flight identifier (passed to the API endpoint) */
flightId: string, config: SeatMapConfig, callbacks?: {
    onSeatPress?: (seat: PreparedSeat, passenger?: Passenger) => void;
    onSeatDeselect?: (seat: PreparedSeat) => void;
    onDeckChange?: (deckIndex: number) => void;
}): UseSeatMapState;
//# sourceMappingURL=useSeatMap.d.ts.map