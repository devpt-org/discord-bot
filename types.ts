import { Guild, GuildMember } from "discord.js";

export interface ChatMember {
  id: string;
}

export interface Context {
  channelId: string;
  guild: Guild | null;
  member: GuildMember | null;
}

export enum ChannelSlug {
  ENTRANCE = "ENTRANCE",
  JOBS = "JOBS",
}
