import { Message } from "discord.js";

export interface ChatMember {
  id: string;
}

export interface Context {
  message: Message;
}

export enum ChannelSlug {
  ENTRANCE = "ENTRANCE",
  JOBS = "JOBS",
}
