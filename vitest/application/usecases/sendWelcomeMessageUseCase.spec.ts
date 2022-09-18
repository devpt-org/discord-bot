import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { Client } from "discord.js";
import SendWelcomeMessageUseCase from "../../../application/usecases/sendWelcomeMessageUseCase";
import DiscordChatService from "../../../infrastructure/service/discordChatService";
import FileMessageRepository from "../../../infrastructure/repository/fileMessageRepository";
import ConsoleLoggerService from "../../../infrastructure/service/consoleLoggerService";
import { ChatMember } from "../../../types";
import ChatService from "../../../domain/service/chatService";

describe("send welcome message to channel use case", () => {
  beforeEach(() => {
    vi.mock("../../../infrastructure/repository/fileMessageRepository", () => ({
      default: function mockDefault() {
        return {
          getRandomIntroMessage: () => "Olá {MEMBER_ID}",
          getRandomWelcomingMessage: () => ", bem-vindo!",
        };
      },
    }));

    vi.mock("../../../infrastructure/service/discordChatService", () => ({
      default: function mockDefault() {
        return {
          sendMessageToChannel: () => {},
        };
      },
    }));

    vi.mock("discord.js", () => ({
      Client: vi.fn(),
    }));

    vi.mock("../../../infrastructure/service/consoleLoggerService", () => ({
      default: function mockDefault() {
        return {
          log: () => {},
        };
      },
    }));
  });

  it("should send message to channel in chatService", async () => {
    const discordClient = new Client({ intents: [] });
    const chatService: ChatService = new DiscordChatService(discordClient);

    const spy = vi.spyOn(chatService, "sendMessageToChannel");

    const chatMember: ChatMember = {
      id: "1234567890",
    };

    await new SendWelcomeMessageUseCase({
      messageRepository: new FileMessageRepository(),
      chatService,
      loggerService: new ConsoleLoggerService(),
    }).execute(chatMember);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Olá <@1234567890>, bem-vindo!", "855861944930402344");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});
