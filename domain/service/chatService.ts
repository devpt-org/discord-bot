export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): void;
  deleteMessageFromChannel(messageId: string, channelId: string): void;
  sendDirectMessageToUser(message: string, userId: string): void;
}
