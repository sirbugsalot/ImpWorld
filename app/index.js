import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

// Import constants for initial state and colors
import { 
    INITIAL_DARK_MODE, 
    PRIMARY_COLOR, 
    LIGHT_TEXT_COLOR, 
    DARK_TEXT_COLOR, 
    LIGHT_BG_COLOR, 
    DARK_BG_COLOR, 
    LIGHT_HEADER_BG, 
    DARK_HEADER_BG 
} from './src/utils/constants';

// Import components with updated logic
import HamburgerMenu from './src/components/HamburgerMenu';
import SettingsModal from './src/components/SettingsModal';

const App = () => {
  const router = useRouter();
  
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); 
  const [isDarkMode, setIsDarkMode] = useState(INITIAL_DARK_MODE);

  // Theme Derivation
  const primaryColor = PRIMARY_COLOR;
  const textColor = isDarkMode ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;
  const bgColor = isDarkMode ? DARK_BG_COLOR : LIGHT_BG_COLOR;
  const headerBg = isDarkMode ? DARK_HEADER_BG : LIGHT_HEADER_BG;

  // Toggle Logic
  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Define exactly which keys from the central HamburgerMenu logic should appear on Home
  // Including the new 'sandbox' key
  const menuKeys = ['home', 'profile', 'sandbox', 'settings', 'version', 'auth'];

  // Special override: If the menu handles 'settings' via ID, we can intercept or 
  // let the menu call a specific function. Since your Hamburger uses ids,
  // we can pass a specific handler for settings if we want it to open the local modal.
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header Bar */}
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: isDarkMode ? '#4B5563' : '#E5E7EB' }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>ImpWorld</Text>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
          <Ionicons name="menu" size={32} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <View style={styles.heroImagePlaceholder}>
           <Ionicons name="planet-outline" size={100} color={isDarkMode ? '#374151' : '#E5E7EB'} />
        </View>

        <Text style={[styles.placeholderText, { color: textColor }]}>
            Welcome to the Imp World
        </Text>
        <Text style={[styles.subPlaceholderText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
            The gateway to your digital avatar's journey.
        </Text>

        <TouchableOpacity
            style={[styles.navButton, { backgroundColor: primaryColor }]}
            onPress={() => router.push('/env/world')}
        >
            <Text style={styles.navButtonText}>Enter World</Text>
        </TouchableOpacity>
      </View>

      {/* Centralized Hamburger Menu */}
      {isMenuOpen && (
        <HamburgerMenu 
            onClose={handleMenuClose} 
            activeItems={menuKeys}
        />
      )}

      {/* Settings Modal Popup */}
      {isSettingsModalOpen && (
          <SettingsModal 
              onClose={() => setIsSettingsModalOpen(false)} 
              onToggleDarkMode={handleToggleDarkMode}
              isDarkMode={isDarkMode}
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

