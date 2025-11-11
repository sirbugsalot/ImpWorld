import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';

// Define colors for the application
const primaryColor = '#2563EB'; // Blue-600
const secondaryColor = '#FBBF24'; // Amber-400
const devColor = '#EF4444'; // Red-500
const nominalColor = '#10B981'; // Emerald-500
const textColor = '#1F2937'; // Gray-800

const App = () => {
  // State for the Dev/Nominal Mode switch
  const [isDevMode, setIsDevMode] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Ready for use.');
  const [isChecking, setIsChecking] = useState(false);

  // Function to check for and install remote OTA updates
  const checkForUpdateAndInstall = async () => {
    if (!isDevMode) return; // Only allow update checks in Dev Mode

    setIsChecking(true);
    setStatusMessage('Checking for remote update...');
    
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setStatusMessage('Update found! Downloading and installing...');
        await Updates.fetchUpdateAsync();
        
        // Use Alert for critical system actions like restart
        Alert.alert(
          "Update Complete",
          "A new version is downloaded and ready. The app must restart.",
          [
            { 
              text: "Restart Now", 
              onPress: () => Updates.reloadAsync() 
            },
          ]
        );
      } else {
        setStatusMessage('No new remote update available.');
      }
    } catch (e) {
      console.error('Error checking for or applying update:', e);
      setStatusMessage(`Update check failed: ${e.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  // UI for the custom alert/status box (to avoid using native Alert for status)
  const StatusBox = () => (
    <View style={[styles.statusBox, { backgroundColor: isDevMode ? devColor : nominalColor }]}>
      <Text style={styles.statusTextHeader}>
        Mode: {isDevMode ? 'DEVELOPMENT' : 'NOMINAL'}
      </Text>
      <Text style={styles.statusTextContent}>
        {statusMessage}
      </Text>
      {isChecking && <ActivityIndicator size="small" color="#fff" style={styles.indicator} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBox />
      <Text style={styles.title}>On-the-Go App V0</Text>
      <Text style={styles.subtitle}>Mobile Application Skeleton</Text>

      {/* Mode Switch Button */}
      <TouchableOpacity
        style={[styles.modeSwitchButton, { backgroundColor: isDevMode ? nominalColor : devColor }]}
        onPress={() => setIsDevMode(!isDevMode)}
        disabled={isChecking}
      >
        <Text style={styles.buttonText}>
          Switch to {isDevMode ? 'NOMINAL Mode' : 'DEVELOPMENT Mode'}
        </Text>
      </TouchableOpacity>

      {/* Conditional UI based on Mode */}
      {isDevMode ? (
        // DEV USE Screen
        <View style={styles.buttonContainer}>
          <Text style={styles.sectionHeader}>DEV USE</Text>
          
          <TouchableOpacity 
            style={styles.devButton} 
            onPress={checkForUpdateAndInstall}
            disabled={isChecking}
          >
            <Text style={styles.buttonText}>
              {isChecking ? 'Checking...' : 'Check for Remote Update & Install'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.devButton}>
            <Text style={styles.buttonText}>Placeholder Button A (Dev)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // NOMINAL Screen
        <View style={styles.buttonContainer}>
          <Text style={styles.sectionHeader}>NOMINAL USE</Text>
          <TouchableOpacity style={styles.nominalButton}>
            <Text style={styles.buttonText}>Placeholder Button B (Nominal)</Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
};

// Styles using React Native's StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Gray-100
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: textColor,
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // Gray-500
    marginBottom: 40,
  },
  statusBox: {
    width: '100%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statusTextHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statusTextContent: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  indicator: {
    marginTop: 8,
  },
  modeSwitchButton: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: textColor,
    marginBottom: 20,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
  },
  devButton: {
    width: '90%',
    backgroundColor: devColor, 
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  nominalButton: {
    width: '90%',
    backgroundColor: nominalColor, 
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;