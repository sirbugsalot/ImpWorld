import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

// 1. Import the hook from your new context folder
import { useTheme } from './src/context/ThemeContext';
import HamburgerMenu from './src/components/HamburgerMenu';

// NEW: Import Firebase initialization
import { initFirebaseStack } from './src/config/firebase';

const App = () => {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  // NEW: Firebase connection state
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // NEW: Initialize Firebase on mount
  useEffect(() => {
    const setup = async () => {
      try {
        await initFirebaseStack();
        setIsFirebaseReady(true);
      } catch (error) {
        console.error("Firebase init failed:", error);
      }
    };
    setup();
  }, []);

  const menuKeys = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'];
  const handleMenuClose = () => setIsMenuOpen(false);

  // NEW: Show loading until Firebase (Anonymous Auth) is ready
  if (!isFirebaseReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Syncing with cloud...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header Bar - Using colors from context */}
      <View style={[
        styles.header, 
        { 
          backgroundColor: colors.header, 
          borderBottomColor: colors.border 
        }
      ]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>ImpWorld</Text>
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
            onClose={handleMenuClose} 
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
  // NEW: Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 8,
  },
  navButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '700',
  }
});

export default App;
