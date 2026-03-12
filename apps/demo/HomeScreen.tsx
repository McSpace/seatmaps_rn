import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FLIGHTS } from './flights';
import type { FlightOption } from './flights';
import type { RootStackParamList } from './App';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

function FlightCard({
  item,
  onPress,
}: {
  item: FlightOption;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardLabel}>{item.label}</Text>
        <Text style={styles.cardRoute}>{item.route}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Select a flight to view its seat map</Text>
      <FlatList
        data={FLIGHTS}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FlightCard
            item={item}
            onPress={() => navigation.navigate('SeatMap', { flight: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
    gap: 3,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    fontFamily: 'monospace',
  },
  cardRoute: {
    fontSize: 12,
    color: '#666',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  cardArrow: {
    fontSize: 22,
    color: '#1157ce',
    lineHeight: 22,
  },
});
