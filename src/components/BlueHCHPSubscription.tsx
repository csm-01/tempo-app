import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  COLORS,
  SHADOWS,
  EDF_BLUE_BASE_PRICE,
  EDF_BLUE_HP_PRICE,
  EDF_BLUE_HC_PRICE,
} from '../constants';
import { useI18n } from '../i18n';
import type { TempoPrices } from '../types';

interface Props {
  tempoPrices: TempoPrices | null;
  loading: boolean;
}

/** A single horizontal bar comparing a price to a reference */
function RateBar({
  label,
  price,
  maxPrice,
  color,
  refPrice,
}: {
  label: string;
  price: number;
  maxPrice: number;
  color: string;
  refPrice: number;
}) {
  const { t } = useI18n();
  const barWidth = Math.min((price / maxPrice) * 100, 100);
  const diff = ((price - refPrice) / refPrice) * 100;
  const isSaving = diff < 0;

  return (
    <View style={styles.rateBarContainer}>
      <View style={styles.rateBarLabelRow}>
        <Text style={styles.rateBarLabel}>{label}</Text>
        <View style={styles.rateBarRight}>
          <Text style={styles.rateBarPrice}>{price.toFixed(4)} €</Text>
          <View
            style={[
              styles.rateBarBadge,
              { backgroundColor: isSaving ? COLORS.savingsLight : COLORS.expensiveLight },
            ]}
          >
            <Text
              style={[
                styles.rateBarBadgeText,
                { color: isSaving ? COLORS.savings : COLORS.expensive },
              ]}
            >
              {diff > 0 ? '+' : ''}
              {diff.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.rateBarTrack}>
        <View style={[styles.rateBarFill, { width: `${barWidth}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

/** Tempo comparison row */
function TempoCompRow({
  label,
  tempoPrice,
  hchpPrice,
  dotColor,
}: {
  label: string;
  tempoPrice: number;
  hchpPrice: number;
  dotColor: string;
}) {
  const { t } = useI18n();
  const diff = ((tempoPrice - hchpPrice) / hchpPrice) * 100;
  const isCheaper = diff < 0;

  return (
    <View style={styles.tempoRow}>
      <View style={styles.tempoRowLeft}>
        <View style={[styles.tempoDot, { backgroundColor: dotColor }]} />
        <Text style={styles.tempoLabel}>{label}</Text>
      </View>
      <View style={styles.tempoRowRight}>
        <Text style={styles.tempoPrice}>{tempoPrice.toFixed(4)} €</Text>
        <View
          style={[
            styles.tempoBadge,
            { backgroundColor: isCheaper ? COLORS.savingsLight : COLORS.expensiveLight },
          ]}
        >
          <Text
            style={[
              styles.tempoBadgeText,
              { color: isCheaper ? COLORS.savings : COLORS.expensive },
            ]}
          >
            {diff > 0 ? '+' : ''}
            {diff.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function BlueHCHPSubscription({ tempoPrices, loading }: Props) {
  const { t } = useI18n();

  const weightedHCHP = (EDF_BLUE_HP_PRICE * 16 + EDF_BLUE_HC_PRICE * 8) / 24;
  const weightedDiffVsBase =
    ((weightedHCHP - EDF_BLUE_BASE_PRICE) / EDF_BLUE_BASE_PRICE) * 100;
  const isWeightedCheaper = weightedDiffVsBase < 0;

  const maxBarPrice = Math.max(EDF_BLUE_HP_PRICE, EDF_BLUE_BASE_PRICE) * 1.1;

  return (
    <View style={styles.container}>
      {/* ── Current HC/HP Rates ─────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hchp.currentRate')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <Text style={styles.optionLabel}>{t('hchp.option')}</Text>

          {/* Two big price cards side by side */}
          <View style={styles.priceCards}>
            <View style={[styles.priceCard, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.priceCardLabel}>{t('hchp.peakLabel')}</Text>
              <Text style={[styles.priceCardValue, { color: '#E65100' }]}>
                {EDF_BLUE_HP_PRICE.toFixed(4)}
              </Text>
              <Text style={styles.priceCardUnit}>{t('hchp.unit')}</Text>
            </View>
            <View style={styles.priceCardSpacer} />
            <View style={[styles.priceCard, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.priceCardLabel}>{t('hchp.offPeakLabel')}</Text>
              <Text style={[styles.priceCardValue, { color: '#1565C0' }]}>
                {EDF_BLUE_HC_PRICE.toFixed(4)}
              </Text>
              <Text style={styles.priceCardUnit}>{t('hchp.unit')}</Text>
            </View>
          </View>

          <Text style={styles.rateNote}>{t('hchp.rateNote')}</Text>

          <View style={styles.advantageBox}>
            <Text style={styles.advantageTitle}>{t('hchp.advTitle')}</Text>
            <Text style={styles.advantageItem}>{t('hchp.adv1')}</Text>
            <Text style={styles.advantageItem}>{t('hchp.adv2')}</Text>
            <Text style={styles.advantageItem}>{t('hchp.adv3')}</Text>
          </View>
        </View>
      </View>

      {/* ── Comparison with EDF Bleu Base ─────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hchp.vsBase')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.barsSection}>
            <RateBar
              label={t('hchp.hpRate')}
              price={EDF_BLUE_HP_PRICE}
              maxPrice={maxBarPrice}
              color="#FF8F00"
              refPrice={EDF_BLUE_BASE_PRICE}
            />
            <RateBar
              label={t('hchp.hcRate')}
              price={EDF_BLUE_HC_PRICE}
              maxPrice={maxBarPrice}
              color="#1E88E5"
              refPrice={EDF_BLUE_BASE_PRICE}
            />
            {/* Reference bar */}
            <View style={styles.rateBarContainer}>
              <View style={styles.rateBarLabelRow}>
                <Text style={[styles.rateBarLabel, { fontStyle: 'italic' }]}>
                  {t('hchp.baseRate')}
                </Text>
                <Text style={[styles.rateBarPrice, { color: '#78909C' }]}>
                  {EDF_BLUE_BASE_PRICE.toFixed(4)} €
                </Text>
              </View>
              <View style={styles.rateBarTrack}>
                <View
                  style={[
                    styles.rateBarFill,
                    {
                      width: `${(EDF_BLUE_BASE_PRICE / maxBarPrice) * 100}%`,
                      backgroundColor: '#78909C',
                      opacity: 0.5,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Weighted average summary */}
          <View
            style={[
              styles.summaryBox,
              {
                backgroundColor: isWeightedCheaper
                  ? COLORS.savingsLight
                  : COLORS.expensiveLight,
              },
            ]}
          >
            <Text
              style={[
                styles.summaryText,
                {
                  color: isWeightedCheaper ? COLORS.savings : COLORS.expensive,
                },
              ]}
            >
              {t('hchp.weightedAvg')}: {weightedHCHP.toFixed(4)} €/kWh (
              {weightedDiffVsBase > 0 ? '+' : ''}
              {weightedDiffVsBase.toFixed(1)}%)
            </Text>
            <Text style={styles.summarySubtext}>{t('hchp.weightedNote')}</Text>
          </View>
        </View>
      </View>

      {/* ── Comparison with Tempo ─────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hchp.vsTempo')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          {loading || !tempoPrices ? (
            <Text style={styles.loadingText}>{t('rem.loading')}</Text>
          ) : (
            <>
              <Text style={styles.compSubtitle}>
                vs HC/HP {t('hchp.offPeakLabel')}: {EDF_BLUE_HC_PRICE.toFixed(4)} €
              </Text>

              <TempoCompRow
                label={t('hchp.tempoBlueHC')}
                tempoPrice={tempoPrices.bleuHC}
                hchpPrice={EDF_BLUE_HC_PRICE}
                dotColor={COLORS.tempoBlue}
              />
              <TempoCompRow
                label={t('hchp.tempoBlueHP')}
                tempoPrice={tempoPrices.bleuHP}
                hchpPrice={EDF_BLUE_HP_PRICE}
                dotColor={COLORS.tempoBlue}
              />
              <TempoCompRow
                label={t('hchp.tempoWhiteHC')}
                tempoPrice={tempoPrices.blancHC}
                hchpPrice={EDF_BLUE_HC_PRICE}
                dotColor={COLORS.tempoWhite}
              />
              <TempoCompRow
                label={t('hchp.tempoWhiteHP')}
                tempoPrice={tempoPrices.blancHP}
                hchpPrice={EDF_BLUE_HP_PRICE}
                dotColor={COLORS.tempoWhite}
              />
              <TempoCompRow
                label={t('hchp.tempoRedHC')}
                tempoPrice={tempoPrices.rougeHC}
                hchpPrice={EDF_BLUE_HC_PRICE}
                dotColor={COLORS.tempoRed}
              />
              <TempoCompRow
                label={t('hchp.tempoRedHP')}
                tempoPrice={tempoPrices.rougeHP}
                hchpPrice={EDF_BLUE_HP_PRICE}
                dotColor={COLORS.tempoRed}
              />

              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>{t('hchp.tipTitle')}</Text>
                <Text style={styles.tipText}>{t('hchp.tipText')}</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textOnDark,
    marginBottom: 12,
    opacity: 0.9,
  },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  optionLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Price cards
  priceCards: { flexDirection: 'row', marginBottom: 16 },
  priceCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  priceCardSpacer: { width: 10 },
  priceCardLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, textAlign: 'center' },
  priceCardValue: { fontSize: 28, fontWeight: '800' },
  priceCardUnit: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },

  rateNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },

  // Advantages
  advantageBox: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 14 },
  advantageTitle: { fontSize: 14, fontWeight: '700', color: COLORS.savings, marginBottom: 8 },
  advantageItem: { fontSize: 13, color: '#2E7D32', marginBottom: 4, lineHeight: 20 },

  // Rate bars
  barsSection: { marginBottom: 16 },
  rateBarContainer: { marginBottom: 14 },
  rateBarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rateBarLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500', flex: 1 },
  rateBarRight: { flexDirection: 'row', alignItems: 'center' },
  rateBarPrice: { fontSize: 13, fontWeight: '700', color: COLORS.textOnCard },
  rateBarBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  rateBarBadgeText: { fontSize: 12, fontWeight: '700' },
  rateBarTrack: { height: 10, backgroundColor: '#F0F0F0', borderRadius: 5, overflow: 'hidden' },
  rateBarFill: { height: '100%', borderRadius: 5 },

  // Summary
  summaryBox: { borderRadius: 12, padding: 14, alignItems: 'center' },
  summaryText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  summarySubtext: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },

  // Tempo comparison
  compSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  tempoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  tempoRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  tempoDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  tempoLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textOnCard },
  tempoRowRight: { flexDirection: 'row', alignItems: 'center' },
  tempoPrice: { fontSize: 13, fontWeight: '700', color: COLORS.textOnCard },
  tempoBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  tempoBadgeText: { fontSize: 11, fontWeight: '700' },

  // Tip
  tipBox: { backgroundColor: '#E3F2FD', borderRadius: 12, padding: 14, marginTop: 16 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#1565C0', marginBottom: 6 },
  tipText: { fontSize: 13, color: '#0D47A1', lineHeight: 20 },

  loadingText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 14, paddingVertical: 30 },
});
