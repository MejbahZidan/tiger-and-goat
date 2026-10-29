import { RulesEngine, MatchState, Move } from '../engine/RulesEngine';
import { Evaluator } from './Evaluator';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'EXPERT';

export class MinimaxAI {
  public static getBestMove(state: MatchState, difficulty: AIDifficulty): Move | null {
    const legalMoves = RulesEngine.getLegalMoves(state);
    if (legalMoves.length === 0) return null;

    // Easy AI: 25% chance of deliberate random move for friendly casual play
    if (difficulty === 'EASY' && Math.random() < 0.28) {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    const maxDepth = difficulty === 'EASY' ? 1 : difficulty === 'MEDIUM' ? 3 : 4;
    const isMaximizing = state.turn === 'TIGER';

    // Prioritize Jump moves first for faster Alpha-Beta pruning
    const sortedMoves = [...legalMoves].sort((a, b) => {
      const aVal = a.type === 'JUMP' ? 10 : 0;
      const bVal = b.type === 'JUMP' ? 10 : 0;
      return bVal - aVal;
    });

    let bestMove: Move = sortedMoves[0];
    let bestValue = isMaximizing ? -Infinity : Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of sortedMoves) {
      const nextState = RulesEngine.applyMove(state, move);
      const val = this.minimax(nextState, maxDepth - 1, alpha, beta, !isMaximizing);

      if (isMaximizing) {
        if (val > bestValue) {
          bestValue = val;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestValue);
      } else {
        if (val < bestValue) {
          bestValue = val;
          bestMove = move;
        }
        beta = Math.min(beta, bestValue);
      }

      if (beta <= alpha) break;
    }

    return bestMove;
  }

  private static minimax(state: MatchState, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    if (depth === 0 || state.result !== 'IN_PROGRESS') {
      return Evaluator.evaluate(state);
    }

    const legalMoves = RulesEngine.getLegalMoves(state);
    if (legalMoves.length === 0) {
      return Evaluator.evaluate(state);
    }

    // Sort jumps first
    legalMoves.sort((a, b) => (b.type === 'JUMP' ? 1 : 0) - (a.type === 'JUMP' ? 1 : 0));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        const nextState = RulesEngine.applyMove(state, move);
        const evalScore = this.minimax(nextState, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of legalMoves) {
        const nextState = RulesEngine.applyMove(state, move);
        const evalScore = this.minimax(nextState, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }
}