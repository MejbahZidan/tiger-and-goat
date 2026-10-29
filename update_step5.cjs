const fs = require('fs');

// 1. src/audio/SoundManager.ts (Procedural Web Audio Engine)
fs.writeFileSync('src/audio/SoundManager.ts', `export class SoundManager {
  private static ctx: AudioContext | null = null;
  public static isMuted = false;
  private static rainNode: AudioNode | null = null;
  private static isRainPlaying = false;

  private static init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tactile Wooden Tap (Piece placed or moved)
  public static playPlace() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.07);

    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  // Deep Capture Impact (Tiger leaps over goat)
  public static playCapture() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Strike 1 (Takeoff)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(320, t);
    osc1.frequency.exponentialRampToValueAtTime(60, t + 0.12);
    gain1.gain.setValueAtTime(0.7, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.12);

    // Strike 2 (Wood Slam Landing)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(140, t + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(30, t + 0.22);
    gain2.gain.setValueAtTime(0.85, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.22);
  }

  // Melodic Bengali Folk Pentatonic Flute Arpeggio
  public static playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Raga Bhoopali / Bengali folk scale: Sa, Re, Ga, Pa, Dha, Sa' (C4, D4, E4, G4, A4, C5)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const startTime = this.ctx.currentTime + 0.05;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.14;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.35, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.48);
    });
  }

  // Procedural Monsoon Rain Ambience
  public static toggleRain(): boolean {
    this.init();
    if (!this.ctx) return false;

    if (this.isRainPlaying) {
      if (this.rainNode) {
        (this.rainNode as any).stop?.();
        this.rainNode.disconnect();
        this.rainNode = null;
      }
      this.isRainPlaying = false;
      return false;
    }

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Pink/Brown noise filter
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isRainPlaying = true;
    return true;
  }
}`);

// 2. src/ui/BoardCanvas.ts (With 60fps lerp animations and visual polish)
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

    // Animation state
    this.activeAnim = null; // { piece, fromIdx, toIdx, progress, duration, onComplete }
    this.currentState = null;
    this.currentSelected = null;
    this.currentLegalMoves = [];
    this.pulsePhase = 0;

    this.setupInteractions();
    this.startRenderLoop();
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

  public animateMove(piece, fromIdx, toIdx, onComplete) {
    this.activeAnim = {
      piece,
      fromIdx,
      toIdx,
      progress: 0,
      onComplete
    };
  }

  public setState(state, selectedNode, legalMoves) {
    this.currentState = state;
    this.currentSelected = selectedNode;
    this.currentLegalMoves = legalMoves;
  }

  private startRenderLoop() {
    let lastTime = performance.now();
    const frame = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      this.pulsePhase = (this.pulsePhase + dt * 3.5) % (Math.PI * 2);

      if (this.activeAnim) {
        this.activeAnim.progress += dt * 5.2; // ~190ms animation duration
        if (this.activeAnim.progress >= 1) {
          const cb = this.activeAnim.onComplete;
          this.activeAnim = null;
          if (cb) cb();
        }
      }

      this.render();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  private render() {
    if (!this.currentState) return;
    const ctx = this.ctx;
    const state = this.currentState;
    const selectedNode = this.currentSelected;
    const legalMoves = this.currentLegalMoves;

    ctx.clearRect(0, 0, this.boardSizePx, this.boardSizePx);

    // Earthen Wooden Board Mat with subtle wood grain shadow
    ctx.fillStyle = '#E8DCBE';
    ctx.beginPath(); ctx.roundRect(4, 4, this.boardSizePx - 8, this.boardSizePx - 8, 14); ctx.fill();
    ctx.strokeStyle = '#49352B'; ctx.lineWidth = 3.5; ctx.stroke();

    // Hand-drawn Board Line Grid
    ctx.strokeStyle = '#5E4437'; ctx.lineWidth = 2.4;
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

    // Carved Intersection Nodes
    for (let i = 0; i < TOTAL_NODES; i++) {
      ctx.fillStyle = '#49352B';
      ctx.beginPath(); ctx.arc(this.nodeCoords[i].x, this.nodeCoords[i].y, this.nodeRadius, 0, Math.PI * 2); ctx.fill();
    }

    // Pulsing Legal Destination Indicators
    const pulseFactor = 0.85 + 0.12 * Math.sin(this.pulsePhase);
    for (const m of legalMoves) {
      const dest = this.nodeCoords[m.to];
      ctx.save();
      ctx.fillStyle = m.type === 'JUMP' ? 'rgba(169, 81, 59, 0.42)' : 'rgba(86, 101, 72, 0.42)';
      ctx.beginPath(); ctx.arc(dest.x, dest.y, this.pieceRadius * pulseFactor, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = m.type === 'JUMP' ? '#A9513B' : '#566548';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    }

    // Selected Piece Golden Halo
    if (selectedNode !== null) {
      const sel = this.nodeCoords[selectedNode];
      ctx.save();
      ctx.strokeStyle = '#C19A58';
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(sel.x, sel.y, this.pieceRadius * 1.28, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    // Draw Static Pieces
    for (let i = 0; i < TOTAL_NODES; i++) {
      // Don't draw the piece if it's currently animating away from this node
      if (this.activeAnim && this.activeAnim.fromIdx === i) continue;

      const p = state.board[i];
      if (p === TIGER) PieceRenderer.drawTiger(ctx, this.nodeCoords[i].x, this.nodeCoords[i].y, this.pieceRadius, selectedNode === i);
      else if (p === GOAT) PieceRenderer.drawGoat(ctx, this.nodeCoords[i].x, this.nodeCoords[i].y, this.pieceRadius, selectedNode === i);
    }

    // Draw Smooth Animated Moving Piece
    if (this.activeAnim) {
      const p1 = this.nodeCoords[this.activeAnim.fromIdx];
      const p2 = this.nodeCoords[this.activeAnim.toIdx];
      const prog = Math.min(1, this.activeAnim.progress);
      // Smooth Ease-Out Lerp
      const ease = 1 - Math.pow(1 - prog, 3);
      const currX = p1.x + (p2.x - p1.x) * ease;
      const currY = p1.y + (p2.y - p1.y) * ease;

      if (this.activeAnim.piece === TIGER) {
        PieceRenderer.drawTiger(ctx, currX, currY, this.pieceRadius * 1.1, true);
      } else {
        PieceRenderer.drawGoat(ctx, currX, currY, this.pieceRadius * 1.1, true);
      }
    }
  }
}`);

// 3. src/main.ts (Integrated with Web Audio & Smooth Animation Triggers)
fs.writeFileSync('src/main.ts', `import './style.css';
import { RulesEngine, TIGER, GOAT } from './engine/RulesEngine';
import { BoardCanvas } from './ui/BoardCanvas';
import { MinimaxAI } from './ai/MinimaxAI';
import { SoundManager } from './audio/SoundManager';

class GameApp {
  constructor() {
    this.state = RulesEngine.createInitialState();
    this.selectedNode = null;
    this.legalMoves = [];
    this.gameMode = 'AI_TIGER';
    this.difficulty = 'MEDIUM';
    this.isAiThinking = false;

    const app = document.getElementById('app');
    app.innerHTML = \`
      <header>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <button id="btn-rain" style="padding: 6px 12px; font-size: 0.82rem; background: #566548;">🌧️ বর্ষা (Rain)</button>
          <div style="text-align: center;">
            <h1 style="margin: 0;">বাঘ ও ছাগল</h1>
            <div class="subtitle">Tiger & Goat • Classic</div>
          </div>
          <button id="btn-mute" style="padding: 6px 12px; font-size: 0.82rem; background: #49352B;">🔊 শব্দ</button>
        </div>
      </header>

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
    const muteBtn = document.getElementById('btn-mute');
    const rainBtn = document.getElementById('btn-rain');

    muteBtn.onclick = () => {
      SoundManager.isMuted = !SoundManager.isMuted;
      muteBtn.innerText = SoundManager.isMuted ? '🔇 বন্ধ' : '🔊 শব্দ';
    };

    rainBtn.onclick = () => {
      const isRaining = SoundManager.toggleRain();
      rainBtn.style.filter = isRaining ? 'brightness(1.3)' : 'none';
      rainBtn.innerText = isRaining ? '🌧️ বৃষ্টি চালু' : '🌧️ বর্ষা (Rain)';
    };

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
    this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
  }

  handleNodeClick(nodeIndex) {
    if (this.state.result !== 'IN_PROGRESS' || this.isAiThinking) return;

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
      SoundManager.playPlace();
      this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
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
    this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
  }

  executeMove(move) {
    const movingPiece = move.from !== undefined ? this.state.board[move.from] : GOAT;

    const finalize = () => {
      if (move.type === 'JUMP') {
        SoundManager.playCapture();
      } else {
        SoundManager.playPlace();
      }

      this.state = RulesEngine.applyMove(this.state, move);
      this.selectedNode = null;
      this.legalMoves = [];
      this.updateHUD();
      this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

      if (this.state.result !== 'IN_PROGRESS') {
        SoundManager.playVictory();
        this.showGameOver();
        return;
      }

      this.checkTriggerAI();
    };

    if (move.type === 'MOVE' || move.type === 'JUMP') {
      this.boardCanvas.animateMove(movingPiece, move.from, move.to, finalize);
    } else {
      finalize();
    }
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
          const aiPiece = bestMove.from !== undefined ? this.state.board[bestMove.from] : GOAT;
          if (bestMove.type === 'MOVE' || bestMove.type === 'JUMP') {
            this.boardCanvas.animateMove(aiPiece, bestMove.from, bestMove.to, () => {
              if (bestMove.type === 'JUMP') SoundManager.playCapture();
              else SoundManager.playPlace();

              this.state = RulesEngine.applyMove(this.state, bestMove);
              this.isAiThinking = false;
              this.updateHUD();
              this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

              if (this.state.result !== 'IN_PROGRESS') {
                SoundManager.playVictory();
                this.showGameOver();
              }
            });
            return;
          } else {
            this.state = RulesEngine.applyMove(this.state, bestMove);
            SoundManager.playPlace();
          }
        }
        this.isAiThinking = false;
        this.updateHUD();
        this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

        if (this.state.result !== 'IN_PROGRESS') {
          SoundManager.playVictory();
          this.showGameOver();
        }
      }, 420);
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
    this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

    if (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT') {
      this.checkTriggerAI();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => { new GameApp(); });`);

console.log('🎉 STEP 5 PROCEDURAL AUDIO & ANIMATION ENGINE INSTALLED!');
