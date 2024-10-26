import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import CommandUseCaseResolver from "../../domain/service/commandUseCaseResolver";
import SendMessageToChannelUseCase from "../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase";
import SendCodewarsLeaderboardToChannelUseCase from "../../application/usecases/sendCodewarsLeaderboardToChannel/sendCodewarsLeaderboardToChannelUseCase";
import { Context } from "../../types";

vi.mock("../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase");
vi.mock("../../application/usecases/sendCodewarsLeaderboardToChannel/sendCodewarsLeaderboardToChannelUseCase");

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
  },
}));

describe("CommandUseCaseResolver", () => {
  let commandUseCaseResolver: CommandUseCaseResolver;
  const mockContext: Context = {
    channelId: "test-channel",
  };

  beforeEach(async () => {
    (fs.readFile as vi.Mock).mockResolvedValueOnce(
      JSON.stringify({
        "!ja": "Olá! Test message",
        "!oc": ":warning: Only Code questions!",
      })
    );

    commandUseCaseResolver = new CommandUseCaseResolver({
      messageRepository: {
        getRandomIntroMessage: vi.fn(),
        getRandomWelcomingMessage: vi.fn(),
      },
      chatService: {
        sendMessageToChannel: vi.fn(),
      },
      loggerService: { log: vi.fn() },
      channelResolver: {
        getBySlug: vi.fn(),
      },
      kataService: {
        getLeaderboard: vi.fn().mockResolvedValue([]),
      },
    });
  });

  it("should send the correct message for !ja command", async () => {
    await commandUseCaseResolver.resolveByCommand("!ja", mockContext);

    expect(SendMessageToChannelUseCase.prototype.execute).toHaveBeenCalledWith({
      channelId: "test-channel",
      message: "Olá! Test message",
    });
  });

  it("should send the correct message for !oc command", async () => {
    await commandUseCaseResolver.resolveByCommand("!oc", mockContext);

    expect(SendMessageToChannelUseCase.prototype.execute).toHaveBeenCalledWith({
      channelId: "test-channel",
      message: ":warning: Only Code questions!",
    });
  });

  it("should handle the !cwl command by sending the leaderboard", async () => {
    await commandUseCaseResolver.resolveByCommand("!cwl", mockContext);

    expect(SendCodewarsLeaderboardToChannelUseCase.prototype.execute).toHaveBeenCalledWith({
      channelId: "test-channel",
    });
  });

  it("should throw UseCaseNotFound error for unknown command", async () => {
    await expect(commandUseCaseResolver.resolveByCommand("!unknown", mockContext)).rejects.toThrow(
      'Use case for command "!unknown" not found'
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});
