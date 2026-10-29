export interface ScenarioTheme {
  id: string;
  nameBn: string;
  nameEn: string;
  bgGrad: string;
  boardMat: string;
  boardBorder: string;
  gridLine: string;
  nodeColor: string;
}

export const SCENARIOS: Record<string, ScenarioTheme> = {
  courtyard: {
    id: 'courtyard',
    nameBn: '🏡 গ্রামের উঠান',
    nameEn: 'Village Courtyard',
    bgGrad: 'radial-gradient(circle at 50% 30%, #F5E8D0, #D9C39E)',
    boardMat: '#EAD7B7',
    boardBorder: '#5C3826',
    gridLine: '#6A4632',
    nodeColor: '#4A2A1A'
  },
  school: {
    id: 'school',
    nameBn: '🏫 স্কুলের কাঠের ডেস্ক',
    nameEn: 'Classroom Wood Desk',
    bgGrad: 'radial-gradient(circle at 50% 30%, #C49A6C, #734F2C)',
    boardMat: '#8F6239',
    boardBorder: '#3D2512',
    gridLine: '#452A14',
    nodeColor: '#2B1707'
  },
  monsoon: {
    id: 'monsoon',
    nameBn: '🌧️ বর্ষার বিকেল',
    nameEn: 'Monsoon Slate Stone',
    bgGrad: 'radial-gradient(circle at 50% 30%, #68808A, #37464D)',
    boardMat: '#4B5E66',
    boardBorder: '#1F292E',
    gridLine: '#2D3B42',
    nodeColor: '#172024'
  },
  sundarban: {
    id: 'sundarban',
    nameBn: '🐅 সুন্দরবনের গহীন',
    nameEn: 'Deep Sundarbans',
    bgGrad: 'radial-gradient(circle at 50% 30%, #4D5E45, #1F2E1A)',
    boardMat: '#3A4B32',
    boardBorder: '#162412',
    gridLine: '#B59858',
    nodeColor: '#8C7235'
  }
};
