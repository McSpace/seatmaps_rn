import React from 'react';
import { ViewStyle } from 'react-native';
import type { PreparedSeat, Passenger } from '../types';
interface SeatProps {
    seat: PreparedSeat;
    scale?: number;
    isSelected?: boolean;
    onPress?: (seat: PreparedSeat) => void;
    style?: ViewStyle;
    passenger?: Passenger;
}
export declare const Seat: React.FC<SeatProps>;
export {};
//# sourceMappingURL=Seat.d.ts.map