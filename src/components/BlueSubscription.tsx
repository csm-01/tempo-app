import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, EDF_BLUE_BASE_PRICE } from '../constants';
import { useI18n } from '../i18n';
import type { TempoPrices } from '../types';

interface Props {
  tempoPrices: TempoPrices | null;
  loading: boolean;
}

function ComparisonRow({
  label, tempoHP, tempoHC, dotColor,
}: {
  label: string; tempoHP: number; tempoHC: number; dotColor: string;
}) {
  const { t } = useI18n();
  const avgTempo = (tempoHP * 16 + tempoHC * 8) / 24;
  const avgDiff = ((EDF_BLUE_BASE_PRICE - avgTempo) / EDF_BLUE_BASE_PRICE) * 100;
  const isMoreExpensive = avgDiff < 0;

  return (
    <View style={styles.compRow}>
      <View style={styles.compLabelRow}>
        <View style={[styles.compDot, { backgroundColor: dotColor }]} />
        <Text style={styles.compLabel}>{label}</Text>
      </View>
      <View style={styles.compValues}>
        <Text style={[styles.compValue, { color: isMoreExpensive ? COLORS.savings : COLORS.expensive }]}>
          {isMoreExpensive ? t('blue.youSave') : t('blue.overcost')} {Math.abs(avgDiff).toFixed(1)}%
        </Text>
        <Text style={styles.compSubtext}>
          {t('blue.tempoAvg')}: {avgTempo.toFixed(4)} € {t('blue.vs')}: {EDF_BLUE_BASE_PRICE.toFixed(4)} €
        </Text>
      </View>
    </View>
  );
}

export default function BlueSubscription({ tempoPrices, loading }: Props) {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('blue.currentRate')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.rateCard}>
            <Text style={styles.rateLabel}>{t('blue.option')}</Text>
            <View style={styles.rateRow}>
              <Text style={styles.rateValue}>{EDF_BLUE_BASE_PRICE.toFixed(4)}</Text>
              <Text style={styles.rateUnit}>{t('blue.unit')}</Text>
            </View>
            <Text style={styles.rateNote}>{t('blue.rateNote')}</Text>
          </View>

          <View style={styles.advantageBox}>
            <Text style={styles.advantageTitle}>{t('blue.advTitle')}</Text>
            <Text style={styles.advantageItem}>{t('blue.adv1')}</Text>
            <Text style={styles.advantageItem}>{t('blue.adv2')}</Text>
            <Text style={styles.advantageItem}>{t('blue.adv3')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('blue.switchTitle')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          {loading || !tempoPrices ? (
            <Text style={styles.loadingText}>{t('rem.loading')}</Text>
          ) : (
            <>
              <Text style={styles.compTitle}>{t('blue.compTitle')}</Text>
              <ComparisonRow label={t('blue.blueDays')} tempoHP={tempoPrices.bleuHP} tempoHC={tempoPrices.bleuHC} dotColor={COLORS.tempoBlue} />
              <ComparisonRow label={t('blue.whiteDays')} tempoHP={tempoPrices.blancHP} tempoHC={tempoPrices.blancHC} dotColor={COLORS.tempoWhite} />
              <ComparisonRow label={t('blue.redDays')} tempoHP={tempoPrices.rougeHP} tempoHC={tempoPrices.rougeHC} dotColor={COLORS.tempoRed} />

              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>{t('blue.tipTitle')}</Text>
                <Text style={styles.tipText}>{t('blue.tipText')}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textOnDark, marginBottom: 12, opacity: 0.9 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  rateCard: { alignItems: 'center', marginBottom: 20 },
  rateLabel: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500', marginBottom: 8 },
  rateRow: { flexDirection: 'row', alignItems: 'baseline' },
  rateValue: { fontSize: 42, fontWeight: '800', color: COLORS.textPrimary },
  rateUnit: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginLeft: 8 },
  rateNote: { fontSize: 12, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' },
  advantageBox: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 14 },
  advantageTitle: { fontSize: 14, fontWeight: '700', color: COLORS.savings, marginBottom: 8 },
  advantageItem: { fontSize: 13, color: '#2E7D32', marginBottom: 4, lineHeight: 20 },
  compTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16 },
  compRow: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  compLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  compDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  compLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textOnCard },
  compValues: {},
  compValue: { fontSize: 15, fontWeight: '700' },
  compSubtext: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  tipBox: { backgroundColor: '#FFF3E0', borderRadius: 12, padding: 14, marginTop: 4 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#E65100', marginBottom: 6 },
  tipText: { fontSize: 13, color: '#BF360C', lineHeight: 20 },
  loadingText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 14, paddingVertical: 30 },
});
