import { Client } from "discord.js";
export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): void;
  deleteMessageFromChannel(messageId: string, channelId: string): void;
  sendDM(message: string, userId: string): void;
}
