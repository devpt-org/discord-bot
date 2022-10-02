import EmbedMessage from "../entity/embedMessage";
import Channel from "../entity/channel";
import User from "../entity/user";
import LoggerService from "./loggerService";

export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): void;

  sendMessageEmbedToChannel(
    loggerService: LoggerService,
    embed: EmbedMessage,
    channel: string,
    guildId: string,
    user: User
  ): Promise<void>;

  buildEmbedFromCapturedMessages(
    loggerService: LoggerService,
    job_questions: string[],
    capturedMessages: string[],
    guildId: string,
    user: User
  ): Promise<EmbedMessage>;

  createPrivateChannel(loggerService: LoggerService, guildId: string, user: User): Promise<Channel>;

  deleteChannel(loggerService: LoggerService, channel: Channel): void;

  readMessagesFromChannel(
    loggerService: LoggerService,
    channel: Channel,
    guildId: string,
    user: User,
    job_questions: string[]
  ): Promise<string[]>;

  deleteMessageFromChannel(loggerService: LoggerService, messageId: string, channelId: string): void;
}
