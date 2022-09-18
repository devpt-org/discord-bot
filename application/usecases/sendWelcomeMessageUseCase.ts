import LoggerService from "../../domain/service/loggerService";
import MessageRepository from "../../domain/repository/messageRepository";
import ChatService from "../../domain/service/chatService";
import { ChatMember } from "../../types";

// TODO: Pass to a channelResolver
const DESTINATION_CHANNEL_ID: string = process.env.DESTINATION_CHANNEL_ID
  ? process.env.DESTINATION_CHANNEL_ID
  : "855861944930402344";

const replacePlaceholders = (phrases: string, memberID: string) => {
  const memberIdTag = `<@${memberID}>`;
  return phrases.replace("{MEMBER_ID}", memberIdTag);
};

export default class SendWelcomeMessageUseCase {
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

  async execute(member: ChatMember): Promise<void> {
    this.loggerService.log("Member joined the server!");

    const introPhrase = this.messageRepository.getRandomIntroMessage();
    const welcomingPhrase = this.messageRepository.getRandomWelcomingMessage();
    const finalPhrase = replacePlaceholders(`${introPhrase}${welcomingPhrase}`, member.id);

    this.loggerService.log(`[NEW JOIN] ${finalPhrase}`);

    this.chatService.sendMessageToChannel(finalPhrase, DESTINATION_CHANNEL_ID);
  }
}
