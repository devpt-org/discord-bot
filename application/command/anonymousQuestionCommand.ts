import { Command, Context } from "../../types";
import ChatService from "../../domain/service/chatService";
import LoggerService from "../../domain/service/loggerService";
import ChannelResolver from "../../domain/service/channelResolver";
import SendAnonymousQuestionUseCase from "../usecases/sendAnonymousQuestion/sendAnonymousQuestionUseCase";
import QuestionTrackingService from "../../domain/service/questionTrackingService";

export default class AnonymousQuestionCommand implements Command {
  readonly name = "!pergunta";

  private readonly chatService: ChatService;

  private readonly loggerService: LoggerService;

  private readonly channelResolver: ChannelResolver;

  private readonly questionTrackingService: QuestionTrackingService;

  constructor(
    chatService: ChatService,
    loggerService: LoggerService,
    channelResolver: ChannelResolver,
    questionTrackingService: QuestionTrackingService
  ) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
    this.questionTrackingService = questionTrackingService;
  }

  async execute(context: Context): Promise<void> {
    if (!context.message) {
      return;
    }

    const { message } = context;

    const isDM = message.channel.type === "DM";

    if (!isDM) {
      this.chatService.sendMessageToChannel("Este comando só pode ser usado em mensagens diretas.", context.channelId);
      return;
    }

    const questionContent = message.content.replace(/!pergunta\s+/i, "").trim();

    if (!questionContent) {
      this.chatService.sendMessageToChannel(
        "Por favor, forneçe uma pergunta após o comando. Exemplo: `!pergunta Como faço para...`",
        message.channel.id
      );
      return;
    }

    const sendAnonymousQuestionUseCase = new SendAnonymousQuestionUseCase({
      chatService: this.chatService,
      loggerService: this.loggerService,
      channelResolver: this.channelResolver,
      questionTrackingService: this.questionTrackingService,
    });

    await sendAnonymousQuestionUseCase.execute({
      userId: message.author.id,
      username: message.author.username,
      questionContent,
      dmChannelId: message.channel.id,
    });
  }
}
