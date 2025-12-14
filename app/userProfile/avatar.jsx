const AvatarCustomizer = ({ initialCustomization = DEFAULT_CUSTOMIZATION, onSave, onCancel }) => {
    
    const [customization, setCustomization] = useState(initialCustomization);
    const [eggVertices, setEggVertices] = useState([
        { x: VIEWBOX_SIZE / 2, y: initialCustomization.hy }, 
        { x: initialCustomization.wx, y: initialCustomization.wy }, 
    ]);

    const [status, setStatus] = useState('Drag the red dots to reshape the avatar.');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [draggedVertexIndex, setDraggedVertexIndex] = useState(null); 

    const previewRef = useRef(null);
    
    // Derived shape object
    const shape = useMemo(() => ({
        hy: eggVertices[0].y, 
        wx: eggVertices[1].x, 
        wy: eggVertices[1].y, 
    }), [eggVertices]);
    
    
    // --- UTILITY: Coordinate Mapping ---

    const mapClientToSVG = useCallback((clientX, clientY) => {
        if (!previewRef.current) return { x: 0, y: 0 };

        const rect = previewRef.current.getBoundingClientRect();
        
        // Map pixel coordinates to ViewBox (0-100)
        const relativeX = clientX - rect.left;
        const relativeY = clientY - rect.top;
        const svgX = (relativeX / rect.width) * VIEWBOX_SIZE;
        const svgY = (relativeY / rect.height) * VIEWBOX_SIZE;
        
        return { x: svgX, y: svgY };
    }, []);

    const getActiveVertext = useCallback((svgX, svgY) => {
        const touchRadiusSVG = 5; 

        // Check Height Vertex (Index 0)
        const hyX = VIEWBOX_SIZE / 2;
        const hyY = eggVertices[0].y;
        const dist0 = Math.sqrt((svgX - hyX)**2 + (svgY - hyY)**2);

        // Check Width/Waist Vertex (Index 1)
        const wxY = eggVertices[1].y;
        const wxX = eggVertices[1].x;
        const dist1 = Math.sqrt((svgX - wxX)**2 + (svgY - wxY)**2);

        if (dist0 <= touchRadiusSVG) {
            return 0;
        } else if (dist1 <= touchRadiusSVG) {
            return 1;
        }
        return null;
    }, [eggVertices]);


    // --- TOUCH/MOUSE HANDLERS ---
    
    const handleStart = useCallback((event) => {
        if (isColorPickerVisible) return; // Prevent drag if modal is open

        const clientX = event.clientX || event.touches?.[0].clientX;
        const clientY = event.clientY || event.touches?.[0].clientY;

        if (clientX === undefined || clientY === undefined) return;

        const { x: svgX, y: svgY } = mapClientToSVG(clientX, clientY);
        const activeIndex = getActiveVertext(svgX, svgY);
        
        setDraggedVertexIndex(activeIndex);
        if (activeIndex !== null) {
            setStatus(`Dragging Vertex ${activeIndex === 0 ? 'Top (Height)' : 'Right (Width/Waist)'}...`);
        }
    }, [mapClientToSVG, getActiveVertext, isColorPickerVisible]);

    const handleMove = useCallback((event) => {
        if (draggedVertexIndex === null || isColorPickerVisible) return;
        
        event.preventDefault(); // Stop native scrolling

        const clientX = event.clientX || event.touches?.[0].clientX;
        const clientY = event.clientY || event.touches?.[0].clientY;

        if (clientX === undefined || clientY === undefined) return;
        
        const { x: newSvgX, y: newSvgY } = mapClientToSVG(clientX, clientY);

        setEggVertices(prevVertices => {
            let newVertices = [...prevVertices];
            const vertex = newVertices[draggedVertexIndex];
            
            if (draggedVertexIndex === 0) {
                // Height Vertex: Update Y, X stays centered
                const newY = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newSvgY));
                vertex.y = newY;
            } else if (draggedVertexIndex === 1) {
                // Width/Waist Vertex: Update X and Y
                
                // X constraint
                const newX = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newSvgX));
                vertex.x = newX;

                // Y constraint: Ensure waist is far enough from top and bottom
                const minWaistY = newVertices[0].y + MIN_WAIST_Y_OFFSET; 
                const maxWaistY = EGG_VIEWBOX_BASE_Y - MIN_WAIST_Y_OFFSET; 
                
                const newY = Math.max(minWaistY, Math.min(maxWaistY, newSvgY));
                vertex.y = newY;
            }
            
            // Update customization state
            const newShape = { hy: newVertices[0].y, wx: newVertices[1].x, wy: newVertices[1].y };
            setCustomization(prev => ({ ...prev, ...newShape }));

            return newVertices;
        });
    }, [draggedVertexIndex, mapClientToSVG, isColorPickerVisible]);

    const handleEnd = useCallback(() => {
        if (draggedVertexIndex !== null) {
            setStatus('Drag the red dots to reshape the avatar.');
        }
        setDraggedVertexIndex(null);
    }, [draggedVertexIndex]);
    
    // Global listeners for dragging
    useEffect(() => {
        if (draggedVertexIndex !== null) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);
        }
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [draggedVertexIndex, handleMove, handleEnd]);


    // --- OTHER HANDLERS ---
    
    const handleColorChange = (newColor) => {
        setCustomization(prev => ({ ...prev, color: newColor }));
        setIsColorPickerVisible(false);
    };

    const handleTypeChange = (type) => {
        setCustomization(prev => ({ ...prev, type }));
    };


    // --- RENDER (Mobile-First Layout) ---
    return (
        // Use min-h-screen and p-0 for edge-to-edge mobile look
        <div className="min-h-screen bg-gray-50 font-[Inter] flex justify-center">
            <div className="w-full max-w-md bg-white shadow-2xl flex flex-col">
                {/* Header Section */}
                <header className="flex justify-between items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
                    <button onClick={onCancel} className="p-2 rounded-full active:bg-gray-100 transition">
                        <ChevronLeft className="w-6 h-6 text-indigo-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Customizer</h1>
                    <div className="w-10 h-6" /> {/* Spacer */}
                </header>
                
                {/* Scrollable Content Area */}
                <div className="flex-grow p-4 overflow-y-auto">
                    
                    <div className="bg-white rounded-xl">
                        <p className="text-center text-sm text-gray-500 h-5 mb-4">{status}</p>
                        
                        {/* --- PREVIEW AREA --- */}
                        <div className="flex justify-center mb-6">
                            <div 
                                ref={previewRef}
                                className="w-full max-w-xs aspect-square bg-gray-50 border-4 border-gray-200 rounded-2xl relative overflow-hidden shadow-inner touch-none" 
                                onMouseDown={handleStart}
                                onTouchStart={handleStart}
                            >
                                {/* SVG Avatar */}
                                <EggPreviewSVG color={customization.color} shape={shape} >
                                    {/* Draggable Vertices */}
                                    {eggVertices.map((vertex, index) => (
                                        <circle
                                            key={index}
                                            cx={vertex.x}
                                            cy={vertex.y}
                                            r={4}
                                            fill={draggedVertexIndex === index ? '#DC2626' : '#EF4444'} 
                                            stroke="#FFFFFF"
                                            strokeWidth="1.5"
                                            className="cursor-grab"
                                        />
                                    ))}
                                </EggPreviewSVG> 
                                
                                {/* Color Picker Trigger Button */}
                                <button 
                                    className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition active:scale-95 z-10"
                                    onClick={() => setIsColorPickerVisible(true)}
                                >
                                    <Palette className="w-6 h-6 text-indigo-600" />
                                </button>

                                {isColorPickerVisible && (
                                    <ColorPicker 
                                        selectedColor={customization.color} 
                                        onColorChange={handleColorChange} 
                                        onClose={() => setIsColorPickerVisible(false)} 
                                    />
                                )}
                            </div>
                        </div>
                        
                        {/* --- TYPE SELECTOR --- */}
                        <div className="p-2 bg-gray-100 rounded-xl mb-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3 ml-2">Avatar Style</h3>
                            <div className="flex justify-between space-x-2">
                                {/* EGG Button */}
                                <button 
                                    onClick={() => handleTypeChange('egg')}
                                    className={`py-3 rounded-xl flex-1 font-semibold text-base transition duration-200 ${
                                        customization.type === 'egg' 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    EGG
                                </button>
                                {/* HUMAN Button */}
                                <button 
                                    onClick={() => handleTypeChange('human')}
                                    className={`py-3 rounded-xl flex-1 font-semibold text-base transition duration-200 ${
                                        customization.type === 'human' 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    HUMAN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Fixed Footer with Save Button */}
                <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-t-lg">
                    <button 
                        onClick={() => {
                            setStatus('Customization saved!');
                            // onSave(customization);
                            console.log('Final Customization Data:', customization);
                        }}
                        className="flex items-center justify-center w-full py-4 text-white font-bold text-xl rounded-xl shadow-2xl transition transform active:scale-[0.99]"
                        style={{ 
                            backgroundColor: accentColor, 
                            boxShadow: `0 8px 15px -3px ${accentColor}60` 
                        }}
                    >
                        <Save className="w-6 h-6 mr-3" />
                        SAVE AVATAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarCustomizer;