import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
// Import the necessary hook for navigation
import { useRouter } from 'expo-router'; 

// Define colors
const primaryColor = '#1D4ED8'; 
const textColor = '#1F2937';

// --- Placeholder Handlers (Empty functions for menu items) ---
const handleVersionInfo = () => {
    alert("Displaying Version Information..."); 
};

const handleAuth = () => {
    alert("Navigating to Authentication Screen..."); 
};

// --- Settings Menu Dropdown Component ---
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
  // Get the router instance
  const router = useRouter();

  // Function to navigate to the new details.js file (path is just '/details')
  const navigateToDetails = () => {
      router.push('/details');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header Bar with Hamburger Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ImpWorld</Text>
        <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
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

        {/* NEW NAVIGATION BUTTON */}
        <TouchableOpacity
            style={styles.navButton}
            onPress={navigateToDetails}
        >
            <Text style={styles.navButtonText}>Go to Details Page</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Dropdown Overlay */}
      {isSettingsOpen && <SettingsMenu onClose={() => setIsSettingsOpen(false)} />}
      
    </View>
  );
};

// Styles updated to include new button styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
    paddingTop: Platform.OS === 'android' ? 30 : 50,
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
    flex: 1,
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
    marginBottom: 50, // Added margin below subtitle
  },
  navButton: {
      backgroundColor: primaryColor,
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
  },
  dropdownContainer: {
    position: 'absolute',
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
    zIndex: 10,
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
