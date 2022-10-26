import {
  Client,
  ClientUser,
  Guild,
  GuildEmoji,
  GuildMember,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
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

  addReactionToMessage(message: Message, reaction: string | GuildEmoji): Promise<MessageReaction> {
    return message.react(reaction);
  }

  getClientUser(): ClientUser | null {
    return this.client.user;
  }

  getChannel(id: string): TextChannel | undefined {
    const channel = this.client.channels.cache.get(id);

    if (channel === undefined) {
      return undefined;
    }

    return channel as TextChannel;
  }

  async getChannelMessage(channel: TextChannel, messageId: string): Promise<Message<boolean> | undefined> {
    if (channel === undefined) {
      return undefined;
    }

    const message = await channel.messages.fetch(messageId);

    return message;
  }

  getMember(guild: Guild, user: User): Promise<GuildMember> {
    return guild.members.fetch(user);
  }

  addMemberRole(member: GuildMember, roleId: string): Promise<GuildMember> {
    return member.roles.add(roleId);
  }

  removeMemberRole(member: GuildMember, roleId: string): Promise<GuildMember> {
    return member.roles.remove(roleId);
  }
}
