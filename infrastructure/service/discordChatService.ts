import { Client } from "discord.js";
import ChatService from "../../domain/service/chatService";

export default class DiscordChatService implements ChatService {
  constructor(private client: Client) {}

  async sendMessageToChannel(message: string, channelId: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (!channel.isText()) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    channel.send(message);
  }
}
