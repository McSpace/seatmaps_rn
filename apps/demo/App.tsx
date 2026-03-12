import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import SeatMapScreen from './SeatMapScreen';
import type { FlightOption } from './flights';

export type RootStackParamList = {
  Home: undefined;
  SeatMap: { flight: FlightOption };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'SeatMap Demo' }}
        />
        <Stack.Screen
          name="SeatMap"
          component={SeatMapScreen}
          options={({ route }) => ({ title: route.params.flight.label })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
