import { ClientUser, Guild, GuildEmoji, GuildMember, Message, MessageReaction, TextChannel, User } from "discord.js";

export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): void;

  addReactionToMessage(message: Message, reaction: string | GuildEmoji): Promise<MessageReaction>;

  getClientUser(): ClientUser | null;

  getChannel(id: string): TextChannel | undefined;

  getChannelMessage(channel: TextChannel, messageId: string): Promise<Message<boolean> | undefined>;

  getMember(guild: Guild, user: User): Promise<GuildMember>;

  addMemberRole(member: GuildMember, roleId: string): Promise<GuildMember>;

  removeMemberRole(member: GuildMember, roleId: string): Promise<GuildMember>;
}
