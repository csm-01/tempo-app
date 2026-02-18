import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../constants';
import { useI18n } from '../i18n';
import type { TempoStats } from '../types';

interface Props {
  stats: TempoStats | null;
  loading: boolean;
}

function CircleProgress({
  used, total, color, label, bgColor, darkText,
}: {
  used: number; total: number; color: string; label: string; bgColor: string; darkText?: boolean;
}) {
  const remaining = total - used;
  return (
    <View style={styles.progressItem}>
      <View style={[styles.progressOuter, { borderColor: bgColor }]}>
        <View
          style={[
            styles.progressInner,
            { backgroundColor: color },
            darkText && { borderWidth: 1.5, borderColor: '#BDBDBD' },
          ]}
        >
          <Text style={[styles.progressUsed, darkText && { color: '#424242' }]}>{used}</Text>
          <View style={[styles.progressDivider, darkText && { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
          <Text style={[styles.progressTotal, darkText && { color: '#616161' }]}>{total}</Text>
        </View>
      </View>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressRemaining}>
        {remaining} {remaining > 1 ? 'restants' : 'restant'}
      </Text>
    </View>
  );
}

export default function RemainingDays({ stats, loading }: Props) {
  const { t } = useI18n();

  if (loading || !stats) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('rem.title')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <Text style={styles.loadingText}>{t('rem.loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('rem.title')}</Text>
      <View style={[styles.card, SHADOWS.card]}>
        <Text style={styles.periodText}>{t('rem.period')}</Text>
        <View style={styles.progressRow}>
          <CircleProgress used={stats.blueUsed} total={stats.blueTotal} color={COLORS.tempoBlue} bgColor="#BBDEFB" label={t('rem.blue')} />
          <CircleProgress used={stats.whiteUsed} total={stats.whiteTotal} color={COLORS.tempoWhite} bgColor="#FAFAFA" label={t('rem.white')} darkText />
          <CircleProgress used={stats.redUsed} total={stats.redTotal} color={COLORS.tempoRed} bgColor="#FFCDD2" label={t('rem.red')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textOnDark, marginBottom: 12, opacity: 0.9 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  periodText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 20, fontWeight: '500' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-around' },
  progressItem: { alignItems: 'center' },
  progressOuter: { width: 86, height: 86, borderRadius: 43, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  progressInner: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  progressUsed: { fontSize: 22, fontWeight: '800', color: COLORS.white },
  progressDivider: { width: 24, height: 2, backgroundColor: 'rgba(255,255,255,0.5)', marginVertical: 2 },
  progressTotal: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  progressLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textOnCard, marginTop: 8 },
  progressRemaining: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  loadingText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 14, paddingVertical: 30 },
});
