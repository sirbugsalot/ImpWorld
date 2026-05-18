import { Circle, Path } from 'react-native-svg';

/**
Position is obtained from within the hand
*/
export const Pencil = ({ pos, color= "#f9c92a" }) => {
    const shift_x = -0.1;
    const multiplier_x = 2;
    const multiplier_y = 0.5;
    return (
        <>
            {/* --- Pencil Body--- 
            Path logic: given pos(x,y) is the center
            Color logic: main color of the pencil*/}
            <Path 
                d={`M ${pos.x - (0.2+shift_x)*multiplier_x*pos.x} ${pos.y - 0.4*pos.y*multiplier_y}
                    L ${pos.x + (0.2+shift_x)*pos.x*multiplier_x} ${pos.y + 0.4*pos.y*multiplier_y}
                    Q ${pos.x + (0.195+shift_x)*pos.x*multiplier_x} ${pos.y + 0.35*pos.y*multiplier_y}, ${pos.x + (0.19+shift_x)*pos.x*multiplier_x} ${pos.y + 0.38*pos.y*multiplier_y}
                    L ${pos.x - (0.19+shift_x)*pos.x*multiplier_x} ${pos.y - 0.38*pos.y*multiplier_y}
                    L ${pos.x - (0.22+shift_x)*pos.x*multiplier_x} ${pos.y - 0.44*pos.y*multiplier_y}
                    L ${pos.x + (0.22+shift_x)*pos.x*multiplier_x} ${pos.y + 0.44*pos.y*multiplier_y}
                    Q ${pos.x + (0.215+shift_x)*pos.x*multiplier_x} ${pos.y + 0.42*pos.y*multiplier_y}, ${pos.x + (0.21+shift_x)*pos.x*multiplier_x} ${pos.y + 0.42*pos.y*multiplier_y}
                    Q ${pos.x + (0.205+shift_x)*pos.x*multiplier_x} ${pos.y + 0.38*pos.y*multiplier_y}, ${pos.x + (0.20+shift_x)*pos.x*multiplier_x} ${pos.y + 0.4*pos.y*multiplier_y}
                    M ${pos.x + (0.21+shift_x)*pos.x*multiplier_x} ${pos.y + 0.42*pos.y*multiplier_y}
                    L ${pos.x - (0.21+shift_x)*pos.x*multiplier_x} ${pos.y - 0.42*pos.y*multiplier_y}
                    `} 
                stroke="#111" 
                strokeWidth="0.5" 
                fill={color}
                strokeLinecap="round" 
            />
            <Circle cx={pos.x - (0.20+shift_x)*pos.x*multiplier_x} cy={pos.y - 0.40*pos.y*multiplier_y} r="1" fill="#000000" />
            <Circle cx={pos.x + (0.20+shift_x)*pos.x*multiplier_x} cy={pos.y + 0.40*pos.y*multiplier_y} r="1" fill="#434141" />
            <Circle cx={pos.x + (0.19+shift_x)*pos.x*multiplier_x} cy={pos.y + 0.38*pos.y*multiplier_y} r="1" fill="#6c6a6a" />
            <Circle cx={pos.x - (0.19+shift_x)*pos.x*multiplier_x} cy={pos.y - 0.38*pos.y*multiplier_y} r="1" fill="#9b9999" />
            <Circle cx={pos.x - (0.22+shift_x)*pos.x*multiplier_x} cy={pos.y - 0.44*pos.y*multiplier_y} r="1" fill="#f4bbbb" />
            <Circle cx={pos.x + (0.20+shift_x)*pos.x*multiplier_x} cy={pos.y + 0.44*pos.y*multiplier_y} r="1" fill="#f79e9e" />
            <Circle cx={pos.x + (0.21+shift_x)*pos.x*multiplier_x} cy={pos.y + 0.42*pos.y*multiplier_y} r="1" fill="#f79e9e" />
            <Circle cx={pos.x + (0.20+shift_x)*pos.x*multiplier_x} cy={pos.y + 0.40*pos.y*multiplier_y} r="1" fill="#f87070" />
            <Circle cx={pos.x - (0.21+shift_x)*pos.x*multiplier_x} cy={pos.y - 0.42*pos.y*multiplier_y} r="1" fill="#f92525" />
        </>
    );
};
