import { Client, EmbedBuilder, TextChannel } from "discord.js";
import ChatService from "../../domain/service/chatService";

export default class DiscordChatService implements ChatService {
  constructor(private client: Client) {}

  async sendMessageToChannel(message: string, channelId: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      throw new Error(`Channel with id ${channelId} is not a text channel or was not found!`);
    }

    await (channel as TextChannel).send(message);
  }

  async sendEmbedToChannel(embed: EmbedBuilder, channelId: string, content?: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      throw new Error(`Channel with id ${channelId} is not a text channel or was not found!`);
    }

    await (channel as TextChannel).send({
      embeds: [embed],
      content: content ?? undefined,
    });
  }
}
