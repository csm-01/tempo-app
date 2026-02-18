import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import { useI18n } from '../i18n';
import type { Subscription } from '../types';

interface Props {
  subscription: Subscription;
  onSubscriptionChange: (sub: Subscription) => void;
}

const TABS: { key: Subscription; i18nKey: string }[] = [
  { key: 'TEMPO', i18nKey: 'header.tempo' },
  { key: 'BLUE', i18nKey: 'header.blue' },
  { key: 'BLUE_HCHP', i18nKey: 'header.blueHCHP' },
];

export default function Header({ subscription, onSubscriptionChange }: Props) {
  const { lang, setLang, t } = useI18n();

  return (
    <View style={styles.container}>
      {/* Title row */}
      <View style={styles.titleRow}>
        <Text style={styles.clockIcon}>⏱</Text>
        <Text style={styles.title}>TEMPO</Text>

        {/* Language flags */}
        <View style={styles.flagRow}>
          <TouchableOpacity
            onPress={() => setLang('fr')}
            style={[styles.flagBtn, lang === 'fr' && styles.flagBtnActive]}
            activeOpacity={0.7}
          >
            <Text style={styles.flagText}>🇫🇷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLang('en')}
            style={[styles.flagBtn, lang === 'en' && styles.flagBtnActive]}
            activeOpacity={0.7}
          >
            <Text style={styles.flagText}>🇬🇧</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscription selector — 3 tabs */}
      <View style={styles.selectorContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.selectorButton,
              subscription === tab.key && styles.selectorActive,
            ]}
            onPress={() => onSubscriptionChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectorText,
                subscription === tab.key && styles.selectorTextActive,
              ]}
            >
              {t(tab.i18nKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clockIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textOnDark,
    letterSpacing: 4,
    flex: 1,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    opacity: 0.5,
  },
  flagBtnActive: {
    opacity: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  flagText: {
    fontSize: 22,
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 4,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectorActive: {
    backgroundColor: COLORS.white,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  selectorTextActive: {
    color: COLORS.textPrimary,
  },
});
