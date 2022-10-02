import Channel from "./domain/entity/channel";
import User from "./domain/entity/user";
import Message from "./domain/entity/message";

export interface ChatMember {
  id: string;
}

export interface Context {
  message: Message;
  guildId: string | undefined;
  user: User;
  channel: Channel;
}

export enum ChannelSlug {
  ENTRANCE = "ENTRANCE",
  JOBS = "JOBS",
}
