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
                d={`M ${pos.x - 5} ${pos.y - 16}
                    L ${pos.x + 5} ${pos.y + 16}
                    Q ${pos.x + 4.25} ${pos.y + 14}, ${pos.x + 4} ${pos.y + 16}
                    L ${pos.x - 6} ${pos.y - 16}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};
