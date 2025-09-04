import { EmbedBuilder } from "discord.js";

export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): void;
  sendEmbedToChannel(embed: EmbedBuilder, channelId: string, content?: string): void;
}
