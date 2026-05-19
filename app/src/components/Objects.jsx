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
                d={`M ${pos.x - 2} ${pos.y - 20}
                    L ${pos.x + 2} ${pos.y + 20}
                    Q ${pos.x + 1.5} ${pos.y + 21}, ${pos.x + 1} ${pos.y + 22}
                    L ${pos.x - 3} ${pos.y - 19}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.5" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};
