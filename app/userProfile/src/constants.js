import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Export window dimensions for use in other files (like EggPreviewSVG for scaling)
export { windowWidth, windowHeight };

// --- SVG Viewbox Unit Definitions (100x100 system) ---
export const VIEWBOX_SIZE = 100; // The virtual size of the SVG canvas
export const WIDTH_VIEWBOX = VIEWBOX_SIZE; // Alias for the width in the 100-unit system

// The Y-anchor for the bottom of the shape, in VIEWBOX units (70 units from the top)
export const EGG_VIEWBOX_BASE_Y = 70;

// --- Dimension Constraints (All in 100-unit VIEWBOX space) ---
// These are absolute length/width dimensions, not percentages of screen size.
export const MAX_HEIGHT = 55; // Max height dimension in 100-unit space (e.g., 55 units tall)
export const MIN_HEIGHT = 20; // Min height dimension in 100-unit space
export const MAX_WIDTH = 70; // Max width dimension in 100-unit space
export const MIN_WIDTH = 30; // Min width dimension in 100-unit space

// --- Style and UI Constants ---
export const primaryColor = '#1F2937'; // Dark gray
export const accentColor = '#10B981'; // Emerald-500
export const TRACK_THICKNESS = 4;
export const THUMB_SIZE = 24;
export const backgroundColor = '#F3F4F6';

// --- Default Initialization Values (All in 100-unit space) ---
export const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669', // Emerald Green
    shape: {
        // hy: Height Dimension (Length). Set to a safe value.
        // Top Y will be 70 - 45 = 25.
        hy: 45, 
        
        // wx: Width Dimension (Total length).
        wx: 50, 
        
        // wy: Waist Y-Coordinate (Absolute position, 0=top, 100=bottom).
        // Must be between Top Y (25) and Bottom Y (70). 50 is a safe middle.
        wy: 50, 
    }
};
