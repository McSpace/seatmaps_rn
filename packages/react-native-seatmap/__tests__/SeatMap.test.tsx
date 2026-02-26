/**
 * Render tests for the SeatMap component.
 */
import React, { createRef } from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SeatMap } from '../src/components/SeatMap';
import type { SeatMapRef, IFlight } from '../src/types';

// ---- Mocks ----------------------------------------------------------------

const mockPrepareData = jest.fn();
const mockGetData = jest.fn();

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
    init: jest.fn().mockResolvedValue(undefined),
    getData: jest.fn().mockReturnValue(null),
    setData: jest.fn(),
  })),
}));

jest.mock('react-native-svg', () => ({
  SvgXml: 'SvgXml',
}));

// ---- Helpers ---------------------------------------------------------------

const FLIGHT: IFlight = { id: 'test-flight' };
const CONFIG = { apiUrl: 'https://api.test', appId: 'app', apiKey: 'key' };

function emptyPreparedData() {
  return { content: [], params: {} as any, exits: [], bulks: [] };
}

// ---- Tests -----------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  mockGetData.mockResolvedValue({});
  mockPrepareData.mockReturnValue(emptyPreparedData());
});

describe('SeatMap', () => {
  it('renders without crashing', () => {
    // useSeatMap initialises with loading=false, so the initial render shows
    // the "no data" state synchronously while the async fetch is pending.
    const { getByText } = render(<SeatMap flight={FLIGHT} {...CONFIG} />);
    expect(getByText('No seat data available.')).toBeTruthy();
  });

  it('renders "no data" message when content is empty', async () => {
    const { getByText } = render(<SeatMap flight={FLIGHT} {...CONFIG} />);
    await waitFor(() => expect(getByText('No seat data available.')).toBeTruthy());
  });

  it('fires onSeatMapInited after load', async () => {
    const onSeatMapInited = jest.fn();
    render(<SeatMap flight={FLIGHT} {...CONFIG} onSeatMapInited={onSeatMapInited} />);
    await waitFor(() => expect(onSeatMapInited).toHaveBeenCalledTimes(1));
  });

  it('exposes seatJumpTo via ref without throwing', async () => {
    const ref = createRef<SeatMapRef>();
    render(<SeatMap ref={ref} flight={FLIGHT} {...CONFIG} />);
    await waitFor(() => expect(ref.current).not.toBeNull());
    expect(() => ref.current?.seatJumpTo('12A')).not.toThrow();
  });
});
