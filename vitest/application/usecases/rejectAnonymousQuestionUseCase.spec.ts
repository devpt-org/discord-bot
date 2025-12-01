import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { ButtonInteraction, EmbedBuilder } from "discord.js";
import RejectAnonymousQuestionUseCase from "../../../application/usecases/rejectAnonymousQuestionUseCase";
import ChatService from "../../../domain/service/chatService";
import LoggerService from "../../../domain/service/loggerService";
import QuestionTrackingService from "../../../domain/service/questionTrackingService";

describe("RejectAnonymousQuestionUseCase", () => {
  let chatService: ChatService;
  let loggerService: LoggerService;
  let questionTrackingService: QuestionTrackingService;
  let interaction: ButtonInteraction;

  beforeEach(() => {
    chatService = {
      sendMessageToChannel: vi.fn(),
    } as unknown as ChatService;

    loggerService = {
      log: vi.fn(),
    } as unknown as LoggerService;

    questionTrackingService = {
      removeQuestion: vi.fn(),
    } as unknown as QuestionTrackingService;

    interaction = {
      update: vi.fn(),
    } as unknown as ButtonInteraction;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("notifies user of rejection, updates embed and clears tracking", async () => {
    const useCase = new RejectAnonymousQuestionUseCase({
      chatService,
      loggerService,
      questionTrackingService,
    });

    await useCase.execute({
      questionId: "321",
      moderatorId: "mod-9",
      interactionId: "reject_321_dm-77_user-55",
      questionContent: "Will it blend?",
      interaction,
    });

    expect(chatService.sendMessageToChannel).toHaveBeenCalledWith(
      "A tua pergunta anónima foi rejeitada pelos moderadores.",
      "dm-77"
    );

    expect(questionTrackingService.removeQuestion).toHaveBeenCalledWith("user-55");

    expect(interaction.update).toHaveBeenCalledTimes(1);
    const payload = (interaction.update as unknown as Mock).mock.calls[0][0];
    expect(payload.components).toEqual([]);
    expect(payload.embeds[0]).toBeInstanceOf(EmbedBuilder);
  });
});
