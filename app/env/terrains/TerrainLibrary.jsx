import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

/**
 * Grass Terrain
 * Light green base with darker green "blades" or patches.
 */
export const GrassTerrain = ({ style }) => {
  return (
    <View style={[styles.tile, { backgroundColor: '#4ADE80' }, style]}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        {/* Darker grass patches */}
        <Path d="M10 20 L12 15 L14 20" stroke="#166534" strokeWidth="1" fill="none" />
        <Path d="M40 60 L42 55 L44 60" stroke="#166534" strokeWidth="1" fill="none" />
        <Path d="M80 30 L82 25 L84 30" stroke="#166534" strokeWidth="1" fill="none" />
        <Path d="M20 80 L22 75 L24 80" stroke="#166534" strokeWidth="1" fill="none" />
        <Path d="M70 70 L72 65 L74 70" stroke="#166534" strokeWidth="1" fill="none" />
      </Svg>
    </View>
  );
};

/**
 * Gravel Terrain
 * Grey base with small "pebbles" of varying shades.
 */
export const GravelTerrain = ({ style }) => {
  return (
    <View style={[styles.tile, { backgroundColor: '#9CA3AF' }, style]}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Circle cx="20" cy="30" r="3" fill="#6B7280" />
        <Circle cx="50" cy="20" r="4" fill="#4B5563" />
        <Circle cx="80" cy="50" r="3" fill="#D1D5DB" />
        <Circle cx="30" cy="70" r="5" fill="#4B5563" />
        <Circle cx="70" cy="85" r="2" fill="#374151" />
        <Circle cx="15" cy="85" r="3" fill="#6B7280" />
      </Svg>
    </View>
  );
};

/**
 * Building Interior
 * Neutral floor tile with a subtle grid or "sheen" pattern.
 */
export const InteriorTerrain = ({ style }) => {
  return (
    <View style={[styles.tile, { backgroundColor: '#E5E7EB' }, style]}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        {/* Subtle grid lines */}
        <Path d="M0 50 L100 50" stroke="#D1D5DB" strokeWidth="0.5" />
        <Path d="M50 0 L50 100" stroke="#D1D5DB" strokeWidth="0.5" />
        {/* Reflection/Sheen effect */}
        <Rect x="10" y="10" width="30" height="2" fill="white" fillOpacity="0.4" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});

