import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { Client } from "discord.js";
import SendMessageToChannelUseCase from "../../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase";
import DiscordChatService from "../../../infrastructure/service/discordChatService";
import ChatService from "../../../domain/service/chatService";

describe("send message to channel use case", () => {
  beforeEach(() => {
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
  });

  it("should send message to channel in chatService", async () => {
    const discordClient = new Client({ intents: [] });
    const chatService: ChatService = new DiscordChatService(discordClient);

    const spy = vi.spyOn(chatService, "sendMessageToChannel");

    await new SendMessageToChannelUseCase({
      chatService,
    }).execute({
      message: ":point_right: https://dontasktoask.com/pt-pt/",
      channelId: "855861944930402344",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(":point_right: https://dontasktoask.com/pt-pt/", "855861944930402344");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});
