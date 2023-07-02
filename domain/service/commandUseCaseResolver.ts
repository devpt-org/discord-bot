import { Context } from "../../types";
import UseCaseNotFound from "../exception/useCaseNotFound";
import SendMessageToChannelUseCase from "../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase";
import MessageRepository from "../repository/messageRepository";
import ChatService from "./chatService";
import LoggerService from "./loggerService";
import ChannelResolver from "./channelResolver";
import KataService from "./kataService/kataService";
import SendCodewarsLeaderboardToChannelUseCase from "../../application/usecases/sendCodewarsLeaderboardToChannel/sendCodewarsLeaderboardToChannelUseCase";

type CallbackFunctionVariadic = (...args: unknown[]) => void;

export default class CommandUseCaseResolver {
  private messageRepository: MessageRepository;

  private chatService: ChatService;

  private loggerService: LoggerService;

  private channelResolver: ChannelResolver;

  private kataService: KataService;

  constructor({
    messageRepository,
    chatService,
    loggerService,
    channelResolver,
    kataService,
  }: {
    messageRepository: MessageRepository;
    chatService: ChatService;
    loggerService: LoggerService;
    channelResolver: ChannelResolver;
    kataService: KataService;
  }) {
    this.messageRepository = messageRepository;
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
    this.kataService = kataService;
  }

  resolveByCommand(command: string, context: Context): void {
    this.loggerService.log(`Command received: "${command}"`);

    const deps = {
      messageRepository: this.messageRepository,
      chatService: this.chatService,
      loggerService: this.loggerService,
      channelResolver: this.channelResolver,
      kataService: this.kataService,
    };

    const commandUseCases: Record<string, CallbackFunctionVariadic> = {
      "!ja": async () =>
        new SendMessageToChannelUseCase(deps).execute({
          channelId: context.channelId,
          message:
            "Olá! Experimenta fazer a pergunta diretamente e contar o que já tentaste! Sabe mais aqui :point_right: https://dontasktoask.com/pt-pt/",
        }),
      "!oc": async () =>
        new SendMessageToChannelUseCase(deps).execute({
          channelId: context.channelId,
          message: ":warning: Este servidor é APENAS para questões relacionadas com programação! :warning:",
        }),
      "!cwl": async () =>
        new SendCodewarsLeaderboardToChannelUseCase(deps).execute({
          channelId: context.channelId,
        }),
    };

    if (!commandUseCases[command]) {
      throw new UseCaseNotFound().byCommand(command);
    }

    commandUseCases[command]();
  }
}
