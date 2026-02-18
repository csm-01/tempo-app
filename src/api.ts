import type { DayInfo, TempoStats, TempoPrices, CalendarDay, TempoColor } from './types';
import { TEMPO_TOTALS } from './constants';

const BASE_URL = 'https://www.api-couleur-tempo.fr/api';

// ── Helpers ──────────────────────────────────────────────────

function mapColorLabel(label: string): TempoColor {
  switch (label.toLowerCase()) {
    case 'bleu':
      return 'BLUE';
    case 'blanc':
      return 'WHITE';
    case 'rouge':
      return 'RED';
    default:
      return 'UNKNOWN';
  }
}

function mapColorCode(code: number): TempoColor {
  switch (code) {
    case 1:
      return 'BLUE';
    case 2:
      return 'WHITE';
    case 3:
      return 'RED';
    default:
      return 'UNKNOWN';
  }
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// ── Public API ──────────────────────────────────────────────

export async function fetchToday(): Promise<DayInfo> {
  const data = await fetchJSON<{
    dateJour: string;
    codeJour: number;
    libCouleur: string;
  }>(`${BASE_URL}/jourTempo/today`);
  return { date: data.dateJour, color: mapColorLabel(data.libCouleur) };
}

export async function fetchTomorrow(): Promise<DayInfo> {
  const data = await fetchJSON<{
    dateJour: string;
    codeJour: number;
    libCouleur: string;
  }>(`${BASE_URL}/jourTempo/tomorrow`);
  return { date: data.dateJour, color: mapColorLabel(data.libCouleur) };
}

export async function fetchStats(): Promise<TempoStats> {
  const data = await fetchJSON<{
    periode: string;
    joursBleusConsommes: number;
    joursBlancsConsommes: number;
    joursRougesConsommes: number;
    joursBleusRestants: number;
    joursBlancsRestants: number;
    joursRougesRestants: number;
  }>(`${BASE_URL}/stats`);

  return {
    periode: data.periode,
    blueUsed: data.joursBleusConsommes,
    blueRemaining: data.joursBleusRestants,
    blueTotal: TEMPO_TOTALS.blue,
    whiteUsed: data.joursBlancsConsommes,
    whiteRemaining: data.joursBlancsRestants,
    whiteTotal: TEMPO_TOTALS.white,
    redUsed: data.joursRougesConsommes,
    redRemaining: data.joursRougesRestants,
    redTotal: TEMPO_TOTALS.red,
  };
}

export async function fetchPrices(): Promise<TempoPrices> {
  const data = await fetchJSON<{
    bleuHC: number;
    bleuHP: number;
    blancHC: number;
    blancHP: number;
    rougeHC: number;
    rougeHP: number;
    dateDebut: string;
  }>(`${BASE_URL}/tarifs`);

  return data;
}

export async function fetchCalendarMonth(
  year: number,
  month: number, // 0-indexed (0 = January)
): Promise<CalendarDay[]> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates: string[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    dates.push(`${year}-${mm}-${dd}`);
  }

  // Use the batch endpoint with dateJour[] query params
  const params = dates.map((d) => `dateJour[]=${d}`).join('&');
  const url = `${BASE_URL}/joursTempo?${params}`;

  try {
    const data = await fetchJSON<
      Array<{
        dateJour: string;
        codeJour: number;
        libCouleur: string;
      }>
    >(url);

    const result: CalendarDay[] = [];
    const dataMap = new Map(data.map((d) => [d.dateJour, d]));

    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      const entry = dataMap.get(dateStr);

      result.push({
        date: dateStr,
        day: d,
        color: entry ? mapColorCode(entry.codeJour) : 'UNKNOWN',
      });
    }

    return result;
  } catch {
    // Fallback: return empty array if API fails
    return dates.map((dateStr, i) => ({
      date: dateStr,
      day: i + 1,
      color: 'UNKNOWN' as TempoColor,
    }));
  }
}

export async function fetchNow(): Promise<{
  codeCouleur: number;
  codeHoraire: number;
  tarifKwh: number;
  libTarif: string;
}> {
  return fetchJSON(`${BASE_URL}/now`);
}
