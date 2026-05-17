import { Path } from 'react-native-svg';

/**
Position is obtained from within the hand
*/
export const Pencil = ({ pos, color= "#f9c92a" }) => {
    
    return (
        <>
            {/* --- Pencil Body--- 
            Path logic: given pos(x,y) is the center
            Color logic: main color of the pencil*/}
            <Path 
                d={`M ${pos.x - 0.02*pos.x} ${pos.y - pos.y - 0.04*pos.y}
                    L ${pos.x + 0.02*pos.x} ${pos.y - pos.y + 0.04*pos.y}
                    Q ${pos.x + 0.0195*pos.x} ${pos.y + 0.035*pos.y}, ${pos.x + 0.019*pos.x} ${pos.y + 0.038*pos.y}
                    L ${pos.x - 0.019*pos.x} ${pos.y - 0.038*pos.y}
                    L ${pos.x - 0.022*pos.x} ${pos.y - 0.044*pos.y}
                    L ${pos.x + 0.022*pos.x} ${pos.y + 0.044*pos.y}
                    Q ${pos.x + 0.0215*pos.x} ${pos.y + 0.042*pos.y}, ${pos.x + 0.021*pos.x} ${pos.y + 0.042*pos.y}
                    Q ${pos.x + 0.0205*pos.x} ${pos.y + 0.038*pos.y}, ${pos.x + 0.02*pos.x} ${pos.y + 0.04*pos.y}
                    M ${pos.x + 0.021*pos.x} ${pos.y + 0.042*pos.y}
                    L ${pos.x - 0.021*pos.x} ${pos.y - 0.042*pos.y}
                    `} 
                stroke="#111" 
                strokeWidth="0.5" 
                fill={color}
                strokeLinecap="round" 
            />
            <Circle cx={pos.x} cy={pos.y} r="3" fill="#333" />
        </>
    );
};
