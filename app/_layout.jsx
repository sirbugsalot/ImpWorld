import React from 'react';
import { Stack } from 'expo-router';
// Ensure this path is exactly correct relative to this file
// If _layout.jsx is in /app, and context is in /app/src/context:
import { ThemeProvider } from './src/context/ThemeContext';

/**
 * The Root Layout is the gateway of the app.
 * If this file has an error (like a bad import), the app will stay white.
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }, // Prevents white flash
          animation: 'fade',
        }}
      >
        {/* Explicitly defining the index can sometimes help Expo Router 
            link the file-system mapping if it gets confused. */}
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}


