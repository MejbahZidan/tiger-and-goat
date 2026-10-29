import './style.css';
import { RulesEngine, TIGER, GOAT } from './engine/RulesEngine';
import { BoardCanvas } from './ui/BoardCanvas';
import { MinimaxAI } from './ai/MinimaxAI';
import { SoundManager } from './audio/SoundManager';
import { PieceRenderer } from './ui/PieceRenderer';
import { SCENARIOS } from './cosmetics/ScenarioRegistry';
import { CAMPAIGN_LEVELS } from './adventure/CampaignLevels';
import { StorageManager } from './storage/StorageManager';

class GameApp {
  public state: any;
  public selectedNode: number | null = null;
  public legalMoves: any[] = [];
  public gameMode = 'AI_TIGER';
  public difficulty = 'MEDIUM';
  public isAiThinking = false;
  public currentScenario = localStorage.getItem('tiger_goat_scenario') || 'courtyard';
  public currentLevel = 0;
  public isAdventure = false;
  public boardCanvas!: BoardCanvas;
  public hudTurnEl!: HTMLElement;
  public hudReserveEl!: HTMLElement;
  public hudCapturedEl!: HTMLElement;
  public winBannerEl!: HTMLElement;

  constructor() {
    this.state = RulesEngine.createInitialState();
    PieceRenderer.skin = localStorage.getItem('tiger_goat_skin') || 'terracotta';
    this.buildUI();
  }

  private buildUI() {
    const app = document.getElementById('app')!;
    app.style.background = SCENARIOS[this.currentScenario].bgGrad;

    app.innerHTML = `
      <!-- Thrown Guti Promo Screen -->
      <div id="welcome-screen">
        <div class="guti-scatter-stage">
          <div class="thrown-guti thrown-tiger toss-1">🐅</div>
          <div class="thrown-guti thrown-goat toss-2">🐐</div>
          <div class="thrown-guti thrown-goat toss-3">🐐</div>
          <div class="thrown-guti thrown-tiger toss-4">🐅</div>
          <div class="thrown-guti thrown-goat toss-5">🐐</div>
          <div class="thrown-guti thrown-goat toss-6">🐐</div>
        </div>
        <div class="welcome-title">বাঘ ও ছাগল</div>
        <div class="welcome-tagline">এক চালেই বদলে যায় খেলা।</div>
        <div class="welcome-lore">বাংলার ঐতিহ্যবাহী বুদ্ধির লড়াই। চার বাঘ আর কুড়ি ছাগলের অসম মহাযুদ্ধ।</div>
        <button id="btn-start" class="btn-start">যুদ্ধ শুরু করুন ➔</button>
      </div>

      <!-- Main Game Header -->
      <header style="padding: 10px 16px 4px 16px; width: 100%; display: flex; justify-content: space-between; align-items: center;">
        <button id="btn-scenario" style="padding: 6px 12px; font-size: 0.8rem; background: rgba(40,24,14,0.75); border: 1.5px solid #C19A58; border-radius: 8px; color: #F5E8D0;">🏞️ সিনারিও</button>
        <div style="text-align: center;">
          <h1 style="margin: 0; font-size: 1.5rem; color: #2B180D; text-shadow: 0 1px 3px rgba(255,255,255,0.35);">বাঘ ও ছাগল</h1>
          <div id="sub-mode" style="font-size: 0.78rem; font-weight: 700; color: #8A4B29;">ক্লাসিক কৌশল দ্বৈরথ</div>
        </div>
        <button id="btn-skin" style="padding: 6px 12px; font-size: 0.8rem; background: rgba(40,24,14,0.75); border: 1.5px solid #C19A58; border-radius: 8px; color: #F5E8D0;">🎨 ঘুঁটি</button>
      </header>

      <!-- Match Options -->
      <div style="display: flex; gap: 6px; justify-content: center; padding: 4px 12px;">
        <select id="sel-mode" style="background: rgba(232, 220, 190, 0.95); border: 1.5px solid #5C3826; padding: 4px 6px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; font-family: 'Noto Serif Bengali';">
          <option value="AI_TIGER">ছাগল vs বাঘ (AI)</option>
          <option value="AI_GOAT">বাঘ vs ছাগল (AI)</option>
          <option value="PVP">২ জন খেলোয়াড়</option>
        </select>
        <select id="sel-diff" style="background: rgba(232, 220, 190, 0.95); border: 1.5px solid #5C3826; padding: 4px 6px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; font-family: 'Noto Serif Bengali';">
          <option value="EASY">সহজ</option>
          <option value="MEDIUM" selected>মাঝারি</option>
          <option value="EXPERT">ওস্তাদ</option>
        </select>
        <button id="btn-rain" style="padding: 4px 8px; font-size: 0.8rem; background: #4A6348; border-radius: 6px;">🌧️</button>
        <button id="btn-sound" style="padding: 4px 8px; font-size: 0.8rem; background: #5C3826; border-radius: 6px;">🔊</button>
      </div>

      <!-- Live Tactical HUD -->
      <div class="hud-panel" style="padding: 6px 16px;">
        <div id="hud-turn" class="hud-badge" style="font-weight: 800;">চাল: ছাগল</div>
        <div id="hud-reserve" class="hud-badge">বাকি: 20</div>
        <div id="hud-captured" class="hud-badge">শিকার: 0 / 5</div>
      </div>

      <!-- Canvas Board -->
      <div class="board-container" id="board-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <!-- Themed Carved Bottom Navigation Bar -->
      <div class="bottom-dock">
        <button id="btn-classic" class="dock-btn dock-btn-classic">🎮 ক্লাসিক</button>
        <button id="btn-campaign" class="dock-btn dock-btn-campaign">🗺️ অভিযান (১০)</button>
        <button id="btn-restart" class="dock-btn dock-btn-restart">🔄 নতুন খেলা</button>
      </div>

      <!-- Modals -->
      <div id="modal-scenario" class="win-banner" style="display: none; width: 90%; max-width: 360px;">
        <h3>সিনারিও নির্বাচন করুন</h3>
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin: 12px 0;">
          <button class="scen-btn dock-btn dock-btn-classic" data-id="courtyard">🏡 গ্রামের উঠান (Village)</button>
          <button class="scen-btn dock-btn dock-btn-restart" data-id="school">🏫 স্কুলের কাঠের ডেস্ক (School Desk)</button>
          <button class="scen-btn dock-btn dock-btn-classic" data-id="monsoon">🌧️ বর্ষার বিকেল (Monsoon Slate)</button>
          <button class="scen-btn dock-btn dock-btn-campaign" data-id="sundarban">🐅 সুন্দরবনের গহীন (Sundarban)</button>
        </div>
        <button id="close-scen" style="background: #5C3826; padding: 6px;">বন্ধ করুন</button>
      </div>

      <div id="modal-skin" class="win-banner" style="display: none; width: 90%; max-width: 360px;">
        <h3>ঘুঁটির রূপ (3D Skins)</h3>
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin: 12px 0;">
          <button class="skin-btn dock-btn dock-btn-classic" data-id="terracotta">🏺 পোড়ামাটির ঘুঁটি (Terracotta)</button>
          <button class="skin-btn dock-btn dock-btn-restart" data-id="wood">🪵 খোদাই করা শাল কাঠ (Carved Teak)</button>
          <button class="skin-btn dock-btn dock-btn-classic" data-id="monsoon">🪨 বর্ষার নদী পাথর (Monsoon Slate)</button>
          <button class="skin-btn dock-btn dock-btn-campaign" data-id="royal">👑 রাজকীয় স্বর্ণ ও ব্রোঞ্জ (Royal Gold)</button>
        </div>
        <button id="close-skin" style="background: #5C3826; padding: 6px;">বন্ধ করুন</button>
      </div>

      <div id="modal-levels" class="win-banner" style="display: none; width: 92%; max-width: 380px; max-height: 80vh; overflow-y: auto;">
        <h3>অভিযান স্তরসমূহ (1-10)</h3>
        <div id="lvl-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 12px 0; width: 100%;"></div>
        <button id="close-lvl" style="background: #5C3826; padding: 6px;">বন্ধ করুন</button>
      </div>

      <div id="win-banner" class="win-banner" style="display: none;">
        <h2 id="win-title">খেলা সমাপ্ত!</h2>
        <p id="win-desc"></p>
        <button id="btn-rematch" class="btn-start" style="margin-top: 10px; padding: 10px 24px;">আবার খেলুন</button>
      </div>
    `;

    this.hudTurnEl = document.getElementById('hud-turn')!;
    this.hudReserveEl = document.getElementById('hud-reserve')!;
    this.hudCapturedEl = document.getElementById('hud-captured')!;
    this.winBannerEl = document.getElementById('win-banner')!;

    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.boardCanvas = new BoardCanvas(canvas);
    this.boardCanvas.setScenario(this.currentScenario);
    this.boardCanvas.onNodeClick = (idx) => this.handleNodeClick(idx);

    this.bindEvents();
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
    this.updateHUD();
  }

  private bindEvents() {
    document.getElementById('btn-start')!.onclick = () => {
      SoundManager.playPlace();
      document.getElementById('welcome-screen')!.classList.add('hidden');
    };

    document.getElementById('btn-scenario')!.onclick = () => {
      document.getElementById('modal-scenario')!.style.display = 'flex';
    };
    document.querySelectorAll('.scen-btn').forEach(b => {
      (b as HTMLElement).onclick = (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id')!;
        this.currentScenario = id;
        localStorage.setItem('tiger_goat_scenario', id);
        document.getElementById('app')!.style.background = SCENARIOS[id].bgGrad;
        this.boardCanvas.setScenario(id);
        document.getElementById('modal-scenario')!.style.display = 'none';
      };
    });
    document.getElementById('close-scen')!.onclick = () => {
      document.getElementById('modal-scenario')!.style.display = 'none';
    };

    document.getElementById('btn-skin')!.onclick = () => {
      document.getElementById('modal-skin')!.style.display = 'flex';
    };
    document.querySelectorAll('.skin-btn').forEach(b => {
      (b as HTMLElement).onclick = (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id')!;
        PieceRenderer.setSkin(id);
        document.getElementById('modal-skin')!.style.display = 'none';
      };
    });
    document.getElementById('close-skin')!.onclick = () => {
      document.getElementById('modal-skin')!.style.display = 'none';
    };

    document.getElementById('btn-campaign')!.onclick = () => this.showLevelsModal();
    document.getElementById('close-lvl')!.onclick = () => {
      document.getElementById('modal-levels')!.style.display = 'none';
    };

    document.getElementById('btn-classic')!.onclick = () => {
      this.isAdventure = false;
      document.getElementById('sub-mode')!.innerText = 'ক্লাসিক কৌশল দ্বৈরথ';
      this.restartGame();
    };

    document.getElementById('btn-restart')!.onclick = () => this.restartGame();
    document.getElementById('btn-rematch')!.onclick = () => this.restartGame();

    document.getElementById('btn-sound')!.onclick = (e) => {
      SoundManager.isMuted = !SoundManager.isMuted;
      (e.target as HTMLElement).innerText = SoundManager.isMuted ? '🔇' : '🔊';
    };
    document.getElementById('btn-rain')!.onclick = (e) => {
      const on = SoundManager.toggleRain();
      (e.target as HTMLElement).style.filter = on ? 'brightness(1.5)' : 'none';
    };

    const selMode = document.getElementById('sel-mode') as HTMLSelectElement;
    selMode.onchange = (e) => {
      this.gameMode = (e.target as HTMLSelectElement).value;
      this.restartGame();
    };

    const selDiff = document.getElementById('sel-diff') as HTMLSelectElement;
    selDiff.onchange = (e) => {
      this.difficulty = (e.target as HTMLSelectElement).value;
    };
  }

  private showLevelsModal() {
    const prog = StorageManager.loadProgress();
    const grid = document.getElementById('lvl-grid')!;
    grid.innerHTML = '';
    CAMPAIGN_LEVELS.forEach((lvl, idx) => {
      const unlocked = idx + 1 <= prog.unlockedLevel;
      const stars = prog.levelStars[lvl.id] || 0;
      const b = document.createElement('button');
      b.className = 'dock-btn ' + (unlocked ? 'dock-btn-campaign' : '');
      b.style.cssText = 'padding: 8px 4px; font-size: 0.78rem; display: flex; flex-direction: column; align-items: center;' +
        (unlocked ? '' : 'background: #251610; opacity: 0.55; border: 1px solid #442A1D;');
      b.innerHTML = `<span>${lvl.titleBn}</span><span style="color: #FFD700;">${unlocked ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '🔒'}</span>`;
      if (unlocked) {
        b.onclick = () => {
          this.loadCampaignLevel(idx);
          document.getElementById('modal-levels')!.style.display = 'none';
        };
      }
      grid.appendChild(b);
    });
    document.getElementById('modal-levels')!.style.display = 'flex';
  }

  private loadCampaignLevel(idx: number) {
    this.isAdventure = true;
    this.currentLevel = idx;
    const lvl = CAMPAIGN_LEVELS[idx];
    document.getElementById('sub-mode')!.innerText = `অভিযান: ${lvl.titleBn}`;
    this.state = lvl.getInitialState();
    this.gameMode = lvl.playerSide === 'GOAT' ? 'AI_TIGER' : 'AI_GOAT';
    this.difficulty = lvl.aiDifficulty;
    this.selectedNode = null;
    this.legalMoves = [];
    this.winBannerEl.style.display = 'none';
    this.updateHUD();
    this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
    if (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT') this.checkTriggerAI();
  }

  private handleResize() {
    const container = document.getElementById('board-container');
    if (container && this.boardCanvas) {
      this.boardCanvas.resize(container.clientWidth);
      this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
    }
  }

  private handleNodeClick(nodeIndex: number) {
    if (this.state.result !== 'IN_PROGRESS' || this.isAiThinking) return;
    if ((this.gameMode === 'AI_TIGER' && this.state.turn === 'TIGER') ||
        (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT')) return;

    const all = RulesEngine.getLegalMoves(this.state);
    if (this.state.turn === 'GOAT' && this.state.phase === 'PLACEMENT') {
      const pm = all.find((m: any) => m.type === 'PLACE' && m.to === nodeIndex);
      if (pm) this.executeMove(pm);
      return;
    }

    const piece = this.state.board[nodeIndex];
    if ((this.state.turn === 'TIGER' && piece === TIGER) ||
        (this.state.turn === 'GOAT' && this.state.phase === 'MOVEMENT' && piece === GOAT)) {
      this.selectedNode = nodeIndex;
      this.legalMoves = all.filter((m: any) => m.from === nodeIndex);
      SoundManager.playPlace();
      this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
      return;
    }

    if (this.selectedNode !== null) {
      const targetMove = this.legalMoves.find((m: any) => m.to === nodeIndex);
      if (targetMove) { this.executeMove(targetMove); return; }
    }
    this.selectedNode = null;
    this.legalMoves = [];
    this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
  }

  private executeMove(move: any) {
    const piece = move.from !== undefined ? this.state.board[move.from] : GOAT;
    const finalize = () => {
      if (move.type === 'JUMP') {
        SoundManager.playGoatScream();
        SoundManager.playCapture();
        if (move.captured !== undefined) {
          this.boardCanvas.addBloodMark(move.captured);
        }
      } else {
        SoundManager.playPlace();
      }

      this.state = RulesEngine.applyMove(this.state, move);
      this.selectedNode = null;
      this.legalMoves = [];
      this.updateHUD();
      this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

      if (this.state.result !== 'IN_PROGRESS') {
        if (this.state.result === 'GOAT_WINS') SoundManager.playTigerRoar();
        else SoundManager.playVictory();
        this.showGameOver();
        return;
      }
      this.checkTriggerAI();
    };

    if (move.type === 'MOVE' || move.type === 'JUMP') {
      this.boardCanvas.animateMove(piece, move.from, move.to, finalize);
    } else {
      finalize();
    }
  }

  private checkTriggerAI() {
    const isAiTurn = (this.gameMode === 'AI_TIGER' && this.state.turn === 'TIGER') ||
                     (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT');
    if (isAiTurn && this.state.result === 'IN_PROGRESS') {
      this.isAiThinking = true;
      this.hudTurnEl.innerText = 'বাঘ ভাবছে...';
      setTimeout(() => {
        const best = MinimaxAI.getBestMove(this.state, this.difficulty);
        if (best) {
          const piece = best.from !== undefined ? this.state.board[best.from] : GOAT;
          if (best.type === 'MOVE' || best.type === 'JUMP') {
            this.boardCanvas.animateMove(piece, best.from, best.to, () => {
              if (best.type === 'JUMP') {
                SoundManager.playGoatScream();
                SoundManager.playCapture();
                if (best.captured !== undefined) {
                  this.boardCanvas.addBloodMark(best.captured);
                }
              } else {
                SoundManager.playPlace();
              }
              this.state = RulesEngine.applyMove(this.state, best);
              this.isAiThinking = false;
              this.updateHUD();
              this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
              if (this.state.result !== 'IN_PROGRESS') {
                if (this.state.result === 'GOAT_WINS') SoundManager.playTigerRoar();
                else SoundManager.playVictory();
                this.showGameOver();
              }
            });
            return;
          } else {
            this.state = RulesEngine.applyMove(this.state, best);
            SoundManager.playPlace();
          }
        }
        this.isAiThinking = false;
        this.updateHUD();
        this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
        if (this.state.result !== 'IN_PROGRESS') {
          if (this.state.result === 'GOAT_WINS') SoundManager.playTigerRoar();
          else SoundManager.playVictory();
          this.showGameOver();
        }
      }, 420);
    }
  }

  private updateHUD() {
    const isGoat = this.state.turn === 'GOAT';
    this.hudTurnEl.innerText = `চাল: ${isGoat ? 'ছাগল' : 'বাঘ'}`;
    this.hudTurnEl.style.color = isGoat ? '#2E7D32' : '#C62828';
    this.hudReserveEl.innerText = `বাকি: ${this.state.goatsToPlace}`;
    this.hudCapturedEl.innerText = `শিকার: ${this.state.goatsCaptured} / 5`;
  }

  private showGameOver() {
    this.winBannerEl.style.display = 'flex';
    const t = document.getElementById('win-title')!;
    const d = document.getElementById('win-desc')!;
    if (this.state.result === 'TIGER_WINS') {
      t.innerText = 'বাঘের জয়!';
      d.innerText = 'বাঘ ৫টি ছাগল শিকার করেছে।';
    } else if (this.state.result === 'GOAT_WINS') {
      t.innerText = 'ছাগলের জয়!';
      d.innerText = 'সব বাঘ চারদিক থেকে বন্দি হয়েছে!';
    } else {
      t.innerText = 'খেলা ড্র!';
      d.innerText = 'অচলাবস্থা বা পুনরাবৃত্তি হয়েছে।';
    }
  }

  private restartGame() {
    this.state = RulesEngine.createInitialState();
    this.selectedNode = null;
    this.legalMoves = [];
    this.isAiThinking = false;
    this.winBannerEl.style.display = 'none';
    this.updateHUD();
    this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
    if (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT') this.checkTriggerAI();
  }
}

window.addEventListener('DOMContentLoaded', () => { new GameApp(); });
