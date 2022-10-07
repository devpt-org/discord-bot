import EmbedMessage from "../entity/embedMessage";
import Channel from "../entity/channel";
import User from "../entity/user";
import LoggerService from "./loggerService";

export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): void;

  sendMessageEmbedToChannel(
    loggerService: LoggerService,
    embed: EmbedMessage,
    channelId: string,
    author: User
  ): Promise<void>;

  createPrivateChannel(loggerService: LoggerService, guildId: string, user: User): Promise<Channel>;

  deleteChannel(loggerService: LoggerService, channel: Channel): void;

  askAndCollectAnswersFromChannel(
    loggerService: LoggerService,
    channel: Channel,
    author: User,
    questions: string[]
  ): Promise<string[]>;

  deleteMessageFromChannel(loggerService: LoggerService, messageId: string, channelId: string): void;

  getUserById(userId: string): User;
}
