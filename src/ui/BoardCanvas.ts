import { BoardTopology, BOARD_SIZE, TOTAL_NODES } from '../engine/BoardTopology';
import { TIGER, GOAT } from '../engine/RulesEngine';
import { PieceRenderer } from './PieceRenderer';
import { SCENARIOS, ScenarioTheme } from '../cosmetics/ScenarioRegistry';
import { AtmosphereEngine } from './AtmosphereEngine';

interface BloodMark {
  x: number;
  y: number;
  drops: Array<{ dx: number; dy: number; r: number }>;
  startTime: number;
}

export class BoardCanvas {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public boardSizePx = 0;
  public margin = 32;
  public nodeRadius = 8;
  public pieceRadius = 20;
  public nodeCoords: { x: number; y: number }[] = [];
  public activeAnim: any = null;
  public currentState: any = null;
  public currentSelected: number | null = null;
  public currentLegalMoves: any[] = [];
  public pulsePhase = 0;
  public onNodeClick?: (idx: number) => void;
  public scenario: ScenarioTheme = SCENARIOS.courtyard;
  private atmosphere: AtmosphereEngine;

  // Mud, Scars & Temporary Blood Marks
  private mudPatches: Array<{ xRel: number; yRel: number; rx: number; ry: number; angle: number; alpha: number }> = [];
  private surfaceScars: Array<{ x1: number; y1: number; x2: number; y2: number; width: number }> = [];
  private bloodMarks: BloodMark[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.atmosphere = new AtmosphereEngine();
    this.initMudAndScars();
    this.setupInteractions();
    this.startRenderLoop();
  }

  private initMudAndScars() {
    const spots = [
      { x: 0.18, y: 0.22, rx: 28, ry: 18, a: 0.4 },
      { x: 0.82, y: 0.25, rx: 32, ry: 20, a: -0.6 },
      { x: 0.5, y: 0.5, rx: 42, ry: 26, a: 0.2 },
      { x: 0.25, y: 0.78, rx: 35, ry: 22, a: 0.8 },
      { x: 0.8, y: 0.75, rx: 30, ry: 16, a: -0.3 }
    ];
    for (const s of spots) {
      this.mudPatches.push({ xRel: s.x, yRel: s.y, rx: s.rx, ry: s.ry, angle: s.a, alpha: 0.25 });
    }
    this.surfaceScars = [
      { x1: 0.12, y1: 0.15, x2: 0.28, y2: 0.19, width: 1.3 },
      { x1: 0.14, y1: 0.18, x2: 0.26, y2: 0.24, width: 1.6 },
      { x1: 0.42, y1: 0.46, x2: 0.58, y2: 0.52, width: 1.8 },
      { x1: 0.76, y1: 0.78, x2: 0.88, y2: 0.72, width: 1.5 }
    ];
  }

  // 🩸 Spawn Blood Mark on Jump Capture
  public addBloodMark(nodeIdx: number) {
    if (!this.nodeCoords[nodeIdx]) return;
    const pt = this.nodeCoords[nodeIdx];
    const drops: Array<{ dx: number; dy: number; r: number }> = [];
    for (let i = 0; i < 9; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * (this.pieceRadius * 0.95);
      drops.push({
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist,
        r: 1.5 + Math.random() * 3.2
      });
    }
    this.bloodMarks.push({
      x: pt.x,
      y: pt.y,
      drops,
      startTime: performance.now()
    });
  }

  public setScenario(id: string) {
    if (SCENARIOS[id]) this.scenario = SCENARIOS[id];
  }

  public resize(containerWidth: number) {
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
    this.pieceRadius = (size - 2 * this.margin) / 8.2;
    this.nodeRadius = this.pieceRadius * 0.22;
    this.computeNodeCoordinates();
  }

  private computeNodeCoordinates() {
    this.nodeCoords = [];
    const step = (this.boardSizePx - 2 * this.margin) / (BOARD_SIZE - 1);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        this.nodeCoords.push({ x: this.margin + c * step, y: this.margin + r * step });
      }
    }
  }

  private setupInteractions() {
    const handleTap = (clientX: number, clientY: number) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      let nearest = -1;
      let minDist = this.pieceRadius * 1.35;
      for (let i = 0; i < TOTAL_NODES; i++) {
        const c = this.nodeCoords[i];
        const dist = Math.hypot(c.x - x, c.y - y);
        if (dist < minDist) { minDist = dist; nearest = i; }
      }
      if (nearest !== -1 && this.onNodeClick) this.onNodeClick(nearest);
    };
    this.canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); handleTap(e.clientX, e.clientY); });
  }

  public animateMove(piece: number, fromIdx: number, toIdx: number, onComplete: () => void) {
    this.activeAnim = { piece, fromIdx, toIdx, progress: 0, onComplete };
  }

  public setState(state: any, selectedNode: number | null, legalMoves: any[]) {
    this.currentState = state;
    this.currentSelected = selectedNode;
    this.currentLegalMoves = legalMoves;
  }

  private startRenderLoop() {
    let lastTime = performance.now();
    const frame = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      this.pulsePhase = (this.pulsePhase + dt * 4) % (Math.PI * 2);
      if (this.activeAnim) {
        this.activeAnim.progress += dt * 5.5;
        if (this.activeAnim.progress >= 1) {
          const cb = this.activeAnim.onComplete;
          this.activeAnim = null;
          if (cb) cb();
        }
      }
      this.render(now);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  private render(now: number) {
    if (!this.currentState) return;
    const ctx = this.ctx;
    const s = this.scenario;
    const sz = this.boardSizePx;
    ctx.clearRect(0, 0, sz, sz);

    // 1. Board Mat with Deep Ambient Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.48)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = s.boardMat;
    ctx.beginPath();
    ctx.roundRect(6, 6, sz - 12, sz - 12, 16);
    ctx.fill();
    ctx.restore();

    // 2. Mud Splotches
    ctx.save();
    for (const m of this.mudPatches) {
      const mx = m.xRel * sz, my = m.yRel * sz;
      const g = ctx.createRadialGradient(mx, my, 2, mx, my, m.rx);
      g.addColorStop(0, `rgba(50, 30, 16, ${m.alpha * 1.5})`);
      g.addColorStop(1, 'rgba(50, 30, 16, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(mx, my, m.rx, m.ry, m.angle, 0, Math.PI * 2); ctx.fill();
    }

    // 3. Carved Claw Scars
    for (const sc of this.surfaceScars) {
      ctx.strokeStyle = 'rgba(25, 12, 6, 0.45)';
      ctx.lineWidth = sc.width;
      ctx.beginPath(); ctx.moveTo(sc.x1 * sz, sc.y1 * sz); ctx.lineTo(sc.x2 * sz, sc.y2 * sz); ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = sc.width * 0.6;
      ctx.beginPath(); ctx.moveTo(sc.x1 * sz + 0.8, sc.y1 * sz + 0.8); ctx.lineTo(sc.x2 * sz + 0.8, sc.y2 * sz + 0.8); ctx.stroke();
    }

    // 4. Temporary Blood Marks (রক্তের দাগ ৪.৫ সেকেন্ডে মিলিয়ে যায়)
    for (let i = this.bloodMarks.length - 1; i >= 0; i--) {
      const bm = this.bloodMarks[i];
      const elapsed = (now - bm.startTime) / 1000;
      if (elapsed > 4.5) {
        this.bloodMarks.splice(i, 1);
        continue;
      }
      const alpha = Math.max(0, (1 - elapsed / 4.5) * 0.75);
      ctx.fillStyle = `rgba(145, 15, 15, ${alpha})`;
      // Central Pool
      ctx.beginPath();
      ctx.arc(bm.x, bm.y, this.pieceRadius * 0.42, 0, Math.PI * 2);
      ctx.fill();
      // Splatter Drops
      for (const d of bm.drops) {
        ctx.beginPath();
        ctx.arc(bm.x + d.dx, bm.y + d.dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 5. Board Rim & Lines
    ctx.strokeStyle = s.boardBorder;
    ctx.lineWidth = 4.5;
    ctx.stroke();

    ctx.strokeStyle = s.gridLine;
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    const drawn = new Set<string>();
    for (let u = 0; u < TOTAL_NODES; u++) {
      for (const v of BoardTopology.neighbors[u]) {
        const k = u < v ? `${u}_${v}` : `${v}_${u}`;
        if (!drawn.has(k)) {
          drawn.add(k);
          ctx.beginPath();
          ctx.moveTo(this.nodeCoords[u].x, this.nodeCoords[u].y);
          ctx.lineTo(this.nodeCoords[v].x, this.nodeCoords[v].y);
          ctx.stroke();
        }
      }
    }

    // 6. Intersection Anchors
    for (let i = 0; i < TOTAL_NODES; i++) {
      const pt = this.nodeCoords[i];
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.arc(pt.x + 1, pt.y + 1, this.nodeRadius + 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = s.nodeColor;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, this.nodeRadius, 0, Math.PI * 2); ctx.fill();
    }

    // 7. Pulsing Rings
    const pulseFactor = 0.85 + 0.14 * Math.sin(this.pulsePhase);
    for (const m of this.currentLegalMoves) {
      const dest = this.nodeCoords[m.to];
      ctx.save();
      ctx.fillStyle = m.type === 'JUMP' ? 'rgba(217, 74, 56, 0.45)' : 'rgba(76, 175, 80, 0.45)';
      ctx.beginPath(); ctx.arc(dest.x, dest.y, this.pieceRadius * pulseFactor, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = m.type === 'JUMP' ? '#D94A38' : '#4CAF50';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }

    // 8. 3D Pieces
    for (let i = 0; i < TOTAL_NODES; i++) {
      if (this.activeAnim && this.activeAnim.fromIdx === i) continue;
      const p = this.currentState.board[i];
      if (p === TIGER) PieceRenderer.drawTiger(ctx, this.nodeCoords[i].x, this.nodeCoords[i].y, this.pieceRadius, this.currentSelected === i);
      else if (p === GOAT) PieceRenderer.drawGoat(ctx, this.nodeCoords[i].x, this.nodeCoords[i].y, this.pieceRadius, this.currentSelected === i);
    }

    // 9. Jumping Piece
    if (this.activeAnim) {
      const p1 = this.nodeCoords[this.activeAnim.fromIdx];
      const p2 = this.nodeCoords[this.activeAnim.toIdx];
      const prog = Math.min(1, this.activeAnim.progress);
      const ease = 1 - Math.pow(1 - prog, 3);
      const currX = p1.x + (p2.x - p1.x) * ease;
      const currY = p1.y + (p2.y - p1.y) * ease - Math.sin(prog * Math.PI) * 16;
      if (this.activeAnim.piece === TIGER) PieceRenderer.drawTiger(ctx, currX, currY, this.pieceRadius * 1.15, true);
      else PieceRenderer.drawGoat(ctx, currX, currY, this.pieceRadius * 1.15, true);
    }

    // 10. Weather Particles
    this.atmosphere.updateAndDraw(ctx, sz, sz, this.scenario.id);
  }
}
