class Avatar {
    /**
     * Initializes the player avatar with default or provided configuration.
     * This class acts as the single source of truth for the avatar's appearance
     * and eventual animation state (e.g., walk cycle frame).
     * * @param {object} config - Optional configuration object to set initial items.
     */
    constructor(config = {}) {
        // 1. Core Appearance and Customization Attributes
        // These can hold strings (e.g., 'red_shirt', 'leather_boots') or complex objects
        this.hat = config.hat || 'none';
        this.skinTone = config.skinTone || 'blue'; // Default color, as requested
        this.shirt = config.shirt || 'none';
        this.pants = config.pants || 'none';
        this.shoes = config.shoes || 'none'; 

        // 2. Modular Body Parts (Structured for Animation)
        // Arms and Legs are defined as objects to hold future animation properties.
        this.arms = {
            style: config.armStyle || 'default_sleeves', // Style determines visual shape
            color: this.skinTone,                       // Usually matches skin tone
            currentFrame: 0,                            // For walk cycle animation
            isMoving: false,
        };
        this.legs = {
            style: config.legStyle || 'default_pants',
            color: this.skinTone,
            currentFrame: 0,
            isMoving: false,
        };
    }

    // --- Placeholder Methods for Future Logic ---

    /**
     * Placeholder for the logic that updates the arms and legs for the walk cycle.
     */
    updateWalkCycle(deltaTime) {
        // Future logic: Increment currentFrame based on time and speed
    }

    /**
     * Example: Method to change a customizable item.
     */
    equipShirt(newShirtID) {
        this.shirt = newShirtID;
        console.log(`Avatar equipped: ${newShirtID}`);
    }

    /**
     * Gets the current color for the 'blob' representation (can be removed later).
     */
    getBlobColor() {
        return this.skinTone;
    }
}

export default Avatar;
