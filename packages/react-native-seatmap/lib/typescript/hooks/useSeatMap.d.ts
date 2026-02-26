import type { SeatMapConfig, SeatMapCallbacks, PreparedData, PreparedSeat, Passenger, SeatAvailability, IFlight } from '../types';
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
/** Flight object used to fetch seatmap data */
flight: IFlight, config: SeatMapConfig, callbacks?: SeatMapCallbacks, 
/** Optional list of passengers; pre-assigned seats are auto-selected */
passengers?: Passenger[], 
/** Optional availability list; overrides seat statuses from the API */
availability?: SeatAvailability[]): UseSeatMapState;
//# sourceMappingURL=useSeatMap.d.ts.map