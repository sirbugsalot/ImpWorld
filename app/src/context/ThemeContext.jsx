import React, { createContext, useState, useContext, useMemo } from 'react';
import { 
    INITIAL_DARK_MODE, 
    PRIMARY_COLOR, 
    DARK_BG_COLOR, 
    LIGHT_BG_COLOR, 
    DARK_TEXT_COLOR, 
    LIGHT_TEXT_COLOR 
} from '../utils/constants';

// 1. Create the Context object
const ThemeContext = createContext();

/**
 * Professional ThemeProvider.
 * It encapsulates the logic for switching themes and provides a 
 * "colors" object that components can use directly.
 */
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(INITIAL_DARK_MODE);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    // 2. useMemo ensures we don't recalculate this object on every render
    const value = useMemo(() => ({
        isDarkMode,
        toggleTheme,
        colors: {
            primary: PRIMARY_COLOR,
            background: isDarkMode ? DARK_BG_COLOR : LIGHT_BG_COLOR,
            text: isDarkMode ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR,
            card: isDarkMode ? '#1F2937' : '#F9FAFB',
            border: isDarkMode ? '#374151' : '#E5E7EB',
            header: isDarkMode ? '#111827' : '#FFFFFF',
            tabBar: isDarkMode ? '#111827' : '#F3F4F6'
        }
    }), [isDarkMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// 3. Custom hook for easy consumption in components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

