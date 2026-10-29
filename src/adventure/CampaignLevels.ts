import { TIGER, EMPTY } from '../engine/RulesEngine';

export const CAMPAIGN_LEVELS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  titleBn: `লেভেল ${i + 1}: ${['প্রথম পাঠ', 'কোণার ফাঁদ', 'শিকারির চোখ', 'কঞ্চি বেড়া', 'টিফিন দ্বৈরথ', 'বর্ষার চাল', 'জোড়া ফাঁদ', 'অলিগলি', 'সুন্দরবন', 'বাঘের রাজ্য'][i]}`,
  playerSide: i % 2 === 0 ? 'GOAT' : 'TIGER',
  aiDifficulty: i < 3 ? 'EASY' : i < 7 ? 'MEDIUM' : 'EXPERT',
  getInitialState: () => {
    const b = new Array(25).fill(EMPTY);
    b[0] = TIGER; b[4] = TIGER; b[20] = TIGER; b[24] = TIGER;
    return { board: b, turn: 'GOAT', phase: 'PLACEMENT', goatsToPlace: 20, goatsCaptured: 0, result: 'IN_PROGRESS', moveHistory: [], positionCounts: new Map() };
  }
}));
