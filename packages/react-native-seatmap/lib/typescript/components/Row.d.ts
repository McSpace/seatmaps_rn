import React from 'react';
import { ViewStyle } from 'react-native';
import type { PreparedRow, PreparedSeat } from '../types';
interface RowProps {
    row: PreparedRow;
    scale?: number;
    selectedSeats?: Record<string, PreparedSeat>;
    onSeatPress?: (seat: PreparedSeat) => void;
    style?: ViewStyle;
}
export declare const Row: React.FC<RowProps>;
export {};
//# sourceMappingURL=Row.d.ts.map