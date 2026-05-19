import { Circle, Path } from 'react-native-svg';

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
                d={`M ${pos.x - 0.05*pos.x } ${pos.y - 0.19*pos.y}
                    L ${pos.x + 0.05*pos.x } ${pos.y + 0.19*pos.y}
                    Q ${pos.x - 0.03125*pos.x} ${pos.y + 0.185*pos.y}, ${pos.x - 0.025*pos.x } ${pos.y + 0.18*pos.y}
                    L ${pos.x - 0.075*pos.x } ${pos.y - 0.195*pos.y}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.5" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};
