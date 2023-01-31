import { MessageEmbed, MessageActionRow } from "discord.js";

export default interface SendMessageToChannel {
  sendEmbedToChannel(message: MessageEmbed, row: MessageActionRow, channelId: string): void;
}
