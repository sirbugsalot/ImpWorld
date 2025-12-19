import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AvatarCustomizer from './avatar';
import HamburgerMenu from '../src/components/HamburgerMenu';

// Import the Theme Context hook
import { useTheme } from '../src/context/ThemeContext';

export default function ProfileScreen() {
    const { isDarkMode, colors } = useTheme();
    
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userStats] = useState({ level: 5, xp: 1250, joinDate: 'Dec 2023' });

    // Handle the screen transition to Customizer
    if (isCustomizing) {
        return (
            <AvatarCustomizer 
                onCancel={() => setIsCustomizing(false)} 
                onSave={() => setIsCustomizing(false)} 
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Explorer Profile</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Ionicons name="menu" size={32} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileCard}>
                    <View style={[
                        styles.avatarCircle, 
                        { 
                            borderColor: colors.primary,
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                        }
                    ]}>
                        <Ionicons name="person" size={60} color={colors.primary} />
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>User_Explorer</Text>
                    
                    <TouchableOpacity 
                        style={[
                            styles.editBadge, 
                            { backgroundColor: isDarkMode ? colors.card : '#F3F4F6' }
                        ]} 
                        onPress={() => setIsCustomizing(true)}
                    >
                        <Text style={[
                            styles.editBadgeText, 
                            { color: isDarkMode ? '#D1D5DB' : '#4B5563' }
                        ]}>
                            Edit Avatar
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                        <Text style={[styles.statLabel, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>Level</Text>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{userStats.level}</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                        <Text style={[styles.statLabel, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>XP</Text>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{userStats.xp}</Text>
                    </View>
                </View>
            </ScrollView>

            {isMenuOpen && (
                <HamburgerMenu 
                    onClose={() => setIsMenuOpen(false)} 
                    activeItems={['home', 'sandbox', 'settings']} 
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 25, 
        marginBottom: 20 
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: '800' 
    },
    scrollContent: { 
        paddingBottom: 40 
    },
    profileCard: { 
        alignItems: 'center', 
        marginVertical: 20 
    },
    avatarCircle: { 
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        borderWidth: 3, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    userName: { 
        fontSize: 20, 
        fontWeight: '700', 
        marginTop: 15 
    },
    editBadge: { 
        marginTop: 10, 
        paddingVertical: 6, 
        paddingHorizontal: 16, 
        borderRadius: 20 
    },
    editBadgeText: { 
        fontSize: 12, 
        fontWeight: '600' 
    },
    statsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingHorizontal: 20, 
        marginTop: 30 
    },
    statBox: { 
        alignItems: 'center', 
        padding: 20, 
        borderRadius: 20, 
        width: '43%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    statLabel: { 
        fontSize: 14, 
        fontWeight: '600' 
    },
    statValue: { 
        fontSize: 24, 
        fontWeight: '800', 
        marginTop: 5 
    }
});

                            
