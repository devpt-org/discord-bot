import fetch from "node-fetch";
import KataLeaderboardUser from "../../domain/service/kataService/kataLeaderboardUser";
import KataService from "../../domain/service/kataService/kataService";

interface LeaderboardUser {
  username: string;
  score: number;
  points: number[];
}

interface LeaderboardChallenge {
  kata: string;
  year: number;
  week: number;
}

interface LeaderboardResponse {
  challenges: LeaderboardChallenge[];
  users: LeaderboardUser[];
}

export default class CodewarsKataService implements KataService {
  private baseUrl = "https://codewars.devpt.co";

  async getLeaderboard(): Promise<KataLeaderboardUser[]> {
    const response = await fetch(`${this.baseUrl}/index.json`);
    const data = (await response.json()) as LeaderboardResponse;
    const leaderboard = data.users.map(
      (user: LeaderboardUser) =>
        new KataLeaderboardUser({
          username: user.username,
          score: user.score,
          points: user.points,
        })
    );

    return leaderboard;
  }
}
