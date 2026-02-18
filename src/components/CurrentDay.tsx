import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants';
import { useI18n } from '../i18n';
import type { DayInfo, TempoColor } from '../types';

interface Props {
  today: DayInfo | null;
  tomorrow: DayInfo | null;
  loading: boolean;
}

function getColorGradient(color: TempoColor): [string, string] {
  switch (color) {
    case 'BLUE':
      return ['#1565C0', '#1E88E5'];
    case 'WHITE':
      return ['#C8C8C8', '#E8E8E8'];
    case 'RED':
      return ['#C62828', '#EF5350'];
    default:
      return ['#9E9E9E', '#BDBDBD'];
  }
}

function getColorLabelKey(color: TempoColor): string {
  switch (color) {
    case 'BLUE':
      return 'now.blueDay';
    case 'WHITE':
      return 'now.whiteDay';
    case 'RED':
      return 'now.redDay';
    default:
      return 'now.unknown';
  }
}

export default function CurrentDay({ today, tomorrow, loading }: Props) {
  const { t } = useI18n();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const day = date.getDate().toString();
    const months = t('month.short').split(',');
    return { day, monthShort: months[date.getMonth()] };
  };

  const renderCard = (title: string, info: DayInfo | null) => {
    const color = info?.color ?? 'UNKNOWN';
    const gradient = getColorGradient(color);
    const formatted = info ? formatDate(info.date) : null;

    return (
      <LinearGradient
        colors={loading ? ['#9E9E9E', '#BDBDBD'] : gradient}
        style={styles.dayCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.dayLabel}>
          <Text style={styles.dayLabelText}>{title}</Text>
        </View>
        {loading ? (
          <Text style={styles.loadingText}>...</Text>
        ) : (
          <>
            <Text style={styles.dayNumber}>{formatted?.day ?? '—'}</Text>
            <Text style={styles.dayMonth}>{formatted?.monthShort ?? ''}</Text>
            <View style={styles.colorBadge}>
              <Text style={styles.colorBadgeText}>
                {t(getColorLabelKey(color))}
              </Text>
            </View>
          </>
        )}
      </LinearGradient>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('now.title')}</Text>

      <View style={styles.cardContainer}>
        <View style={[styles.cardsWrapper, SHADOWS.card]}>
          <View style={styles.cardsInner}>
            {renderCard(t('now.today'), today)}
            <View style={styles.cardSpacer} />
            {renderCard(t('now.tomorrow'), tomorrow)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoText}>{t('now.info')}</Text>
            <Text style={styles.infoTextSmall}>{t('now.hours')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textOnDark, marginBottom: 12, opacity: 0.9 },
  cardContainer: { borderRadius: 20, overflow: 'hidden' },
  cardsWrapper: { backgroundColor: COLORS.card, borderRadius: 20, overflow: 'hidden' },
  cardsInner: { flexDirection: 'row', padding: 12 },
  dayCard: { flex: 1, borderRadius: 16, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12 },
  cardSpacer: { width: 10 },
  dayLabel: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5, marginBottom: 10 },
  dayLabelText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  dayNumber: { fontSize: 48, fontWeight: '800', color: COLORS.white, lineHeight: 54 },
  dayMonth: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  colorBadge: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  colorBadgeText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  loadingText: { fontSize: 32, color: COLORS.white, fontWeight: '600', marginVertical: 20 },
  infoSection: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  infoText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '500', marginBottom: 6 },
  infoTextSmall: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
});
