import { ChannelType, Client, Guild, GuildMember } from "discord.js";
import { CustomEmoji, CustomMessage, InteractionInterface } from "../../domain/interface";
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

  async isUserWithRole(guildId: string, userId: string, roleId: string): Promise<boolean> {
    const member = await this.getMember(guildId, userId);

    return member.roles.cache.has(roleId);
  }

  async isUserWithRoleName(guildId: string, userId: string, roles: string[] = []): Promise<boolean> {
    const member = await this.getMember(guildId, userId);

    return roles.some((role) => member.roles.cache.some((_role) => _role.name === role));
  }

  async addUserRole(guildId: string, userId: string, roleId: string): Promise<void> {
    const member = await this.getMember(guildId, userId);

    member.roles.add(roleId);
  }

  async removeUserRole(guildId: string, userId: string, roleId: string): Promise<void> {
    const member = await this.getMember(guildId, userId);

    member.roles.remove(roleId);
  }

  async sendInteractionReply(interaction: InteractionInterface, message: any): Promise<void> {
    interaction.reply(message);
  }

  async sendInteractionUpdate(interaction: InteractionInterface, message: any): Promise<void> {
    interaction.update(message);
  }

  async getGuildEmojis(guildId: string): Promise<CustomEmoji[]> {
    const guild = await this.getGuild(guildId);

    const emojis = await guild.emojis.fetch();

    return emojis.map((emoji) => ({
      id: emoji.id,
      name: emoji.name,
      string: emoji.toString(),
    }));
  }
}
