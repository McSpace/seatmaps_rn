import React from 'react';
import { ViewStyle } from 'react-native';
import type { SeatMapConfig, SeatMapCallbacks, SeatMapRef, Passenger, SeatAvailability, IFlight } from '../types';
export interface SeatMapProps extends SeatMapConfig, SeatMapCallbacks {
    /** Flight data used to fetch seatmap from the API */
    flight: IFlight;
    /** Width of the seatmap component in pixels */
    width?: number;
    /** Passengers list; pre-assigned seats are auto-selected */
    passengers?: Passenger[];
    /** Availability data; overrides seat statuses */
    availability?: SeatAvailability[];
    /** Controlled deck index; synced to internal state */
    currentDeckIndex?: number;
    /** Open tooltip for this seat label and scroll to it */
    openedTooltipSeatLabel?: string;
    style?: ViewStyle;
}
/**
 * Top-level SeatMap component.
 *
 * Usage:
 * ```tsx
 * const ref = useRef<SeatMapRef>(null);
 *
 * <SeatMap
 *   ref={ref}
 *   flight={{ id: 'UA123' }}
 *   apiUrl="https://api.example.com"
 *   appId="my-app"
 *   apiKey="my-key"
 *   width={350}
 *   lang="EN"
 *   onSeatSelected={(seat) => console.log('Selected:', seat.number)}
 *   onSeatMapInited={() => console.log('Ready')}
 * />
 * ```
 */
export declare const SeatMap: React.ForwardRefExoticComponent<SeatMapProps & React.RefAttributes<SeatMapRef>>;
//# sourceMappingURL=SeatMap.d.ts.map