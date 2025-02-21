import { SendCodewarsLeaderboardToChannelInput } from "application/usecases/sendCodewarsLeaderboardToChannel/sendCodewarsLeaderboardToChannelInput";
import { Command } from "../../types";
import KataService from "../../domain/service/kataService/kataService";
import ChatService from "../../domain/service/chatService";
import KataLeaderboardUser from "../../domain/service/kataService/kataLeaderboardUser";

export default class CodewarsLeaderboardCommand implements Command {
  readonly name = "!cwl";

  private chatService: ChatService;

  private kataService: KataService;

  constructor(chatService: ChatService, kataService: KataService) {
    this.chatService = chatService;
    this.kataService = kataService;
  }

  private formatLeaderboard(leaderboard: KataLeaderboardUser[]): string {
    let output = "```";
    let position = 1;

    const leaderboardTotalEntriesToShow = 10;
    const leaderboardEntries = leaderboard.slice(0, leaderboardTotalEntriesToShow);
    const leaderboardEntriesLeft = leaderboard.length - leaderboardTotalEntriesToShow;

    leaderboardEntries.forEach((user: KataLeaderboardUser) => {
      const pointsCollection = user.getPoints().map((points: number) => points || 0);

      output += `${position}. ${user.getUsername()} - ${user.getScore()} - [${pointsCollection.join(",")}] points
`;

      position += 1;
    });

    output += "```";

    if (leaderboardEntriesLeft > 1) {
      output += `
... e ${leaderboardEntriesLeft} outras participações em https://codewars.devpt.co`;
    } else if (leaderboardEntriesLeft === 1) {
      output += `
... e 1 outra participação em https://codewars.devpt.co`;
    }

    return output;
  }

  async execute({ channelId }: SendCodewarsLeaderboardToChannelInput): Promise<void> {
    const leaderboard = await this.kataService.getLeaderboard();

    if (leaderboard.length === 0) {
      this.chatService.sendMessageToChannel("Ainda não existem participantes nesta ediçăo do desafio.", channelId);
      return;
    }

    const formattedLeaderboard = this.formatLeaderboard(leaderboard);
    this.chatService.sendMessageToChannel(formattedLeaderboard, channelId);
  }
}
