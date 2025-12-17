import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Centralized Menu
import HamburgerMenu from './src/components/HamburgerMenu';
import { PRIMARY_COLOR, INITIAL_DARK_MODE, DARK_BG_COLOR, LIGHT_BG_COLOR, DARK_TEXT_COLOR, LIGHT_TEXT_COLOR } from '../src/utils/constants';

export default function App() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Theme constants applied directly from centralized source
  const bgColor = INITIAL_DARK_MODE ? DARK_BG_COLOR : LIGHT_BG_COLOR;
  const textColor = INITIAL_DARK_MODE ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.logoText, { color: PRIMARY_COLOR }]}>IMP WORLD</Text>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
          <Ionicons name="menu" size={32} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Ionicons name="planet-outline" size={100} color={PRIMARY_COLOR} />
          <Text style={[styles.title, { color: textColor }]}>Welcome, Traveler</Text>
          <Text style={styles.subtitle}>Your companion in the digital void.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.mainButton, { backgroundColor: PRIMARY_COLOR }]}
          onPress={() => router.push('/env/world')}
        >
          <Text style={styles.buttonText}>Enter World</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <HamburgerMenu 
          onClose={() => setIsMenuOpen(false)} 
          activeItems={['profile', 'settings', 'version', 'auth']} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25 },
  logoText: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  heroSection: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 32, fontWeight: '800', marginTop: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 10, textAlign: 'center' },
  mainButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 20, shadowColor: PRIMARY_COLOR, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700', marginRight: 10 }
});

              
