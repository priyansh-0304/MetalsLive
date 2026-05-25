/**
 * MetalTile.jsx
 *
 * A single tile on the landing screen.
 * Uses its own useMetal() hook, so each tile loads independently.
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useMetal } from '../hooks/useMetal';
import { colors, spacing, radius, typography, metalTheme } from '../constants/theme';

// ---------- Skeleton shimmer ----------

function SkeletonLine({ width, height = 14, style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: 4, backgroundColor: colors.surfaceSecondary },
        { opacity },
        style,
      ]}
    />
  );
}

function LoadingSkeleton() {
  return (
    <View style={styles.skeletonBody}>
      <SkeletonLine width="80%" height={22} style={{ marginBottom: spacing.xs }} />
      <SkeletonLine width="50%" height={11} style={{ marginBottom: spacing.md }} />
      <View style={styles.tileFooter}>
        <SkeletonLine width={60} height={18} />
        <SkeletonLine width={45} height={11} />
      </View>
    </View>
  );
}

// ---------- Error state ----------

function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.errorBody}>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={styles.retryText}>Tap to retry</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- Main tile ----------

export default function MetalTile({ metal, onPress }) {
  const { data, loading, error, refresh } = useMetal(metal);
  const theme = metalTheme[metal.id];

  const handlePress = () => {
    if (!loading && !error && data) {
      onPress({ metal, data });
    } else if (error) {
      refresh();
    }
  };

  const up = data ? data.change >= 0 : true;

  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={handlePress}
      activeOpacity={0.75}
      disabled={loading}
    >
      {/* Accent bar */}
      <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />

      {/* Header row */}
      <View style={styles.tileHeader}>
        <Text style={[styles.tileSymbol, { color: theme.primary }]}>{metal.symbol}</Text>
        <View style={styles.karatBadge}>
          <Text style={styles.karatText}>{metal.karat}</Text>
        </View>
      </View>

      <Text style={styles.tileName}>{metal.name}</Text>

      {/* Body — loading / error / data */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <View>
          <Text style={styles.tilePrice}>${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <Text style={styles.tileUnit}>{metal.unit}</Text>
          <View style={styles.tileFooter}>
            <View style={[styles.changePill, up ? styles.changeUp : styles.changeDown]}>
              <Text style={[styles.changePillText, { color: up ? colors.positive : colors.negative }]}>
                {up ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(2)}%
              </Text>
            </View>
            <Text style={styles.tileTime}>{data.fetchedAt}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    paddingTop: spacing.md + 2,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tileSymbol: {
    fontSize: typography.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  karatBadge: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  karatText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  tileName: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  tilePrice: {
    fontSize: typography.lg,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -0.5,
  },
  tileUnit: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  tileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  changePill: {
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  changeUp: { backgroundColor: colors.positiveBg },
  changeDown: { backgroundColor: colors.negativeBg },
  changePillText: {
    fontSize: 11,
    fontWeight: '500',
  },
  tileTime: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  skeletonBody: { marginTop: spacing.xs },
  errorBody: { marginTop: spacing.sm },
  errorText: {
    fontSize: typography.xs,
    color: colors.negative,
    marginBottom: spacing.xs,
  },
  retryText: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },
});
