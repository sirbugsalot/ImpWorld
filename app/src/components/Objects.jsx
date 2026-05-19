import { Circle, Path } from 'react-native-svg';

/**
Position is obtained from within the hand
*/
export const Pencil = ({ pos, color= "#f9c92a" }) => {
    const shift_x = -0.1;
    const multiplier_x = 0.5;
    const multiplier_y = 0.5;
    return (
        <>
            {/* --- Pencil Body--- 
            Path logic: given pos(x,y) is the center
            Color logic: main color of the pencil*/}
            <Path 
                d={`M ${pos.x - 0.10*pos.x} ${pos.y - 0.20*pos.y}
                    L ${pos.x + 0.10*pos.x} ${pos.y + 0.20*pos.y}
                    Q ${pos.x - 0.075*pos.x} ${pos.y + 0.175*pos.y}, ${pos.x + 0.05*pos.x } ${pos.y + 0.19*pos.y}
                    L ${pos.x - 0.05*pos.x } ${pos.y - 0.19*pos.y}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.5" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};
