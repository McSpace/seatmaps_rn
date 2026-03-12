/**
 * Flight configurations for the demo home screen.
 * Each entry contains the POST body for the sandbox API plus display metadata.
 */

export interface FlightRequest {
  flight: {
    id: string;
    airlineCode: string;
    flightNo: string;
    departureDate: string;
    departure: string;
    arrival: string;
    cabinClass: string;
    planeCode: string;
  };
  lang: string;
  units: string;
}

export interface FlightOption {
  key: string;
  label: string;
  route: string;
  date: string;
  request: FlightRequest;
  /** Reserved for per-flight visual settings (color theme, lang, etc.) */
  displayConfig: Record<string, unknown>;
}

export const FLIGHTS: FlightOption[] = [
  {
    key: 'ua953',
    label: 'UA953 · ORD → MUC',
    route: 'Chicago → Munich',
    date: '17 May 2026',
    request: {
      flight: {
        id: 'ua953',
        airlineCode: 'UA',
        flightNo: '953',
        departureDate: '2026-05-17',
        departure: 'ORD',
        arrival: 'MUC',
        cabinClass: 'B',
        planeCode: '',
      },
      lang: 'EN',
      units: 'metric',
    },
    displayConfig: {},
  },
  {
    key: 'qt777',
    label: 'QT777 · DXB → LHR',
    route: 'Dubai → London',
    date: '7 Mar 2026',
    request: {
      flight: {
        id: 'demo',
        airlineCode: 'QT',
        flightNo: '777',
        departureDate: '2026-03-07',
        departure: 'DXB',
        arrival: 'LHR',
        cabinClass: 'A',
        planeCode: '',
      },
      lang: 'EN',
      units: 'metric',
    },
    displayConfig: {},
  },
  {
    key: 'dl898',
    label: 'DL898 · ATL → LAX',
    route: 'Atlanta → Los Angeles',
    date: '12 May 2026',
    request: {
      flight: {
        id: 'dl898',
        airlineCode: 'DL',
        flightNo: '898',
        departureDate: '2026-05-12',
        departure: 'ATL',
        arrival: 'LAX',
        cabinClass: 'E',
        planeCode: '',
      },
      lang: 'EN',
      units: 'metric',
    },
    displayConfig: {},
  },
  {
    key: 'as1002',
    label: 'AS1002 · HNL → ITO',
    route: 'Honolulu → Hilo',
    date: '22 Jun 2026',
    request: {
      flight: {
        id: 'as1002',
        airlineCode: 'AS',
        flightNo: '1002',
        departureDate: '2026-06-22',
        departure: 'HNL',
        arrival: 'ITO',
        cabinClass: 'B',
        planeCode: '',
      },
      lang: 'EN',
      units: 'metric',
    },
    displayConfig: {},
  },
  {
    key: 'lh470',
    label: 'LH470 · FRA → YYZ',
    route: 'Frankfurt → Toronto',
    date: '31 May 2026',
    request: {
      flight: {
        id: 'lh470',
        airlineCode: 'LH',
        flightNo: '470',
        departureDate: '2026-05-31',
        departure: 'FRA',
        arrival: 'YYZ',
        cabinClass: 'B',
        planeCode: '',
      },
      lang: 'EN',
      units: 'metric',
    },
    displayConfig: {},
  },
];
