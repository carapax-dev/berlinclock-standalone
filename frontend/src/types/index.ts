export interface BerlinClockTime {
  secondsLamp: string;
  fiveHoursRow: string;
  singleHoursRow: string;
  fiveMinutesRow: string;
  singleMinutesRow: string;
  currentTime: string;
}

export interface DecodeResponse {
  time: string;
}

export type AppMode = 'realtime' | 'convert' | 'decode' | 'info';