import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import type { PreparedSeat } from '../types';
import {
  ENTITY_STATUS_MAP,
  LOCALES_MAP,
  DEFAULT_LANG,
} from '../core/constants';

const STATUS_COLORS: Record<string, string> = {
  [ENTITY_STATUS_MAP.available]: '#4CAF50',
  [ENTITY_STATUS_MAP.selected]: '#1157CE',
  [ENTITY_STATUS_MAP.preferred]: '#8BC34A',
  [ENTITY_STATUS_MAP.extra]: '#FF9800',
  [ENTITY_STATUS_MAP.unavailable]: '#9E9E9E',
  [ENTITY_STATUS_MAP.disabled]: '#ccc',
};

const STATUS_LABELS: Record<string, string> = {
  [ENTITY_STATUS_MAP.available]: 'Available',
  [ENTITY_STATUS_MAP.selected]: 'Selected',
  [ENTITY_STATUS_MAP.preferred]: 'Preferred',
  [ENTITY_STATUS_MAP.extra]: 'Extra charge',
  [ENTITY_STATUS_MAP.unavailable]: 'Not available',
  [ENTITY_STATUS_MAP.disabled]: '',
};

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

export const Tooltip: React.FC<TooltipProps> = ({
  seat,
  visible,
  isSelected = false,
  lang = DEFAULT_LANG,
  photos = [],
  onSelect,
  onDeselect,
  onClose,
}) => {
  if (!seat) return null;

  const locale = LOCALES_MAP[lang] ?? LOCALES_MAP[DEFAULT_LANG];
  const isUnavailable = seat.status === ENTITY_STATUS_MAP.unavailable;
  const statusColor = STATUS_COLORS[seat.status] ?? '#9E9E9E';
  const statusLabel = STATUS_LABELS[seat.status] ?? seat.status;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tap backdrop to dismiss */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* Bottom sheet */}
        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Seat number + status badge */}
          <View style={styles.headerRow}>
            <Text style={styles.seatNumber}>{seat.number}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusBadgeText}>{statusLabel}</Text>
            </View>
          </View>

          {/* Cabin type */}
          <Text style={styles.cabinType}>{seat.classType}</Text>

          {/* Price */}
          {!!seat.price && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>{seat.price}</Text>
            </View>
          )}

          {/* Photo gallery */}
          {photos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.gallery}
            >
              {photos.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          {/* Measurements — compact 3-column grid */}
          {seat.measurements.length > 0 && (
            <View style={styles.measurements}>
              {seat.measurements.map(m => (
                <View key={m.uniqId} style={styles.measurementCell}>
                  <Text style={styles.measurementValue}>{String(m.value ?? '--')}</Text>
                  <Text style={styles.measurementTitle}>{m.title}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Features */}
          {seat.features.length > 0 && (
            <ScrollView
              style={styles.featuresList}
              showsVerticalScrollIndicator={false}
            >
              {seat.features.slice(0, 12).map(f => (
                <Text key={f.uniqId} style={styles.featureItem}>
                  · {f.value}
                </Text>
              ))}
            </ScrollView>
          )}

          {/* Action */}
          <View style={styles.actions}>
            {isUnavailable ? (
              <View style={[styles.button, styles.unavailableButton]}>
                <Text style={styles.unavailableText}>Seat is not available</Text>
              </View>
            ) : isSelected ? (
              <TouchableOpacity
                style={[styles.button, styles.deselectButton]}
                onPress={() => { onDeselect?.(seat); onClose?.(); }}
              >
                <Text style={styles.deselectText}>{locale['unselect'] ?? 'Unselect'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.selectButton]}
                onPress={() => { onSelect?.(seat); onClose?.(); }}
              >
                <Text style={styles.selectText}>{locale['select'] ?? 'Select'}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.closeText}>{locale['cancel'] ?? 'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  seatNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Cabin
  cabinType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#555',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1157ce',
  },

  // Photos
  gallery: {
    marginBottom: 12,
    height: 120,
  },
  photo: {
    width: 160,
    height: 110,
    borderRadius: 8,
    marginRight: 8,
  },

  // Measurements
  measurements: {
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  measurementCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#e0e4ea',
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  measurementTitle: {
    fontSize: 11,
    color: '#888',
  },

  // Features
  featuresList: {
    maxHeight: 100,
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 13,
    color: '#4f6f8f',
    paddingVertical: 2,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#007AFF',
  },
  selectText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  deselectButton: {
    backgroundColor: '#FF3B30',
  },
  deselectText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  unavailableButton: {
    backgroundColor: '#f0f0f0',
  },
  unavailableText: {
    color: '#999',
    fontWeight: '600',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#EDF0F3',
  },
  closeText: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: 15,
  },
});
