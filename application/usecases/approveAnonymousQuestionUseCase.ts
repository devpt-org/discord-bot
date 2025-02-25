import { ButtonInteraction, MessageEmbed } from "discord.js";
import ChatService from "../../domain/service/chatService";
import ChannelResolver from "../../domain/service/channelResolver";
import LoggerService from "../../domain/service/loggerService";
import { ChannelSlug } from "../../types";
import QuestionTrackingService from "../../domain/service/questionTrackingService";

interface ApproveAnonymousQuestionUseCaseOptions {
  chatService: ChatService;
  loggerService: LoggerService;
  channelResolver: ChannelResolver;
  questionTrackingService: QuestionTrackingService;
}

interface ApproveAnonymousQuestionParams {
  questionId: string;
  moderatorId: string;
  interactionId: string;
  questionContent: string;
  interaction: ButtonInteraction;
}

export default class ApproveAnonymousQuestionUseCase {
  private chatService: ChatService;

  private loggerService: LoggerService;

  private channelResolver: ChannelResolver;

  private questionTrackingService: QuestionTrackingService;

  constructor({
    chatService,
    loggerService,
    channelResolver,
    questionTrackingService,
  }: ApproveAnonymousQuestionUseCaseOptions) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
    this.questionTrackingService = questionTrackingService;
  }

  async execute({
    questionId,
    moderatorId,
    interactionId,
    questionContent,
    interaction,
  }: ApproveAnonymousQuestionParams) {
    this.loggerService.log(`A aprovar a pergunta ${questionId} pelo moderador ${moderatorId}`);

    const customIdParts = interactionId.split("_");
    const dmChannelId = customIdParts[2];
    const userId = customIdParts[3];

    const publicChannelId = this.channelResolver.getBySlug(ChannelSlug.QUESTIONS);
    await this.chatService.sendMessageToChannel(`**Pergunta anónima:**\n\n${questionContent}`, publicChannelId);

    const publicMessageLink = interaction.guildId
      ? `https://discord.com/channels/${interaction.guildId}/${publicChannelId}/`
      : "";

    if (dmChannelId) {
      await this.chatService.sendMessageToChannel(
        `A tua pergunta anónima foi aprovada e publicada no canal <#${publicChannelId}>!${
          publicMessageLink ? `\n\nVê aqui: ${publicMessageLink}` : ""
        }`,
        dmChannelId
      );
    }

    try {
      const updatedEmbed = new MessageEmbed()
        .setTitle("Pergunta Anónima Aprovada")
        .setDescription(questionContent)
        .setColor(0x00ff00) // Green
        .setFields([
          { name: "ID", value: questionId, inline: true },
          { name: "Aprovado por", value: `<@${moderatorId}>`, inline: true },
        ])
        .setFooter({ text: "Esta pergunta foi aprovada e publicada" });

      if (interaction.message && "edit" in interaction.message) {
        await interaction.message.edit({
          embeds: [updatedEmbed],
          components: [],
        });
      } else {
        await interaction.update({
          embeds: [updatedEmbed],
          components: [],
        });
      }
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
