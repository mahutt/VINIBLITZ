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

    if (gameMessage.currentTickNumber % 100 === 0) {
      console.log(gameMessage.score)
    }

    // On the first tick, we calculate our network
    if (gameMessage.currentTickNumber === 1) {
      const colonies = gameMessage.map.colonies

      const averageColonyPosition = getAveragePosition(
        colonies.map((colony) => colony.position)
      )

      for (const colony of colonies) {
        const pathToCenter = getShortestPath(
          colony.position,
          averageColonyPosition
        )
        this.network.push(pathToCenter)
      }
    }

    let biomassForThisTurn = gameMessage.maximumNumberOfBiomassPerTurn
    while (biomassForThisTurn > 0) {
      const nextPosition = this.network[this.currentBranch][this.currentStep]

      if (isColonyPosition(gameMessage, nextPosition)) {
        this.incrementStepAndBranch()
        continue
      }

      actions.push({
        type: ActionType.ADD_BIOMASS,
        position: nextPosition,
        amount: 1,
      } as ActionAddBiomass)
      this.incrementStepAndBranch()
      biomassForThisTurn = biomassForThisTurn - 1
    }

    return actions
  }

  incrementStepAndBranch() {
    this.currentStep =
      (this.currentStep + 1) % this.network[this.currentBranch].length
    if (this.currentStep === 0) {
      this.currentBranch = (this.currentBranch + 1) % this.network.length
    }
  }
}

function isColonyPosition(
  gameMessage: TeamGameState,
  position: Position
): boolean {
  for (const colony of gameMessage.map.colonies) {
    if (colony.position.x === position.x && colony.position.y === position.y) {
      return true
    }
  }
  return false
}

function getShortestPath(pos1: Position, pos2: Position): Position[] {
  let paths: Position[] = []
  let deltaX = pos2.x - pos1.x
  let deltaY = pos2.y - pos1.y
  let isXturn = true // Assume False means isYturn
  let current: Position = { x: pos1.x, y: pos1.y } // Create a copy

  paths.push({ x: current.x, y: current.y }) // Push a copy

  while (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
    //Check if deltaX or deltaY are 0 (we shouldnt x if delta x is 0)
    if (deltaX == 0 && isXturn) {
      isXturn = false
      continue
    }
    if (deltaY == 0 && !isXturn) {
      isXturn = true
      continue
    }

    //Next Position for either X or Y

    //Only Move X
    if (isXturn) {
      current.x =
        deltaX > 0 ? current.x + 1 : deltaX < 0 ? current.x - 1 : current.x //Safety check to make sure we dont move x if deltaX is 0
      deltaX = deltaX > 0 ? deltaX - 1 : deltaX < 0 ? deltaX + 1 : deltaX
    }
    //Only Move Y
    if (!isXturn) {
      current.y =
        deltaY > 0 ? current.y + 1 : deltaY < 0 ? current.y - 1 : current.y //Safety check to make sure we dont move x if deltaX is 0
      deltaY = deltaY > 0 ? deltaY - 1 : deltaY < 0 ? deltaY + 1 : deltaY
    }
    //Switch between x turn and y turn after each move
    isXturn = !isXturn
    paths.push({ x: current.x, y: current.y }) // Push a copy
  }
  return paths
}

function connectToNetwork(
  partialNetwork: Position[][],
  nextColony: Position
): Position[][] {
  let shortestPathToNextColony: Position[] = []

  for (const structure of partialNetwork) {
    for (const position of structure) {
      const path = getShortestPath(nextColony, position)

      if (
        shortestPathToNextColony.length === 0 ||
        path.length < shortestPathToNextColony.length
      ) {
        shortestPathToNextColony = path
      }
    }
  }

  if (shortestPathToNextColony.length > 0) {
    return [...partialNetwork, shortestPathToNextColony]
  }

  return partialNetwork
}

function getAveragePosition(positions: Position[]): Position {
  const averageX =
    positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length
  const averageY =
    positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length
  return { x: Math.round(averageX), y: Math.round(averageY) }
}
