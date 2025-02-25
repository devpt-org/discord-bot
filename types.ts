import { Message } from "discord.js";

export interface ChatMember {
  id: string;
}

export interface Context {
  channelId: string;
  message?: Message;
}

export enum ChannelSlug {
  ENTRANCE = "ENTRANCE",
  JOBS = "JOBS",
  MODERATION = "MODERATION",
  QUESTIONS = "QUESTIONS",
}

export type CommandMessages = {
  [command: string]: string;
};

export interface Command {
  name: string;
  execute(context: Context): Promise<void>;
}
