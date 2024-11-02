import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import CommandUseCaseResolver from "../../domain/service/commandUseCaseResolver";
import { Context } from "../../types";

describe("CommandUseCaseResolver", () => {
  let commandUseCaseResolver: CommandUseCaseResolver;
  const mockContext: Context = {
    channelId: "test-channel",
  };

  beforeEach(async () => {
    commandUseCaseResolver = new CommandUseCaseResolver({
      chatService: {
        sendMessageToChannel: vi.fn(),
      },
      loggerService: { log: vi.fn() },
      kataService: {
        getLeaderboard: vi.fn().mockResolvedValue([]),
      },
    });
  });

  it("should invoke for !ja command", async () => {
    await commandUseCaseResolver.resolveByCommand("!ja", mockContext);

    expect(() => commandUseCaseResolver.resolveByCommand("!ja", mockContext)).not.toThrow();
  });

  it("should invoke for !oc command", async () => {
    await commandUseCaseResolver.resolveByCommand("!oc", mockContext);

    expect(() => commandUseCaseResolver.resolveByCommand("!oc", mockContext)).not.toThrow();
  });

  it("should invoke for !cwl command", async () => {
    await commandUseCaseResolver.resolveByCommand("!cwl", mockContext);

    expect(() => commandUseCaseResolver.resolveByCommand("!cwl", mockContext)).not.toThrow();
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
