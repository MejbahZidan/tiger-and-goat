const fs = require('fs');

// 1. src/ai/Evaluator.ts
fs.writeFileSync('src/ai/Evaluator.ts', `import { BoardTopology, TOTAL_NODES } from '../engine/BoardTopology';
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
}`);

// 2. src/ai/MinimaxAI.ts
fs.writeFileSync('src/ai/MinimaxAI.ts', `import { RulesEngine, MatchState, Move } from '../engine/RulesEngine';
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
}`);

// 3. src/main.ts (Enhanced with Game Modes & AI Opponents)
fs.writeFileSync('src/main.ts', `import './style.css';
import { RulesEngine, TIGER, GOAT } from './engine/RulesEngine';
import { BoardCanvas } from './ui/BoardCanvas';
import { MinimaxAI } from './ai/MinimaxAI';

class GameApp {
  constructor() {
    this.state = RulesEngine.createInitialState();
    this.selectedNode = null;
    this.legalMoves = [];
    this.gameMode = 'AI_TIGER'; // 'AI_TIGER' (Player is Goat), 'AI_GOAT' (Player is Tiger), 'PVP'
    this.difficulty = 'MEDIUM'; // 'EASY', 'MEDIUM', 'EXPERT'
    this.isAiThinking = false;

    const app = document.getElementById('app');
    app.innerHTML = \`
      <header>
        <h1>বাঘ ও ছাগল</h1>
        <div class="subtitle">Tiger & Goat • Classic Strategy</div>
      </header>

      <!-- Match Options Bar -->
      <div style="display: flex; gap: 8px; justify-content: center; padding: 6px 16px;">
        <select id="select-mode" style="background: #E8DCBE; border: 1px solid #49352B; padding: 5px 10px; border-radius: 6px; font-weight: bold; color: #49352B;">
          <option value="AI_TIGER">ছাগল vs বাঘ (AI Tiger)</option>
          <option value="AI_GOAT">বাঘ vs ছাগল (AI Goat)</option>
          <option value="PVP">২ জন খেলোয়াড় (Pass & Play)</option>
        </select>
        <select id="select-diff" style="background: #E8DCBE; border: 1px solid #49352B; padding: 5px 10px; border-radius: 6px; font-weight: bold; color: #49352B;">
          <option value="EASY">সহজ (Easy)</option>
          <option value="MEDIUM" selected>মাঝারি (Medium)</option>
          <option value="EXPERT">ওস্তাদ (Expert)</option>
        </select>
      </div>

      <div class="hud-panel">
        <div id="hud-turn" class="hud-badge">চাল: ছাগল (Goat)</div>
        <div id="hud-reserve" class="hud-badge">বাকি ছাগল: 20</div>
        <div id="hud-captured" class="hud-badge">শিকার: 0 / 5</div>
      </div>

      <div class="board-container" id="board-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <div class="controls-footer">
        <button id="btn-restart">নতুন খেলা (Restart)</button>
      </div>

      <div id="win-banner" class="win-banner" style="display: none;">
        <h2 id="win-title">খেলা সমাপ্ত!</h2>
        <p id="win-desc"></p>
        <button id="btn-rematch">আবার খেলুন</button>
      </div>
    \`;

    this.hudTurnEl = document.getElementById('hud-turn');
    this.hudReserveEl = document.getElementById('hud-reserve');
    this.hudCapturedEl = document.getElementById('hud-captured');
    this.winBannerEl = document.getElementById('win-banner');

    const modeSelect = document.getElementById('select-mode');
    const diffSelect = document.getElementById('select-diff');

    modeSelect.onchange = (e) => {
      this.gameMode = e.target.value;
      diffSelect.style.display = this.gameMode === 'PVP' ? 'none' : 'block';
      this.restartGame();
    };

    diffSelect.onchange = (e) => {
      this.difficulty = e.target.value;
    };

    const canvas = document.getElementById('game-canvas');
    this.boardCanvas = new BoardCanvas(canvas);
    this.boardCanvas.onNodeClick = (idx) => this.handleNodeClick(idx);

    document.getElementById('btn-restart').onclick = () => this.restartGame();
    document.getElementById('btn-rematch').onclick = () => this.restartGame();

    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
    this.updateHUD();
  }

  handleResize() {
    const container = document.getElementById('board-container');
    this.boardCanvas.resize(container.clientWidth);
    this.boardCanvas.render(this.state, this.selectedNode, this.legalMoves);
  }

  handleNodeClick(nodeIndex) {
    if (this.state.result !== 'IN_PROGRESS' || this.isAiThinking) return;

    // Check if it's AI's turn
    if ((this.gameMode === 'AI_TIGER' && this.state.turn === 'TIGER') ||
        (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT')) {
      return;
    }

    const all = RulesEngine.getLegalMoves(this.state);

    if (this.state.turn === 'GOAT' && this.state.phase === 'PLACEMENT') {
      const pm = all.find(m => m.type === 'PLACE' && m.to === nodeIndex);
      if (pm) this.executeMove(pm);
      return;
    }

    const piece = this.state.board[nodeIndex];
    if ((this.state.turn === 'TIGER' && piece === TIGER) ||
        (this.state.turn === 'GOAT' && this.state.phase === 'MOVEMENT' && piece === GOAT)) {
      this.selectedNode = nodeIndex;
      this.legalMoves = all.filter(m => m.from === nodeIndex);
      this.boardCanvas.render(this.state, this.selectedNode, this.legalMoves);
      return;
    }

    if (this.selectedNode !== null) {
      const targetMove = this.legalMoves.find(m => m.to === nodeIndex);
      if (targetMove) {
        this.executeMove(targetMove);
        return;
      }
    }

    this.selectedNode = null;
    this.legalMoves = [];
    this.boardCanvas.render(this.state, this.selectedNode, this.legalMoves);
  }

  executeMove(move) {
    this.state = RulesEngine.applyMove(this.state, move);
    this.selectedNode = null;
    this.legalMoves = [];
    this.updateHUD();
    this.boardCanvas.render(this.state, this.selectedNode, this.legalMoves);

    if (this.state.result !== 'IN_PROGRESS') {
      this.showGameOver();
      return;
    }

    // Trigger AI move if applicable
    this.checkTriggerAI();
  }

  checkTriggerAI() {
    const isAiTurn = (this.gameMode === 'AI_TIGER' && this.state.turn === 'TIGER') ||
                     (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT');

    if (isAiTurn && this.state.result === 'IN_PROGRESS') {
      this.isAiThinking = true;
      this.hudTurnEl.innerText = this.state.turn === 'TIGER' ? 'বাঘ ভাবছে...' : 'ছাগল ভাবছে...';

      setTimeout(() => {
        const bestMove = MinimaxAI.getBestMove(this.state, this.difficulty);
        if (bestMove) {
          this.state = RulesEngine.applyMove(this.state, bestMove);
        }
        this.isAiThinking = false;
        this.updateHUD();
        this.boardCanvas.render(this.state, this.selectedNode, this.legalMoves);

        if (this.state.result !== 'IN_PROGRESS') {
          this.showGameOver();
        }
      }, 420); // Tactile 420ms delay gives natural board rhythm
    }
  }

  updateHUD() {
    const isGoat = this.state.turn === 'GOAT';
    this.hudTurnEl.innerText = isGoat ? 'চাল: ছাগল (Goat)' : 'চাল: বাঘ (Tiger)';
    this.hudTurnEl.style.color = isGoat ? '#566548' : '#A9513B';
    this.hudReserveEl.innerText = 'বাকি ছাগল: ' + this.state.goatsToPlace;
    this.hudCapturedEl.innerText = 'শিকার: ' + this.state.goatsCaptured + ' / 5';
  }

  showGameOver() {
    this.winBannerEl.style.display = 'flex';
    const winTitle = document.getElementById('win-title');
    const winDesc = document.getElementById('win-desc');
    if (this.state.result === 'TIGER_WINS') {
      winTitle.innerText = 'বাঘের জয়! (Tigers Win)';
      winDesc.innerText = 'বাঘ ৫টি ছাগল শিকার করেছে।';
    } else if (this.state.result === 'GOAT_WINS') {
      winTitle.innerText = 'ছাগলের জয়! (Goats Win)';
      winDesc.innerText = 'সব বাঘ বন্দি হয়েছে!';
    } else {
      winTitle.innerText = 'খেলা ড্র! (Draw)';
      winDesc.innerText = 'পুনরাবৃত্তি বা অচলাবস্থা হয়েছে।';
    }
  }

  restartGame() {
    this.state = RulesEngine.createInitialState();
    this.selectedNode = null;
    this.legalMoves = [];
    this.isAiThinking = false;
    this.winBannerEl.style.display = 'none';
    this.updateHUD();
    this.boardCanvas.render(this.state, this.selectedNode, this.legalMoves);

    // If AI is Goat and goes first:
    if (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT') {
      this.checkTriggerAI();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => { new GameApp(); });`);

console.log('🎉 STEP 4 AI ENGINE WRITTEN SUCCESSFULLY!');
