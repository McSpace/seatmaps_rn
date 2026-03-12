"use strict";

import React, { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Deck } from './Deck';
import { DeckSelector } from './DeckSelector';
import { Tooltip } from './Tooltip';
import { useSeatMap } from '../hooks/useSeatMap';
import { DEFAULT_LANG, DEFAULT_SEAT_MAP_WIDTH, THEME_BACKGROUND_COLOR } from '../core/constants';
import { getNoseAspectRatio } from '../core/nose-templates';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export const SeatMap = /*#__PURE__*/forwardRef(({
  flight,
  width = DEFAULT_SEAT_MAP_WIDTH,
  lang = DEFAULT_LANG,
  style,
  passengers,
  availability,
  currentDeckIndex,
  openedTooltipSeatLabel,
  // callbacks
  onSeatMapInited,
  onSeatSelected,
  onSeatUnselected,
  onLayoutUpdated,
  onTooltipRequested,
  onAvailabilityApplied,
  onDeckChange,
  onSeatPress,
  onSeatDeselect,
  ...config
}, ref) => {
  const [tooltipSeat, setTooltipSeat] = useState(null);
  const scrollViewRef = useRef(null);
  const {
    data,
    loading,
    error,
    activeDeckIndex,
    selectedSeats,
    setActiveDeckIndex,
    toggleSeat
  } = useSeatMap(flight, {
    ...config,
    width,
    lang
  }, {
    onSeatMapInited,
    onSeatSelected,
    onSeatUnselected,
    onAvailabilityApplied,
    onDeckChange,
    onSeatPress,
    onSeatDeselect
  }, passengers, availability);

  // Sync external currentDeckIndex → internal state
  useEffect(() => {
    if (currentDeckIndex !== undefined && currentDeckIndex !== activeDeckIndex) {
      setActiveDeckIndex(currentDeckIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDeckIndex]);

  // Handle openedTooltipSeatLabel: scroll + open tooltip
  useEffect(() => {
    if (!openedTooltipSeatLabel || !data) return;
    const deck = data.content[activeDeckIndex];
    if (!deck) return;
    for (const row of deck.rows) {
      const seat = row.seats.find(s => s.type === 'seat' && s.number === openedTooltipSeatLabel);
      if (seat) {
        const scale = data.params.scale;
        const noseOffset = data.params.visibleFuselage ? width * getNoseAspectRatio(data.params.noseType ?? 'default') : 0;
        scrollViewRef.current?.scrollTo({
          y: noseOffset + row.topOffset * scale,
          animated: true
        });
        setTooltipSeat(seat);
        onTooltipRequested?.(seat);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedTooltipSeatLabel]);

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    seatJumpTo: seatLabel => {
      if (!data) return;
      const deck = data.content[activeDeckIndex];
      if (!deck) return;
      for (const row of deck.rows) {
        const seat = row.seats.find(s => s.type === 'seat' && s.number === seatLabel);
        if (seat) {
          const scale = data.params.scale;
          const noseOffset = data.params.visibleFuselage ? width * getNoseAspectRatio(data.params.noseType ?? 'default') : 0;
          scrollViewRef.current?.scrollTo({
            y: noseOffset + row.topOffset * scale,
            animated: true
          });
          setTooltipSeat(seat);
          onTooltipRequested?.(seat);
          break;
        }
      }
    }
  }), [data, activeDeckIndex, onTooltipRequested]);
  const handleSeatPress = useCallback(seat => {
    if (config.builtInTooltip !== false) {
      setTooltipSeat(seat);
      onTooltipRequested?.(seat);
    } else {
      toggleSeat(seat);
    }
  }, [config.builtInTooltip, toggleSeat, onTooltipRequested]);
  const handleTooltipSelect = useCallback((seat, passenger) => {
    toggleSeat(seat, passenger);
    setTooltipSeat(null);
  }, [toggleSeat]);
  const handleTooltipDeselect = useCallback(seat => {
    toggleSeat(seat);
    setTooltipSeat(null);
  }, [toggleSeat]);
  if (loading) {
    return /*#__PURE__*/_jsx(View, {
      style: [styles.center, {
        width
      }, style],
      children: /*#__PURE__*/_jsx(ActivityIndicator, {
        size: "large"
      })
    });
  }
  if (error) {
    return /*#__PURE__*/_jsx(View, {
      style: [styles.center, {
        width
      }, style],
      children: /*#__PURE__*/_jsx(Text, {
        style: styles.errorText,
        children: error
      })
    });
  }
  if (!data || !data.content.length) {
    return /*#__PURE__*/_jsx(View, {
      style: [styles.center, {
        width
      }, style],
      children: /*#__PURE__*/_jsx(Text, {
        style: styles.emptyText,
        children: "No seat data available."
      })
    });
  }
  const {
    content: decks,
    params
  } = data;
  const activeDeck = decks[activeDeckIndex];
  const scale = params.scale;
  return /*#__PURE__*/_jsxs(View, {
    style: [styles.container, {
      width,
      backgroundColor: THEME_BACKGROUND_COLOR
    }, style],
    onLayout: e => {
      const {
        width: w,
        height: h
      } = e.nativeEvent.layout;
      onLayoutUpdated?.({
        width: w,
        height: h
      });
    },
    children: [config.builtInDeckSelector !== false && decks.length > 1 && /*#__PURE__*/_jsx(DeckSelector, {
      decks: decks,
      activeDeckIndex: activeDeckIndex,
      onDeckChange: setActiveDeckIndex,
      lang: lang
    }), activeDeck && /*#__PURE__*/_jsx(Deck, {
      deck: activeDeck,
      exits: data.exits?.[activeDeckIndex] ?? [],
      bulks: data.bulks?.[activeDeckIndex] ?? [],
      scale: scale,
      selectedSeats: selectedSeats,
      onSeatPress: handleSeatPress,
      scrollViewRef: scrollViewRef,
      visibleFuselage: params.visibleFuselage,
      visibleCabinTitles: params.visibleCabinTitles,
      noseType: params.noseType
    }), config.builtInTooltip !== false && /*#__PURE__*/_jsx(Tooltip, {
      seat: tooltipSeat,
      visible: !!tooltipSeat,
      isSelected: tooltipSeat ? !!selectedSeats[tooltipSeat.uniqId] : false,
      lang: lang,
      onSelect: handleTooltipSelect,
      onDeselect: handleTooltipDeselect,
      onClose: () => setTooltipSeat(null)
    })]
  });
});
SeatMap.displayName = 'SeatMap';
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center'
  }
});
//# sourceMappingURL=SeatMap.js.map