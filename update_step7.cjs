const fs = require('fs');

// 1. src/localization/i18n.ts
fs.writeFileSync('src/localization/i18n.ts', `export type Language = 'bn' | 'en';

export const DICTIONARY = {
  bn: {
    gameTitle: 'বাঘ ও ছাগল',
    gameSubtitleClassic: 'ক্লাসিক কৌশল খেলা',
    gameSubtitleAdv: 'অভিযান পর্ব',
    tabClassic: 'ক্লাসিক',
    tabAdventure: 'অভিযান',
    tabProfile: 'প্রোফাইল',
    turnGoat: 'চাল: ছাগল',
    turnTiger: 'চাল: বাঘ',
    turnAiThinking: 'ভাবছে...',
    reserveGoats: 'বাকি ছাগল',
    capturedGoats: 'শিকার',
    modeAiTiger: 'ছাগল vs বাঘ (AI বাঘ)',
    modeAiGoat: 'বাঘ vs ছাগল (AI ছাগল)',
    modePvp: '২ জন খেলোয়াড়',
    diffEasy: 'সহজ',
    diffMedium: 'মাঝারি',
    diffExpert: 'ওস্তাদ',
    btnRestart: 'নতুন খেলা',
    btnRainOn: '🌧️ বৃষ্টি চালু',
    btnRainOff: '🌧️ বর্ষা',
    btnSoundOn: '🔊 শব্দ',
    btnSoundOff: '🔇 বন্ধ',
    winTigerTitle: 'বাঘের জয়!',
    winTigerDesc: 'বাঘ ৫টি ছাগল শিকার করেছে।',
    winGoatTitle: 'ছাগলের জয়!',
    winGoatDesc: 'সব বাঘ বন্দি হয়েছে!',
    winDrawTitle: 'খেলা ড্র!',
    winDrawDesc: 'একই অবস্থানের পুনরাবৃত্তি হয়েছে।',
    btnRematch: 'আবার খেলুন',
    btnNextLevel: 'পরবর্তী স্তর ➔',
    profileTitle: 'খেলোয়াড় পরিচিতি',
    level: 'লেভেল',
    xp: 'অভিজ্ঞতা (XP)',
    selectSkin: 'ঘুঁটির রূপ (Skin)',
    titleUnset: 'উঠানের রাজা',
    allLevels: 'সব লেভেল',
    close: 'বন্ধ করুন'
  },
  en: {
    gameTitle: 'Tiger & Goat',
    gameSubtitleClassic: 'Classic Strategy',
    gameSubtitleAdv: 'Adventure Mode',
    tabClassic: 'Classic',
    tabAdventure: 'Campaign',
    tabProfile: 'Profile',
    turnGoat: "Turn: Goat",
    turnTiger: "Turn: Tiger",
    turnAiThinking: 'Thinking...',
    reserveGoats: 'Goats Left',
    capturedGoats: 'Captured',
    modeAiTiger: 'Goat vs AI Tiger',
    modeAiGoat: 'Tiger vs AI Goat',
    modePvp: 'Pass & Play (2P)',
    diffEasy: 'Easy',
    diffMedium: 'Medium',
    diffExpert: 'Expert',
    btnRestart: 'Restart Match',
    btnRainOn: '🌧️ Rain On',
    btnRainOff: '🌧️ Rain',
    btnSoundOn: '🔊 Audio',
    btnSoundOff: '🔇 Muted',
    winTigerTitle: 'Tigers Win!',
    winTigerDesc: 'Tigers have captured 5 goats.',
    winGoatTitle: 'Goats Win!',
    winGoatDesc: 'All tigers are completely trapped!',
    winDrawTitle: 'Match Drawn!',
    winDrawDesc: 'Position repeated threefold.',
    btnRematch: 'Play Again',
    btnNextLevel: 'Next Level ➔',
    profileTitle: 'Player Profile',
    level: 'Level',
    xp: 'Experience (XP)',
    selectSkin: 'Piece Theme (Skin)',
    titleUnset: 'Courtyard Champion',
    allLevels: 'All Levels',
    close: 'Close'
  }
};

export class I18n {
  private static currentLang: Language = (localStorage.getItem('tiger_goat_lang') as Language) || 'bn';

  public static get lang(): Language {
    return this.currentLang;
  }

  public static setLanguage(lang: Language) {
    this.currentLang = lang;
    localStorage.setItem('tiger_goat_lang', lang);
  }

  public static t(key: keyof typeof DICTIONARY['bn']): string {
    return DICTIONARY[this.currentLang][key] || key;
  }
}`);

// 2. src/cosmetics/SkinRegistry.ts
fs.writeFileSync('src/cosmetics/SkinRegistry.ts', `export interface SkinTheme {
  id: string;
  nameBn: string;
  nameEn: string;
  tigerBody: string;
  tigerSelected: string;
  tigerRim: string;
  goatBody: string;
  goatSelected: string;
  goatRim: string;
  tigerStripe: string;
  goatHorn: string;
}

export const SKINS: Record<string, SkinTheme> = {
  terracotta: {
    id: 'terracotta',
    nameBn: 'মাটির রূপ (Terracotta)',
    nameEn: 'Terracotta Clay',
    tigerBody: '#A9513B',
    tigerSelected: '#C85A32',
    tigerRim: '#6D2B1C',
    goatBody: '#E8DCBE',
    goatSelected: '#FFFFFF',
    goatRim: '#566548',
    tigerStripe: '#292720',
    goatHorn: '#49352B'
  },
  wood: {
    id: 'wood',
    nameBn: 'শাল কাঠ (Carved Teak)',
    nameEn: 'Carved Teak Wood',
    tigerBody: '#4A2A18',
    tigerSelected: '#6B3C22',
    tigerRim: '#C19A58',
    goatBody: '#D7BA89',
    goatSelected: '#F4DEB8',
    goatRim: '#654321',
    tigerStripe: '#1F100B',
    goatHorn: '#2E1A0F'
  },
  monsoon: {
    id: 'monsoon',
    nameBn: 'বর্ষার পাথর (Monsoon Slate)',
    nameEn: 'Monsoon River Slate',
    tigerBody: '#475D65',
    tigerSelected: '#5A747E',
    tigerRim: '#25353B',
    goatBody: '#D3DFE2',
    goatSelected: '#FFFFFF',
    goatRim: '#6B878E',
    tigerStripe: '#162227',
    goatHorn: '#33444A'
  },
  royal: {
    id: 'royal',
    nameBn: 'রাজকীয় সুন্দরবন (Royal Gold)',
    nameEn: 'Royal Sundarbans',
    tigerBody: '#C19A58',
    tigerSelected: '#DFC07D',
    tigerRim: '#3B3624',
    goatBody: '#566548',
    goatSelected: '#728362',
    goatRim: '#A3B495',
    tigerStripe: '#292720',
    goatHorn: '#263020'
  }
};
`);

// 3. Update PieceRenderer to accept dynamic skins
fs.writeFileSync('src/ui/PieceRenderer.ts', `import { SKINS, SkinTheme } from '../cosmetics/SkinRegistry';

export class PieceRenderer {
  public static currentSkin: SkinTheme = SKINS.terracotta;

  public static setSkin(skinId: string) {
    if (SKINS[skinId]) {
      this.currentSkin = SKINS[skinId];
    }
  }

  public static drawTiger(ctx, x, y, r, selected) {
    const s = this.currentSkin;
    ctx.save();
    ctx.fillStyle = selected ? s.tigerSelected : s.tigerBody;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = s.tigerRim; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.fillStyle = s.tigerStripe;
    ctx.beginPath(); ctx.arc(x - r * 0.45, y - r * 0.5, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + r * 0.45, y - r * 0.5, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = s.tigerStripe; ctx.lineWidth = r * 0.12;
    ctx.beginPath(); ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x, y - r * 0.1); ctx.stroke();
    ctx.fillStyle = '#E6D7B8'; ctx.beginPath(); ctx.arc(x, y + r * 0.2, r * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = s.tigerStripe; ctx.beginPath(); ctx.arc(x, y + r * 0.12, r * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  public static drawGoat(ctx, x, y, r, selected) {
    const s = this.currentSkin;
    ctx.save();
    ctx.fillStyle = selected ? s.goatSelected : s.goatBody;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = s.goatRim; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.strokeStyle = s.goatHorn; ctx.lineWidth = r * 0.14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.35, Math.PI * 0.9, Math.PI * 1.6); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + r * 0.3, y - r * 0.2, r * 0.35, Math.PI * 1.4, Math.PI * 2.1); ctx.stroke();
    ctx.fillStyle = s.goatHorn; ctx.beginPath(); ctx.arc(x, y + r * 0.15, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}`);

// 4. Update src/main.ts with language switcher, profile drawer, and skin customizer
fs.writeFileSync('src/main.ts', `import './style.css';
import { RulesEngine, TIGER, GOAT } from './engine/RulesEngine';
import { BoardCanvas } from './ui/BoardCanvas';
import { MinimaxAI } from './ai/MinimaxAI';
import { SoundManager } from './audio/SoundManager';
import { StorageManager } from './storage/StorageManager';
import { CAMPAIGN_LEVELS } from './adventure/CampaignLevels';
import { I18n } from './localization/i18n';
import { SKINS } from './cosmetics/SkinRegistry';
import { PieceRenderer } from './ui/PieceRenderer';

class GameApp {
  constructor() {
    this.currentMode = 'CLASSIC';
    this.currentLevelIndex = 0;
    this.movesTakenInLevel = 0;
    this.initialCaptures = 0;
    this.activeSkin = localStorage.getItem('tiger_goat_skin') || 'terracotta';
    PieceRenderer.setSkin(this.activeSkin);

    this.progress = StorageManager.loadProgress();
    this.state = RulesEngine.createInitialState();
    this.selectedNode = null;
    this.legalMoves = [];
    this.gameMode = 'AI_TIGER';
    this.difficulty = 'MEDIUM';
    this.isAiThinking = false;

    this.renderDOM();
    this.bindEvents();
  }

  renderDOM() {
    const t = (k) => I18n.t(k);
    const app = document.getElementById('app');
    app.innerHTML = \`
      <header>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <button id="btn-lang" style="padding: 5px 10px; font-size: 0.8rem; background: #C19A58; color: #292720; font-weight: bold;">\${I18n.lang === 'bn' ? 'ENG' : 'বাং'}</button>
          <div style="text-align: center;">
            <h1 id="lbl-title" style="margin: 0; font-size: 1.35rem;">\${t('gameTitle')}</h1>
            <div id="mode-subtitle" class="subtitle">\${t('gameSubtitleClassic')}</div>
          </div>
          <button id="btn-profile" style="padding: 5px 10px; font-size: 0.8rem; background: #49352B;">👤 Lvl \${Math.floor(this.progress.totalXP / 100) + 1}</button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div style="display: flex; justify-content: center; gap: 8px; padding: 4px 16px;">
        <button id="tab-classic" style="flex: 1; padding: 7px; background: \${this.currentMode === 'CLASSIC' ? '#A9513B' : '#566548'}; font-size: 0.88rem;">\${t('tabClassic')}</button>
        <button id="tab-adventure" style="flex: 1; padding: 7px; background: \${this.currentMode === 'ADVENTURE' ? '#A9513B' : '#566548'}; font-size: 0.88rem;">\${t('tabAdventure')}</button>
      </div>

      <!-- Quick Audio & Mode Controls -->
      <div style="display: flex; justify-content: space-between; padding: 4px 16px; align-items: center;">
        <button id="btn-rain" style="padding: 4px 8px; font-size: 0.78rem; background: #566548;">\${t('btnRainOff')}</button>
        <div id="classic-bar" style="display: \${this.currentMode === 'CLASSIC' ? 'flex' : 'none'}; gap: 6px;">
          <select id="select-mode" style="background: #E8DCBE; border: 1px solid #49352B; padding: 4px 6px; border-radius: 6px; font-weight: bold; color: #49352B; font-size: 0.8rem;">
            <option value="AI_TIGER">\${t('modeAiTiger')}</option>
            <option value="AI_GOAT">\${t('modeAiGoat')}</option>
            <option value="PVP">\${t('modePvp')}</option>
          </select>
          <select id="select-diff" style="background: #E8DCBE; border: 1px solid #49352B; padding: 4px 6px; border-radius: 6px; font-weight: bold; color: #49352B; font-size: 0.8rem;">
            <option value="EASY">\${t('diffEasy')}</option>
            <option value="MEDIUM" selected>\${t('diffMedium')}</option>
            <option value="EXPERT">\${t('diffExpert')}</option>
          </select>
        </div>
        <button id="btn-mute" style="padding: 4px 8px; font-size: 0.78rem; background: #49352B;">\${SoundManager.isMuted ? t('btnSoundOff') : t('btnSoundOn')}</button>
      </div>

      <!-- Adventure Objective Banner -->
      <div id="adventure-bar" style="display: \${this.currentMode === 'ADVENTURE' ? 'block' : 'none'}; background: rgba(86, 101, 72, 0.15); border: 1px solid #566548; margin: 4px 16px; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; text-align: center;">
        <div id="adv-title" style="font-weight: bold; color: #292720;">লেভেল ১</div>
        <div id="adv-objective" style="color: #49352B;"></div>
      </div>

      <div class="hud-panel">
        <div id="hud-turn" class="hud-badge">\${t('turnGoat')}</div>
        <div id="hud-reserve" class="hud-badge">\${t('reserveGoats')}: 20</div>
        <div id="hud-captured" class="hud-badge">\${t('capturedGoats')}: 0 / 5</div>
      </div>

      <div class="board-container" id="board-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <div class="controls-footer" style="padding: 10px 16px;">
        <button id="btn-restart" style="padding: 8px 18px;">\${t('btnRestart')}</button>
        <button id="btn-levels-modal" style="display: \${this.currentMode === 'ADVENTURE' ? 'inline-block' : 'none'}; padding: 8px 18px; background: #C19A58;">\${t('allLevels')}</button>
      </div>

      <!-- Levels Modal -->
      <div id="levels-modal" class="win-banner" style="display: none; max-height: 80vh; overflow-y: auto; width: 90%; max-width: 400px;">
        <h2>\${t('tabAdventure')}</h2>
        <div id="levels-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 12px 0;"></div>
        <button id="btn-close-levels" style="background: #A9513B;">\${t('close')}</button>
      </div>

      <!-- Profile & Skins Modal -->
      <div id="profile-modal" class="win-banner" style="display: none; max-height: 85vh; overflow-y: auto; width: 90%; max-width: 400px;">
        <h2>\${t('profileTitle')}</h2>
        <div style="color: #C19A58; font-size: 1.1rem; font-weight: bold;">\${t('level')} \${Math.floor(this.progress.totalXP / 100) + 1}</div>
        <div style="font-size: 0.85rem; color: #E8DCBE;">\${t('xp')}: \${this.progress.totalXP}</div>
        <div style="font-size: 0.85rem; color: #566548; font-weight: bold; margin-top: 4px;">শিরোপা: \${t('titleUnset')}</div>

        <h3 style="margin-top: 14px; font-size: 1rem; color: #C19A58;">\${t('selectSkin')}</h3>
        <div id="skin-list" style="display: flex; flex-direction: column; gap: 8px; margin: 10px 0; width: 100%;"></div>

        <button id="btn-close-profile" style="background: #A9513B; margin-top: 8px;">\${t('close')}</button>
      </div>

      <!-- Result Modal -->
      <div id="win-banner" class="win-banner" style="display: none;">
        <h2 id="win-title">খেলা সমাপ্ত!</h2>
        <p id="win-desc"></p>
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button id="btn-rematch">\${t('btnRematch')}</button>
          <button id="btn-next-level" style="display: none; background: #566548;">\${t('btnNextLevel')}</button>
        </div>
      </div>
    \`;

    this.hudTurnEl = document.getElementById('hud-turn');
    this.hudReserveEl = document.getElementById('hud-reserve');
    this.hudCapturedEl = document.getElementById('hud-captured');
    this.winBannerEl = document.getElementById('win-banner');

    const canvas = document.getElementById('game-canvas');
    this.boardCanvas = new BoardCanvas(canvas);
    this.boardCanvas.onNodeClick = (idx) => this.handleNodeClick(idx);
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
    this.updateHUD();
  }

  bindEvents() {
    document.getElementById('btn-lang').onclick = () => {
      I18n.setLanguage(I18n.lang === 'bn' ? 'en' : 'bn');
      this.renderDOM();
      this.bindEvents();
      if (this.currentMode === 'ADVENTURE') this.loadLevel(this.currentLevelIndex);
      else this.updateHUD();
    };

    document.getElementById('btn-profile').onclick = () => this.showProfileModal();
    document.getElementById('btn-close-profile').onclick = () => {
      document.getElementById('profile-modal').style.display = 'none';
    };

    document.getElementById('tab-classic').onclick = () => {
      this.currentMode = 'CLASSIC';
      this.renderDOM();
      this.bindEvents();
      this.restartGame();
    };

    document.getElementById('tab-adventure').onclick = () => {
      this.currentMode = 'ADVENTURE';
      this.renderDOM();
      this.bindEvents();
      this.loadLevel(this.currentLevelIndex);
    };

    document.getElementById('btn-levels-modal').onclick = () => this.showLevelsModal();
    document.getElementById('btn-close-levels').onclick = () => {
      document.getElementById('levels-modal').style.display = 'none';
    };

    const muteBtn = document.getElementById('btn-mute');
    muteBtn.onclick = () => {
      SoundManager.isMuted = !SoundManager.isMuted;
      muteBtn.innerText = SoundManager.isMuted ? I18n.t('btnSoundOff') : I18n.t('btnSoundOn');
    };

    const rainBtn = document.getElementById('btn-rain');
    rainBtn.onclick = () => {
      const isRaining = SoundManager.toggleRain();
      rainBtn.innerText = isRaining ? I18n.t('btnRainOn') : I18n.t('btnRainOff');
      rainBtn.style.filter = isRaining ? 'brightness(1.3)' : 'none';
    };

    const modeSelect = document.getElementById('select-mode');
    if (modeSelect) {
      modeSelect.value = this.gameMode;
      modeSelect.onchange = (e) => {
        this.gameMode = e.target.value;
        this.restartGame();
      };
    }

    const diffSelect = document.getElementById('select-diff');
    if (diffSelect) {
      diffSelect.value = this.difficulty;
      diffSelect.onchange = (e) => {
        this.difficulty = e.target.value;
      };
    }

    document.getElementById('btn-restart').onclick = () => this.restartGame();
    document.getElementById('btn-rematch').onclick = () => this.restartGame();
    document.getElementById('btn-next-level').onclick = () => this.goToNextLevel();
  }

  showProfileModal() {
    const list = document.getElementById('skin-list');
    list.innerHTML = '';

    Object.values(SKINS).forEach(s => {
      const isSelected = this.activeSkin === s.id;
      const btn = document.createElement('button');
      btn.style.cssText = \`display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: \${isSelected ? '#C19A58' : '#3B3624'}; color: \${isSelected ? '#292720' : '#FFF'}; font-weight: bold; font-size: 0.88rem;\`;
      btn.innerHTML = \`<span>\${I18n.lang === 'bn' ? s.nameBn : s.nameEn}</span><span>\${isSelected ? '✓' : ''}</span>\`;
      btn.onclick = () => {
        this.activeSkin = s.id;
        localStorage.setItem('tiger_goat_skin', s.id);
        PieceRenderer.setSkin(s.id);
        this.showProfileModal();
        this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
      };
      list.appendChild(btn);
    });

    document.getElementById('profile-modal').style.display = 'flex';
  }

  showLevelsModal() {
    this.progress = StorageManager.loadProgress();
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';

    CAMPAIGN_LEVELS.forEach((lvl, idx) => {
      const isUnlocked = idx + 1 <= this.progress.unlockedLevel;
      const stars = this.progress.levelStars[lvl.id] || 0;
      const starStr = isUnlocked ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '🔒';

      const btn = document.createElement('button');
      btn.style.cssText = 'padding: 8px 4px; font-size: 0.78rem; display: flex; flex-direction: column; align-items: center; gap: 2px;' +
        (isUnlocked ? 'background: #49352B;' : 'background: #333; opacity: 0.6;');
      btn.innerHTML = \`<span>\${I18n.lang === 'bn' ? lvl.titleBn : lvl.titleEn}</span><span style="color: #C19A58;">\${starStr}</span>\`;

      if (isUnlocked) {
        btn.onclick = () => {
          document.getElementById('levels-modal').style.display = 'none';
          this.loadLevel(idx);
        };
      }
      grid.appendChild(btn);
    });

    document.getElementById('levels-modal').style.display = 'flex';
  }

  loadLevel(index) {
    this.currentLevelIndex = index;
    const lvl = CAMPAIGN_LEVELS[index];
    this.movesTakenInLevel = 0;
    this.state = lvl.getInitialState();
    this.initialCaptures = this.state.goatsCaptured;
    this.gameMode = lvl.playerSide === 'GOAT' ? 'AI_TIGER' : 'AI_GOAT';
    this.difficulty = lvl.aiDifficulty;

    const titleEl = document.getElementById('adv-title');
    const objEl = document.getElementById('adv-objective');
    if (titleEl) titleEl.innerText = I18n.lang === 'bn' ? lvl.titleBn : lvl.titleEn;
    if (objEl) {
      const desc = I18n.lang === 'bn' ? lvl.descBn : lvl.descEn;
      const moveLabel = I18n.lang === 'bn' ? 'বাকি চাল' : 'Moves left';
      objEl.innerText = desc + (lvl.maxMoves ? \` (\${moveLabel}: \${lvl.maxMoves})\` : '');
    }

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

  handleResize() {
    const container = document.getElementById('board-container');
    if (container) {
      this.boardCanvas.resize(container.clientWidth);
      this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);
    }
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
      if (move.type === 'JUMP') SoundManager.playCapture();
      else SoundManager.playPlace();

      this.state = RulesEngine.applyMove(this.state, move);
      this.movesTakenInLevel++;
      this.selectedNode = null;
      this.legalMoves = [];
      this.updateHUD();
      this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

      if (this.checkAdventureObjectives()) return;

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

  checkAdventureObjectives() {
    if (this.currentMode !== 'ADVENTURE') return false;
    const lvl = CAMPAIGN_LEVELS[this.currentLevelIndex];

    if (lvl.maxMoves && this.movesTakenInLevel > lvl.maxMoves) {
      const failMsg = I18n.lang === 'bn' ? 'চাল শেষ হয়ে গেছে! আবার চেষ্টা করুন।' : 'Move limit reached! Try again.';
      this.showAdventureResult(false, failMsg);
      return true;
    }

    if (lvl.requiredCaptures) {
      const capturedHere = this.state.goatsCaptured - this.initialCaptures;
      if (capturedHere >= lvl.requiredCaptures) {
        const successMsg = I18n.lang === 'bn' ? \`চমৎকার! \${lvl.requiredCaptures}টি ছাগল শিকার সম্পন্ন!\` : \`Great! \${lvl.requiredCaptures} captures completed!\`;
        this.showAdventureResult(true, successMsg);
        return true;
      }
    }

    if (lvl.id === 1 && this.state.moveHistory.length >= 10 && this.state.goatsCaptured === 0) {
      const msg = I18n.lang === 'bn' ? 'সফলভাবে প্রথম পাঠ সম্পন্ন হয়েছে!' : 'First lesson completed successfully!';
      this.showAdventureResult(true, msg);
      return true;
    }

    if (lvl.trapTigers && this.state.result === 'GOAT_WINS') {
      const msg = I18n.lang === 'bn' ? 'বাঘ সফলভাবে কোণায় বন্দি হয়েছে!' : 'Tiger cornered and trapped!';
      this.showAdventureResult(true, msg);
      return true;
    }

    return false;
  }

  showAdventureResult(won, msg) {
    this.winBannerEl.style.display = 'flex';
    const winTitle = document.getElementById('win-title');
    const winDesc = document.getElementById('win-desc');
    const nextBtn = document.getElementById('btn-next-level');

    if (won) {
      SoundManager.playVictory();
      winTitle.innerText = I18n.lang === 'bn' ? 'অভিনন্দন! বিজয়!' : 'Victory Achieved!';
      winDesc.innerText = msg;
      const lvl = CAMPAIGN_LEVELS[this.currentLevelIndex];
      this.progress = StorageManager.completeLevel(lvl.id, 3, lvl.xpReward);

      if (this.currentLevelIndex < CAMPAIGN_LEVELS.length - 1) {
        nextBtn.style.display = 'inline-block';
      } else {
        nextBtn.style.display = 'none';
      }
    } else {
      winTitle.innerText = I18n.lang === 'bn' ? 'ব্যর্থ!' : 'Level Failed!';
      winDesc.innerText = msg;
      nextBtn.style.display = 'none';
    }
  }

  goToNextLevel() {
    this.loadLevel(this.currentLevelIndex + 1);
  }

  checkTriggerAI() {
    const isAiTurn = (this.gameMode === 'AI_TIGER' && this.state.turn === 'TIGER') ||
                     (this.gameMode === 'AI_GOAT' && this.state.turn === 'GOAT');

    if (isAiTurn && this.state.result === 'IN_PROGRESS') {
      this.isAiThinking = true;
      this.hudTurnEl.innerText = I18n.t('turnAiThinking');

      setTimeout(() => {
        const bestMove = MinimaxAI.getBestMove(this.state, this.difficulty);
        if (bestMove) {
          const aiPiece = bestMove.from !== undefined ? this.state.board[bestMove.from] : GOAT;
          if (bestMove.type === 'MOVE' || bestMove.type === 'JUMP') {
            this.boardCanvas.animateMove(aiPiece, bestMove.from, bestMove.to, () => {
              if (bestMove.type === 'JUMP') SoundManager.playCapture();
              else SoundManager.playPlace();

              this.state = RulesEngine.applyMove(this.state, bestMove);
              this.movesTakenInLevel++;
              this.isAiThinking = false;
              this.updateHUD();
              this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

              if (this.checkAdventureObjectives()) return;

              if (this.state.result !== 'IN_PROGRESS') {
                SoundManager.playVictory();
                this.showGameOver();
              }
            });
            return;
          } else {
            this.state = RulesEngine.applyMove(this.state, bestMove);
            this.movesTakenInLevel++;
            SoundManager.playPlace();
          }
        }
        this.isAiThinking = false;
        this.updateHUD();
        this.boardCanvas.setState(this.state, this.selectedNode, this.legalMoves);

        if (this.checkAdventureObjectives()) return;

        if (this.state.result !== 'IN_PROGRESS') {
          SoundManager.playVictory();
          this.showGameOver();
        }
      }, 420);
    }
  }

  updateHUD() {
    const isGoat = this.state.turn === 'GOAT';
    this.hudTurnEl.innerText = isGoat ? I18n.t('turnGoat') : I18n.t('turnTiger');
    this.hudTurnEl.style.color = isGoat ? '#566548' : '#A9513B';
    this.hudReserveEl.innerText = \`\${I18n.t('reserveGoats')}: \${this.state.goatsToPlace}\`;
    this.hudCapturedEl.innerText = \`\${I18n.t('capturedGoats')}: \${this.state.goatsCaptured} / 5\`;

    if (this.currentMode === 'ADVENTURE') {
      const lvl = CAMPAIGN_LEVELS[this.currentLevelIndex];
      const remainingMoves = lvl.maxMoves ? Math.max(0, lvl.maxMoves - this.movesTakenInLevel) : null;
      const desc = I18n.lang === 'bn' ? lvl.descBn : lvl.descEn;
      const moveLabel = I18n.lang === 'bn' ? 'বাকি চাল' : 'Moves left';
      const objEl = document.getElementById('adv-objective');
      if (objEl) {
        objEl.innerText = desc + (remainingMoves !== null ? \` (\${moveLabel}: \${remainingMoves})\` : '');
      }
    }
  }

  showGameOver() {
    this.winBannerEl.style.display = 'flex';
    const winTitle = document.getElementById('win-title');
    const winDesc = document.getElementById('win-desc');
    const nextBtn = document.getElementById('btn-next-level');
    nextBtn.style.display = 'none';

    if (this.state.result === 'TIGER_WINS') {
      winTitle.innerText = I18n.t('winTigerTitle');
      winDesc.innerText = I18n.t('winTigerDesc');
    } else if (this.state.result === 'GOAT_WINS') {
      winTitle.innerText = I18n.t('winGoatTitle');
      winDesc.innerText = I18n.t('winGoatDesc');
    } else {
      winTitle.innerText = I18n.t('winDrawTitle');
      winDesc.innerText = I18n.t('winDrawDesc');
    }
  }

  restartGame() {
    if (this.currentMode === 'ADVENTURE') {
      this.loadLevel(this.currentLevelIndex);
      return;
    }
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

console.log('🎉 STEP 7 LOCALIZATION, PROFILES & SKINS INSTALLED!');
