"use strict";

import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, StyleSheet } from 'react-native';
import { ENTITY_STATUS_MAP, LOCALES_MAP, DEFAULT_LANG } from '../core/constants';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_COLORS = {
  [ENTITY_STATUS_MAP.available]: '#4CAF50',
  [ENTITY_STATUS_MAP.selected]: '#1157CE',
  [ENTITY_STATUS_MAP.preferred]: '#8BC34A',
  [ENTITY_STATUS_MAP.extra]: '#FF9800',
  [ENTITY_STATUS_MAP.unavailable]: '#9E9E9E',
  [ENTITY_STATUS_MAP.disabled]: '#ccc'
};
const STATUS_LABELS = {
  [ENTITY_STATUS_MAP.available]: 'Available',
  [ENTITY_STATUS_MAP.selected]: 'Selected',
  [ENTITY_STATUS_MAP.preferred]: 'Preferred',
  [ENTITY_STATUS_MAP.extra]: 'Extra charge',
  [ENTITY_STATUS_MAP.unavailable]: 'Not available',
  [ENTITY_STATUS_MAP.disabled]: ''
};
export const Tooltip = ({
  seat,
  visible,
  isSelected = false,
  lang = DEFAULT_LANG,
  photos = [],
  onSelect,
  onDeselect,
  onClose
}) => {
  if (!seat) return null;
  const locale = LOCALES_MAP[lang] ?? LOCALES_MAP[DEFAULT_LANG];
  const isUnavailable = seat.status === ENTITY_STATUS_MAP.unavailable;
  const statusColor = STATUS_COLORS[seat.status] ?? '#9E9E9E';
  const statusLabel = STATUS_LABELS[seat.status] ?? seat.status;
  return /*#__PURE__*/_jsx(Modal, {
    transparent: true,
    visible: visible,
    animationType: "slide",
    onRequestClose: onClose,
    children: /*#__PURE__*/_jsxs(View, {
      style: styles.overlay,
      children: [/*#__PURE__*/_jsx(TouchableOpacity, {
        style: styles.backdrop,
        activeOpacity: 1,
        onPress: onClose
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.sheet,
        children: [/*#__PURE__*/_jsx(View, {
          style: styles.handle
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.headerRow,
          children: [/*#__PURE__*/_jsx(Text, {
            style: styles.seatNumber,
            children: seat.number
          }), /*#__PURE__*/_jsx(View, {
            style: [styles.statusBadge, {
              backgroundColor: statusColor
            }],
            children: /*#__PURE__*/_jsx(Text, {
              style: styles.statusBadgeText,
              children: statusLabel
            })
          })]
        }), /*#__PURE__*/_jsx(Text, {
          style: styles.cabinType,
          children: seat.classType
        }), !!seat.price && /*#__PURE__*/_jsxs(View, {
          style: styles.priceRow,
          children: [/*#__PURE__*/_jsx(Text, {
            style: styles.priceLabel,
            children: "Price"
          }), /*#__PURE__*/_jsx(Text, {
            style: styles.priceValue,
            children: seat.price
          })]
        }), photos.length > 0 && /*#__PURE__*/_jsx(ScrollView, {
          horizontal: true,
          showsHorizontalScrollIndicator: false,
          style: styles.gallery,
          children: photos.map((uri, i) => /*#__PURE__*/_jsx(Image, {
            source: {
              uri
            },
            style: styles.photo,
            resizeMode: "cover"
          }, i))
        }), seat.measurements.length > 0 && /*#__PURE__*/_jsx(View, {
          style: styles.measurements,
          children: seat.measurements.map(m => /*#__PURE__*/_jsxs(View, {
            style: styles.measurementCell,
            children: [/*#__PURE__*/_jsx(Text, {
              style: styles.measurementValue,
              children: String(m.value ?? '--')
            }), /*#__PURE__*/_jsx(Text, {
              style: styles.measurementTitle,
              children: m.title
            })]
          }, m.uniqId))
        }), seat.features.length > 0 && /*#__PURE__*/_jsx(ScrollView, {
          style: styles.featuresList,
          showsVerticalScrollIndicator: false,
          children: seat.features.slice(0, 12).map(f => /*#__PURE__*/_jsxs(Text, {
            style: styles.featureItem,
            children: ["\xB7 ", f.value]
          }, f.uniqId))
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.actions,
          children: [isUnavailable ? /*#__PURE__*/_jsx(View, {
            style: [styles.button, styles.unavailableButton],
            children: /*#__PURE__*/_jsx(Text, {
              style: styles.unavailableText,
              children: "Seat is not available"
            })
          }) : isSelected ? /*#__PURE__*/_jsx(TouchableOpacity, {
            style: [styles.button, styles.deselectButton],
            onPress: () => {
              onDeselect?.(seat);
              onClose?.();
            },
            children: /*#__PURE__*/_jsx(Text, {
              style: styles.deselectText,
              children: locale['unselect'] ?? 'Unselect'
            })
          }) : /*#__PURE__*/_jsx(TouchableOpacity, {
            style: [styles.button, styles.selectButton],
            onPress: () => {
              onSelect?.(seat);
              onClose?.();
            },
            children: /*#__PURE__*/_jsx(Text, {
              style: styles.selectText,
              children: locale['select'] ?? 'Select'
            })
          }), /*#__PURE__*/_jsx(TouchableOpacity, {
            style: [styles.button, styles.closeButton],
            onPress: onClose,
            children: /*#__PURE__*/_jsx(Text, {
              style: styles.closeText,
              children: locale['cancel'] ?? 'Close'
            })
          })]
        })]
      })]
    })
  });
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end'
  },
  backdrop: {
    flex: 1
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    maxHeight: '80%'
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4
  },
  seatNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a2e'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  // Cabin
  cabinType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  // Price
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12
  },
  priceLabel: {
    fontSize: 14,
    color: '#555'
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1157ce'
  },
  // Photos
  gallery: {
    marginBottom: 12,
    height: 120
  },
  photo: {
    width: 160,
    height: 110,
    borderRadius: 8,
    marginRight: 8
  },
  // Measurements
  measurements: {
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden'
  },
  measurementCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#e0e4ea'
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2
  },
  measurementTitle: {
    fontSize: 11,
    color: '#888'
  },
  // Features
  featuresList: {
    maxHeight: 100,
    marginBottom: 16
  },
  featureItem: {
    fontSize: 13,
    color: '#4f6f8f',
    paddingVertical: 2
  },
  // Actions
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectButton: {
    backgroundColor: '#007AFF'
  },
  selectText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15
  },
  deselectButton: {
    backgroundColor: '#FF3B30'
  },
  deselectText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15
  },
  unavailableButton: {
    backgroundColor: '#f0f0f0'
  },
  unavailableText: {
    color: '#999',
    fontWeight: '600',
    fontSize: 14
  },
  closeButton: {
    backgroundColor: '#EDF0F3'
  },
  closeText: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: 15
  }
});
//# sourceMappingURL=Tooltip.js.map