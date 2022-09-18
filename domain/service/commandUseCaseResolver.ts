import { Context } from "../../types";
import UseCaseNotFound from "../exception/useCaseNotFound";
import SendMessageToChannelUseCase from "../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase";
import MessageRepository from "../repository/messageRepository";
import ChatService from "./chatService";
import LoggerService from "./loggerService";

type CallbackFunctionVariadic = (...args: unknown[]) => void;

export default class CommandUseCaseResolver {
  private messageRepository: MessageRepository;

  private chatService: ChatService;

  private loggerService: LoggerService;

  constructor({
    messageRepository,
    chatService,
    loggerService,
  }: {
    messageRepository: MessageRepository;
    chatService: ChatService;
    loggerService: LoggerService;
  }) {
    this.messageRepository = messageRepository;
    this.chatService = chatService;
    this.loggerService = loggerService;
  }

  resolveByCommand(command: string, context: Context): void {
    this.loggerService.log(`Command received: "${command}"`);

    const deps = {
      messageRepository: this.messageRepository,
      chatService: this.chatService,
      loggerService: this.loggerService,
    };

    const commandUseCases: Record<string, CallbackFunctionVariadic> = {
      "!ja": async () =>
        new SendMessageToChannelUseCase(deps).execute({
          channelId: context.channelId,
          message: ":point_right: https://dontasktoask.com/pt-pt/",
        }),
      "!oc": async () =>
        new SendMessageToChannelUseCase(deps).execute({
          channelId: context.channelId,
          message: ":warning: Este servidor é APENAS para questões relacionadas com programação! :warning:",
        }),
    };

    if (!commandUseCases[command]) {
      throw new UseCaseNotFound().byCommand(command);
    }

    commandUseCases[command]();
  }
}
