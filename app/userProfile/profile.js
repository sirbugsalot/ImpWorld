import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// Import the modular class definition
import Avatar from './avatar'; 

// Instantiate the avatar object globally for simplicity in this step
// In a real app, this would be managed by global state (e.g., Context or Redux)
const playerAvatar = new Avatar(); 

const primaryColor = '#1D4ED8'; 
const BLOB_SIZE = 100;

const ProfileScreen = () => {
    const router = useRouter();
    
    // Get the color defined by the Avatar class (default is 'blue')
    const avatarColor = playerAvatar.getBlobColor();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={32} color={primaryColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Player Profile</Text>
                <View style={{ width: 32 }} /> {/* Spacer */}
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Your Avatar (V0 Blob)</Text>
                <Text style={styles.subLabel}>Skin Tone: {avatarColor}</Text>

                {/* Avatar Visual Placeholder (the blob) */}
                <View style={[
                    styles.avatarBlob, 
                    { backgroundColor: avatarColor }
                ]} />
                
                {/* Status Display of Avatar Properties */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statText}>Hat: {playerAvatar.hat}</Text>
                    <Text style={styles.statText}>Shirt: {playerAvatar.shirt}</Text>
                    <Text style={styles.statText}>Pants: {playerAvatar.pants}</Text>
                    <Text style={styles.statText}>Shoes: {playerAvatar.shoes}</Text>
                    <Text style={styles.statText}>Arms Style: {playerAvatar.arms.style}</Text>
                    <Text style={styles.statText}>Legs Style: {playerAvatar.legs.style}</Text>
                </View>
                
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', 
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: primaryColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 5,
    },
    subLabel: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 30,
    },
    avatarBlob: {
        width: BLOB_SIZE,
        height: BLOB_SIZE,
        borderRadius: BLOB_SIZE / 2,
        marginBottom: 40,
        // Added shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    statsContainer: {
        width: '80%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    statText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
    }
});
