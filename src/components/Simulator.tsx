import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, SHADOWS, EDF_BLUE_BASE_PRICE, EDF_BLUE_HC_PRICE } from '../constants';
import { useI18n } from '../i18n';
import type { TempoPrices } from '../types';

interface Props {
  prices: TempoPrices | null;
  loading: boolean;
}

type TempoTariffKey = 'bleuHC' | 'bleuHP' | 'blancHC' | 'blancHP' | 'rougeHC' | 'rougeHP';

interface TariffOption {
  key: TempoTariffKey;
  i18nKey: string;
  color: string;
}

const TARIFF_OPTIONS: TariffOption[] = [
  { key: 'bleuHC', i18nKey: 'sim.bleuHC', color: COLORS.tempoBlue },
  { key: 'bleuHP', i18nKey: 'sim.bleuHP', color: COLORS.tempoBlueDark },
  { key: 'blancHC', i18nKey: 'sim.blancHC', color: '#BDBDBD' },
  { key: 'blancHP', i18nKey: 'sim.blancHP', color: '#9E9E9E' },
  { key: 'rougeHC', i18nKey: 'sim.rougeHC', color: COLORS.tempoRed },
  { key: 'rougeHP', i18nKey: 'sim.rougeHP', color: COLORS.tempoRedDark },
];

function getTempoPrice(prices: TempoPrices, key: TempoTariffKey): number {
  switch (key) {
    case 'bleuHC': return prices.bleuHC;
    case 'bleuHP': return prices.bleuHP;
    case 'blancHC': return prices.blancHC;
    case 'blancHP': return prices.blancHP;
    case 'rougeHC': return prices.rougeHC;
    case 'rougeHP': return prices.rougeHP;
  }
}

export default function Simulator({ prices, loading }: Props) {
  const { t } = useI18n();
  const [kwh, setKwh] = useState(20);
  const [selectedTariff, setSelectedTariff] = useState<TempoTariffKey>('bleuHC');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedOption = TARIFF_OPTIONS.find((o) => o.key === selectedTariff)!;

  const results = useMemo(() => {
    const tempoPrice = prices ? getTempoPrice(prices, selectedTariff) : 0.1325;
    const selectedLabel = t(selectedOption.i18nKey);

    const items = [
      { label: `Tempo ${selectedLabel}`, price: tempoPrice, cost: tempoPrice * kwh, color: selectedOption.color, isCheapest: false },
      { label: t('sim.edfBase'), price: EDF_BLUE_BASE_PRICE, cost: EDF_BLUE_BASE_PRICE * kwh, color: '#78909C', isCheapest: false },
      { label: t('sim.edfHC'), price: EDF_BLUE_HC_PRICE, cost: EDF_BLUE_HC_PRICE * kwh, color: '#546E7A', isCheapest: false },
    ];

    const minCost = Math.min(...items.map((i) => i.cost));
    items.forEach((item) => { item.isCheapest = item.cost === minCost; });
    return items;
  }, [kwh, prices, selectedTariff, t, selectedOption]);

  const maxCost = Math.max(...results.map((r) => r.cost));
  const tempoCost = results[0].cost;
  const baseCost = results[1].cost;
  const diffVsBase = baseCost - tempoCost;
  const isSaving = diffVsBase > 0;

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('sim.title')}</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <Text style={styles.loadingText}>{t('rem.loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('sim.title')}</Text>

      <View style={[styles.card, SHADOWS.card]}>
        <Text style={styles.subtitle}>{t('sim.subtitle')}</Text>
        <Text style={styles.subtitleSmall}>{t('sim.subtitleSmall')}</Text>

        {/* Tariff selector dropdown */}
        <Text style={styles.dropdownLabel}>{t('sim.tariffLabel')}</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownOpen(!dropdownOpen)}
          activeOpacity={0.7}
        >
          <View style={[styles.dropdownDot, { backgroundColor: selectedOption.color }]} />
          <Text style={styles.dropdownButtonText}>
            Tempo {t(selectedOption.i18nKey)}
          </Text>
          <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {TARIFF_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.dropdownItem,
                  option.key === selectedTariff && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedTariff(option.key);
                  setDropdownOpen(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.dropdownItemDot, { backgroundColor: option.color }]} />
                <Text
                  style={[
                    styles.dropdownItemText,
                    option.key === selectedTariff && styles.dropdownItemTextActive,
                  ]}
                >
                  Tempo {t(option.i18nKey)}
                </Text>
                {prices && (
                  <Text style={styles.dropdownItemPrice}>
                    {getTempoPrice(prices, option.key).toFixed(4)} €
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* kWh display */}
        <View style={styles.kwhDisplay}>
          <Text style={styles.kwhValue}>{kwh}</Text>
          <Text style={styles.kwhUnit}>kWh</Text>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>1</Text>
          <View style={styles.sliderTrackWrap}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={kwh}
              onValueChange={setKwh}
              minimumTrackTintColor={selectedOption.color}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={selectedOption.color}
            />
          </View>
          <Text style={styles.sliderLabel}>100</Text>
        </View>

        {/* Cost comparison bars */}
        <View style={styles.barsContainer}>
          {results.map((item) => {
            const barWidth = maxCost > 0 ? Math.max((item.cost / maxCost) * 100, 4) : 4;
            return (
              <View key={item.label} style={styles.barRow}>
                <View style={styles.barInfo}>
                  <Text style={[styles.barLabel, item.isCheapest && styles.barLabelCheapest]}>
                    {item.isCheapest && '⚡ '}{item.label}
                  </Text>
                  <Text style={[styles.barCost, item.isCheapest && styles.barCostCheapest]}>
                    {item.cost.toFixed(2)} €
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={styles.barPrice}>{item.price.toFixed(4)} €/kWh</Text>
              </View>
            );
          })}
        </View>

        {/* Savings / overcost summary */}
        <View style={[styles.savingsBox, { backgroundColor: isSaving ? COLORS.savingsLight : COLORS.expensiveLight }]}>
          <Text style={[styles.savingsTitle, { color: isSaving ? COLORS.savings : COLORS.expensive }]}>
            {isSaving ? t('sim.savingsTitle') : t('sim.overcostTitle')}
          </Text>
          <Text style={[styles.savingsAmount, { color: isSaving ? COLORS.savings : COLORS.expensive }]}>
            {Math.abs(diffVsBase).toFixed(2)} € {isSaving ? t('sim.less') : t('sim.more')}
          </Text>
          <Text style={styles.savingsDetail}>
            {t('sim.vsBase')} {kwh} kWh {t('sim.nightCharge')}
          </Text>
        </View>

        {/* Quick reference */}
        <View style={styles.quickRef}>
          <Text style={styles.quickRefTitle}>{t('sim.evExamples')}</Text>
          <View style={styles.quickRefRow}>
            {[
              { kw: 10, range: '~50 km' },
              { kw: 20, range: '~100 km' },
              { kw: 40, range: '~200 km' },
              { kw: 60, range: '~300 km' },
            ].map((item) => (
              <TouchableOpacity
                key={item.kw}
                style={[styles.quickBtn, kwh === item.kw && { backgroundColor: selectedOption.color }]}
                onPress={() => setKwh(item.kw)}
                activeOpacity={0.7}
              >
                <Text style={[styles.quickBtnText, kwh === item.kw && styles.quickBtnTextActive]}>
                  {item.kw} kWh
                </Text>
                <Text style={[styles.quickBtnSub, kwh === item.kw && styles.quickBtnSubActive]}>
                  {item.range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textOnDark, marginBottom: 12, opacity: 0.9 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  subtitle: { fontSize: 16, fontWeight: '700', color: COLORS.textOnCard, textAlign: 'center', marginBottom: 4 },
  subtitleSmall: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: 20 },

  // Dropdown
  dropdownLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  dropdownButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, marginBottom: 4,
  },
  dropdownDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  dropdownButtonText: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.textOnCard },
  dropdownArrow: { fontSize: 10, color: COLORS.textMuted },
  dropdownList: {
    backgroundColor: '#FAFAFA', borderRadius: 12, marginBottom: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  dropdownItemActive: { backgroundColor: '#E3F2FD' },
  dropdownItemDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  dropdownItemText: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textOnCard },
  dropdownItemTextActive: { color: COLORS.tempoBlue },
  dropdownItemPrice: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },

  // kWh
  kwhDisplay: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 8, marginTop: 12 },
  kwhValue: { fontSize: 52, fontWeight: '800', color: COLORS.tempoBlue },
  kwhUnit: { fontSize: 20, fontWeight: '600', color: COLORS.textMuted, marginLeft: 8 },

  // Slider
  sliderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingHorizontal: 4 },
  sliderLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', width: 28, textAlign: 'center' },
  sliderTrackWrap: { flex: 1 },
  slider: { width: '100%', height: 40 },

  // Bars
  barsContainer: { marginBottom: 16 },
  barRow: { marginBottom: 14 },
  barInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  barLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textOnCard },
  barLabelCheapest: { color: COLORS.savings },
  barCost: { fontSize: 16, fontWeight: '800', color: COLORS.textOnCard },
  barCostCheapest: { color: COLORS.savings },
  barTrack: { height: 12, backgroundColor: '#F0F0F0', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  barPrice: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },

  // Savings
  savingsBox: { borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 16 },
  savingsTitle: { fontSize: 14, fontWeight: '700' },
  savingsAmount: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  savingsDetail: { fontSize: 12, color: '#388E3C', marginTop: 4, textAlign: 'center' },

  // Quick ref
  quickRef: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 16 },
  quickRefTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 10, textAlign: 'center' },
  quickRefRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickBtn: { flex: 1, marginHorizontal: 3, paddingVertical: 8, paddingHorizontal: 4, borderRadius: 10, backgroundColor: '#F5F5F5', alignItems: 'center' },
  quickBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.textOnCard },
  quickBtnTextActive: { color: COLORS.white },
  quickBtnSub: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  quickBtnSubActive: { color: 'rgba(255,255,255,0.7)' },
  loadingText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 14, paddingVertical: 30 },
});
