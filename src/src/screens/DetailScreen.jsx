/**
 * DetailScreen.jsx
 *
 * Metal detail page.
 * Required fields: previous close, previous open, today's time, today's date.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchMetalPrice } from '../services/MetalsService';
import { colors, spacing, radius, typography, metalTheme } from '../constants/theme';

// ---------- Reusable stat card ----------

function StatCard({ label, value, sub }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

// ---------- Info row ----------

function InfoRow({ label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoKey}>{label}</Text>
      <Text style={styles.infoVal}>{value}</Text>
    </View>
  );
}

// ---------- Main screen ----------

export default function DetailScreen({ route, navigation }) {
  const { metal, data: initialData } = route.params;
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const theme = metalTheme[metal.id];

  const fmt = n =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const up = data.change >= 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await fetchMetalPrice(metal);
      setData(fresh);
    } catch (e) {
      Alert.alert(
        'Refresh Failed',
        e.message ?? 'Could not fetch the latest price. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Nav header */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>All Metals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRefresh}
          disabled={refreshing}
          style={styles.refreshBtn}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          ) : (
            <Text style={styles.refreshLabel}>↻  Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={[styles.heroAccent, { backgroundColor: theme.accent }]} />

          <View style={styles.heroMeta}>
            <View style={[styles.heroIcon, { backgroundColor: theme.light }]}>
              <Text style={{ fontSize: 22 }}>{metal.icon}</Text>
            </View>
            <View>
              <Text style={styles.heroName}>{metal.name}</Text>
              <Text style={styles.heroSym}>{metal.symbol} · {metal.karat}</Text>
            </View>
          </View>

          <Text style={styles.heroPrice}>{fmt(data.price)}</Text>

          <View style={styles.heroChangeRow}>
            <View style={[styles.changePill, up ? styles.changeUp : styles.changeDown]}>
              <Text style={[styles.changePillText, { color: up ? colors.positive : colors.negative }]}>
                {up ? '▲' : '▼'} {up ? '+' : ''}{fmt(data.change)} ({up ? '+' : ''}{data.changePercent.toFixed(2)}%)
              </Text>
            </View>
            <Text style={styles.heroUnit}>per troy oz</Text>
          </View>
        </View>

        {/* Stat cards — prev close / prev open / day high / day low */}
        <View style={styles.statsGrid}>
          <StatCard label="Previous Close" value={fmt(data.prevClose)} sub="Yesterday" />
          <StatCard label="Previous Open" value={fmt(data.prevOpen)} sub="Yesterday" />
          <StatCard label="Day High" value={fmt(data.dayHigh)} sub="Today" />
          <StatCard label="Day Low" value={fmt(data.dayLow)} sub="Today" />
        </View>

        {/* Info list */}
        <View style={styles.infoCard}>
          <InfoRow label="📅  Today's Date" value={data.date.split(',').slice(1).join(',').trim()} />
          <InfoRow label="🕐  Last Updated" value={data.fetchedAt} />
          <InfoRow label="📈  52W High" value={fmt(data.weekHigh)} />
          <InfoRow label="📉  52W Low" value={fmt(data.weekLow)} last />
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Prices are indicative and for informational purposes only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backArrow: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  backLabel: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  refreshBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
    minWidth: 80,
    alignItems: 'center',
  },
  refreshLabel: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: typography.md,
    fontWeight: '500',
    color: colors.text,
  },
  heroSym: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  heroPrice: {
    fontSize: 38,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -1,
  },
  heroChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  changePill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  changeUp: { backgroundColor: colors.positiveBg },
  changeDown: { backgroundColor: colors.negativeBg },
  changePillText: {
    fontSize: typography.sm,
    fontWeight: '500',
  },
  heroUnit: {
    fontSize: typography.sm,
    color: colors.textTertiary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: typography.md,
    fontWeight: '500',
    color: colors.text,
  },
  statSub: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  infoKey: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.text,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
