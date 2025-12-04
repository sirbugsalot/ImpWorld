import { StyleSheet, Dimensions } from 'react-native';
import { 
    primaryColor, accentColor, backgroundColor, 
    TRACK_THICKNESS, THUMB_SIZE 
} from '../constants'; // Correct path

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
    },
    contentContainer: {
        paddingTop: 50,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: screenWidth * 0.9,
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: primaryColor,
    },
    card: {
        width: screenWidth * 0.9,
        maxWidth: 500,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: primaryColor,
        textAlign: 'center',
        marginBottom: 20,
    },
    
    // --- PREVIEW & SLIDER LAYOUTS ---
    previewArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    verticalSliderWrapper: {
        height: 200, 
        marginRight: 20, 
        width: 40, 
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    previewWindow: { // This is the container for the egg and the color icon
        width: 180, 
        height: 200, 
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative', // IMPORTANT: This ensures the icon is positioned correctly
    },
    colorTriggerIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 10, // Ensure it sits above the egg SVG
    },
    horizontalSliderContainer: { // New container to make the width slider wider
        width: '100%', // Use full width of the card padding area
        alignSelf: 'center',
        marginTop: 15, 
        paddingHorizontal: 0, // Removed padding here
    },
    horizontalSliderWrapper: { // Inner wrapper for the track
        height: 40, 
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15, // Added internal padding for visual space from edges
    },
    sliderValueText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
        marginTop: 5,
        textAlign: 'center', // Center value text
    },
    waistLine: {
        position: 'absolute',
        height: 2,
        backgroundColor: '#4B5563',
        opacity: 0.5,
    },

    // --- SLIDER TRACK STYLES (Shared) ---
    interactiveTrackShadow: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    verticalTrack: {
        width: TRACK_THICKNESS, 
        height: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: TRACK_THICKNESS / 2,
        position: 'relative',
    },
    verticalFill: {
        width: TRACK_THICKNESS,
        backgroundColor: accentColor,
        position: 'absolute',
        bottom: 0,
        borderRadius: TRACK_THICKNESS / 2,
    },
    verticalThumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        left: -(THUMB_SIZE - TRACK_THICKNESS) / 2, 
    },
    horizontalTrack: {
        flex: 1,
        height: TRACK_THICKNESS, 
        backgroundColor: '#E5E7EB',
        borderRadius: TRACK_THICKNESS / 2,
        position: 'relative',
    },
    horizontalFill: {
        height: TRACK_THICKNESS,
        backgroundColor: accentColor,
        borderRadius: TRACK_THICKNESS / 2,
        position: 'absolute',
    },
    horizontalThumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: primaryColor,
        borderWidth: 3,
        borderColor: 'white',
        position: 'absolute',
        top: -(THUMB_SIZE - TRACK_THICKNESS) / 2, 
    },
    
    // --- WAIST SLIDER STYLES ---
    waistSliderContainer: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 10,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 8,
    },
    sliderControlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    smallButton: {
        width: 40, 
        height: 40, 
        backgroundColor: primaryColor,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },

    // --- GENERAL CONTROL STYLES ---
    controlSection: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    typeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 5,
    },
    typeButtonActive: {
        backgroundColor: primaryColor,
    },
    typeButtonText: {
        textAlign: 'center',
        fontWeight: '700',
        color: '#4B5563',
        letterSpacing: 1,
    },
    typeButtonTextActive: {
        color: 'white',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    
    // --- COLOR PICKER STYLES ---
    colorPickerModal: {
        position: 'absolute',
        top: 40,
        right: 0,
        width: 180,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 100, 
    },
    colorPaletteGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    paletteSwatch: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        margin: 4,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkIcon: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
    },
    colorPickerCloseButton: {
        padding: 5,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginTop: 5,
    },
    colorPickerCloseText: {
        color: '#4B5563',
        fontWeight: '600',
        fontSize: 12,
    }
});
