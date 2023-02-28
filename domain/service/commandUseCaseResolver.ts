import SendCodewarsLeaderboardToChannelUseCase from "../../application/usecases/sendCodewarsLeaderboardToChannel/sendCodewarsLeaderboardToChannelUseCase";
import SendMessageToChannelUseCase from "../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase";
import SendRolesDropdownMessageUseCase from "../../application/usecases/sendRolesDropdownMessage/sendRolesDropdownMessageUseCase";
import { Context } from "../../types";
import UseCaseNotFound from "../exception/useCaseNotFound";
import { ActionRowBuilderInterface } from "../interface";
import MessageRepository from "../repository/messageRepository";
import ChannelResolver from "./channelResolver";
import ChatService from "./chatService";
import KataService from "./kataService/kataService";
import LoggerService from "./loggerService";

type CallbackFunctionVariadic = (...args: unknown[]) => void;

export default class CommandUseCaseResolver<A> {
  private messageRepository: MessageRepository;

  private chatService: ChatService;

  private loggerService: LoggerService;

  private channelResolver: ChannelResolver;

  private kataService: KataService;

  private actionRowBuilder: ActionRowBuilderInterface<A>;

  constructor({
    messageRepository,
    chatService,
    loggerService,
    channelResolver,
    kataService,
    actionRowBuilder,
  }: {
    messageRepository: MessageRepository;
    chatService: ChatService;
    loggerService: LoggerService;
    channelResolver: ChannelResolver;
    kataService: KataService;
    actionRowBuilder: ActionRowBuilderInterface<A>;
  }) {
    this.messageRepository = messageRepository;
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
    this.kataService = kataService;
    this.actionRowBuilder = actionRowBuilder;
  }

  resolveByCommand(command: string, context: Context): void {
    this.loggerService.log(`Command received: "${command}"`);

    const deps = {
      messageRepository: this.messageRepository,
      chatService: this.chatService,
      loggerService: this.loggerService,
      channelResolver: this.channelResolver,
      kataService: this.kataService,
      actionRowBuilder: this.actionRowBuilder,
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
      "!cwl": async () =>
        new SendCodewarsLeaderboardToChannelUseCase(deps).execute({
          channelId: context.channelId,
        }),
      "!roles": async () =>
        new SendRolesDropdownMessageUseCase(deps).execute({
          channelId: context.channelId,
          guildId: context.guildId,
          memberId: context.member?.id || null,
        }),
    };

    if (!commandUseCases[command]) {
      throw new UseCaseNotFound().byCommand(command);
    }

    commandUseCases[command]();
  }
}
