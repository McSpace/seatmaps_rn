import React from 'react';
import { ViewStyle } from 'react-native';
import type { PreparedDeck } from '../types';
interface DeckSelectorProps {
    decks: PreparedDeck[];
    activeDeckIndex: number;
    onDeckChange: (index: number) => void;
    lang?: string;
    style?: ViewStyle;
}
export declare const DeckSelector: React.FC<DeckSelectorProps>;
export {};
//# sourceMappingURL=DeckSelector.d.ts.map