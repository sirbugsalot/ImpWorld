import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

// Import new components with correct path
import HamburgerMenu from './userProfile/src/components/HamburgerMenu';
import SettingsModal from './userProfile/src/components/SettingsModal';


// Define colors and styles based on state
const initialPrimaryColor = '#1D4ED8'; 
const initialTextColor = '#1F2937';
const initialBgColor = '#F9FAFB'; 
const initialHeaderBg = '#FFFFFF'; 

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); 
  const [isDarkMode, setIsDarkMode] = useState(false);

  const router = useRouter();

  // Determine current colors based on dark mode state
  const primaryColor = initialPrimaryColor;
  const textColor = isDarkMode ? '#F9FAFB' : initialTextColor;
  const bgColor = isDarkMode ? '#1F2937' : initialBgColor;
  const headerBg = isDarkMode ? '#374151' : initialHeaderBg;
  const containerStyle = { ...styles.container, backgroundColor: bgColor };


  // Function to navigate to the new world.js file (path is now '/world')
  const navigateToWorld = () => {
      router.push('/env/world');
  };

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
    console.log(`Dark Mode Toggled: ${!isDarkMode}`);
  }, [isDarkMode]);

  // --- Menu Item Handlers (No more alerts!) ---
  const handleVersionInfo = (onClose) => {
      console.log("Displaying Version Information..."); 
      onClose();
  };

  const handleAuth = (onClose) => {
      console.log("Navigating to Authentication Screen..."); 
      onClose();
  };

  const handleOpenSettings = (onClose) => {
      onClose(); // Close the menu first
      setIsSettingsModalOpen(true); // Open the modal
  };
  
  // Define menu items array
  const menuItems = [
      { id: 'version', title: 'Version', action: handleVersionInfo },
      { id: 'auth', title: 'Log In / Sign Up', action: handleAuth },
      { id: 'settings', title: 'Settings', action: handleOpenSettings },
  ];

  return (
    <View style={containerStyle}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header Bar with Hamburger Icon */}
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: isDarkMode ? '#4B5563' : '#E5E7EB' }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>ImpWorld</Text>
        <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
          <Ionicons name="menu" size={32} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Main Empty Content Area */}
      <View style={styles.mainContent}>
        <Text style={[styles.placeholderText, { color: isDarkMode ? '#4B5563' : '#ccc' }]}>
            Welcome to the Imp World.
        </Text>
        <Text style={[styles.subPlaceholderText, { color: isDarkMode ? '#374151' : '#ddd' }]}>
            Use the menu icon to access settings.
        </Text>

        {/* NAVIGATION BUTTON now links to /world */}
        <TouchableOpacity
            style={[styles.navButton, { backgroundColor: primaryColor }]}
            onPress={navigateToWorld}
        >
            <Text style={styles.navButtonText}>Enter Imp World</Text>
        </TouchableOpacity>
      </View>

      {/* 1. Hamburger Menu Dropdown Overlay */}
      {isSettingsOpen && (
        <HamburgerMenu 
            onClose={() => setIsSettingsOpen(false)} 
            menuItems={menuItems}
        />
      )}

      {/* 2. Settings Modal Popup */}
      {isSettingsModalOpen && (
          <SettingsModal 
              onClose={() => setIsSettingsModalOpen(false)} 
              onToggleDarkMode={handleToggleDarkMode}
          />
      )}
      
    </View>
  );
};

// Styles remain mostly the same, removed menu styles that were moved
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
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  subPlaceholderText: {
    fontSize: 16,
    marginBottom: 50,
  },
  navButton: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
  navButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
  }
});

export default App;

