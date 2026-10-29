const fs = require('fs');

// 1. src/storage/StorageManager.ts
fs.writeFileSync('src/storage/StorageManager.ts', `export interface PlayerProgress {
  unlockedLevel: number;
  levelStars: { [key: number]: number };
  totalXP: number;
}

const STORAGE_KEY = 'tiger_goat_save_v1';

export class StorageManager {
  public static loadProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return {
      unlockedLevel: 1,
      levelStars: {},
      totalXP: 0
    };
  }

  public static saveProgress(progress: PlayerProgress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save', e);
    }
  }

  public static completeLevel(levelId: number, stars: number, xpReward: number): PlayerProgress {
    const progress = this.loadProgress();
    const currentStars = progress.levelStars[levelId] || 0;
    if (stars > currentStars) {
      progress.levelStars[levelId] = stars;
    }
    progress.totalXP += xpReward;
    if (progress.unlockedLevel <= levelId && levelId < 10) {
      progress.unlockedLevel = levelId + 1;
    }
    this.saveProgress(progress);
    return progress;
  }
}`);

// 2. src/adventure/CampaignLevels.ts
fs.writeFileSync('src/adventure/CampaignLevels.ts', `import { MatchState, TIGER, GOAT, EMPTY } from '../engine/RulesEngine';

export interface CampaignLevel {
  id: number;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  playerSide: 'GOAT' | 'TIGER';
  aiDifficulty: 'EASY' | 'MEDIUM' | 'EXPERT';
  maxMoves?: number;
  requiredCaptures?: number;
  trapTigers?: boolean;
  xpReward: number;
  getInitialState: () => MatchState;
}

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    id: 1,
    titleBn: '১. উঠানের প্রথম পাঠ',
    titleEn: '1. Courtyard First Lesson',
    descBn: 'কোনো ছাগল না হারিয়ে ৬টি ছাগল সফলভাবে বসান।',
    descEn: 'Place 6 goats without losing any piece.',
    playerSide: 'GOAT',
    aiDifficulty: 'EASY',
    maxMoves: 12,
    xpReward: 50,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[0] = TIGER; board[4] = TIGER; board[20] = TIGER; board[24] = TIGER;
      return {
        board,
        turn: 'GOAT',
        phase: 'PLACEMENT',
        goatsToPlace: 20,
        goatsCaptured: 0,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 2,
    titleBn: '২. কোণার ফাঁদ',
    titleEn: '2. Corner Ambush',
    descBn: 'কোণায় থাকা বাঘটিকে ৪ চালের মধ্যে বন্দি করুন!',
    descEn: 'Trap the cornered tiger within 4 moves!',
    playerSide: 'GOAT',
    aiDifficulty: 'MEDIUM',
    maxMoves: 4,
    trapTigers: true,
    xpReward: 100,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      // Tiger at (0,0), partially surrounded
      board[0] = TIGER;
      board[1] = GOAT;  // node (0,1)
      board[10] = GOAT; // node (2,0)
      board[12] = GOAT; // node (2,2)
      return {
        board,
        turn: 'GOAT',
        phase: 'PLACEMENT',
        goatsToPlace: 10,
        goatsCaptured: 0,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 3,
    titleBn: '৩. শিকারির চোখ',
    titleEn: '3. Hunter’s Eye',
    descBn: 'বাঘ হিসেবে খেলে ৩ চালের মধ্যে ১টি ছাগল শিকার করুন।',
    descEn: 'Play as Tiger and capture at least 1 goat in 3 moves.',
    playerSide: 'TIGER',
    aiDifficulty: 'EASY',
    maxMoves: 3,
    requiredCaptures: 1,
    xpReward: 120,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[6] = TIGER; // node (1,1)
      board[7] = GOAT;  // node (1,2)
      board[11] = GOAT; // node (2,1)
      board[24] = TIGER;
      return {
        board,
        turn: 'TIGER',
        phase: 'PLACEMENT',
        goatsToPlace: 12,
        goatsCaptured: 0,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 4,
    titleBn: '৪. কঞ্চি বেড়া',
    titleEn: '4. The Bamboo Fence',
    descBn: '৪টি ছাগলের একটি দুর্ভেদ্য দুর্গ গড়ে বাঘের আক্রমণ প্রতিহত করুন।',
    descEn: 'Build a safe defense block and survive 8 turns.',
    playerSide: 'GOAT',
    aiDifficulty: 'MEDIUM',
    maxMoves: 8,
    xpReward: 150,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[0] = TIGER; board[4] = TIGER; board[20] = TIGER; board[24] = TIGER;
      board[12] = GOAT; board[13] = GOAT;
      return {
        board,
        turn: 'GOAT',
        phase: 'PLACEMENT',
        goatsToPlace: 15,
        goatsCaptured: 0,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 5,
    titleBn: '৫. স্কুলের টিফিন',
    titleEn: '5. School Break Duel',
    descBn: 'স্কুলের টিফিনে সহপাঠী AI বাঘকে হারিয়ে দিন!',
    descEn: 'Defeat the School Champion AI tiger.',
    playerSide: 'GOAT',
    aiDifficulty: 'MEDIUM',
    xpReward: 200,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[0] = TIGER; board[4] = TIGER; board[20] = TIGER; board[24] = TIGER;
      return {
        board,
        turn: 'GOAT',
        phase: 'PLACEMENT',
        goatsToPlace: 20,
        goatsCaptured: 0,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 6,
    titleBn: '৬. বর্ষার বিকেল',
    titleEn: '6. Monsoon Afternoon',
    descBn: 'বাঘ হিসেবে ৫ চালের মধ্যে ২টি ছাগল শিকার করুন।',
    descEn: 'Play as Tiger: capture 2 goats within 5 moves.',
    playerSide: 'TIGER',
    aiDifficulty: 'MEDIUM',
    maxMoves: 5,
    requiredCaptures: 2,
    xpReward: 220,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[0] = TIGER; board[2] = TIGER;
      board[1] = GOAT; board[7] = GOAT; board[12] = GOAT;
      return {
        board,
        turn: 'TIGER',
        phase: 'MOVEMENT',
        goatsToPlace: 0,
        goatsCaptured: 2,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 7,
    titleBn: '৭. দ্বিমুখী আক্রমণ',
    titleEn: '7. Double Threat',
    descBn: 'এক চালে ফাঁদ তৈরি করে নিশ্চিত শিকার নিশ্চিত করুন।',
    descEn: 'Create an unavoidable jump capture fork in 4 moves.',
    playerSide: 'TIGER',
    aiDifficulty: 'MEDIUM',
    maxMoves: 4,
    requiredCaptures: 1,
    xpReward: 250,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[12] = TIGER; // Center Tiger
      board[11] = GOAT; board[13] = GOAT;
      board[0] = TIGER; board[24] = TIGER;
      return {
        board,
        turn: 'TIGER',
        phase: 'MOVEMENT',
        goatsToPlace: 0,
        goatsCaptured: 3,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 8,
    titleBn: '৮. পুরান ঢাকার অলিগলি',
    titleEn: '8. Old Dhaka Alley',
    descBn: 'ঘূর্ণন পর্বে ছাগল চালিয়ে সব বাঘের পথ রোধ করুন।',
    descEn: 'Movement phase challenge: pin the roaming tigers.',
    playerSide: 'GOAT',
    aiDifficulty: 'EXPERT',
    xpReward: 300,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[0] = TIGER; board[2] = TIGER; board[20] = TIGER; board[22] = TIGER;
      for (let i = 5; i < 18; i++) {
        if (board[i] === EMPTY) board[i] = GOAT;
      }
      return {
        board,
        turn: 'GOAT',
        phase: 'MOVEMENT',
        goatsToPlace: 0,
        goatsCaptured: 2,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 9,
    titleBn: '৯. সুন্দরবনের ছায়া',
    titleEn: '9. Sundarban Shadows',
    descBn: 'ওস্তাদ স্তরের ক্ষিপ্র বাঘের মোকাবিলা করুন।',
    descEn: 'Outsmart the apex Expert AI tiger.',
    playerSide: 'GOAT',
    aiDifficulty: 'EXPERT',
    xpReward: 350,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[0] = TIGER; board[4] = TIGER; board[20] = TIGER; board[24] = TIGER;
      return {
        board,
        turn: 'GOAT',
        phase: 'PLACEMENT',
        goatsToPlace: 20,
        goatsCaptured: 0,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  },
  {
    id: 10,
    titleBn: '১০. বাঘের রাজ্য — সুন্দরবনের অধিপতি',
    titleEn: '10. The Tiger King',
    descBn: 'চূড়ান্ত মহারণ! সুন্দরবনের অধিপতিকে পরাস্ত করে শিরোপা জিতুন!',
    descEn: 'The Final Boss Battle! Claim the Master Title!',
    playerSide: 'GOAT',
    aiDifficulty: 'EXPERT',
    xpReward: 500,
    getInitialState: () => {
      const board = new Array(25).fill(EMPTY);
      board[0] = TIGER; board[4] = TIGER; board[20] = TIGER; board[24] = TIGER;
      return {
        board,
        turn: 'GOAT',
        phase: 'PLACEMENT',
        goatsToPlace: 20,
        goatsCaptured: 0,
        result: 'IN_PROGRESS',
        moveHistory: [],
        positionCounts: new Map()
      };
    }
  }
];
`);

// 3. src/main.ts (With Adventure Mode drawer, Level selector, and progression)
fs.writeFileSync('src/main.ts', `import './style.css';
import { RulesEngine, TIGER, GOAT } from './engine/RulesEngine';
import { BoardCanvas } from './ui/BoardCanvas';
import { MinimaxAI } from './ai/MinimaxAI';
import { SoundManager } from './audio/SoundManager';
import { StorageManager } from './storage/StorageManager';
import { CAMPAIGN_LEVELS } from './adventure/CampaignLevels';

class GameApp {
  constructor() {
    this.currentMode = 'CLASSIC'; // 'CLASSIC' | 'ADVENTURE'
    this.currentLevelIndex = 0;
    this.movesTakenInLevel = 0;
    this.initialCaptures = 0;

    this.progress = StorageManager.loadProgress();
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
          <button id="btn-rain" style="padding: 5px 10px; font-size: 0.8rem; background: #566548;">🌧️ বর্ষা</button>
          <div style="text-align: center;">
            <h1 style="margin: 0; font-size: 1.35rem;">বাঘ ও ছাগল</h1>
            <div id="mode-subtitle" class="subtitle">Classic Mode</div>
          </div>
          <button id="btn-mute" style="padding: 5px 10px; font-size: 0.8rem; background: #49352B;">🔊 শব্দ</button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div style="display: flex; justify-content: center; gap: 8px; padding: 4px 16px;">
        <button id="tab-classic" style="flex: 1; padding: 7px; background: #A9513B; font-size: 0.9rem;">ক্লাসিক</button>
        <button id="tab-adventure" style="flex: 1; padding: 7px; background: #566548; font-size: 0.9rem;">অভিযান (Levels)</button>
      </div>

      <!-- Classic Controls Bar -->
      <div id="classic-bar" style="display: flex; gap: 8px; justify-content: center; padding: 4px 16px;">
        <select id="select-mode" style="background: #E8DCBE; border: 1px solid #49352B; padding: 4px 8px; border-radius: 6px; font-weight: bold; color: #49352B; font-size: 0.85rem;">
          <option value="AI_TIGER">ছাগল vs বাঘ (AI Tiger)</option>
          <option value="AI_GOAT">বাঘ vs ছাগল (AI Goat)</option>
          <option value="PVP">২ জন খেলোয়াড়</option>
        </select>
        <select id="select-diff" style="background: #E8DCBE; border: 1px solid #49352B; padding: 4px 8px; border-radius: 6px; font-weight: bold; color: #49352B; font-size: 0.85rem;">
          <option value="EASY">সহজ</option>
          <option value="MEDIUM" selected>মাঝারি</option>
          <option value="EXPERT">ওস্তাদ</option>
        </select>
      </div>

      <!-- Adventure Objective Banner -->
      <div id="adventure-bar" style="display: none; background: rgba(86, 101, 72, 0.15); border: 1px solid #566548; margin: 4px 16px; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; text-align: center;">
        <div id="adv-title" style="font-weight: bold; color: #292720;">লেভেল ১</div>
        <div id="adv-objective" style="color: #49352B;">উদ্দেশ্য লোড হচ্ছে...</div>
      </div>

      <div class="hud-panel">
        <div id="hud-turn" class="hud-badge">চাল: ছাগল</div>
        <div id="hud-reserve" class="hud-badge">বাকি ছাগল: 20</div>
        <div id="hud-captured" class="hud-badge">শিকার: 0 / 5</div>
      </div>

      <div class="board-container" id="board-container">
        <canvas id="game-canvas"></canvas>
      </div>

      <div class="controls-footer" style="padding: 10px 16px;">
        <button id="btn-restart" style="padding: 8px 18px;">নতুন খেলা (Restart)</button>
        <button id="btn-levels-modal" style="display: none; padding: 8px 18px; background: #C19A58;">সব লেভেল (1-10)</button>
      </div>

      <!-- Levels Drawer / Modal -->
      <div id="levels-modal" class="win-banner" style="display: none; max-height: 80vh; overflow-y: auto; width: 90%; max-width: 400px;">
        <h2 style="font-size: 1.3rem;">অভিযান লেভেলসমূহ</h2>
        <div style="font-size: 0.85rem; color: #C19A58;">মোট XP: <span id="lbl-xp">0</span></div>
        <div id="levels-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 12px 0;"></div>
        <button id="btn-close-modal" style="background: #A9513B;">বন্ধ করুন</button>
      </div>

      <!-- Result Modal -->
      <div id="win-banner" class="win-banner" style="display: none;">
