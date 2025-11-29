import { ButtonInteraction, EmbedBuilder } from "discord.js";
import ChatService from "../../domain/service/chatService";
import LoggerService from "../../domain/service/loggerService";
import QuestionTrackingService from "../../domain/service/questionTrackingService";

interface RejectAnonymousQuestionUseCaseOptions {
  chatService: ChatService;
  loggerService: LoggerService;
  questionTrackingService: QuestionTrackingService;
}

interface RejectAnonymousQuestionParams {
  questionId: string;
  moderatorId: string;
  interactionId: string;
  questionContent: string;
  interaction: ButtonInteraction;
  reason?: string;
}

export default class RejectAnonymousQuestionUseCase {
  private chatService: ChatService;

  private loggerService: LoggerService;

  private questionTrackingService: QuestionTrackingService;

  constructor({ chatService, loggerService, questionTrackingService }: RejectAnonymousQuestionUseCaseOptions) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.questionTrackingService = questionTrackingService;
  }

  async execute({
    questionId,
    moderatorId,
    interactionId,
    questionContent,
    interaction,
  }: RejectAnonymousQuestionParams) {
    this.loggerService.log(`Rejeitando a pergunta ${questionId} pelo moderador ${moderatorId}`);

    const customIdParts = interactionId.split("_");
    const dmChannelId = customIdParts[2];
    const userId = customIdParts[3];

    if (dmChannelId) {
      await this.chatService.sendMessageToChannel(
        `A tua pergunta anónima foi rejeitada pelos moderadores.`,
        dmChannelId
      );
    }

    try {
      const updatedEmbed = new EmbedBuilder()
        .setTitle("Pergunta Anónima Rejeitada")
        .setDescription(questionContent)
        .setColor(0xff0000) // Red
        .addFields([
          { name: "ID", value: questionId || "N/A", inline: true },
          { name: "Rejeitado por", value: moderatorId ? `<@${moderatorId}>` : "Desconhecido", inline: true },
        ])
        .setFooter({ text: "Esta pergunta foi rejeitada" });

      await interaction.update({
        embeds: [updatedEmbed],
        components: [],
      });
    } catch (error) {
      this.loggerService.log(`Erro ao atualizar mensagem de moderação: ${error}`);
    }

    if (userId) {
      this.questionTrackingService.removeQuestion(userId);
      this.loggerService.log(`Pergunta ${questionId} removida do tracking para o user ${userId}`);
    }

    return { success: true };
  }
}
