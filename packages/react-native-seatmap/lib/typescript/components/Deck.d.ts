import React from 'react';
import type { PreparedDeck, PreparedSeat } from '../types';
interface ExitData {
    uniqId: string;
    type: 'left' | 'right';
    topOffset: number;
}
interface BulkData {
    uniqId: string;
    align: 'left' | 'right' | 'center';
    topOffset: number;
    width: number;
    height: number;
}
interface DeckProps {
    deck: PreparedDeck;
    exits?: ExitData[];
    bulks?: BulkData[];
    scale?: number;
    selectedSeats?: Record<string, PreparedSeat>;
    onSeatPress?: (seat: PreparedSeat) => void;
}
export declare const Deck: React.FC<DeckProps>;
export {};
//# sourceMappingURL=Deck.d.ts.map