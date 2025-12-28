import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

import { useTheme } from './src/context/ThemeContext';
import HamburgerMenu from './src/components/HamburgerMenu';

// Note: If this import itself crashes the app, ensure @react-native-async-storage/async-storage is installed.
import { initFirebaseStack } from './src/config/firebase';

const App = () => {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [status, setStatus] = useState('initializing'); // initializing, ready
  const [isBypassed, setIsBypassed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function startApp() {
      // 1. Setup the bypass timer (10 seconds)
      const bypassTimer = setTimeout(() => {
        if (isMounted && status === 'initializing') {
          console.warn("Firebase initialization timed out. Bypassing to allow local work.");
          setIsBypassed(true);
          setStatus('ready');
        }
      }, 10000);

      try {
        // 2. Attempt the real connection
        await initFirebaseStack();
        
        if (isMounted) {
          clearTimeout(bypassTimer);
          setStatus('ready');
        }
      } catch (e) {
        console.error("Firebase connection failed during startup:", e);
        if (isMounted) {
          clearTimeout(bypassTimer);
          setIsBypassed(true);
          setStatus('ready');
        }
      }
    }

    startApp();
    return () => { isMounted = false; };
  }, []);

  const menuKeys = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'];

  // Loading Screen (Only shows for max 10s)
  if (status === 'initializing') {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Syncing with cloud...</Text>
        <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 20 }}>Auto-bypass active in 10s</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header Bar */}
      <View style={[
        styles.header, 
        { backgroundColor: colors.header, borderBottomColor: colors.border }
      ]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>ImpWorld</Text>
          {isBypassed && (
            <Text style={{ fontSize: 10, color: '#EF4444', fontWeight: 'bold' }}>OFFLINE MODE</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
          <Ionicons name="menu" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <View style={styles.heroImagePlaceholder}>
           <Ionicons 
             name="planet-outline" 
             size={100} 
             color={isDarkMode ? '#374151' : '#E5E7EB'} 
           />
        </View>

        <Text style={[styles.placeholderText, { color: colors.text }]}>
            Welcome to the Imp World
        </Text>
        <Text style={[styles.subPlaceholderText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
            The gateway to your digital avatar's journey.
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
            activeItems={menuKeys}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  heroImagePlaceholder: {
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subPlaceholderText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  navButton: {
      width: '100%',
      paddingVertical: 18,
      borderRadius: 15,
      alignItems: 'center',
      elevation: 8,
  },
  navButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '700',
  }
});

export default App;

