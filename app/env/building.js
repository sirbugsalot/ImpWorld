class Building {
    /**
     * Represents a structure in the game world, such as a house or gym.
     * @param {string} name - The display name of the building (e.g., 'Starter Home', 'Pokémon Center').
     * @param {string} shape - The geometry or sprite shape of the building (e.g., 'rectangle', 'L-shape').
     * @param {object} size - Dimensions of the building in world units {width, height}.
     * @param {object} door - Coordinates and properties of the entry point {x, y, isLocked}.
     */
    constructor(name, shape, size, door) {
        this.name = name;
        this.shape = shape;
        
        // Define size with default structure
        this.size = {
            width: size.width || 50,
            height: size.height || 50,
        };

        // Define door properties
        this.door = {
            x: door.x || 0,
            y: door.y || 0,
            isLocked: door.isLocked || false,
        };
        
        // Placeholder for future interaction/collision data
        this.collisionBounds = this.calculateBounds();
    }

    /**
     * Calculates the bounding box for collision detection based on size.
     */
    calculateBounds() {
        return { 
            minX: 0, 
            minY: 0, 
            maxX: this.size.width, 
            maxY: this.size.height 
        };
    }
}

export default Building;
