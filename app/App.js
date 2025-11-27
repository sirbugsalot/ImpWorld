import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 

// Define colors
const primaryColor = '#1D4ED8'; 
const textColor = '#1F2937';

// --- Placeholder Handlers (Empty functions for menu items) ---
const handleVersionInfo = () => {
    // This will eventually show a modal with version info (OTA bundle ID, native version, etc.)
    alert("Displaying Version Information..."); 
};

const handleAuth = () => {
    // This will eventually navigate to a login screen or open a signup modal
    alert("Navigating to Authentication Screen..."); 
};

// --- Settings Menu Dropdown Component ---
// We pass onClose to hide the menu after an item is pressed
const SettingsMenu = ({ onClose }) => (
    <View style={styles.dropdownContainer}>
        
        {/* Placeholder Menu Item 1: Version */}
        <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { handleVersionInfo(); onClose(); }}
        >
            <Text style={styles.menuItemText}>Version</Text>
        </TouchableOpacity>

        {/* Placeholder Menu Item 2: Auth */}
        <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { handleAuth(); onClose(); }}
        >
            <Text style={styles.menuItemText}>Log In / Sign Up</Text>
        </TouchableOpacity>
    </View>
);

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header Bar with Hamburger Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ImpWorld</Text>
        <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
          {/* Hamburger Menu Icon */}
          <Ionicons name="menu" size={32} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Main Empty Content Area */}
      <View style={styles.mainContent}>
        <Text style={styles.placeholderText}>
            Welcome to the Clean Slate.
        </Text>
        <Text style={styles.subPlaceholderText}>
            Use the menu icon to navigate.
        </Text>
      </View>

      {/* Settings Dropdown Overlay (Absolute Positioned) */}
      {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
      
    </View>
  );
};

// Styles using React Native's StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
    paddingTop: Platform.OS === 'android' ? 30 : 50, // Handle status bar height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: textColor,
  },
  mainContent: {
    flex: 1, // Takes up the remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 5,
  },
  subPlaceholderText: {
    fontSize: 16,
    color: '#ddd',
  },

  // --- Dropdown Styles ---
  dropdownContainer: {
    // Position it absolutely in the top-right corner
    position: 'absolute',
    // Position below the header (adjusting for padding/status bar)
    top: Platform.OS === 'android' ? 70 : 100, 
    right: 20,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10, // Ensure it sits above other content
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 16,
    color: textColor,
    fontWeight: '500',
  }
});

export default App;
