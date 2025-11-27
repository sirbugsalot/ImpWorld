import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// Define colors
const primaryColor = '#1D4ED8'; 
const textColor = '#1F2937';

const DetailsScreen = () => {
    // 1. Get the router instance
    const router = useRouter();

    // 2. Define the navigate back function
    const navigateHome = () => {
        // router.back() would work, but router.replace('/') is explicit
        router.replace('/'); 
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigateHome}>
                    <Ionicons name="arrow-back" size={32} color={primaryColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Details View</Text>
                {/* Placeholder for alignment */}
                <View style={{width: 32}} /> 
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.placeholderText}>
                    This is the Secondary Screen.
                </Text>

                {/* Return to Home Button */}
                <TouchableOpacity
                    style={styles.returnButton}
                    onPress={navigateHome}
                >
                    <Text style={styles.buttonText}>
                        Go Back Home
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        paddingHorizontal: 20,
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: '600',
        color: primaryColor,
        marginBottom: 40,
    },
    returnButton: {
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    }
});

export default DetailsScreen;
