import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { I18nProvider } from './src/i18n';
import Header from './src/components/Header';
import CurrentDay from './src/components/CurrentDay';
import RemainingDays from './src/components/RemainingDays';
import Calendar from './src/components/Calendar';
import Simulator from './src/components/Simulator';
import PriceComparison from './src/components/PriceComparison';
import BlueSubscription from './src/components/BlueSubscription';
import BlueHCHPSubscription from './src/components/BlueHCHPSubscription';

import { fetchToday, fetchTomorrow, fetchStats, fetchPrices } from './src/api';
import type { Subscription, DayInfo, TempoStats, TempoPrices } from './src/types';
import { COLORS } from './src/constants';

function AppContent() {
  const [subscription, setSubscription] = useState<Subscription>('TEMPO');
  const [today, setToday] = useState<DayInfo | null>(null);
  const [tomorrow, setTomorrow] = useState<DayInfo | null>(null);
  const [stats, setStats] = useState<TempoStats | null>(null);
  const [prices, setPrices] = useState<TempoPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const loadData = useCallback(async () => {
    try {
      const [todayData, tomorrowData, statsData, pricesData] =
        await Promise.all([
          fetchToday().catch(() => null),
          fetchTomorrow().catch(() => null),
          fetchStats().catch(() => null),
          fetchPrices().catch(() => null),
        ]);

      setToday(todayData);
      setTomorrow(tomorrowData);
      setStats(statsData);
      setPrices(pricesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const statusBarHeight =
    Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />
      <LinearGradient
        colors={[
          COLORS.gradientStart,
          COLORS.gradientMiddle,
          COLORS.gradientEnd,
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      >
        <ScrollView
          style={[styles.scrollView, { paddingTop: statusBarHeight + 12 }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
              colors={[COLORS.tempoBlue]}
            />
          }
        >
          <Header
            subscription={subscription}
            onSubscriptionChange={setSubscription}
          />

          {subscription === 'TEMPO' ? (
            <>
              <CurrentDay
                today={today}
                tomorrow={tomorrow}
                loading={loading}
              />

              <RemainingDays stats={stats} loading={loading} />

              <Calendar
                initialYear={currentYear}
                initialMonth={currentMonth}
              />

              <PriceComparison prices={prices} loading={loading} />

              <Simulator prices={prices} loading={loading} />
            </>
          ) : subscription === 'BLUE' ? (
            <BlueSubscription tempoPrices={prices} loading={loading} />
          ) : (
            <BlueHCHPSubscription tempoPrices={prices} loading={loading} />
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  bottomPadding: { height: 40 },
});
