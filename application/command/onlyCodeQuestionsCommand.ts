import { Command, Context } from "../../types";
import ChatService from "../../domain/service/chatService";

export default class OnlyCodeQuestionsCommand implements Command {
  readonly name = "!oc";

  private chatService: ChatService;

  private readonly message: string =
    ":warning: Este servidor é APENAS para questões relacionadas com programação! :warning:";

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  async execute(context: Context): Promise<void> {
    await this.chatService.sendMessageToChannel(this.message, context.channelId);
  }
}
