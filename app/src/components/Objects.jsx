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
                d={`M ${pos.x - 0.2*pos.x} ${pos.y - pos.y - 0.4*pos.y}
                    L ${pos.x + 0.2*pos.x} ${pos.y - pos.y + 0.4*pos.y}
                    Q ${pos.x + 0.195*pos.x} ${pos.y + 0.35*pos.y}, ${pos.x + 0.19*pos.x} ${pos.y + 0.38*pos.y}
                    L ${pos.x - 0.19*pos.x} ${pos.y - 0.38*pos.y}
                    L ${pos.x - 0.22*pos.x} ${pos.y - 0.44*pos.y}
                    L ${pos.x + 0.22*pos.x} ${pos.y + 0.44*pos.y}
                    Q ${pos.x + 0.215*pos.x} ${pos.y + 0.42*pos.y}, ${pos.x + 0.21*pos.x} ${pos.y + 0.42*pos.y}
                    Q ${pos.x + 0.205*pos.x} ${pos.y + 0.38*pos.y}, ${pos.x + 0.2*pos.x} ${pos.y + 0.4*pos.y}
                    M ${pos.x + 0.21*pos.x} ${pos.y + 0.42*pos.y}
                    L ${pos.x - 0.21*pos.x} ${pos.y - 0.42*pos.y}
                    `} 
                stroke="#111" 
                strokeWidth="0.5" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};
