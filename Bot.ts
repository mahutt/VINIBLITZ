import {
  Action,
  ActionType,
  TeamGameState,
  ActionAddBiomass,
  Position,
} from './GameInterface'

export class Bot {
  public network: Position[][] = []
  public currentBranch = 0
  public currentStep = 0

  constructor() {
    console.log('Initializing your super duper mega bot')
  }

  getNextMoves(gameMessage: TeamGameState): Action[] {
    const actions: Action[] = []

    // On the first tick, we calculate our network
    if (gameMessage.currentTickNumber === 0) {
      const colonies = gameMessage.map.colonies
      let partialNetwork: Position[][] = [
        // @todo implement shortest path function
        getShortestPath(colonies[0].position, colonies[1].position), // assume at least 2 colonies
      ]
      for (let i = 2; i < colonies.length; i++) {
        partialNetwork = connectToNetwork(partialNetwork, colonies[i].position)
      }
    }

    for (let i = 0; i < gameMessage.maximumNumberOfBiomassPerTurn; i++) {
      actions.push({
        type: ActionType.ADD_BIOMASS,
        position: this.network[this.currentBranch][this.currentStep],
        amount: 1,
      } as ActionAddBiomass)
      this.currentStep =
        (this.currentStep + 1) % this.network[this.currentBranch].length
      if (this.currentStep === 0) {
        this.currentBranch = (this.currentBranch + 1) % this.network.length
      }
    }

    return actions
  }
}

function getShortestPath(first: Position, second: Position): Position[] {
  return []
}

function connectToNetwork(
  partialNetwork: Position[][],
  nextColony: Position
): Position[][] {
  return []
}
