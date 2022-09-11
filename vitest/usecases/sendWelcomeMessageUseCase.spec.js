import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import MessageRepository from "../../repository/messageRepository";
import DiscordService from "../../services/discordService";
import LoggerService from "../../services/loggerService";
import SendWelcomeMessageUseCase from "../../usecases/sendWelcomeMessageUseCase";

describe("welcome message", () => {
  beforeEach(() => {
    vi.mock("../../repository/messageRepository", () => ({
      default: function mockDefault() {
        return {
          getRandomIntroMessage: () => "Hello",
          getRandomWelcomingMessage: () => ", World",
        };
      },
    }));

    vi.mock("../../services/discordService", () => ({
      default: function mockDefault() {
        return {
          sendMessageToChannel: () => {},
        };
      },
    }));

    vi.mock("../../services/loggerService", () => ({
      default: function mockDefault() {
        return {
          log: () => {},
        };
      },
    }));
  });

  // TODO: Should we check instead for an event WelcomeMessageSent?
  it("should build the welcome message", async () => {
    const welcomeMessage = await new SendWelcomeMessageUseCase({
      messageRepository: new MessageRepository(),
      discordService: new DiscordService(),
      loggerService: new LoggerService(),
    }).execute("1234567890");

    expect(welcomeMessage).toBe("Hello, World");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});
