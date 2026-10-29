export const BOARD_SIZE = 5;
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
}