import LoggerService from "../../domain/service/loggerService";
import ChatService from "../../domain/service/chatService";
import ChannelResolver from "../../domain/service/channelResolver";
import MessageRepository from "../../domain/repository/messageRepository";
import Channel from "../../domain/entity/channel";
import EmbedMessage from "../../domain/entity/embedMessage";
import { Context, ChannelSlug } from "../../types";
import EmbedBuilder from "../../domain/service/embedBuilder";
import User from "../../domain/entity/user";

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

    const author = this.chatService.getUserById(context.user.id);

    this.chatService.deleteMessageFromChannel(this.loggerService, context.message.id, context.channel.id);

    const createdChannel: Channel = await this.chatService.createPrivateChannel(
      this.loggerService,
      context.guildId,
      author
    );

    const answers: string[] = await this.chatService.askAndCollectAnswersFromChannel(
      this.loggerService,
      createdChannel,
      author,
      this.messageRepository.getJobQuestions()
    );

    this.chatService.deleteChannel(this.loggerService, createdChannel);

    const embedMessage = this.buildEmbedFromAnswersAndAuthor(answers, author);

    this.chatService.sendMessageEmbedToChannel(
      this.loggerService,
      embedMessage,
      this.channelResolver.getBySlug(ChannelSlug.JOBS),
      author
    );
  }

  private buildEmbedFromAnswersAndAuthor(capturedMessages: string[], author: User): EmbedMessage {
    const jobQuestions = this.messageRepository.getJobQuestions();

    const embedBuilder: EmbedBuilder = new EmbedBuilder()
      .withColor(0x0099ff)
      .withTitle(capturedMessages[0])
      .withDescription(capturedMessages[7])
      .withAuthor(`${author.username}#${author.discriminator}`, author.avatar)
      .withTimestamp(new Date());

    for (let i = 0; i <= 7; i++) {
      embedBuilder.addField(jobQuestions[i], capturedMessages[i]);
    }

    embedBuilder.addField("Contacte", `<@${author.id}>`, true);

    return embedBuilder.build();
  }
}
