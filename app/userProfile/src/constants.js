import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const MIN_PERCENTAGE = 10;
export const MAX_PERCENTAGE = 100;

// Sliders now represent percentages of the max possible size.
export const MIN_DIMENSION = MIN_PERCENTAGE; // Min slider value (10%)
export const MAX_DIMENSION = MAX_PERCENTAGE; // Max slider value (100%)

// Style constants
export const primaryColor = '#1F2937'; // Dark gray
export const accentColor = '#3B82F6'; // Blue
export const TRACK_THICKNESS = 4;
export const THUMB_SIZE = 24;

export const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669', // Emerald Green
    shape: {
        // These values (50, 60, 50) now represent percentage of max physical size
        width: 0.3*windowWidth, // 50% of max width
        height: 2*width, // default egg dim defined by proportion
        waist: 0.4*height, // always defined w.r.t. height
    }
};

// SVG ViewBox reference constants (used in EggPreviewSVG.jsx)
// These define the maximum physical size in the 100x100 viewbox space.
export const HEIGHT_VIEWBOX = 0.60*windowHeight; // Max height the shape can occupy
export const WIDTH_VIEWBOX = 0.90*windowWidth;  // Max width the shape can occupy
export const BASE_Y_ANCHOR = 0.45*windowHeight;            // Fixed Y-coordinate for the bottom of the shape (The 0.35 * screen height equivalent)

// Waist constraints (percentage of total height from top)
export const WAIST_MARGIN_PERCENTAGE = 10; // 10% margin from top/bottom
