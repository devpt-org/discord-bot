import { Command, Context } from "../../types";
import ChatService from "../../domain/service/chatService";

export default class DontAskToAskCommand implements Command {
  readonly name = "!ja";

  private readonly message: string =
    "Olá! Experimenta fazer a pergunta diretamente e contar o que já tentaste! Sabe mais aqui :point_right: https://dontasktoask.com/pt-pt/";

  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  async execute(context: Context): Promise<void> {
    await this.chatService.sendMessageToChannel(this.message, context.channelId);
  }
}
