import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/firebase_auth'; // Corrected import path

const AVATAR_DOC_PATH = `customization/player_avatar`;
const DEFAULT_CUSTOMIZATION = {
    type: 'egg',
    color: '#8A2BE2',
    shape: { width: 30, height: 40, waist: 20 }
};

const AvatarCustomizer = ({ onCustomizationComplete }) => {
    const { userId, dbInstance, isAuthReady, appId, fsUtils } = useAuth();
    const { doc, getDoc, setDoc } = fsUtils; // Destructure Firestore utilities
    
    const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
    const [status, setStatus] = useState('Awaiting connection...');
    
    const isAnonymous = userId && userId.length > 20;

    // Load Avatar on Auth Ready
    useEffect(() => {
        if (isAuthReady && userId && dbInstance) {
            loadAvatar(userId);
        }
    }, [isAuthReady, userId, dbInstance]); 

    const loadAvatar = useCallback(async (uid) => {
        if (!dbInstance || !uid || !fsUtils) return;
        setStatus('Loading avatar...');

        try {
            const docRef = doc(dbInstance, `artifacts/${appId}/users/${uid}/${AVATAR_DOC_PATH}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const loadedData = docSnap.data();
                setCustomization(prev => ({
                    ...prev,
                    ...loadedData,
                    shape: { ...prev.shape, ...loadedData.shape }
                }));
                setStatus('Avatar loaded successfully.');
            } else {
                // Save default if none exists
                await saveAvatar(DEFAULT_CUSTOMIZATION, uid);
                setStatus('Initialized default avatar.');
            }
        } catch (e) {
            console.error("Load Avatar Error:", e);
            setStatus(`Error loading avatar: ${e.message}`);
        }
    }, [dbInstance, appId, fsUtils]);

    const saveAvatar = useCallback(async (data, uid = userId) => {
        if (!dbInstance || !uid || !fsUtils) return;
        setStatus('Saving...');

        try {
            const docRef = doc(dbInstance, `artifacts/${appId}/users/${uid}/${AVATAR_DOC_PATH}`);
            await setDoc(docRef, data);
            setCustomization(data);
            setStatus('Avatar saved successfully!');
        } catch (e) {
            console.error("Save Avatar Error:", e);
            setStatus(`Error saving avatar: ${e.message}`);
        }
    }, [dbInstance, appId, userId, fsUtils]);

    // --- UI/Handler Functions (Unchanged) ---
    const handleShapeChange = (name, value) => {
        const newShape = { ...customization.shape, [name]: parseInt(value) };
        if (name === 'height' && newShape.waist > newShape.height) { newShape.waist = newShape.height; }
        setCustomization(prev => ({ ...prev, shape: newShape }));
    };

    const handleColorChange = (e) => { setCustomization(prev => ({ ...prev, color: e.target.value })); };

    const handleTypeChange = (type) => { setCustomization(prev => ({ ...prev, type })); };

    const renderEggPreview = () => {
        const { color, shape } = customization;
        const PREVIEW_SCALE = 2.5; 
        const { width, height, waist } = shape;
        const previewWidth = width * PREVIEW_SCALE; 
        const previewHeight = height * PREVIEW_SCALE; 
        const radiusFactor = 0.5;
        const topRadius = (waist < height / 2) ? width * radiusFactor * 1.5 : width * radiusFactor * 0.5;
        const bottomRadius = (waist > height / 2) ? width * radiusFactor * 1.5 : width * radiusFactor * 0.5;
        const minRadius = width * 0.2; 

        return (
            <div 
                className="egg-preview border-2 border-gray-700 transition-all duration-300"
                style={{
                    width: `${previewWidth}px`,
                    height: `${previewHeight}px`,
                    backgroundColor: color,
                    borderRadius: 
                        `${Math.max(topRadius, minRadius)}px ${Math.max(topRadius, minRadius)}px ${Math.max(bottomRadius, minRadius)}px ${Math.max(bottomRadius, minRadius)}px`,
                }}
            />
        );
    };

    return (
        <div className="p-4 sm:p-8 max-w-lg mx-auto bg-white shadow-2xl rounded-xl w-full">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Avatar Customization</h1>
            <p className="text-sm text-gray-500 mb-2">
                User ID: {userId || 'N/A'} ({isAnonymous ? 'Guest' : 'Linked'})
            </p>
            <p className={`text-base font-semibold mb-4 ${status.includes('Error') ? 'text-red-500' : 'text-blue-500'}`}>{status}</p>

            {/* Preview Area */}
            <div className="flex flex-col items-center mb-6 p-4 bg-gray-100 rounded-xl border border-gray-200 shadow-inner">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Live Preview</h2>
                <div className="w-36 h-36 bg-white rounded-lg flex items-center justify-center">
                    {renderEggPreview()}
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
                {/* Type Selector */}
                <div className="p-4 bg-gray-50 rounded-xl shadow-inner">
                    <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-3">Avatar Type</h3>
                    <div className="flex space-x-4">
                        <button 
                          onClick={() => handleTypeChange('egg')}
                          className={`flex-1 p-3 text-center rounded-lg font-semibold transition ${customization.type === 'egg' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                          Egg
                        </button>
                        <button 
                          onClick={() => handleTypeChange('human')}
                          className={`flex-1 p-3 text-center rounded-lg font-semibold transition ${customization.type === 'human' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                          Human (WIP)
                        </button>
                    </div>
                </div>

                {/* Egg Customization Controls */}
                <div className={`p-4 bg-white rounded-xl shadow-md border border-gray-100 ${customization.type === 'egg' ? 'block' : 'hidden'}`}>
                    <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4">Egg Shape & Color</h3>
                    
                    {/* Color Input */}
                    <div className="flex items-center space-x-4 mb-4">
                        <label htmlFor="color-picker" className="text-sm font-medium text-gray-700 w-1/3">Color:</label>
                        <input 
                          type="color" 
                          id="color-picker" 
                          className="w-10 h-10 rounded-full border-2 border-gray-300" 
                          value={customization.color} 
                          onChange={handleColorChange}
                        />
                        <input 
                          type="text" 
                          id="color-input" 
                          className="flex-1 p-2 border border-gray-300 rounded-lg" 
                          maxLength="7" 
                          value={customization.color} 
                          onChange={handleColorChange}
                        />
                    </div>

                    {/* Shape Sliders */}
                    {['width', 'height', 'waist'].map(key => (
                      <div className="mb-4" key={key}>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)} ({customization.shape[key]}):
                        </label>
                        <input 
                          type="range" 
                          min={key === 'waist' ? 0 : 20} 
                          max={key === 'waist' ? customization.shape.height : 60} 
                          step="1" 
                          value={customization.shape[key]} 
                          onChange={(e) => handleShapeChange(key, e.target.value)}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer range-lg transition duration-200"
                          style={{
                              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((customization.shape[key] - (key === 'waist' ? 0 : 20)) / ((key === 'waist' ? customization.shape.height : 60) - (key === 'waist' ? 0 : 20))) * 100}%, #d1d5db ${((customization.shape[key] - (key === 'waist' ? 0 : 20)) / ((key === 'waist' ? customization.shape.height : 60) - (key === 'waist' ? 0 : 20))) * 100}%, #d1d5db 100%)`
                          }}
                        />
                      </div>
                    ))}
                </div>

                {/* Save Button */}
                <button 
                  onClick={() => saveAvatar(customization)}
                  disabled={!isAuthReady}
                  className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg shadow-lg transition duration-150 ${isAuthReady ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1h4m-4 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3m-2 0h2m-4 0V4a1 1 0 011-1h10a1 1 0 011 1v3"></path></svg>
                    {isAuthReady ? 'Save Customization' : 'Connecting to Save Service...'}
                </button>

                {/* Enter Game Button */}
                <button 
                    onClick={() => onCustomizationComplete(customization)}
                    disabled={!isAuthReady}
                    className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg shadow-lg transition duration-150 border-2 border-blue-600 ${isAuthReady ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                    Enter Game World
                </button>
            </div>
        </div>
    );
};

export default AvatarCustomizer;

            
