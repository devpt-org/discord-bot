import { MessageEmbed, MessageActionRow } from "discord.js";


export default interface sendMessageToChannel {
    sendEmbedToChannel(message: MessageEmbed, row: MessageActionRow, channelId: string): void;
  }
  

