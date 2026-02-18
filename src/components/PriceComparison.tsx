import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, EDF_BLUE_BASE_PRICE } from '../constants';
import { useI18n } from '../i18n';
import type { TempoPrices } from '../types';

interface Props {
  prices: TempoPrices | null;
  loading: boolean;
}

type TabKey = 'blue' | 'white' | 'red';

interface TabConfig {
  key: TabKey;
  i18nKey: string;
  color: string;
  lightColor: string;
}

const TABS: TabConfig[] = [
  { key: 'blue', i18nKey: 'price.blueDay', color: COLORS.tempoBlue, lightColor: '#E3F2FD' },
  { key: 'white', i18nKey: 'price.whiteDay', color: '#BDBDBD', lightColor: '#F5F5F5' },
  { key: 'red', i18nKey: 'price.redDay', color: COLORS.tempoRed, lightColor: '#FFEBEE' },
];

function PriceBar({ label, price, maxPrice, color, percentage }: {
  label: string; price: number; maxPrice: number; color: string; percentage: number;
}) {
  const barWidth = Math.min((price / maxPrice) * 100, 100);
  const isSaving = percentage < 0;
  return (
    <View style={styles.barContainer}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <View style={styles.barPriceRow}>
          <Text style={styles.barPrice}>{price.toFixed(4)} €</Text>
          <View style={[styles.percentBadge, { backgroundColor: isSaving ? COLORS.savingsLight : COLORS.expensiveLight }]}>
            <Text style={[styles.percentText, { color: isSaving ? COLORS.savings : COLORS.expensive }]}>
              {percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function PriceComparison({ prices, loading }: Props) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabKey>('blue');

  if (loading || !prices) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('price.title')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <Text style={styles.loadingText}>{t('rem.loading')}</Text>
        </View>
      </View>
    );
  }

  const getTabPrices = (tab: TabKey) => {
    switch (tab) {
      case 'blue': return { hp: prices.bleuHP, hc: prices.bleuHC };
      case 'white': return { hp: prices.blancHP, hc: prices.blancHC };
      case 'red': return { hp: prices.rougeHP, hc: prices.rougeHC };
    }
  };

  const tabPrices = getTabPrices(activeTab);
  const tabConfig = TABS.find((x) => x.key === activeTab)!;
  const hpPercent = ((tabPrices.hp - EDF_BLUE_BASE_PRICE) / EDF_BLUE_BASE_PRICE) * 100;
  const hcPercent = ((tabPrices.hc - EDF_BLUE_BASE_PRICE) / EDF_BLUE_BASE_PRICE) * 100;
  const allPrices = [tabPrices.hp, tabPrices.hc, EDF_BLUE_BASE_PRICE];
  const maxPrice = Math.max(...allPrices) * 1.05;
  const avgTempoPrice = (tabPrices.hp * 16 + tabPrices.hc * 8) / 24;
  const avgPercent = ((avgTempoPrice - EDF_BLUE_BASE_PRICE) / EDF_BLUE_BASE_PRICE) * 100;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('price.title')}</Text>
      <View style={[styles.card, SHADOWS.card]}>
        <Text style={styles.subtitle}>
          {t('price.subtitle')} ({EDF_BLUE_BASE_PRICE.toFixed(4)} €/kWh)
        </Text>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && { backgroundColor: tab.color }]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab.key && (tab.key === 'white' ? styles.tabTextActiveWhite : styles.tabTextActive)]}>
                {t(tab.i18nKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price bars */}
        <View style={styles.barsSection}>
          <PriceBar label={t('price.peak')} price={tabPrices.hp} maxPrice={maxPrice} color={tabConfig.color} percentage={hpPercent} />
          <PriceBar label={t('price.offPeak')} price={tabPrices.hc} maxPrice={maxPrice} color={tabConfig.color} percentage={hcPercent} />
          <View style={styles.barContainer}>
            <View style={styles.barLabelRow}>
              <Text style={[styles.barLabel, styles.refLabel]}>{t('price.ref')}</Text>
              <Text style={[styles.barPrice, styles.refPrice]}>{EDF_BLUE_BASE_PRICE.toFixed(4)} €</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(EDF_BLUE_BASE_PRICE / maxPrice) * 100}%`, backgroundColor: '#78909C' }, styles.refBar]} />
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={[styles.summaryBox, { backgroundColor: avgPercent < 0 ? COLORS.savingsLight : COLORS.expensiveLight }]}>
          <Text style={[styles.summaryText, { color: avgPercent < 0 ? COLORS.savings : COLORS.expensive }]}>
            {avgPercent < 0 ? t('price.avgSaving') : t('price.avgOvercost')} : {avgPercent > 0 ? '+' : ''}{avgPercent.toFixed(1)}%
          </Text>
          <Text style={styles.summarySubtext}>{t('price.weighted')}</Text>
        </View>

        {/* Detailed price table */}
        <View style={styles.priceTable}>
          <Text style={styles.tableTitle}>{t('price.detailedGrid')}</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>{t('price.color')}</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>HP</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>HC</Text>
          </View>

          {[
            { label: t('cal.blue'), hp: prices.bleuHP, hc: prices.bleuHC, color: COLORS.tempoBlue },
            { label: t('cal.white'), hp: prices.blancHP, hc: prices.blancHC, color: COLORS.tempoWhite },
            { label: t('cal.red'), hp: prices.rougeHP, hc: prices.rougeHC, color: COLORS.tempoRed },
          ].map((row) => (
            <View key={row.label} style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
                <View style={[styles.tableDot, { backgroundColor: row.color }]} />
                <Text style={styles.tableCellText}>{row.label}</Text>
              </View>
              <Text style={[styles.tableCell, styles.tableCellText]}>{row.hp.toFixed(4)}</Text>
              <Text style={[styles.tableCell, styles.tableCellText]}>{row.hc.toFixed(4)}</Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.tableRowRef]}>
            <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
              <View style={[styles.tableDot, { backgroundColor: '#78909C' }]} />
              <Text style={[styles.tableCellText, styles.refCellText]}>EDF {t('cal.blue')}</Text>
            </View>
            <Text style={[styles.tableCell, styles.tableCellText, styles.refCellText]}>{EDF_BLUE_BASE_PRICE.toFixed(4)}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.refCellText]}>{EDF_BLUE_BASE_PRICE.toFixed(4)}</Text>
          </View>
          <Text style={styles.tableFootnote}>{t('price.footnote')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textOnDark, marginBottom: 12, opacity: 0.9 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16, fontWeight: '500' },
  tabRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 3, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },
  tabTextActiveWhite: { color: '#424242' },
  barsSection: { marginBottom: 16 },
  barContainer: { marginBottom: 14 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  barLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500', flex: 1 },
  refLabel: { fontStyle: 'italic' },
  barPriceRow: { flexDirection: 'row', alignItems: 'center' },
  barPrice: { fontSize: 13, fontWeight: '700', color: COLORS.textOnCard },
  refPrice: { color: '#78909C' },
  percentBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  percentText: { fontSize: 12, fontWeight: '700' },
  barTrack: { height: 10, backgroundColor: '#F0F0F0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  refBar: { opacity: 0.5 },
  summaryBox: { borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 20 },
  summaryText: { fontSize: 15, fontWeight: '700' },
  summarySubtext: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  priceTable: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 16 },
  tableTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textOnCard, marginBottom: 12, textAlign: 'center' },
  tableHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 4 },
  tableHeaderText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#FAFAFA' },
  tableRowRef: { backgroundColor: '#FAFAFA', borderRadius: 8, borderBottomWidth: 0, marginTop: 4, paddingHorizontal: 4 },
  tableCell: { flex: 1, justifyContent: 'center' },
  tableCellText: { fontSize: 14, color: COLORS.textOnCard, fontWeight: '600' },
  refCellText: { color: '#78909C' },
  tableDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  tableFootnote: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', marginTop: 12 },
  loadingText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 14, paddingVertical: 30 },
});
