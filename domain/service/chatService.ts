export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): void;
}
