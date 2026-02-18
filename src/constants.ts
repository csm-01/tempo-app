// ============================================================
// Theme colors
// ============================================================

export const COLORS = {
  // Background gradient
  gradientStart: '#0B3D91',
  gradientMiddle: '#1976D2',
  gradientEnd: '#64B5F6',

  // Tempo day colors
  tempoBlue: '#2979FF',
  tempoBlueDark: '#1565C0',
  tempoWhite: '#F3F3F3',
  tempoWhiteBorder: '#D5D5D5',
  tempoRed: '#FF5252',
  tempoRedDark: '#D32F2F',
  tempoUnknown: '#FAFAFA',
  tempoUnknownSlash: '#B0B0B0',

  // Cards
  card: '#FFFFFF',
  cardBorder: 'rgba(255,255,255,0.2)',

  // Text
  textPrimary: '#1A237E',
  textSecondary: '#546E7A',
  textOnDark: '#FFFFFF',
  textOnCard: '#263238',
  textMuted: '#90A4AE',

  // Indicators
  savings: '#4CAF50',
  savingsLight: '#E8F5E9',
  expensive: '#FF5252',
  expensiveLight: '#FFEBEE',

  // Misc
  separator: 'rgba(255,255,255,0.15)',
  overlay: 'rgba(0,0,0,0.05)',
  white: '#FFFFFF',
  black: '#000000',
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardSmall: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
};

// ============================================================
// Prices (February 2026 - 6 kVA)
// ============================================================

export const EDF_BLUE_BASE_PRICE = 0.194; // €/kWh TTC Option Base
export const EDF_BLUE_HP_PRICE = 0.2081; // €/kWh TTC Option HP/HC - Heures Pleines
export const EDF_BLUE_HC_PRICE = 0.1579; // €/kWh TTC Option HP/HC - Heures Creuses (Feb 2026 est.)

// Tempo periods per year
export const TEMPO_TOTALS = {
  blue: 300,
  white: 43,
  red: 22,
};

// Peak / Off-peak schedule
export const HOURS = {
  peakStart: 6,
  peakEnd: 22,
  peakLabel: '6h - 22h',
  offPeakLabel: '22h - 6h',
};

// ============================================================
// French locale helpers
// ============================================================

export const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const DAYS_SHORT_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
