import LoggerService from "../../domain/service/loggerService";
import MessageRepository from "../../domain/repository/messageRepository";
import ChatService from "../../domain/service/chatService";
import { ChatMember, ChannelSlug } from "../../types";
import ChannelResolver from "../../domain/service/channelResolver";

const replacePlaceholders = (phrases: string, memberID: string) => {
  const memberIdTag = `<@${memberID}>`;
  return phrases.replace("{MEMBER_ID}", memberIdTag);
};

export default class SendWelcomeMessageUseCase {
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

  async execute(member: ChatMember): Promise<void> {
    this.loggerService.log("Member joined the server!");

    const introPhrase = this.messageRepository.getRandomIntroMessage();
    const welcomingPhrase = this.messageRepository.getRandomWelcomingMessage();
    const finalPhrase = replacePlaceholders(`${introPhrase}${welcomingPhrase}`, member.id);

    this.loggerService.log(`[NEW JOIN] ${finalPhrase}`);

    this.chatService.sendMessageToChannel(finalPhrase, this.channelResolver.getBySlug(ChannelSlug.ENTRANCE));
  }
}
