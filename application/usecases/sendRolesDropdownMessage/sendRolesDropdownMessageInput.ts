import { Guild, GuildMember } from "discord.js";

export interface SendRolesDropdownMessageInput {
  channelId: string;
  guild: Guild | null;
  member: GuildMember | null;
}
