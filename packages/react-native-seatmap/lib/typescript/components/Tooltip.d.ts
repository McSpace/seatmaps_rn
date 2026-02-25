import React from 'react';
import type { PreparedSeat } from '../types';
interface TooltipProps {
    seat: PreparedSeat | null;
    visible: boolean;
    isSelected?: boolean;
    lang?: string;
    /** Optional per-seat photo URLs for the gallery */
    photos?: string[];
    onSelect?: (seat: PreparedSeat) => void;
    onDeselect?: (seat: PreparedSeat) => void;
    onClose?: () => void;
}
export declare const Tooltip: React.FC<TooltipProps>;
export {};
//# sourceMappingURL=Tooltip.d.ts.map