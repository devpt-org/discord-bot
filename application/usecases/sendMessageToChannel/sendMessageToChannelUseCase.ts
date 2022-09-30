import ChatService from "../../../domain/service/chatService";
import { SendMessageToChannelInput } from "./sendMessageToChannelInput";

export default class SendMessageToChannelUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute({ message, channelId }: SendMessageToChannelInput): Promise<void> {
    await this.chatService.sendMessageToChannel(message, channelId);
  }
}
