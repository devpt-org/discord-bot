import { Client, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import ChatService, { ButtonOptions, EmbedOptions } from "../../domain/service/chatService";

export default class DiscordChatService implements ChatService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

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

  async sendEmbedWithButtons(channelId: string, embedOptions: EmbedOptions, buttons: ButtonOptions[]): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (!channel?.isText()) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    const fields = embedOptions.fields || [];

    const embed = new MessageEmbed({
      title: embedOptions.title || "",
      description: embedOptions.description || "",
      color: embedOptions.color || 0x0099ff,
      fields,
      footer: embedOptions.footer
        ? {
            text: embedOptions.footer.text,
            iconURL: embedOptions.footer.iconURL,
          }
        : undefined,
    });

    const row = new MessageActionRow();

    buttons.forEach((button) => {
      row.addComponents(new MessageButton().setCustomId(button.customId).setLabel(button.label).setStyle(button.style));
    });

    await channel.send({ embeds: [embed], components: [row] });
  }
}
