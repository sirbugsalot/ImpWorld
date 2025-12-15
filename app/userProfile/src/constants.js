// --- Viewbox Configuration ---
export const VIEWBOX_SIZE = 100;
export const EGG_VIEWBOX_BASE_Y = 70; // Fixed Y-coordinate for the base of the egg

// --- Dimension Constraints (used for clamping in avatar.jsx) ---
// Dimensions are lengths/widths in VIEWBOX units (0-100)
export const MAX_HEIGHT = 60; 
export const MIN_HEIGHT = 30; 
export const MAX_WIDTH = 70; 
export const MIN_WIDTH = 40; 

// --- Color Configuration ---
export const primaryColor = '#1F2937'; // Slate-800
export const accentColor = '#10B981'; // Emerald-500

// --- Default Initialization Values ---
export const DEFAULT_CUSTOMIZATION = {
    color: '#059669', // Emerald-600
    type: 'egg',
    shape: {
        // hy: Height Dimension (Length from base Y=70). 
        // 40 means topY will be 70 - 40 = 30.
        hy: 40, 
        
        // wx: Width Dimension (Total length).
        wx: 50, 
        
        // wy: Waist Y-Coordinate (Absolute position). 
        // Must be between topY (30) and bottomY (70). 55 is a safe middle ground.
        wy: 55, 
    }
};
