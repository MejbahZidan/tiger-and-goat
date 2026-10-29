export class StorageManager {
  public static loadProgress() {
    try {
      const d = localStorage.getItem('tiger_goat_save_v1');
      if (d) return JSON.parse(d);
    } catch (e) {}
    return { unlockedLevel: 1, levelStars: {}, totalXP: 0 };
  }
  public static completeLevel(id: number, s: number, xp: number) {
    const p = this.loadProgress();
    p.levelStars[id] = Math.max(p.levelStars[id] || 0, s);
    p.totalXP += xp;
    if (p.unlockedLevel <= id && id < 10) p.unlockedLevel = id + 1;
    localStorage.setItem('tiger_goat_save_v1', JSON.stringify(p));
    return p;
  }
}
