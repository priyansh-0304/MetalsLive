/**
 * LandingScreen.jsx
 *
 * Landing page — four metal price tiles, each with its own loader.
 * Tapping a tile navigates to DetailScreen.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MetalTile from '../components/MetalTile';
import { METALS } from '../services/MetalsService';
import { colors, spacing, typography } from '../constants/theme';

export default function LandingScreen({ navigation }) {
  const handleTilePress = ({ metal, data }) => {
    navigation.navigate('Detail', { metal, data });
  };

  // Render tiles in a 2-column grid
  const rows = [];
  for (let i = 0; i < METALS.length; i += 2) {
    rows.push(METALS.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Metals</Text>
            <Text style={styles.headerSub}>Live precious metals prices</Text>
          </View>
          <View style={styles.marketBadge}>
            <View style={styles.marketDot} />
            <Text style={styles.marketText}>Live</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Spot Prices — USD</Text>

        {/* Tile grid — each row has 2 tiles */}
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map(metal => (
              <View key={metal.id} style={styles.tileWrapper}>
                <MetalTile metal={metal} onPress={handleTilePress} />
              </View>
            ))}
            {/* Pad last row if odd number of metals */}
            {row.length < 2 && <View style={styles.tileWrapper} />}
          </View>
        ))}

        <Text style={styles.disclaimer}>
          Prices refresh automatically every 60 seconds. Tap any tile to view details.
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
  scroll: { flex: 1 },
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginTop: 2,
  },
  marketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.positiveBg,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  marketDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.positive,
  },
  marketText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.positive,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '500',
    color: colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  tileWrapper: {
    flex: 1,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
});
