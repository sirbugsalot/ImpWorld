import React, { useState } from 'react';
import { AuthProvider, useAuth } from './utils/firebase_auth'; // Corrected import path
import AvatarCustomizer from './userProfile/avatar';
import WorldView from './env/world';

const SCREENS = {
    CUSTOMIZER: 'customizer',
    WORLD: 'world'
};
const DEFAULT_AVATAR = {
    type: 'egg',
    color: '#8A2BE2',
    shape: { width: 30, height: 40, waist: 20 } 
};

// --- Settings Menu Dropdown Component (Web/Tailwind) ---
const SettingsMenu = ({ onNavigate, onClose }) => {
    
    const handleAction = (action) => {
        console.log(`Action: ${action}`);
    };

    return (
        <div className="absolute right-4 top-16 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-100">
            
            {/* Profile/Customizer Entry */}
            <button 
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center border-b" 
                onClick={() => { onNavigate(SCREENS.CUSTOMIZER); onClose(); }}
            >
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 8a1 1 0 001-1v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4a1 1 0 001 1h9z"></path></svg>
                Profile / Avatar
            </button>

            {/* Placeholder Menu Item 1: Version */}
            <button 
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center" 
                onClick={() => { handleAction("Version Info"); onClose(); }}
            >
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Version Info
            </button>

            {/* Placeholder Menu Item 2: Auth */}
            <button 
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center border-t mt-1" 
                onClick={() => { handleAction("Auth Screen"); onClose(); }}
            >
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                Log In / Sign Up
            </button>
        </div>
    );
};

// Component that uses the context and handles rendering the correct screen
const AppContent = () => {
    const { isAuthReady, loadingMessage, userId } = useAuth();
    const [currentScreen, setCurrentScreen] = useState(SCREENS.CUSTOMIZER);
    const [avatarData, setAvatarData] = useState(DEFAULT_AVATAR);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Handlers for switching screens and passing data up
    const handleCustomizationComplete = (customization) => {
        setAvatarData(customization);
        setCurrentScreen(SCREENS.WORLD);
    };

    const handleNavigate = (screen) => {
        setCurrentScreen(screen);
        setIsSettingsOpen(false); // Close menu on navigation
    };

    // --- Loading State ---
    if (!isAuthReady || !userId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-700 font-semibold">{loadingMessage}</p>
                </div>
            </div>
        );
    }

    // --- Screen Routing ---
    const renderScreen = () => {
        switch (currentScreen) {
            case SCREENS.WORLD:
                return (
                    <WorldView 
                        avatar={avatarData} 
                        onNavigateToCustomizer={() => handleNavigate(SCREENS.CUSTOMIZER)}
                    />
                );
            case SCREENS.CUSTOMIZER:
            default:
                return (
                    <AvatarCustomizer 
                        onCustomizationComplete={handleCustomizationComplete}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full relative">
            {/* Header Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-40 flex items-center justify-between px-4 sm:px-8">
                <h1 className="text-2xl font-extrabold text-gray-800">ImpWorld</h1>
                <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </header>

            {/* Content Area (Padded for fixed header) */}
            <main className="pt-16 pb-4 w-full flex items-start justify-center">
                {renderScreen()}
            </main>

            {/* Settings Dropdown Overlay */}
            {isSettingsOpen && (
                <SettingsMenu 
                    onNavigate={handleNavigate} 
                    onClose={() => setIsSettingsOpen(false)} 
                />
            )}
            
        </div>
    );
};

// Main App component that wraps the content in the AuthProvider
const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;

    
