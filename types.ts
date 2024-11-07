export interface ChatMember {
  id: string;
}

export interface Context {
  channelId: string;
}

export enum ChannelSlug {
  ENTRANCE = "ENTRANCE",
  JOBS = "JOBS",
}

export type CommandMessages = {
  [command: string]: string;
};

export interface Command {
  name: string;
  execute(context: Context): Promise<void>;
}
