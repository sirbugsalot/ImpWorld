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
                d={`M ${pos.x - 8} ${pos.y - 13.5}
                    L ${pos.x + 6} ${pos.y + 14.5}
                    Q ${pos.x + 6.25} ${pos.y + 14}, ${pos.x + 7} ${pos.y + 14}
                    L ${pos.x - 7} ${pos.y - 14}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#dfb018"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x - 7} ${pos.y - 14}
                    L ${pos.x + 7} ${pos.y + 14}
                    Q ${pos.x + 7.25} ${pos.y + 13.3}, ${pos.x + 8} ${pos.y + 13.5}
                    L ${pos.x - 6} ${pos.y - 14.5}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#f9c92a"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x - 6} ${pos.y - 14.5}
                    L ${pos.x + 8} ${pos.y + 13.5}
                    Q ${pos.x + 8.25} ${pos.y + 12.9}, ${pos.x + 9} ${pos.y + 13}
                    L ${pos.x - 5} ${pos.y - 15}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#fddc62"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x + 6} ${pos.y + 14.5}
                    L ${pos.x + 8} ${pos.y + 16}
                    L ${pos.x + 9} ${pos.y + 15.5}
                    L ${pos.x + 9} ${pos.y + 13}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#f4e6cc"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x + 8} ${pos.y + 16}
                    L ${pos.x + 9} ${pos.y + 16.9}
                    L ${pos.x + 9} ${pos.y + 15.5}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#3d3d42"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x - 8} ${pos.y - 13.5}
                    L ${pos.x - 9} ${pos.y - 15.5}
                    L ${pos.x - 6} ${pos.y - 17}
                    L ${pos.x - 5} ${pos.y - 15}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#a5a7aa"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x - 8} ${pos.y - 14.5}
                    L ${pos.x - 6} ${pos.y - 15.5}
                    M ${pos.x - 8} ${pos.y - 15.5}
                    L ${pos.x - 7} ${pos.y - 16}
                    `} 
                stroke="#f4e6cc" 
                strokeWidth="0.5"
                strokeLinecap="round" 
            />
            <Path 
                d={`M ${pos.x - 9} ${pos.y - 15.5}
                    L ${pos.x - 10} ${pos.y - 17.5}
                    L ${pos.x - 7} ${pos.y - 19}
                    L ${pos.x - 6} ${pos.y - 17}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.25" 
                fill="#da5d61"
                strokeLinecap="round" 
            />
        </>
    );
};
