import { Context } from "../../types";
import UseCaseNotFound from "../exception/useCaseNotFound";
import SendMessageToChannelUseCase from "../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase";
import CreateNewJobUseCase from "../../application/usecases/createJobUseCase";
import MessageRepository from "../repository/messageRepository";
import ChatService from "./chatService";
import LoggerService from "./loggerService";
import ChannelResolver from "./channelResolver";

type CallbackFunctionVariadic = (...args: unknown[]) => void;

export default class CommandUseCaseResolver {
  private messageRepository: MessageRepository;

  private chatService: ChatService;

  private loggerService: LoggerService;

  private channelResolver: ChannelResolver;

  constructor({
    messageRepository,
    chatService,
    loggerService,
    channelResolver,
  }: {
    messageRepository: MessageRepository;
    chatService: ChatService;
    loggerService: LoggerService;
    channelResolver: ChannelResolver;
  }) {
    this.messageRepository = messageRepository;
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
  }

  resolveByCommand(command: string, context: Context): void {
    this.loggerService.log(`Command received: "${command}"`);

    const deps = {
      messageRepository: this.messageRepository,
      chatService: this.chatService,
      loggerService: this.loggerService,
      channelResolver: this.channelResolver,
    };

    const commandUseCases: Record<string, CallbackFunctionVariadic> = {
      "!ja": async () =>
        new SendMessageToChannelUseCase(deps).execute({
          channelId: context.message.channelId,
          message: ":point_right: https://dontasktoask.com/pt-pt/",
        }),
      "!oc": async () =>
        new SendMessageToChannelUseCase(deps).execute({
          channelId: context.message.channelId,
          message: ":warning: Este servidor é APENAS para questões relacionadas com programação! :warning:",
        }),
      "!job": async () => {
        context.message.delete();
        await new CreateNewJobUseCase(deps).execute(context.message);
      },
    };

    if (!commandUseCases[command]) {
      throw new UseCaseNotFound().byCommand(command);
    }

    commandUseCases[command]();
  }
}
