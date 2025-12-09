import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Export window dimensions for use in other files (like EggPreviewSVG for scaling)
export { windowWidth, windowHeight };

export const MIN_PERCENTAGE = 10;
export const MAX_PERCENTAGE = 100;

// Sliders now represent percentages of the max possible size.
export const MIN_DIMENSION = MIN_PERCENTAGE; // Min slider value (10)
export const MAX_DIMENSION = MAX_PERCENTAGE; // Max slider value (100)

// Style constants
export const primaryColor = '#1F2937'; // Dark gray
export const accentColor = '#3B82F6'; // Blue
export const TRACK_THICKNESS = 4;
export const THUMB_SIZE = 24;
export const backgroundColor = '#F3F4F6'; // Define a background color

export const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#059669', // Emerald Green
    shape: {
        // FIX: These must be abstract percentage values (0-100) for the sliders
        // and should NOT be calculated with screen dimensions here, as that causes
        // circular dependency issues and mismatched type errors.
        width: 50, // Default slider percentage for width
        height: 50, // Default slider percentage for height
        waist: 40, // Default slider percentage for waist
    }
};

// SVG ViewBox container constants (screen pixel values for the <View> container)
// User requested: 90% of frame width (screen width), 40% of frame height (screen height)
export const WIDTH_VIEWBOX = windowWidth * 0.8;
export const HEIGHT_VIEWBOX = windowHeight * 0.35;
// The Y-anchor for the bottom of the shape, as a percentage of the VIEWBOX height (not window height)
// This value is used by the EggPreviewSVG to map its internal 100x100 drawing space.
export const EGG_VIEWBOX_BASE_Y = 70; // 70 units from the top of the 100-unit viewbox (i.e., 70% down)

// Waist constraints (percentage of total height from top)
export const WAIST_MARGIN_PERCENTAGE = 10; // 10% margin from top/bottom
