/**
 * Unit tests for useSeatMap hook.
 *
 * These tests mock the API and storage layers so no real HTTP calls are made.
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSeatMap } from '../src/hooks/useSeatMap';
import type { IFlight, SeatMapConfig, SeatAvailability, Passenger } from '../src/types';

// ---- Mocks ----------------------------------------------------------------

const mockPrepareData = jest.fn();
const mockGetData = jest.fn();
const mockInit = jest.fn().mockResolvedValue(undefined);

jest.mock('../src/core/api', () => ({
  JetsApiService: jest.fn().mockImplementation(() => ({
    getData: mockGetData,
  })),
}));

jest.mock('../src/core/data-preparer', () => ({
  JetsContentPreparer: jest.fn().mockImplementation(() => ({
    prepareData: mockPrepareData,
  })),
}));

jest.mock('../src/core/storage', () => ({
  JetsStorageService: jest.fn().mockImplementation(() => ({
    init: mockInit,
    getData: jest.fn().mockReturnValue(null),
    setData: jest.fn(),
  })),
}));

// ---- Helpers ---------------------------------------------------------------

const FLIGHT: IFlight = { id: 'flight-123' };
const CONFIG: SeatMapConfig = { apiUrl: 'https://api.test', appId: 'app', apiKey: 'key' };

function makePreparedData(seats: { number: string; status?: string }[] = []) {
  return {
    content: [
      {
        uniqId: 'deck-1',
        number: 1,
        width: 400,
        height: 800,
        level: 1,
        rows: [
          {
            uniqId: 'row-1',
            number: '12',
            topOffset: 100,
            width: 400,
            height: 50,
            seatScheme: 'S',
            classCode: 'E',
            seatType: 1,
            seats: seats.map((s, i) => ({
              uniqId: `seat-${i}`,
              number: s.number,
              letter: s.number.replace(/\d/g, ''),
              type: 'seat',
              status: s.status ?? 'available',
              size: { width: 50, height: 50 },
              features: [],
              measurements: [],
              classCode: 'E',
              classType: 'Economy',
              seatType: 'E-1',
              seatIconType: 1,
            })),
          },
        ],
        wingsInfo: { start: 0, finish: 0, length: 0 },
      },
    ],
    params: { scale: 1, antiScale: 1 } as any,
    exits: [],
    bulks: [],
  };
}

// ---- Tests -----------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  mockGetData.mockResolvedValue({ seatDetails: { decks: [] }, plane: {} });
  mockPrepareData.mockReturnValue(makePreparedData([{ number: '12A' }, { number: '12B' }]));
});

describe('useSeatMap', () => {
  it('fires onSeatMapInited after successful fetch', async () => {
    const onSeatMapInited = jest.fn();
    renderHook(() => useSeatMap(FLIGHT, CONFIG, { onSeatMapInited }));
    await waitFor(() => expect(onSeatMapInited).toHaveBeenCalledTimes(1));
  });

  it('fires onAvailabilityApplied with available count', async () => {
    const onAvailabilityApplied = jest.fn();
    const availability: SeatAvailability[] = [
      { seatLabel: '12A', available: true },
      { seatLabel: '12B', available: false },
    ];
    // Simulate prepareData returning unavailable for 12B
    mockPrepareData.mockReturnValue(
      makePreparedData([
        { number: '12A', status: 'available' },
        { number: '12B', status: 'unavailable' },
      ])
    );
    renderHook(() => useSeatMap(FLIGHT, CONFIG, { onAvailabilityApplied }, undefined, availability));
    await waitFor(() => expect(onAvailabilityApplied).toHaveBeenCalledWith(1));
  });

  it('pre-selects seats for passengers with pre-assigned seats', async () => {
    const passengers: Passenger[] = [{ id: 'p1', seat: { seatLabel: '12A', price: 0 } }];
    const { result } = renderHook(() => useSeatMap(FLIGHT, CONFIG, {}, passengers));
    await waitFor(() => expect(result.current.data).not.toBeNull());
    const selectedIds = Object.keys(result.current.selectedSeats);
    expect(selectedIds.length).toBe(1);
    expect(result.current.selectedSeats[selectedIds[0]].number).toBe('12A');
  });

  it('calls onSeatSelected and onSeatUnselected via toggleSeat', async () => {
    const onSeatSelected = jest.fn();
    const onSeatUnselected = jest.fn();
    const { result } = renderHook(() =>
      useSeatMap(FLIGHT, CONFIG, { onSeatSelected, onSeatUnselected })
    );
    await waitFor(() => expect(result.current.data).not.toBeNull());

    const seat = result.current.data!.content[0].rows[0].seats[0];

    act(() => { result.current.toggleSeat(seat); });
    expect(onSeatSelected).toHaveBeenCalledWith(seat, undefined);

    act(() => { result.current.toggleSeat(seat); });
    expect(onSeatUnselected).toHaveBeenCalledWith(seat);
  });

  it('prevents deselecting a readOnly passenger seat', async () => {
    const passengers: Passenger[] = [
      { id: 'p1', seat: { seatLabel: '12A', price: 0 }, readOnly: true },
    ];
    const onSeatUnselected = jest.fn();
    const { result } = renderHook(() =>
      useSeatMap(FLIGHT, CONFIG, { onSeatUnselected }, passengers)
    );
    await waitFor(() => expect(result.current.data).not.toBeNull());

    const seat = result.current.data!.content[0].rows[0].seats.find(
      (s: any) => s.number === '12A'
    )!;

    // Seat is pre-selected; try to deselect
    act(() => { result.current.toggleSeat(seat); });
    expect(onSeatUnselected).not.toHaveBeenCalled();
  });
});
