import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { ButtonInteraction, EmbedBuilder } from "discord.js";
import ApproveAnonymousQuestionUseCase from "../../../application/usecases/approveAnonymousQuestionUseCase";
import ChatService from "../../../domain/service/chatService";
import ChannelResolver from "../../../domain/service/channelResolver";
import LoggerService from "../../../domain/service/loggerService";
import QuestionTrackingService from "../../../domain/service/questionTrackingService";

describe("ApproveAnonymousQuestionUseCase", () => {
  let chatService: ChatService;
  let loggerService: LoggerService;
  let channelResolver: ChannelResolver;
  let questionTrackingService: QuestionTrackingService;
  let interaction: ButtonInteraction;

  beforeEach(() => {
    chatService = {
      sendMessageToChannel: vi.fn(),
    } as unknown as ChatService;

    loggerService = {
      log: vi.fn(),
    } as unknown as LoggerService;

    channelResolver = {
      getBySlug: vi.fn(() => "questions-channel"),
    } as unknown as ChannelResolver;

    questionTrackingService = {
      removeQuestion: vi.fn(),
    } as unknown as QuestionTrackingService;

    interaction = {
      guildId: "guild-1",
      update: vi.fn(),
    } as unknown as ButtonInteraction;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("publishes to public channel, notifies the user and clears tracking", async () => {
    const useCase = new ApproveAnonymousQuestionUseCase({
      chatService,
      loggerService,
      channelResolver,
      questionTrackingService,
    });

    await useCase.execute({
      questionId: "123",
      moderatorId: "mod-1",
      interactionId: "approve_123_dm-99_user-42",
      questionContent: "What is the airspeed?",
      interaction,
    });

    expect(chatService.sendMessageToChannel).toHaveBeenCalledWith(
      "**Pergunta anónima:**\n\nWhat is the airspeed?",
      "questions-channel"
    );

    expect(chatService.sendMessageToChannel).toHaveBeenCalledWith(
      expect.stringContaining("aprovada e publicada"),
      "dm-99"
    );

    expect(questionTrackingService.removeQuestion).toHaveBeenCalledWith("user-42");

    expect(interaction.update).toHaveBeenCalledTimes(1);
    const payload = (interaction.update as unknown as Mock).mock.calls[0][0];
    expect(payload.components).toEqual([]);
    expect(payload.embeds[0]).toBeInstanceOf(EmbedBuilder);
  });
});
