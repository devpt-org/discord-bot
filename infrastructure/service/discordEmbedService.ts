import { Client, MessageEmbed, MessageActionRow } from "discord.js";

export default class DiscordEmbedService {
  constructor(private client: Client) {}

  async sendEmbedToChannel(embed: MessageEmbed, row: MessageActionRow, channelId: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (!channel.isText()) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    channel.send({ embeds: [embed], components: [row] });
  }
}