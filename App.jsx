import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator, Alert, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';

// Triggering new pipeline run

// Define colors for the application
const primaryColor = '#1D4ED8'; // Blue-700
const secondaryColor = '#FBBF24'; // Amber-400
const devColor = '#F87171'; // Red-400
const nominalColor = '#34D399'; // Emerald-400
const textColor = '#1F2937'; // Gray-800

// Constants for App Versions
const VERSION_DEV = 'Development';
const VERSION_STABLE = 'Stable';

const App = () => {
  // State for the Dev/Nominal Mode switch (Determines if the OTA check is available)
  const [isDevMode, setIsDevMode] = useState(true);
  
  // State for the version the user has selected to LAUNCH
  const [selectedVersion, setSelectedVersion] = useState(VERSION_DEV);
  
  const [statusMessage, setStatusMessage] = useState('Ready to launch application.');
  const [isChecking, setIsChecking] = useState(false);
  
  // The actual function that the "Launch" button will eventually call
  const launchApp = () => {
      setStatusMessage(`Launching app in ${selectedVersion} mode!`);
      // Placeholder for actual navigation or complex logic start
      Alert.alert(
          "Application Launched",
          `Currently running in ${selectedVersion} mode. All systems nominal.`,
          [{ text: "OK" }]
      );
  };


  // Function to check for and install remote OTA updates
  const checkForUpdateAndInstall = async () => {
    if (!isDevMode) {
      setStatusMessage('Update check disabled in Nominal Mode.');
      return;
    }

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

  // UI for the custom alert/status box
  const StatusBox = () => (
    <View style={[styles.statusBox, { backgroundColor: isDevMode ? devColor : nominalColor }]}>
      <Text style={styles.statusTextHeader}>
        Deployment Mode: {isDevMode ? 'DEVELOPMENT' : 'NOMINAL'}
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
      
      <Text style={styles.title}>On-the-Go App</Text>
      <Text style={styles.subtitle}>Version Selection & Launch</Text>

      {/* OTA Update Check Button (Only visible in Dev Mode) */}
      {isDevMode && (
          <TouchableOpacity 
              style={[styles.otaButton, { opacity: isChecking ? 0.6 : 1 }]} 
              onPress={checkForUpdateAndInstall}
              disabled={isChecking}
          >
              <Text style={styles.buttonText}>
                  {isChecking ? 'Checking for Updates...' : 'Check & Apply Remote Update (OTA)'}
              </Text>
          </TouchableOpacity>
      )}

      {/* Version Selector Switch */}
      <View style={styles.versionSelectorContainer}>
          <Text style={styles.versionSelectorText}>STABLE</Text>
          <Switch
              trackColor={{ false: nominalColor, true: devColor }}
              thumbColor={selectedVersion === VERSION_DEV ? primaryColor : primaryColor}
              onValueChange={(value) => setSelectedVersion(value ? VERSION_DEV : VERSION_STABLE)}
              value={selectedVersion === VERSION_DEV}
          />
          <Text style={styles.versionSelectorText}>DEVELOPMENT</Text>
      </View>
      
      <Text style={styles.versionDisplay}>
          Selected Launch Version: <Text style={{fontWeight: 'bold', color: selectedVersion === VERSION_DEV ? devColor : nominalColor}}>{selectedVersion}</Text>
      </Text>

      {/* Main Launch Button */}
      <TouchableOpacity
        style={styles.launchButton}
        onPress={launchApp}
        disabled={isChecking}
      >
        <Text style={styles.buttonText}>
          LAUNCH APPLICATION
        </Text>
      </TouchableOpacity>

      {/* Mode Switch Button (for disabling the OTA feature) */}
      <View style={styles.modeSwitchContainer}>
          <Text style={styles.modeSwitchLabel}>Dev Mode Enabled (for OTA):</Text>
          <Switch
              trackColor={{ false: nominalColor, true: devColor }}
              thumbColor={isDevMode ? primaryColor : primaryColor}
              onValueChange={setIsDevMode}
              value={isDevMode}
          />
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

// Styles using React Native's StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Gray-50
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: primaryColor,
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: textColor,
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
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  statusTextHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  statusTextContent: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  indicator: {
    marginTop: 8,
  },
  versionSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset