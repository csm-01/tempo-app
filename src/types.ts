export type TempoColor = 'BLUE' | 'WHITE' | 'RED' | 'UNKNOWN';

export type Subscription = 'TEMPO' | 'BLUE' | 'BLUE_HCHP';

export interface DayInfo {
  date: string;
  color: TempoColor;
}

export interface TempoStats {
  periode: string;
  blueUsed: number;
  blueRemaining: number;
  blueTotal: number;
  whiteUsed: number;
  whiteRemaining: number;
  whiteTotal: number;
  redUsed: number;
  redRemaining: number;
  redTotal: number;
}

export interface TempoPrices {
  bleuHC: number;
  bleuHP: number;
  blancHC: number;
  blancHP: number;
  rougeHC: number;
  rougeHP: number;
  dateDebut: string;
}

export interface CalendarDay {
  date: string;
  day: number;
  color: TempoColor;
}

export interface TempoData {
  today: DayInfo | null;
  tomorrow: DayInfo | null;
  stats: TempoStats | null;
  prices: TempoPrices | null;
  calendarDays: CalendarDay[];
  loading: boolean;
  error: string | null;
}
