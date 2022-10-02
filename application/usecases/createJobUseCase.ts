import LoggerService from "../../domain/service/loggerService";
import ChatService from "../../domain/service/chatService";
import ChannelResolver from "../../domain/service/channelResolver";
import MessageRepository from "../../domain/repository/messageRepository";
import Channel from "../../domain/entity/channel";
import EmbedMessage from "../../domain/entity/embedMessage";
import { Context, ChannelSlug } from "../../types";

export default class CreateJobUseCase {
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

  async execute(context: Context): Promise<void> {
    if (context.guildId === undefined) {
      throw new Error(`Guild not found!`);
    }

    this.chatService.deleteMessageFromChannel(this.loggerService, context.message.id, context.channel.id);

    const createdChannel: Channel = await this.chatService.createPrivateChannel(
      this.loggerService,
      context.guildId,
      context.user
    );

    const capturedMessages: string[] = await this.chatService.readMessagesFromChannel(
      this.loggerService,
      createdChannel,
      context.guildId,
      context.user,
      this.messageRepository.getJobQuestions()
    );

    this.chatService.deleteChannel(this.loggerService, createdChannel);

    const embed: EmbedMessage = await this.chatService.buildEmbedFromCapturedMessages(
      this.loggerService,
      this.messageRepository.getJobQuestions(),
      capturedMessages,
      context.guildId,
      context.user
    );

    this.chatService.sendMessageEmbedToChannel(
      this.loggerService,
      embed,
      this.channelResolver.getBySlug(ChannelSlug.JOBS),
      context.guildId,
      context.user
    );
  }
}
