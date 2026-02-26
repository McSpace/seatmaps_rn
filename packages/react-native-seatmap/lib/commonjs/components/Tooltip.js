"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _constants = require("../core/constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const STATUS_COLORS = {
  [_constants.ENTITY_STATUS_MAP.available]: '#4CAF50',
  [_constants.ENTITY_STATUS_MAP.selected]: '#1157CE',
  [_constants.ENTITY_STATUS_MAP.preferred]: '#8BC34A',
  [_constants.ENTITY_STATUS_MAP.extra]: '#FF9800',
  [_constants.ENTITY_STATUS_MAP.unavailable]: '#9E9E9E',
  [_constants.ENTITY_STATUS_MAP.disabled]: '#ccc'
};
const STATUS_LABELS = {
  [_constants.ENTITY_STATUS_MAP.available]: 'Available',
  [_constants.ENTITY_STATUS_MAP.selected]: 'Selected',
  [_constants.ENTITY_STATUS_MAP.preferred]: 'Preferred',
  [_constants.ENTITY_STATUS_MAP.extra]: 'Extra charge',
  [_constants.ENTITY_STATUS_MAP.unavailable]: 'Not available',
  [_constants.ENTITY_STATUS_MAP.disabled]: ''
};
const Tooltip = ({
  seat,
  visible,
  isSelected = false,
  lang = _constants.DEFAULT_LANG,
  photos = [],
  onSelect,
  onDeselect,
  onClose
}) => {
  if (!seat) return null;
  const locale = _constants.LOCALES_MAP[lang] ?? _constants.LOCALES_MAP[_constants.DEFAULT_LANG];
  const isUnavailable = seat.status === _constants.ENTITY_STATUS_MAP.unavailable;
  const statusColor = STATUS_COLORS[seat.status] ?? '#9E9E9E';
  const statusLabel = STATUS_LABELS[seat.status] ?? seat.status;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Modal, {
    transparent: true,
    visible: visible,
    animationType: "slide",
    onRequestClose: onClose,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.overlay,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
        style: styles.backdrop,
        activeOpacity: 1,
        onPress: onClose
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: styles.sheet,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.handle
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
          style: styles.headerRow,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.seatNumber,
            children: seat.number
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: [styles.statusBadge, {
              backgroundColor: statusColor
            }],
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.statusBadgeText,
              children: statusLabel
            })
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.cabinType,
          children: seat.classType
        }), !!seat.price && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
          style: styles.priceRow,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.priceLabel,
            children: "Price"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.priceValue,
            children: seat.price
          })]
        }), photos.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
          horizontal: true,
          showsHorizontalScrollIndicator: false,
          style: styles.gallery,
          children: photos.map((uri, i) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Image, {
            source: {
              uri
            },
            style: styles.photo,
            resizeMode: "cover"
          }, i))
        }), seat.measurements.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.measurements,
          children: seat.measurements.map(m => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
            style: styles.measurementCell,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.measurementValue,
              children: String(m.value ?? '--')
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.measurementTitle,
              children: m.title
            })]
          }, m.uniqId))
        }), seat.features.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
          style: styles.featuresList,
          showsVerticalScrollIndicator: false,
          children: seat.features.slice(0, 12).map(f => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, {
            style: styles.featureItem,
            children: ["\xB7 ", f.value]
          }, f.uniqId))
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
          style: styles.actions,
          children: [isUnavailable ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: [styles.button, styles.unavailableButton],
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.unavailableText,
              children: "Seat is not available"
            })
          }) : isSelected ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
            style: [styles.button, styles.deselectButton],
            onPress: () => {
              onDeselect?.(seat);
              onClose?.();
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.deselectText,
              children: locale['unselect'] ?? 'Unselect'
            })
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
            style: [styles.button, styles.selectButton],
            onPress: () => {
              onSelect?.(seat);
              onClose?.();
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.selectText,
              children: locale['select'] ?? 'Select'
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
            style: [styles.button, styles.closeButton],
            onPress: onClose,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.closeText,
              children: locale['cancel'] ?? 'Close'
            })
          })]
        })]
      })]
    })
  });
};
exports.Tooltip = Tooltip;
const styles = _reactNative.StyleSheet.create({
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