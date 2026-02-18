import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../constants';
import { useI18n } from '../i18n';
import { fetchCalendarMonth } from '../api';
import type { CalendarDay, TempoColor } from '../types';

interface Props {
  initialYear: number;
  initialMonth: number;
}

function getDayColor(color: TempoColor): string {
  switch (color) {
    case 'BLUE': return COLORS.tempoBlue;
    case 'WHITE': return COLORS.tempoWhite;
    case 'RED': return COLORS.tempoRed;
    default: return COLORS.tempoUnknown;
  }
}

function getDayTextColor(color: TempoColor): string {
  if (color === 'WHITE') return '#555555';
  if (color === 'UNKNOWN') return '#AAAAAA';
  return COLORS.white;
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function SlashOverlay() {
  return (
    <View style={styles.slashContainer} pointerEvents="none">
      <View style={styles.slashLine} />
    </View>
  );
}

export default function Calendar({ initialYear, initialMonth }: Props) {
  const { t } = useI18n();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  const months = t('cal.months').split(',');
  const daysShort = t('cal.days').split(',');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCalendarMonth(year, month).then((data) => {
      if (!cancelled) { setDays(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [year, month]);

  const goToPrev = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else { setMonth(month - 1); } };
  const goToNext = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else { setMonth(month + 1); } };

  const firstDay = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const rows: (CalendarDay | null)[][] = [];
  let currentRow: (CalendarDay | null)[] = [];
  for (let i = 0; i < firstDay; i++) currentRow.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const calDay = days.find((cd) => cd.day === d);
    currentRow.push(calDay ?? { date: '', day: d, color: 'UNKNOWN' as TempoColor });
    if (currentRow.length === 7) { rows.push(currentRow); currentRow = []; }
  }
  if (currentRow.length > 0) { while (currentRow.length < 7) currentRow.push(null); rows.push(currentRow); }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('cal.title')}</Text>
      <View style={[styles.card, SHADOWS.card]}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={goToPrev} style={styles.navButton}><Text style={styles.navArrow}>‹</Text></TouchableOpacity>
          <Text style={styles.monthTitle}>{months[month]} {year}</Text>
          <TouchableOpacity onPress={goToNext} style={styles.navButton}><Text style={styles.navArrow}>›</Text></TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {daysShort.map((day, i) => (
            <View key={i} style={styles.weekCell}><Text style={styles.weekText}>{day}</Text></View>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}><Text style={styles.loadingText}>{t('cal.loading')}</Text></View>
        ) : (
          rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.weekRow}>
              {row.map((cell, cellIdx) => {
                if (!cell) return <View key={cellIdx} style={styles.dayCell} />;
                const isToday = isCurrentMonth && cell.day === todayDate;
                const isFuture = isCurrentMonth ? cell.day > todayDate : year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());
                const isUnknown = cell.color === 'UNKNOWN';
                const isWhite = cell.color === 'WHITE';
                const bgColor = getDayColor(cell.color);
                const textColor = isFuture ? COLORS.textMuted : getDayTextColor(cell.color);
                return (
                  <View key={cellIdx} style={styles.dayCell}>
                    <View style={[styles.dayCellInner, { backgroundColor: bgColor }, isWhite && styles.dayCellWhite, isUnknown && styles.dayCellUnknown, isFuture && styles.dayCellFuture, isToday && styles.dayCellToday]}>
                      <Text style={[styles.dayText, { color: textColor }]}>{cell.day}</Text>
                      {isUnknown && <SlashOverlay />}
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.tempoBlue }]} />
            <Text style={styles.legendText}>{t('cal.blue')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotWhite]} />
            <Text style={styles.legendText}>{t('cal.white')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.tempoRed }]} />
            <Text style={styles.legendText}>{t('cal.red')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendDotUnknown}><View style={styles.legendSlash} /></View>
            <Text style={styles.legendText}>{t('cal.unknown')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textOnDark, marginBottom: 12, opacity: 0.9 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 16 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  navButton: { padding: 8, paddingHorizontal: 16 },
  navArrow: { fontSize: 28, color: COLORS.textPrimary, fontWeight: '300' },
  monthTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, minWidth: 160, textAlign: 'center' },
  weekRow: { flexDirection: 'row' },
  weekCell: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  weekText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 3 },
  dayCellInner: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  dayCellWhite: { borderWidth: 1.5, borderColor: COLORS.tempoWhiteBorder },
  dayCellUnknown: { borderWidth: 1, borderColor: '#E0E0E0', borderStyle: 'dashed' },
  dayCellFuture: { opacity: 0.5 },
  dayCellToday: { borderWidth: 3, borderColor: '#FFD600' },
  slashContainer: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  slashLine: { width: 40, height: 2, backgroundColor: COLORS.tempoUnknownSlash, transform: [{ rotate: '-45deg' }] },
  dayText: { fontSize: 14, fontWeight: '600', zIndex: 2 },
  legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 4 },
  legendDotWhite: { backgroundColor: COLORS.tempoWhite, borderWidth: 1, borderColor: COLORS.tempoWhiteBorder },
  legendDotUnknown: { width: 12, height: 12, borderRadius: 6, marginRight: 4, backgroundColor: COLORS.tempoUnknown, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  legendSlash: { width: 16, height: 1.5, backgroundColor: COLORS.tempoUnknownSlash, transform: [{ rotate: '-45deg' }] },
  legendText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  loadingContainer: { paddingVertical: 40 },
  loadingText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 14 },
});
