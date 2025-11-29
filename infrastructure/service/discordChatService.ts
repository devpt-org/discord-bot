import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, TextBasedChannel } from "discord.js";
import ChatService, { ButtonOptions, EmbedOptions } from "../../domain/service/chatService";

export default class DiscordChatService implements ChatService {
  constructor(private client: Client) {}

  async sendMessageToChannel(message: string, channelId: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (!channel.isTextBased() || !("send" in channel)) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    const textChannel = channel as TextBasedChannel & { send: (content: string) => Promise<unknown> };
    await textChannel.send(message);
  }

  private mapButtonStyle(style: ButtonOptions["style"]): ButtonStyle {
    switch (style) {
      case "PRIMARY":
        return ButtonStyle.Primary;
      case "SECONDARY":
        return ButtonStyle.Secondary;
      case "SUCCESS":
        return ButtonStyle.Success;
      case "DANGER":
        return ButtonStyle.Danger;
      default:
        return ButtonStyle.Secondary;
    }
  }

  async sendEmbedWithButtons(channelId: string, embedOptions: EmbedOptions, buttons: ButtonOptions[]): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (!channel.isTextBased() || !("send" in channel)) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    const textChannel = channel as TextBasedChannel & { send: (content: unknown) => Promise<unknown> };

    const embed = new EmbedBuilder()
      .setTitle(embedOptions.title ?? "")
      .setDescription(embedOptions.description ?? "")
      .setColor(embedOptions.color ?? 0x0099ff);

    if (embedOptions.fields) {
      embed.setFields(embedOptions.fields);
    }

    if (embedOptions.footer) {
      embed.setFooter({ text: embedOptions.footer.text, iconURL: embedOptions.footer.iconURL });
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      ...buttons.map((button) =>
        new ButtonBuilder()
          .setCustomId(button.customId)
          .setLabel(button.label)
          .setStyle(this.mapButtonStyle(button.style))
      )
    );

    await textChannel.send({ embeds: [embed], components: [row] });
  }
}
