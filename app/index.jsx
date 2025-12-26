import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

import { useTheme } from './src/context/ThemeContext';
import HamburgerMenu from './src/components/HamburgerMenu';
import { initFirebaseStack } from './src/config/firebase';

const App = () => {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      // Safety Timeout: If Firebase takes > 10s, throw an error so we don't hang
      const timeout = setTimeout(() => {
        if (!isFirebaseReady && isMounted) {
          setError("Connection timed out. Check your internet or Firebase config.");
        }
      }, 10);

      try {
        await initFirebaseStack();
        if (isMounted) {
          setIsFirebaseReady(true);
          clearTimeout(timeout);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to sync with cloud.");
          clearTimeout(timeout);
        }
      }
    };

    setup();
    return () => { isMounted = false; };
  }, []);

  const handleRetry = () => {
    setError(null);
    setIsFirebaseReady(false);
    // Trigger a simple reload or call setup again
  };

  // 1. Error State UI
  if (error) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background, padding: 20 }]}>
        <Ionicons name="cloud-offline-outline" size={60} color="#EF4444" />
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: colors.primary, marginTop: 20 }]}
          onPress={handleRetry}
        >
          <Text style={styles.navButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Loading State UI
  if (!isFirebaseReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Syncing with ImpWorld...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: colors.header, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>ImpWorld</Text>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
          <Ionicons name="menu" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.heroImagePlaceholder}>
           <Ionicons name="planet-outline" size={100} color={isDarkMode ? '#374151' : '#E5E7EB'} />
        </View>

        <Text style={[styles.placeholderText, { color: colors.text }]}>Welcome to Imp World</Text>
        <Text style={[styles.subPlaceholderText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
            Your digital journey is cloud-secured.
        </Text>

        <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/env/world')}
        >
            <Text style={styles.navButtonText}>Enter World</Text>
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <HamburgerMenu 
            onClose={() => setIsMenuOpen(false)} 
            activeItems={['home', 'profile', 'sandbox', 'settings', 'auth']}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 16, fontWeight: '500' },
  errorText: { marginTop: 15, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  heroImagePlaceholder: { marginBottom: 20 },
  placeholderText: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  subPlaceholderText: { fontSize: 16, textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  navButton: { width: '100%', paddingVertical: 18, borderRadius: 15, alignItems: 'center', elevation: 8 },
  navButtonText: { color: 'white', fontSize: 18, fontWeight: '700' }
});

export default App;

