# SeatMap — Demo App

Expo-приложение для демонстрации библиотеки `@seatmaps.com/react-native-seatmap`.

## Запуск

```sh
# Из корня монорепо
npm install
cd apps/demo
npx expo start
```

Затем откройте приложение в Expo Go на телефоне или в симуляторе.

---

## Что показывает демо

| Функция | Как увидеть |
|---------|-------------|
| Рендер карты мест | Запустить приложение |
| Availability (недоступные места) | Первые 3 места каждой деки серые — `unavailable` |
| Пассажир с предназначенным местом | Место **14A** предвыбрано (demo passenger) |
| Jump to seat | Введите метку места (напр. `22C`) и нажмите **Jump** |
| Callback-лог | Внизу экрана — все события в реальном времени |
| Multi-deck | DeckSelector появляется автоматически для самолётов с двумя палубами |
| Tooltip с деталями | Нажмите на любое место |

---

## Использование компонента `<SeatMap>` в вашем приложении

### Установка

```sh
npm install @seatmaps.com/react-native-seatmap react-native-svg @react-native-async-storage/async-storage
```

### Минимальный пример

```tsx
import { SeatMap } from '@seatmaps.com/react-native-seatmap';

export default function BookingScreen() {
  return (
    <SeatMap
      flight={{ id: 'UA123' }}
      apiUrl="https://api.example.com"
      appId="your-app-id"
      apiKey="your-api-key"
      width={350}
      lang="EN"
      onSeatMapInited={() => console.log('Карта готова')}
      onSeatSelected={(seat) => console.log('Выбрано:', seat.number)}
    />
  );
}
```

---

## Пропсы `<SeatMap>`

### Обязательные

| Проп | Тип | Описание |
|------|-----|----------|
| `flight` | `IFlight` | Объект рейса. Поле `flight.id` используется для API-запроса |
| `apiUrl` | `string` | Базовый URL API |
| `appId` | `string` | ID приложения для аутентификации |
| `apiKey` | `string` | API-ключ |

### Данные

| Проп | Тип | Описание |
|------|-----|----------|
| `passengers` | `Passenger[]` | Список пассажиров. Если у пассажира задан `seat.seatLabel` — место предвыбирается автоматически. `readOnly: true` запрещает снятие выбора |
| `availability` | `SeatAvailability[]` | Массив `{ seatLabel, available }`. Переопределяет статусы мест из API |
| `currentDeckIndex` | `number` | Контролируемый индекс активной деки (для внешнего управления) |
| `openedTooltipSeatLabel` | `string` | При изменении — скроллит к месту и открывает тултип |

### Конфигурация

| Проп | Тип | По умолчанию | Описание |
|------|-----|-------------|----------|
| `width` | `number` | `400` | Ширина компонента в пикселях |
| `lang` | `string` | `'EN'` | Язык (`'EN'`, `'RU'`, `'DE'`, `'FR'` и др.) |
| `units` | `'metric' \| 'imperials'` | — | Единицы измерения |
| `horizontal` | `boolean` | `false` | Горизонтальный режим |
| `rightToLeft` | `boolean` | `false` | Направление справа налево |
| `visibleFuselage` | `boolean` | `true` | Показывать контур фюзеляжа |
| `visibleWings` | `boolean` | `false` | Показывать крылья |
| `visibleCabinTitles` | `boolean` | `true` | Показывать заголовки классов кабины |
| `customCabinTitles` | `Record<string, string>` | — | Переопределить названия классов: `{ F: 'Первый', B: 'Бизнес' }` |
| `builtInTooltip` | `boolean` | `true` | Встроенный тултип при нажатии на место |
| `builtInDeckSelector` | `boolean` | `true` | Встроенный переключатель деки |
| `singleDeckMode` | `boolean` | `false` | Показывать только одну деку |
| `colorTheme` | `ColorTheme` | — | Переопределение цветов |

### Колбэки

| Колбэк | Сигнатура | Когда вызывается |
|--------|-----------|-----------------|
| `onSeatMapInited` | `() => void` | После загрузки данных — карта готова к работе |
| `onSeatSelected` | `(seat, passenger?) => void` | Место выбрано |
| `onSeatUnselected` | `(seat) => void` | Место снято с выбора |
| `onLayoutUpdated` | `({ width, height }) => void` | Размер компонента изменился |
| `onTooltipRequested` | `(seat) => void` | Тултип открывается |
| `onAvailabilityApplied` | `(count) => void` | Availability применена; `count` — количество доступных мест |
| `onDeckChange` | `(deckIndex) => void` | Активная дека изменилась |

> **Устаревшие имена** (работают, но не рекомендуются):
> `onSeatPress` → используйте `onSeatSelected`,
> `onSeatDeselect` → используйте `onSeatUnselected`

---

## Императивное API — `SeatMapRef`

```tsx
import { useRef } from 'react';
import { SeatMap } from '@seatmaps.com/react-native-seatmap';
import type { SeatMapRef } from '@seatmaps.com/react-native-seatmap';

function BookingScreen() {
  const mapRef = useRef<SeatMapRef>(null);

  return (
    <>
      <SeatMap
        ref={mapRef}
        flight={{ id: 'UA123' }}
        apiUrl="..."
        appId="..."
        apiKey="..."
      />
      <Button
        title="Перейти к месту 22C"
        onPress={() => mapRef.current?.seatJumpTo('22C')}
      />
    </>
  );
}
```

| Метод | Описание |
|-------|----------|
| `seatJumpTo(seatLabel)` | Скроллит к месту с указанной меткой и открывает тултип |

---

## Типы

### `IFlight`

```ts
interface IFlight {
  id: string;            // обязательно — используется в URL запроса
  airlineIata?: string;  // IATA-код авиакомпании, напр. "UA"
  flightNumber?: string; // номер рейса, напр. "123"
  cabinCode?: string;    // класс, напр. "E", "B", "F"
  origin?: string;       // аэропорт отправления
  destination?: string;  // аэропорт назначения
  departureDate?: string;// дата вылета (ISO-строка)
}
```

### `Passenger`

```ts
interface Passenger {
  readonly id: string;
  seat?: {
    seatLabel: string; // метка предназначенного места, напр. "14A"
    price: number;
  };
  passengerType?: string;   // 'ADT' | 'CHD' | 'INF'
  passengerLabel?: string;  // отображаемая метка (инициал и т.п.)
  passengerColor?: string;  // цвет выделения места
  readOnly?: boolean;       // true — запретить снятие с выбора
}
```

### `SeatAvailability`

```ts
interface SeatAvailability {
  seatLabel: string;  // метка места, напр. "14A"
  available: boolean; // true — доступно, false — недоступно
}
```

---

## Полный пример с пассажирами и availability

```tsx
import { SeatMap } from '@seatmaps.com/react-native-seatmap';
import type { SeatMapRef, Passenger, SeatAvailability } from '@seatmaps.com/react-native-seatmap';
import { useRef } from 'react';

const passengers: Passenger[] = [
  {
    id: 'p1',
    passengerType: 'ADT',
    passengerLabel: 'Иван',
    seat: { seatLabel: '14A', price: 0 },
    readOnly: true,  // нельзя снять с выбора
  },
  {
    id: 'p2',
    passengerType: 'CHD',
    passengerLabel: 'Аня',
  },
];

// Получается с сервера бронирования
const availability: SeatAvailability[] = [
  { seatLabel: '1A', available: false },
  { seatLabel: '1B', available: false },
  { seatLabel: '14A', available: true },
  // ...
];

export default function BookingScreen() {
  const mapRef = useRef<SeatMapRef>(null);

  return (
    <SeatMap
      ref={mapRef}
      flight={{ id: 'UA123', airlineIata: 'UA', origin: 'JFK', destination: 'LAX' }}
      apiUrl="https://api.example.com"
      appId="my-app"
      apiKey="my-key"
      width={360}
      lang="RU"
      passengers={passengers}
      availability={availability}
      builtInDeckSelector
      builtInTooltip
      onSeatMapInited={() => console.log('Карта загружена')}
      onSeatSelected={(seat, passenger) =>
        console.log(`Пассажир ${passenger?.id ?? '?'} выбрал ${seat.number}`)
      }
      onSeatUnselected={(seat) => console.log(`Место ${seat.number} снято`)}
      onAvailabilityApplied={(count) => console.log(`Доступно мест: ${count}`)}
      onDeckChange={(index) => console.log(`Активная дека: ${index + 1}`)}
    />
  );
}
```

---

## Почему демо использует Deck/Tooltip напрямую?

Компонент `<SeatMap>` ожидает GET-запрос по схеме `GET ${apiUrl}/flight/${flight.id}`.
Sandbox API (quicket.io) использует `POST` с телом запроса — несовместимый формат.

Поэтому демо самостоятельно делает `fetch()` и передаёт подготовленные данные
напрямую в низкоуровневые компоненты `<Deck>` и `<Tooltip>`.

Если ваш backend соответствует схеме GET — используйте `<SeatMap>` напрямую.

---

## Структура монорепо

```
ReactNative/
├── apps/
│   └── demo/          ← это приложение
└── packages/
    └── react-native-seatmap/  ← исходная библиотека
        └── README.md  ← полная документация по пакету
```
