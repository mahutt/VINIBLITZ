/**
 * A position on the game map.
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * A colony on the game map.
 */
export interface Colony {
    /**
     * Position of the colony on the map.
     */
    position: Position;
    /**
     * Current value of the nutriments.
     */
    nutrients: number;
    /**
     * Future value of the nutriments.
     */
    futureNutrients: Array<number>;
}

export interface GameMap {
    /**
     * Width of the game map in tiles.
     */
    width: number;
    /**
     * Height of the game map in tiles.
     */
    height: number;
    /**
     * Biomass per tile.
     */
    biomass: Array<Array<number>>;
    /**
     * List of all colonies on the map.
     */
    colonies: Array<Colony>;
}

export interface TeamGameState {
    /**
     * Current tick number in the game.
     */
    currentTickNumber: number;
    /**
     * List of errors from the last tick.
     */
    lastTickErrors: Array<string>;
    /**
     * Current score of the game.
     */
    score: number;
    /**
     * Amount of biomass available to the player to be placed on the map.
     */
    availableBiomass: number;
    /**
     * Maximum amount of biomass that can be added or removed in a single turn.
     */
    maximumNumberOfBiomassPerTurn: number;
    /**
     * Maximum amount of biomass that can be on the map at once.
     */
    maximumNumberOfBiomassOnMap: number;
    /**
     * The game map containing biomass and colonies.
     */
    map: GameMap;
}

export enum ActionType {
    ADD_BIOMASS = 'ADD_BIOMASS',
    REMOVE_BIOMASS = 'REMOVE_BIOMASS',
}

export type Action = ActionAddBiomass | ActionRemoveBiomass;

interface ActionBase {
    type: ActionType;
}

/**
 * Add biomass to a specific position on the map. Amount must be greater than zero. Position must be inside the map boundaries.
 */
export interface ActionAddBiomass extends ActionBase {
    type: ActionType.ADD_BIOMASS;
    amount: number;
    position: Position;
}

/**
 * Remove biomass from a specific position on the map. Amount must be greater than zero. Position must be inside the map boundaries.
 */
export interface ActionRemoveBiomass extends ActionBase {
    type: ActionType.REMOVE_BIOMASS;
    amount: number;
    position: Position;
}
