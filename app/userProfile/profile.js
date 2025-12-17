import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AvatarCustomizer from './avatar';
import HamburgerMenu from '../app/src/components/HamburgerMenu';
import { PRIMARY_COLOR, INITIAL_DARK_MODE, DARK_BG_COLOR, LIGHT_BG_COLOR, DARK_TEXT_COLOR, LIGHT_TEXT_COLOR } from '../src/utils/constants';

export default function ProfileScreen() {
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userStats] = useState({ level: 5, xp: 1250, joinDate: 'Dec 2023' });

    const bgColor = INITIAL_DARK_MODE ? DARK_BG_COLOR : LIGHT_BG_COLOR;
    const textColor = INITIAL_DARK_MODE ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;

    if (isCustomizing) {
        return <AvatarCustomizer onCancel={() => setIsCustomizing(false)} onSave={() => setIsCustomizing(false)} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: textColor }]}>Explorer Profile</Text>
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Ionicons name="menu" size={32} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileCard}>
                    <View style={[styles.avatarCircle, { borderColor: PRIMARY_COLOR }]}>
                        <Ionicons name="person" size={60} color={PRIMARY_COLOR} />
                    </View>
                    <Text style={[styles.userName, { color: textColor }]}>User_Explorer</Text>
                    <TouchableOpacity style={styles.editBadge} onPress={() => setIsCustomizing(true)}>
                        <Text style={styles.editBadgeText}>Edit Avatar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Level</Text>
                        <Text style={[styles.statValue, { color: PRIMARY_COLOR }]}>{userStats.level}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>XP</Text>
                        <Text style={[styles.statValue, { color: PRIMARY_COLOR }]}>{userStats.xp}</Text>
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
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: '800' },
    scrollContent: { paddingBottom: 40 },
    profileCard: { alignItems: 'center', marginVertical: 20 },
    avatarCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(29, 78, 216, 0.05)' },
    userName: { fontSize: 20, fontWeight: '700', marginTop: 15 },
    editBadge: { marginTop: 10, backgroundColor: '#F3F4F6', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
    editBadgeText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginTop: 30 },
    statBox: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 20, width: '40%' },
    statLabel: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
    statValue: { fontSize: 24, fontWeight: '800', marginTop: 5 }
});

                
