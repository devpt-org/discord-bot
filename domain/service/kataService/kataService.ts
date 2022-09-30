import KataLeaderboardUser from "./kataLeaderboardUser";

export default interface KataService {
  getLeaderboard(): Promise<KataLeaderboardUser[]>;
}
