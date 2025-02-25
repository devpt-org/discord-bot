import LoggerService from "../../../domain/service/loggerService";
import ChatService from "../../../domain/service/chatService";
import ChannelResolver from "../../../domain/service/channelResolver";
import { ChannelSlug } from "../../../types";
import QuestionTrackingService from "../../../domain/service/questionTrackingService";

export default class SendAnonymousQuestionUseCase {
  private chatService: ChatService;

  private loggerService: LoggerService;

  private channelResolver: ChannelResolver;

  private questionTrackingService: QuestionTrackingService;

  constructor({
    chatService,
    loggerService,
    channelResolver,
    questionTrackingService,
  }: {
    chatService: ChatService;
    loggerService: LoggerService;
    channelResolver: ChannelResolver;
    questionTrackingService: QuestionTrackingService;
  }) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
    this.questionTrackingService = questionTrackingService;
  }

  async execute({
    userId,
    username,
    questionContent,
    dmChannelId,
  }: {
    userId: string;
    username: string;
    questionContent: string;
    dmChannelId: string;
  }): Promise<void> {
    if (this.questionTrackingService.hasPendingQuestion(userId)) {
      await this.chatService.sendMessageToChannel(
        "Já tens uma pergunta pendente. Por favor, aguarda até que seja aprovada ou rejeitada antes de enviar outra.",
        dmChannelId
      );
      return;
    }

    this.loggerService.log(`Pergunta anónima recebida de ${username}: ${questionContent}`);

    const questionId = Date.now().toString();

    const moderationChannelId = this.channelResolver.getBySlug(ChannelSlug.MODERATION);

    const approveCustomId = `approve_${questionId}_${dmChannelId}_${userId}`;
    const rejectCustomId = `reject_${questionId}_${dmChannelId}_${userId}`;

    await this.chatService.sendEmbedWithButtons(
      moderationChannelId,
      {
        title: "Nova Pergunta Anónima",
        description: questionContent,
        color: 0x3498db, // Blue
        fields: [
          { name: "ID", value: questionId, inline: true },
          { name: "Enviado por", value: username, inline: true },
        ],
        footer: { text: "Pergunta anónima - Moderação necessária" },
      },
      [
        {
          customId: approveCustomId,
          label: "Aprovar",
          style: "SUCCESS",
        },
        {
          customId: rejectCustomId,
          label: "Rejeitar",
          style: "DANGER",
        },
      ]
    );

    this.questionTrackingService.trackQuestion(userId, questionId);

    await this.chatService.sendMessageToChannel(
      "A tua pergunta anônima foi recebida e será analisada pelos moderadores.",
      dmChannelId
    );
  }
}
