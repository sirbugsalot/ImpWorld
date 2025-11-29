import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// --- FIREBASE CONFIG ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- CONSTANTS ---
const DEFAULT_COLOR = '#8A2BE2'; // BlueViolet
const MIN_DIM = 20;
const MAX_DIM = 60;

const defaultCustomization = {
    type: 'egg', // 'egg' or 'human'
    color: DEFAULT_COLOR,
    shape: {
        width: 30,
        height: 40,
        waist: 20, // Center of 40 height
    }
};

/**
 * AvatarRenderer is responsible for drawing the selected avatar shape for the PREVIEW.
 * It uses dynamic border radii to approximate the egg's shape.
 */
const AvatarRenderer = ({ type, customization }) => {
    const { color, shape } = customization;
    
    // Scale factor for the preview inside the fixed 150x150 box
    const PREVIEW_SCALE = 2; 

    if (type === 'egg') {
        const { width, height, waist } = shape;
        
        const previewWidth = width * PREVIEW_SCALE; 
        const previewHeight = height * PREVIEW_SCALE; 
        
        // Logic to dynamically calculate the curvature based on waist position.
        const radiusFactor = 0.5;
        const topRadius = (waist < height / 2) ? width * radiusFactor * 1.5 : width * radiusFactor * 0.5;
        const bottomRadius = (waist > height / 2) ? width * radiusFactor * 1.5 : width * radiusFactor * 0.5;
        const minRadius = width * 0.2; 

        return (
            <View 
                style={[
                    styles.eggPreview,
                    {
                        width: previewWidth,
                        height: previewHeight,
                        backgroundColor: color,
                        // Apply scaled radii for the visual effect
                        borderTopLeftRadius: Math.max(topRadius * PREVIEW_SCALE, minRadius),
                        borderTopRightRadius: Math.max(topRadius * PREVIEW_SCALE, minRadius),
                        borderBottomLeftRadius: Math.max(bottomRadius * PREVIEW_SCALE, minRadius),
                        borderBottomRightRadius: Math.max(bottomRadius * PREVIEW_SCALE, minRadius),
                    }
                ]} 
            />
        );
    } 
    
    // Placeholder for the 'human' avatar type
    if (type === 'human') {
        return (
            <View style={[styles.humanPlaceholderPreview, { backgroundColor: color }]}>
                <View style={styles.humanHead} />
                <View style={styles.humanBody} />
            </View>
        );
    }

    return <Text style={{ color: '#E91E63', fontWeight: 'bold' }}>Select Type</Text>;
};


const AvatarCustomizer = () => {
    const [customization, setCustomization] = useState(defaultCustomization);
    const [status, setStatus] = useState('Initializing...');
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);

    const dbRef = useRef(null);
    const authRef = useRef(null);
    const avatarDocPath = `customization/player_avatar`;

    // 1. Firebase Initialization and Authentication
    useEffect(() => {
        if (!firebaseConfig) {
            setStatus("Error: Firebase config not found.");
            return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);
            dbRef.current = db;
            authRef.current = auth;

            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                    setStatus('Authenticated. Loading avatar...');
                } else {
                    try {
                        if (initialAuthToken) {
                            await signInWithCustomToken(auth, initialAuthToken);
                        } else {
                            await signInAnonymously(auth);
                        }
                    } catch (error) {
                        console.error("Firebase Auth Error:", error);
                        setStatus('Error signing in. Check console.');
                    }
                }
            });

            return () => unsubscribe();
        } catch (e) {
            console.error("Initialization Error:", e);
            setStatus(`Initialization Error: ${e.message}`);
        }
    }, []);

    // 2. Load and Save Logic Trigger
    useEffect(() => {
        if (isAuthReady && userId) {
            loadAvatar();
        }
    }, [isAuthReady, userId]);

    const loadAvatar = async () => {
        if (!dbRef.current || !userId) return;

        try {
            // Path: /artifacts/{appId}/users/{userId}/customization/player_avatar
            const docRef = doc(dbRef.current, `artifacts/${appId}/users/${userId}/${avatarDocPath}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setCustomization(docSnap.data());
                setStatus('Avatar loaded successfully.');
            } else {
                // If no saved data, save and use the default
                await saveAvatar(defaultCustomization);
            }
        } catch (e) {
            console.error("Load Avatar Error:", e);
            setStatus('Error loading avatar.');
        }
    };

    const saveAvatar = async (data) => {
        if (!dbRef.current || !userId) return;

        try {
            const docRef = doc(dbRef.current, `artifacts/${appId}/users/${userId}/${avatarDocPath}`);
            await setDoc(docRef, data);
            setCustomization(data);
            setStatus('Avatar saved!');
        } catch (e) {
            console.error("Save Avatar Error:", e);
            setStatus('Error saving avatar.');
        }
    };

    // Handler for updates from UI controls
    const handleUpdate = (key, value) => {
        const newCustomization = { ...customization };

        if (key === 'color') {
            newCustomization.color = value;
        } else if (key === 'type') {
            newCustomization.type = value;
        } else if (key === 'width' || key === 'height' || key === 'waist') {
            newCustomization.shape = { ...newCustomization.shape, [key]: value };
        }

        // Simple validation for waist relative to height
        if (key === 'waist' && value > newCustomization.shape.height) {
            newCustomization.shape.waist = newCustomization.shape.height;
        }
        
        setCustomization(newCustomization);
    };

    const handleSave = () => {
        saveAvatar(customization);
    };

    // UI helper for sliders (using TextInput for cross-platform compatibility)
    const Slider = ({ label, value, min, max, step, onChange }) => (
        <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{label}: {value}</Text>
            <TextInput
                style={styles.sliderInput}
                keyboardType="numeric"
                value={String(value)}
                onChangeText={(text) => {
                    const num = parseInt(text) || min;
                    // Clamp value to min/max range
                    const clamped = Math.min(max, Math.max(min, num)); 
                    onChange(clamped);
                }}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Avatar Customization</Text>
            <Text style={styles.subtitle}>Your User ID: {userId || 'Signing in...'}</Text>
            <Text style={styles.statusText}>{status}</Text>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Preview Area */}
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>Live Preview</Text>
                    <View style={styles.previewBox}>
                         <AvatarRenderer type={customization.type} customization={customization} />
                    </View>
                </View>

                {/* Type Selector */}
                <View style={styles.controlGroup}>
                    <Text style={styles.controlGroupTitle}>Avatar Type</Text>
                    <View style={styles.typeSelector}>
                        <TouchableOpacity 
                            style={[styles.typeButton, customization.type === 'egg' && styles.typeButtonActive]}
                            onPress={() => handleUpdate('type', 'egg')}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'egg' && { color: 'white' }]}>Egg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.typeButton, customization.type === 'human' && styles.typeButtonActive]}
                            onPress={() => handleUpdate('type', 'human')}
                        >
                            <Text style={[styles.typeButtonText, customization.type === 'human' && { color: 'white' }]}>Human (WIP)</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Egg Customization Controls */}
                {customization.type === 'egg' && (
                    <View style={styles.controlGroup}>
                        <Text style={styles.controlGroupTitle}>Egg Shape & Color</Text>

                        {/* Color Input */}
                        <View style={styles.colorControl}>
                            <Text style={styles.sliderLabel}>Color (Hex):</Text>
                            <TextInput
                                style={styles.colorInput}
                                value={customization.color}
                                onChangeText={(text) => handleUpdate('color', text)}
                                maxLength={7}
                            />
                            <View style={[styles.colorSwatch, { backgroundColor: customization.color }]} />
                        </View>

                        {/* Sliders for Shape */}
                        <Slider 
                            label={`Width (${MIN_DIM}-${MAX_DIM})`}
                            value={customization.shape.width}
                            min={MIN_DIM} max={MAX_DIM} step={1}
                            onChange={(val) => handleUpdate('width', val)}
                        />
                         <Slider 
                            label={`Height (${MIN_DIM}-${MAX_DIM})`}
                            value={customization.shape.height}
                            min={MIN_DIM} max={MAX_DIM} step={1}
                            onChange={(val) => handleUpdate('height', val)}
                        />
                         <Slider 
                            label={`Waist Position (0-${customization.shape.height})`}
                            value={customization.shape.waist}
                            min={0} max={customization.shape.height} step={1}
                            onChange={(val) => handleUpdate('waist', val)}
                        />
                    </View>
                )}
                
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Ionicons name="save" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Customization</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AvatarCustomizer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D4ED8',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 14,
        color: '#3B82F6',
        marginBottom: 15,
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    // --- Preview Styles ---
    previewContainer: {
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 10,
    },
    previewBox: {
        width: 150,
        height: 150,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    // --- Renderer Styles (for Preview) ---
    eggPreview: {
        borderWidth: 2,
        borderColor: '#000',
    },
    humanPlaceholderPreview: {
        width: 45, 
        height: 60,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingTop: 5,
    },
    humanHead: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 2,
    },
    humanBody: {
        width: 28,
        height: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
    },
    // --- Control Styles ---
    controlGroup: {
        marginBottom: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    controlGroupTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 5,
    },
    typeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    typeButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        alignItems: 'center',
    },
    typeButtonActive: {
        backgroundColor: '#1D4ED8',
    },
    typeButtonText: {
        color: '#1F2937',
        fontWeight: '600',
    },
    // --- Slider/Input Styles ---
    sliderContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 5,
    },
    sliderInput: {
        height: 40,
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        backgroundColor: '#F9FAFB',
    },
    colorControl: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    colorInput: {
        flex: 1,
        height: 40,
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        backgroundColor: '#F9FAFB',
        marginRight: 10,
    },
    colorSwatch: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    // --- Save Button ---
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#059669',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#059669',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

      
