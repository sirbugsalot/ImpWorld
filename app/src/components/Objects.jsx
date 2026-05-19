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
                d={`M ${-1.05*pos.x} ${-1.19*pos.y}
                    L ${1.05*pos.x} ${1.19*pos.y}
                    Q ${1.03125*pos.x} ${1.185*pos.y}, ${- 1.025*pos.x } ${ 1.18*pos.y}
                    L ${- 1.075*pos.x } ${- 1.195*pos.y}
                    Z`} 
                stroke="#111" 
                strokeWidth="0.5" 
                fill={color}
                strokeLinecap="round" 
            />
        </>
    );
};
