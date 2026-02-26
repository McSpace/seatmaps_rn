import { JetsContentPreparer } from '../src/core/data-preparer';

const BASE_CONFIG = {
  width: 400,
  lang: 'EN',
  colorTheme: { customSeatColorRanges: [] },
};

/** Minimal API response stub for one deck with one row and two seats */
function makeApiData(seatOverrides: Record<string, unknown> = {}) {
  return {
    seatDetails: {
      decks: [
        {
          level: 1,
          wingsInfo: null,
          exits: [],
          bulks: [],
          rows: [
            {
              number: '12',
              topOffset: 100,
              seatScheme: 'SS',
              classCode: 'E',
              seatType: 1,
              name: 'row-12',
              seats: [
                { letter: 'A', seatType: 1, features: {}, ...seatOverrides },
                { letter: 'B', seatType: 1, features: {}, ...seatOverrides },
              ],
            },
          ],
        },
      ],
    },
    E: {
      cabin: { pitch: 30, width: 17, recline: 3 },
      entertainment: { exists: false },
      power: { exists: false },
      wifi: { exists: false },
      bluetooth: { exists: false },
    },
    plane: { noseType: 'default' },
  };
}

describe('JetsContentPreparer', () => {
  let preparer: JetsContentPreparer;

  beforeEach(() => {
    preparer = new JetsContentPreparer();
  });

  describe('_prepareSeat status', () => {
    it('defaults to "available" when API seat has no status', () => {
      const result = preparer.prepareData(makeApiData(), BASE_CONFIG);
      const seats = result.content[0].rows[0].seats.filter((s: any) => s.type === 'seat');
      seats.forEach((seat: any) => expect(seat.status).toBe('available'));
    });

    it('uses status from API data when present', () => {
      const result = preparer.prepareData(makeApiData({ status: 'unavailable' }), BASE_CONFIG);
      const seats = result.content[0].rows[0].seats.filter((s: any) => s.type === 'seat');
      seats.forEach((seat: any) => expect(seat.status).toBe('unavailable'));
    });

    it('applies availabilityMap to override seat status', () => {
      const config = { ...BASE_CONFIG, availabilityMap: { '12A': false, '12B': true } };
      const result = preparer.prepareData(makeApiData(), config);
      const seats = result.content[0].rows[0].seats.filter((s: any) => s.type === 'seat');
      const seatA = seats.find((s: any) => s.number === '12A');
      const seatB = seats.find((s: any) => s.number === '12B');
      expect(seatA?.status).toBe('unavailable');
      expect(seatB?.status).toBe('available');
    });

    it('uses customCabinTitles when provided', () => {
      const config = { ...BASE_CONFIG, customCabinTitles: { E: 'Economy Plus' } };
      const result = preparer.prepareData(makeApiData(), config);
      const seat = result.content[0].rows[0].seats.find((s: any) => s.type === 'seat');
      expect(seat?.classType).toBe('Economy Plus');
    });
  });
});
