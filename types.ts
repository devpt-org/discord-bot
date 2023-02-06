export interface ChatMember {
  id: string;
}

export interface Context {
  channelId: string;
}

export enum ChannelSlug {
  ENTRANCE = "ENTRANCE",
  JOBS = "JOBS",
  QUESTION = "QUESTION",
  MOD_CHANNEL = "MOD_CHANNEL",
}
