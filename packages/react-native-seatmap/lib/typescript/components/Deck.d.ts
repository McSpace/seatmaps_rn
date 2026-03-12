import React from 'react';
import { ScrollView } from 'react-native';
import type { PreparedDeck, PreparedSeat } from '../types';
interface ExitData {
    uniqId: string;
    type: 'left' | 'right';
    topOffset: number;
}
interface BulkData {
    uniqId: string;
    id: string;
    align: 'left' | 'right' | 'center';
    topOffset: number;
    width: number;
    height: number;
    iconType?: string;
}
interface DeckProps {
    deck: PreparedDeck;
    exits?: ExitData[];
    bulks?: BulkData[];
    scale?: number;
    selectedSeats?: Record<string, PreparedSeat>;
    onSeatPress?: (seat: PreparedSeat) => void;
    /** Ref forwarded to the inner ScrollView for programmatic scrolling */
    scrollViewRef?: React.RefObject<ScrollView | null>;
    /** Show nose/tail SVG fuselage caps */
    visibleFuselage?: boolean;
    /** Show cabin class title strips on the sides */
    visibleCabinTitles?: boolean;
    /** Aircraft nose type key, e.g. 'B787', 'A320' (falls back to 'default') */
    noseType?: string;
}
export declare const Deck: React.FC<DeckProps>;
export {};
//# sourceMappingURL=Deck.d.ts.map