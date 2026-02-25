import React from 'react';
import { ViewStyle } from 'react-native';
import type { PreparedSeat } from '../types';
interface SeatProps {
    seat: PreparedSeat;
    scale?: number;
    isSelected?: boolean;
    onPress?: (seat: PreparedSeat) => void;
    style?: ViewStyle;
}
export declare const Seat: React.FC<SeatProps>;
export {};
//# sourceMappingURL=Seat.d.ts.map