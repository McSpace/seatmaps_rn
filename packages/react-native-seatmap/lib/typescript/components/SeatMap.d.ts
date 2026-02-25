import React from 'react';
import { ViewStyle } from 'react-native';
import type { SeatMapConfig, SeatMapCallbacks } from '../types';
export interface SeatMapProps extends SeatMapConfig, SeatMapCallbacks {
    /** Flight identifier used to fetch seat data */
    flightId: string;
    /** Width of the seatmap component in pixels */
    width?: number;
    style?: ViewStyle;
}
/**
 * Top-level SeatMap component.
 *
 * Usage:
 * ```tsx
 * <SeatMap
 *   flightId="UA123"
 *   apiUrl="https://api.example.com"
 *   appId="my-app"
 *   apiKey="my-key"
 *   width={350}
 *   lang="EN"
 *   onSeatPress={(seat) => console.log('Selected:', seat.number)}
 * />
 * ```
 */
export declare const SeatMap: React.FC<SeatMapProps>;
//# sourceMappingURL=SeatMap.d.ts.map