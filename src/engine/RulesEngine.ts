import { BoardTopology, TOTAL_NODES } from './BoardTopology';
export type PieceType = 0 | 1 | 2;
export const EMPTY = 0;
export const TIGER = 1;
export const GOAT = 2;
export type PlayerSide = 'GOAT' | 'TIGER';
export type GamePhase = 'PLACEMENT' | 'MOVEMENT';
export type GameResult = 'GOAT_WINS' | 'TIGER_WINS' | 'DRAW' | 'IN_PROGRESS';
export interface Move { type: 'PLACE' | 'MOVE' | 'JUMP'; from?: number; to: number; captured?: number; }
export interface MatchState {
  board: PieceType[]; turn: PlayerSide; phase: GamePhase; goatsToPlace: number; goatsCaptured: number; result: GameResult; moveHistory: Move[]; positionCounts: Map<string, number>;
}
export class RulesEngine {
  public static createInitialState(): MatchState {
    const board = new Array(TOTAL_NODES).fill(EMPTY);
    board[0] = TIGER; board[4] = TIGER; board[20] = TIGER; board[24] = TIGER;
    const initialCounts = new Map();
    const state = { board, turn: 'GOAT', phase: 'PLACEMENT', goatsToPlace: 20, goatsCaptured: 0, result: 'IN_PROGRESS', moveHistory: [], positionCounts: initialCounts };
    state.positionCounts.set(this.getBoardKey(state), 1);
    return state;
  }
  public static getBoardKey(state) { return state.turn + '_' + state.goatsToPlace + '_' + state.board.join(''); }
  public static getLegalMoves(state) {
    if (state.result !== 'IN_PROGRESS') return [];
    const moves = [];
    if (state.turn === 'GOAT') {
      if (state.phase === 'PLACEMENT') {
        for (let i = 0; i < TOTAL_NODES; i++) {
          if (state.board[i] === EMPTY) moves.push({ type: 'PLACE', to: i });
        }
      } else {
        for (let i = 0; i < TOTAL_NODES; i++) {
          if (state.board[i] === GOAT) {
            for (const n of BoardTopology.neighbors[i]) {
              if (state.board[n] === EMPTY) moves.push({ type: 'MOVE', from: i, to: n });
            }
          }
        }
      }
    } else {
      for (let i = 0; i < TOTAL_NODES; i++) {
        if (state.board[i] === TIGER) {
          for (const n of BoardTopology.neighbors[i]) {
            if (state.board[n] === EMPTY) moves.push({ type: 'MOVE', from: i, to: n });
          }
          const jumps = BoardTopology.jumps.get(i) || [];
          for (const j of jumps) {
            if (state.board[j.over] === GOAT && state.board[j.to] === EMPTY) {
              moves.push({ type: 'JUMP', from: i, to: j.to, captured: j.over });
            }
          }
        }
      }
    }
    return moves;
  }
  public static applyMove(state, move) {
    const nextBoard = [...state.board];
    let nextGoatsToPlace = state.goatsToPlace;
    let nextGoatsCaptured = state.goatsCaptured;
    let nextPhase = state.phase;
    if (move.type === 'PLACE') {
      nextBoard[move.to] = GOAT;
      nextGoatsToPlace--;
      if (nextGoatsToPlace === 0) nextPhase = 'MOVEMENT';
    } else if (move.type === 'MOVE') {
      nextBoard[move.to] = nextBoard[move.from];
      nextBoard[move.from] = EMPTY;
    } else if (move.type === 'JUMP') {
      nextBoard[move.to] = TIGER;
      nextBoard[move.from] = EMPTY;
      nextBoard[move.captured] = EMPTY;
      nextGoatsCaptured++;
    }
    const nextTurn = state.turn === 'GOAT' ? 'TIGER' : 'GOAT';
    const nextState = {
      board: nextBoard, turn: nextTurn, phase: nextPhase, goatsToPlace: nextGoatsToPlace, goatsCaptured: nextGoatsCaptured, result: 'IN_PROGRESS', moveHistory: [...state.moveHistory, move], positionCounts: new Map(state.positionCounts)
    };
    const key = this.getBoardKey(nextState);
    const count = (nextState.positionCounts.get(key) || 0) + 1;
    nextState.positionCounts.set(key, count);
    nextState.result = this.evaluateResult(nextState, count);
    return nextState;
  }
  public static evaluateResult(state, repCount = 1) {
    if (state.goatsCaptured >= 5) return 'TIGER_WINS';
    if (repCount >= 3) return 'DRAW';
    let tigerHasMoves = false;
    for (let i = 0; i < TOTAL_NODES; i++) {
      if (state.board[i] === TIGER) {
        for (const n of BoardTopology.neighbors[i]) {
          if (state.board[n] === EMPTY) { tigerHasMoves = true; break; }
        }
        if (tigerHasMoves) break;
        const jumps = BoardTopology.jumps.get(i) || [];
        for (const j of jumps) {
          if (state.board[j.over] === GOAT && state.board[j.to] === EMPTY) { tigerHasMoves = true; break; }
        }
        if (tigerHasMoves) break;
      }
    }
    return !tigerHasMoves ? 'GOAT_WINS' : 'IN_PROGRESS';
  }
}