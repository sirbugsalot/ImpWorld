import { Circle, Path } from 'react-native-svg';

/**
Position is obtained from within the hand
*/
export const Pencil = ({ pos }) => {
    
    return (
        <>
            {/* --- Pencil Body--- 
            Path logic: given pos(x,y) is the center
            Color logic: main color of the pencil*/}
            <Path 
                d={`M ${pos.x - 7} ${pos.y - 14}
                    L ${pos.x + 5} ${pos.y + 16}
                    Q ${pos.x + 4.25} ${pos.y + 15.5}, ${pos.x + 6} ${pos.y + 15}
                    L ${pos.x - 6} ${pos.y - 15}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#dfb018"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x - 6} ${pos.y - 15.5}
                    L ${pos.x + 6} ${pos.y + 15.5}
                    Q ${pos.x + 5.25} ${pos.y + 13.5}, ${pos.x + 5} ${pos.y + 15.5}
                    L ${pos.x - 7} ${pos.y - 14}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#f9c92a"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x - 7} ${pos.y - 14}
                    L ${pos.x + 7} ${pos.y + 14}
                    Q ${pos.x + 6.25} ${pos.y + 12}, ${pos.x + 6} ${pos.y + 13.5}
                    L ${pos.x - 8} ${pos.y - 13.5}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#fddc62"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x} ${pos.y - 25}
                    L ${pos.x} ${pos.y + 25}
                    M ${pos.x + 10} ${pos.y}
                    L ${pos.x - 10} ${pos.y}
                    Z`} 
                stroke="#111" 
                strokeWidth="2"
                strokeLinecap="round" 
            />
        </>
    );
};
