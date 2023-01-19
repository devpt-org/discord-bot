import { ChannelType, Client, Guild, GuildMember, Interaction } from "discord.js";
import { CustomMessage } from "../../domain/interface/customMessage.interface";
import ChatService from "../../domain/service/chatService";

export default class DiscordChatService implements ChatService {
  constructor(private client: Client) {}

  async sendMessageToChannel(message: string | CustomMessage, channelId: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (channel.type !== ChannelType.GuildText) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    channel.send(message);
  }

  async getRoleIdByName(guildId: string, roleName: string): Promise<string> {
    const guild = await this.getGuild(guildId);

    const roles = await guild.roles.fetch();

    const role = roles.find((findingRole) => findingRole.name === roleName);

    if (!role) throw new Error(`Role with name ${roleName} not found!`);

    return role.id;
  }

  private async getGuild(guildId: string): Promise<Guild> {
    const guild = await this.client.guilds.fetch(guildId);

    if (!guild) throw new Error(`Guild with id ${guildId} not found!`);

    return guild;
  }

  private async getMember(guildId: string, userId: string): Promise<GuildMember> {
    const guild = await this.getGuild(guildId);

    const member = await guild.members.fetch(userId);

    if (!member) throw new Error(`Member with id ${userId} not found!`);

    return member;
  }

  async isMemberWithRole(guildId: string, userId: string, roleId: string): Promise<boolean> {
    const member = await this.getMember(guildId, userId);

    return member.roles.cache.has(roleId);
  }

  async isMemberWithRoleName(guildId: string, userId: string, role: string): Promise<boolean> {
    const member = await this.getMember(guildId, userId);

    return member.roles.cache.some((_role) => _role.name === role);
  }

  async addMemberRole(guildId: string, userId: string, roleId: string): Promise<void> {
    const member = await this.getMember(guildId, userId);

    member.roles.add(roleId);
  }

  async removeMemberRole(guildId: string, userId: string, roleId: string): Promise<void> {
    const member = await this.getMember(guildId, userId);

    member.roles.remove(roleId);
  }

  async sendInteractionReply(interaction: Interaction, message: string | CustomMessage): Promise<void> {
    if (!interaction.isRepliable()) throw new Error("Interaction is not repliable!");

    interaction.reply(message);
  }

  async sendInteractionUpdate(interaction: Interaction, message: string | CustomMessage): Promise<void> {
    if (!interaction.isButton()) throw new Error("Interaction is not a button!");

    interaction.update(message);
  }
}
