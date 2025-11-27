import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator, Alert, Switch, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
// Importing Vector Icons (using a common Expo library for cross-platform icons)
import { Ionicons } from '@expo/vector-icons'; 

// Define colors for the application
const primaryColor = '#1D4ED8'; 
const secondaryColor = '#FBBF24';
const devColor = '#F87171';
const nominalColor = '#34D399';
const textColor = '#1F2937';

const VERSION_DEV = 'Development';
const VERSION_STABLE = 'Stable';

const App = () => {
  const [isDevMode, setIsDevMode] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(VERSION_DEV);
  const [statusMessage, setStatusMessage] = useState('Ready to launch application.');
  const [isChecking, setIsChecking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // New state for menu

  // Functionality remains the same
  const launchApp = () => {
      setStatusMessage(`Launching app in ${selectedVersion} mode!`);
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

    if (__DEV__) {
        setStatusMessage('ERROR: OTA only works in Preview/Standalone builds.');
        Alert.alert(
            "Updates Check Failed",
            "Updates.checkForUpdateAsync() is not supported in development builds (__DEV__). Please run 'eas build --profile preview' and install that APK/IPA to test OTA."
        );
        return;
    }

    setIsChecking(true);
    setStatusMessage('Checking for remote update...');
    
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setStatusMessage('Update found! Downloading and installing...');
        await Updates.fetchUpdateAsync();
        
        Alert.alert(
          "Update Complete",
          "A new version is downloaded and ready. The app must restart.",
          [{ text: "Restart Now", onPress: () => Updates.reloadAsync() }]
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

  // New Settings View Component
  const SettingsMenu = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsHeader}>OTA Deployment Settings</Text>

      {/* OTA Update Check Button (The original button, now hidden) */}
      <TouchableOpacity 
          style={[styles.otaButton, { opacity: isChecking ? 0.6 : 1 }]} 
          onPress={checkForUpdateAndInstall}
          disabled={isChecking}
      >
          <Text style={styles.buttonText}>
              {isChecking ? 'Checking...' : 'Check & Apply Remote Update (OTA)'}
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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Bar with Hamburger Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>On-the-Go V0</Text>
        <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)}>
          <Ionicons name="menu" size={32} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <StatusBox />
      
      {/* Conditionally Render Settings Menu */}
      {isSettingsOpen && <SettingsMenu />}

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Select deployment version and launch.</Text>

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
    paddingTop: Platform.OS === 'android' ? 30 : 50, // Handle status bar height
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: textColor,
  },
  mainContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: primaryColor,
    marginTop: 10,
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
  settingsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  settingsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: primaryColor,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
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
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  versionSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: textColor,
    marginHorizontal: 10,
  },
  versionDisplay: {
    fontSize: 18,
    marginBottom: 30,
    color: textColor,
  },
  launchButton: {
    width: '100%',
    backgroundColor: primaryColor,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  otaButton: {
    width: '100%',
    backgroundColor: secondaryColor,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    backgroundColor: '#E5E7EB', // Gray-200
    borderRadius: 8,
  },
  modeSwitchLabel: {
    fontSize: 16,
    color: textColor,
    fontWeight: '500',
  }
});

export default App;        );
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
      
      <Text style={styles.title}>ImpWorld</Text>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  versionSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: textColor,
    marginHorizontal: 10,
  },
  versionDisplay: {
      fontSize: 18,
      marginBottom: 30,
      color: textColor,
  },
  launchButton: {
    width: '90%',
    backgroundColor: primaryColor,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  otaButton: {
    width: '90%',
    backgroundColor: secondaryColor,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    padding: 10,
    backgroundColor: '#E5E7EB', // Gray-200
    borderRadius: 8,
  },
  modeSwitchLabel: {
    fontSize: 16,
    color: textColor,
    fontWeight: '500',
  }
});

export default App;
