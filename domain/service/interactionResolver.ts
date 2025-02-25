import { ButtonInteraction } from "discord.js";
import ChatService from "./chatService";
import ChannelResolver from "./channelResolver";
import LoggerService from "./loggerService";
import ApproveAnonymousQuestionUseCase from "../../application/usecases/approveAnonymousQuestionUseCase";
import RejectAnonymousQuestionUseCase from "../../application/usecases/rejectAnonymousQuestionUseCase";
import QuestionTrackingService from "./questionTrackingService";

interface InteractionResolverOptions {
  chatService: ChatService;
  loggerService: LoggerService;
  channelResolver: ChannelResolver;
  questionTrackingService: QuestionTrackingService;
}

export default class InteractionResolver {
  private readonly chatService: ChatService;

  private readonly loggerService: LoggerService;

  private readonly channelResolver: ChannelResolver;

  private readonly questionTrackingService: QuestionTrackingService;

  constructor({ chatService, loggerService, channelResolver, questionTrackingService }: InteractionResolverOptions) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
    this.questionTrackingService = questionTrackingService;
  }

  async resolveButtonInteraction(interaction: ButtonInteraction): Promise<void> {
    const { customId } = interaction;
    const [action, questionId] = customId.split("_");

    try {
      const { message } = interaction;
      let questionContent = "Pergunta anónima";

      if (message.embeds && message.embeds.length > 0) {
        questionContent = message.embeds[0].description || questionContent;
      }

      if (action === "approve") {
        const approveUseCase = new ApproveAnonymousQuestionUseCase({
          chatService: this.chatService,
          loggerService: this.loggerService,
          channelResolver: this.channelResolver,
          questionTrackingService: this.questionTrackingService,
        });

        await approveUseCase.execute({
          questionId,
          moderatorId: interaction.user.id,
          interactionId: customId,
          questionContent,
          interaction,
        });
      } else if (action === "reject") {
        const rejectUseCase = new RejectAnonymousQuestionUseCase({
          chatService: this.chatService,
          loggerService: this.loggerService,
          questionTrackingService: this.questionTrackingService,
        });

        await rejectUseCase.execute({
          questionId,
          moderatorId: interaction.user.id,
          interactionId: customId,
          questionContent,
          interaction,
        });
      }
    } catch (error) {
      this.loggerService.log(`Erro ao processar interação de botão: ${error}`);

      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({
            content: "Ocorreu um erro ao processar esta ação.",
            ephemeral: true,
          });
        } catch (replyError) {
          this.loggerService.log(`Não foi possível responder à interação: ${replyError}`);
        }
      }
    }
  }
}
