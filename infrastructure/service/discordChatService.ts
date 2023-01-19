import { ChannelType, Client, GuildMember, Interaction } from "discord.js";
import { CostumMessage } from "../../domain/interface/message.interface";
import ChatService from "../../domain/service/chatService";

export default class DiscordChatService implements ChatService {
  constructor(private client: Client) {}

  async sendMessageToChannel(message: string | CostumMessage, channelId: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (channel.type !== ChannelType.GuildText) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    channel.send(message);
  }

  private async getMember(guildId: string, userId: string): Promise<GuildMember> {
    const guild = await this.client.guilds.fetch(guildId);

    if (!guild) throw new Error(`Guild with id ${guildId} not found!`);

    const member = await guild.members.fetch(userId);

    if (!member) throw new Error(`Member with id ${userId} not found!`);

    return member;
  }

  async addMemberRole(guildId: string, userId: string, roleId: string): Promise<void> {
    const member = await this.getMember(guildId, userId);

    member.roles.add(roleId);
  }

  async removeMemberRole(guildId: string, userId: string, roleId: string): Promise<void> {
    const member = await this.getMember(guildId, userId);

    member.roles.remove(roleId);
  }

  async sendInteractionReply(interaction: Interaction, message: string | CostumMessage): Promise<void> {
    if (interaction.isRepliable()) interaction.reply(message);
  }

  async sendInteractionUpdate(interaction: Interaction, message: string | CostumMessage): Promise<void> {
    if (interaction.isButton()) interaction.update(message);
  }
}
