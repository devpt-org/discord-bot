export default class KataLeaderboardUser {
  private username: string;

  private score: number;

  private points: number[];

  constructor({ username, score, points }: { username: string; score: number; points: number[] }) {
    this.username = username;
    this.score = score;
    this.points = points;
  }

  getUsername(): string {
    return this.username;
  }

  getScore(): number {
    return this.score;
  }

  getPoints(): number[] {
    return this.points;
  }
}
