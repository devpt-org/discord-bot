import { vi, describe, it, expect, beforeEach } from "vitest";
import { MockProxy, mock } from "vitest-mock-extended";
import SendCodewarsLeaderboardToChannelUseCase from "../../../application/usecases/sendCodewarsLeaderboardToChannel/sendCodewarsLeaderboardToChannelUseCase";
import ChatService from "../../../domain/service/chatService";
import KataService from "../../../domain/service/kataService/kataService";
import KataLeaderboardUser from "../../../domain/service/kataService/kataLeaderboardUser";

describe("send codewars leaderboard to channel use case", () => {
  let mockChatService: MockProxy<ChatService>;
  let mockKataService: MockProxy<KataService>;

  beforeEach(() => {
    mockChatService = mock<ChatService>();

    mockChatService.sendMessageToChannel.mockResolvedValue();

    mockKataService = mock<KataService>();
  });

  it("should send a message to channel in chatService referring there aren't still any participants", async () => {
    mockKataService.getLeaderboard.mockReturnValueOnce(Promise.resolve([]));

    const spy = vi.spyOn(mockChatService, "sendMessageToChannel");

    await new SendCodewarsLeaderboardToChannelUseCase({
      chatService: mockChatService,
      kataService: mockKataService,
    }).execute({
      channelId: "855861944930402342",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Ainda não existem participantes nesta ediçăo do desafio.", "855861944930402342");
  });

  it("should send a message to channel in chatService with a leaderboard with 12 participants plus a message to check more", async () => {
    mockKataService.getLeaderboard.mockReturnValueOnce(
      Promise.resolve([
        new KataLeaderboardUser({ username: "utilizador-1", score: 4, points: [3, 0, 1] }),
        new KataLeaderboardUser({ username: "utilizador-2", score: 4, points: [0, 3, 1] }),
        new KataLeaderboardUser({ username: "utilizador-3", score: 4, points: [0, 0, 4] }),
        new KataLeaderboardUser({ username: "utilizador-4", score: 3, points: [3, 0, 0] }),
        new KataLeaderboardUser({ username: "utilizador-5", score: 3, points: [0, 3, 0] }),
        new KataLeaderboardUser({ username: "utilizador-6", score: 3, points: [0, 0, 3] }),
        new KataLeaderboardUser({ username: "utilizador-7", score: 2, points: [2, 0, 0] }),
        new KataLeaderboardUser({ username: "utilizador-8", score: 2, points: [0, 2, 0] }),
        new KataLeaderboardUser({ username: "utilizador-9", score: 2, points: [0, 0, 2] }),
        new KataLeaderboardUser({ username: "utilizador-10", score: 1, points: [1, 0, 0] }),
        new KataLeaderboardUser({ username: "utilizador-11", score: 1, points: [0, 1, 0] }),
        new KataLeaderboardUser({ username: "utilizador-12", score: 1, points: [0, 0, 1] }),
      ])
    );

    const spy = vi.spyOn(mockChatService, "sendMessageToChannel");

    await new SendCodewarsLeaderboardToChannelUseCase({
      chatService: mockChatService,
      kataService: mockKataService,
    }).execute({
      channelId: "855861944930402342",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      `\`\`\`1. utilizador-1 - 4 - [3,0,1] points
2. utilizador-2 - 4 - [0,3,1] points
3. utilizador-3 - 4 - [0,0,4] points
4. utilizador-4 - 3 - [3,0,0] points
5. utilizador-5 - 3 - [0,3,0] points
6. utilizador-6 - 3 - [0,0,3] points
7. utilizador-7 - 2 - [2,0,0] points
8. utilizador-8 - 2 - [0,2,0] points
9. utilizador-9 - 2 - [0,0,2] points
10. utilizador-10 - 1 - [1,0,0] points
\`\`\`\

... e 2 outras participações em https://codewars.devpt.co`,
      "855861944930402342"
    );
  });

  it("should send a message to channel in chatService with a leaderboard with 3 participants without a footer message", async () => {
    mockKataService.getLeaderboard.mockReturnValueOnce(
      Promise.resolve([
        new KataLeaderboardUser({ username: "utilizador-1", score: 4, points: [3, 0, 1] }),
        new KataLeaderboardUser({ username: "utilizador-2", score: 4, points: [0, 3, 1] }),
        new KataLeaderboardUser({ username: "utilizador-3", score: 1, points: [0, 0, 1] }),
      ])
    );

    const spy = vi.spyOn(mockChatService, "sendMessageToChannel");

    await new SendCodewarsLeaderboardToChannelUseCase({
      chatService: mockChatService,
      kataService: mockKataService,
    }).execute({
      channelId: "855861944930402342",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      `\`\`\`1. utilizador-1 - 4 - [3,0,1] points
2. utilizador-2 - 4 - [0,3,1] points
3. utilizador-3 - 1 - [0,0,1] points
\`\`\``,
      "855861944930402342"
    );
  });
});
