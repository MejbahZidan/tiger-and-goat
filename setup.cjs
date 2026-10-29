const fs = require('fs');

// 1. index.html
fs.writeFileSync('index.html', `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>বাঘ ও ছাগল — Tiger & Goat</title>
  <link rel="stylesheet" href="/src/style.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`);

// 2. src/style.css
fs.writeFileSync('src/style.css', `* { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
:root { --bg-cream: #F0E5CE; --bg-parchment: #E6D7B8; --wood-dark: #49352B; --terracotta: #A9513B; --olive: #566548; --ink: #292720; --gold: #C19A58; }
body, html { width: 100%; height: 100%; overflow: hidden; background-color: #201D1A; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; justify-content: center; align-items: center; }
#app { width: 100vw; max-width: 480px; height: 100vh; max-height: 960px; background: radial-gradient(circle at 50% 30%, var(--bg-cream), var(--bg-parchment)); display: flex; flex-direction: column; position: relative; box-shadow: 0 0 35px rgba(0,0,0,0.45); }
header { padding: 16px 20px 8px 20px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
h1 { font-size: 1.5rem; color: var(--wood-dark); }
.subtitle { font-size: 0.85rem; color: var(--terracotta); font-weight: 600; }
.hud-panel { display: flex; justify-content: space-between; width: 100%; padding: 8px 16px; font-size: 0.95rem; font-weight: bold; color: var(--ink); }
.hud-badge { background: rgba(73, 53, 43, 0.08); border: 1px solid rgba(73, 53, 43, 0.2); padding: 6px 12px; border-radius: 8px; }
.board-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 12px; position: relative; }
canvas { touch-action: none; cursor: pointer; border-radius: 12px; box-shadow: 0 8px 20px rgba(73, 53, 43, 0.15); }
.controls-footer { padding: 16px 20px 24px 20px; display: flex; justify-content: center; gap: 12px; }
button { background: var(--terracotta); color: #FFF; border: none; padding: 10px 22px; font-size: 0.95rem; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 8px rgba(169, 81, 59, 0.3); cursor: pointer; }
.win-banner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(41, 39, 32, 0.95); color: #FFF; padding: 24px 32px; border-radius: 14px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10; display: flex; flex-direction: column; gap: 12px; }
.win-banner h2 { color: var(--gold); font-size: 1.5rem; }`);

// 3. src/engine/BoardTopology.ts
fs.writeFileSync('src/engine/BoardTopology.ts', `export const BOARD_SIZE = 5;
export const TOTAL_NODES = 25;
export interface JumpPath { to: number; over: number; }
export class BoardTopology {
  public static readonly neighbors: number[][] = BoardTopology.buildNeighbors();
  public static readonly jumps: Map<number, JumpPath[]> = BoardTopology.buildJumps();
  public static getRow(idx: number): number { return Math.floor(idx / BOARD_SIZE); }
  public static getCol(idx: number): number { return idx % BOARD_SIZE; }
  public static getIndex(row: number, col: number): number { return row * BOARD_SIZE + col; }
  public static isValid(row: number, col: number): boolean { return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE; }
  private static buildNeighbors(): number[][] {
    const adj: number[][] = Array.from({ length: TOTAL_NODES }, () => []);
    const orth = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const diag = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const u = this.getIndex(r, c);
        const dirs = (r + c) % 2 === 0 ? [...orth, ...diag] : orth;
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (this.isValid(nr, nc)) adj[u].push(this.getIndex(nr, nc));
        }
      }
    }
    return adj;
  }
  private static buildJumps(): Map<number, JumpPath[]> {
    const jumpMap = new Map<number, JumpPath[]>();
    const orth = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const diag = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const u = this.getIndex(r, c);
        const paths = [];
        const dirs = (r + c) % 2 === 0 ? [...orth, ...diag] : orth;
        for (const [dr, dc] of dirs) {
          const midR = r + dr, midC = c + dc;
          const targetR = r + 2 * dr, targetC = c + 2 * dc;
          if (this.isValid(midR, midC) && this.isValid(targetR, targetC)) {
            paths.push({ to: this.getIndex(targetR, targetC), over: this.getIndex(midR, midC) });
          }
        }
        jumpMap.set(u, paths);
      }
    }
    return jumpMap;
  }
}`);

// 4. src/engine/RulesEngine.ts
fs.writeFileSync('src/engine/RulesEngine.ts', `import { BoardTopology, TOTAL_NODES } from './BoardTopology';
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
}`);

// 5. src/ui/PieceRenderer.ts
fs.writeFileSync('src/ui/PieceRenderer.ts', `export class PieceRenderer {
  public static drawTiger(ctx, x, y, r, selected) {
    ctx.save();
    ctx.fillStyle = selected ? '#C85A32' : '#A9513B';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#6D2B1C'; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.fillStyle = '#292720';
    ctx.beginPath(); ctx.arc(x - r * 0.45, y - r * 0.5, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + r * 0.45, y - r * 0.5, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#292720'; ctx.lineWidth = r * 0.12;
    ctx.beginPath(); ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x, y - r * 0.1); ctx.stroke();
    ctx.fillStyle = '#E6D7B8'; ctx.beginPath(); ctx.arc(x, y + r * 0.2, r * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#292720'; ctx.beginPath(); ctx.arc(x, y + r * 0.12, r * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  public static drawGoat(ctx, x, y, r, selected) {
    ctx.save();
    ctx.fillStyle = selected ? '#FFFFFF' : '#E8DCBE';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#566548'; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.strokeStyle = '#49352B'; ctx.lineWidth = r * 0.14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.35, Math.PI * 0.9, Math.PI * 1.6); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + r * 0.3, y - r * 0.2, r * 0.35, Math.PI * 1.4, Math.PI * 2.1); ctx.stroke();
    ctx.fillStyle = '#49352B'; ctx.beginPath(); ctx.arc(x, y + r * 0.15, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}`);

// 6. src/ui/BoardCanvas.ts
fs.writeFileSync('src/ui/BoardCanvas.ts', `import { BoardTopology, BOARD_SIZE, TOTAL_NODES } from '../engine/BoardTopology';
import { TIGER, GOAT } from '../engine/RulesEngine';
import { PieceRenderer } from './PieceRenderer';
export class BoardCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.boardSizePx = 0;
    this.margin = 32;
    this.nodeRadius = 8;
    this.pieceRadius = 20;
    this.nodeCoords = [];
    this.setupInteractions();
  }
  resize(containerWidth) {
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(containerWidth - 24, 440);
    this.boardSizePx = size;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.margin = size * 0.1;
    this.pieceRadius = (size - 2 * this.margin) / 8.5;
    this.nodeRadius = this.pieceRadius * 0.24;
    this.computeNodeCoordinates();
  }
  computeNodeCoordinates() {
    this.nodeCoords = [];
    const step = (this.boardSizePx - 2 * this.margin) / (BOARD_SIZE - 1);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        this.nodeCoords.push({ x: this.margin + c * step, y: this.margin + r * step });
      }
    }
  }
  setupInteractions() {
    const handleTap = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      let nearestNode = -1;
      let minDist = this.pieceRadius * 1.35;
      for (let i = 0; i < TOTAL_NODES; i++) {
        const c = this.nodeCoords[i];
        const dist = Math.hypot(c.x - x, c.y - y);
        if (dist < minDist) { minDist = dist; nearestNode = i; }
      }
      if (nearestNode !== -1 && this.onNodeClick) this.onNodeClick(nearestNode);
    };
    this.canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); handleTap(e.clientX, e.clientY); });
  }
  render(state, selectedNode, legalMoves) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.boardSizePx, this.boardSizePx);
    ctx.fillStyle = '#E8DCBE';
    ctx.beginPath(); ctx.roundRect(4, 4, this.boardSizePx - 8, this.boardSizePx - 8, 12); ctx.fill();
    ctx.strokeStyle = '#49352B'; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = '#5E4437'; ctx.lineWidth = 2.5;
    const drawn = new Set();
    for (let u = 0; u < TOTAL_NODES; u++) {
      for (const v of BoardTopology.neighbors[u]) {
        const k = u < v ? u + '_' + v : v + '_' + u;
        if (!drawn.has(k)) {
          drawn.add(k);
          ctx.beginPath();
          ctx.moveTo(this.nodeCoords[u].x, this.nodeCoords[u].y);
          ctx.lineTo(this.nodeCoords[v].x, this.nodeCoords[v].y);
          ctx.stroke();
        }
      }
    }
    for (let i = 0; i < TOTAL_NODES; i++) {
      ctx.fillStyle = '#49352B';
      ctx.beginPath(); ctx.arc(this.nodeCoords[i].x, this.nodeCoords[i].y, this.nodeRadius, 0, Math.PI * 2); ctx.fill();
    }
    for (const m of legalMoves) {
      const dest = this.nodeCoords[m.to];
      ctx.fillStyle = m.type === 'JUMP' ? 'rgba(169, 81, 59, 0.45)' : 'rgba(86, 101, 72, 0.45)';
      ctx.beginPath(); ctx.arc(dest.x, dest.y, this.pieceRadius * 0.85, 0, Math.PI * 2); ctx.fill();
    }
    if (selectedNode !== null) {
      const sel = this.nodeCoords[selectedNode];
      ctx.strokeStyle = '#C19A58'; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(sel.x, sel.y, this.pieceRadius * 1.25, 0, Math.PI * 2); ctx.stroke();
    }
    for (let i = 0; i < TOTAL_NODES; i++) {
      const p = state.board[i];
      if (p === TIGER) PieceRenderer.drawTiger(ctx, this.nodeCoords[i].x, this.nodeCoords[i].y, this.pieceRadius, selectedNode === i);
      else if (p === GOAT) PieceRenderer.drawGoat(ctx, this.nodeCoords[i].x, this.nodeCoords[i].y, this.pieceRadius, selectedNode === i);
    }
  }
}`);

// 7. src/main.ts
fs.writeFileSync('src/main.ts', `import './style.css';
import { RulesEngine, TIGER, GOAT } from './engine/RulesEngine';
import { BoardCanvas } from './ui/BoardCanvas';

class GameApp {
  constructor() {
    this.state = RulesEngine.createInitialState();
    this.selectedNode = null;
    this.legalMoves = [];
    const app = document.getElementById('app');
    app.innerHTML = \`
      <header>
        <h1>বাঘ ও ছাগল</h1>
        <div class="subtitle">Tiger & Goat • Classic</div>
      </header>
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
    if (this.state.result !== 'IN_PROGRESS') return;
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
      if (targetMove) { this.executeMove(targetMove); return; }
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
    if (this.state.result !== 'IN_PROGRESS') this.showGameOver();
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
    this.winBannerEl.style.display = 'none';
    this.updateHUD();
    this.boardCanvas.render(this.state, this.selectedNode, this.legalMoves);
  }
}
window.addEventListener('DOMContentLoaded', () => { new GameApp(); });`);

console.log('🎉 ALL GAME FILES WRITTEN SUCCESSFULLY!');
