import { BoardTopology, TOTAL_NODES } from '../engine/BoardTopology';
import { MatchState, TIGER, GOAT, EMPTY } from '../engine/RulesEngine';

export class Evaluator {
  public static evaluate(state: MatchState): number {
    if (state.result === 'TIGER_WINS') return 100000;
    if (state.result === 'GOAT_WINS') return -100000;
    if (state.result === 'DRAW') return 0;

    let score = 0;

    // 1. Goats Captured Weight
    score += state.goatsCaptured * 3000;

    // 2. Tiger Mobility & Jump Threats
    let totalTigerMoves = 0;
    let trappedTigers = 0;

    for (let i = 0; i < TOTAL_NODES; i++) {
      if (state.board[i] === TIGER) {
        let tigerMoves = 0;
        // Step moves
        for (const n of BoardTopology.neighbors[i]) {
          if (state.board[n] === EMPTY) tigerMoves++;
        }
        // Jump moves
        const jumps = BoardTopology.jumps.get(i) || [];
        for (const j of jumps) {
          if (state.board[j.over] === GOAT && state.board[j.to] === EMPTY) {
            tigerMoves += 3;
            score += 450; // High reward for available jump
          }
        }

        if (tigerMoves === 0) {
          trappedTigers++;
        }
        totalTigerMoves += tigerMoves;
      }
    }

    score += totalTigerMoves * 45;
    score -= trappedTigers * 1200; // Severe penalty for trapped tigers

    // 3. Goat Vulnerability (Goats in danger of being jumped)
    let vulnerableGoats = 0;
    for (let i = 0; i < TOTAL_NODES; i++) {
      if (state.board[i] === GOAT) {
        for (const n of BoardTopology.neighbors[i]) {
          if (state.board[n] === TIGER) {
            // Find direction vector to see if tiger can jump this goat
            const dr = BoardTopology.getRow(i) - BoardTopology.getRow(n);
            const dc = BoardTopology.getCol(i) - BoardTopology.getCol(n);
            const landingR = BoardTopology.getRow(i) + dr;
            const landingC = BoardTopology.getCol(i) + dc;
            if (BoardTopology.isValid(landingR, landingC)) {
              const landingIdx = BoardTopology.getIndex(landingR, landingC);
              if (state.board[landingIdx] === EMPTY) {
                vulnerableGoats++;
              }
            }
          }
        }
      }
    }
    score += vulnerableGoats * 220;

    return score;
  }
}