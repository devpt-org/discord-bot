import { Command, Context } from "../../types";
import ChatService from "../../domain/service/chatService";
import { EmbedBuilder } from "discord.js";

export default class OnlyCodeQuestionsCommand implements Command {
  readonly name = "!oc";

  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  async execute(context: Context): Promise<void> {
    const { message, channelId } = context;

    const mentionedUser = message.mentions.users.first();
    const userIdMatch = message.content.match(/<@!?(\d+)>|(\d{17,20})/);
    const userId = mentionedUser?.id || userIdMatch?.[1] || userIdMatch?.[2];
    const content = userId ? `<@${userId}>` : undefined;

    const embed = new EmbedBuilder()
      .setTitle("🚫 Servidor Exclusivo para Programação")
      .setDescription("Este servidor é **APENAS** para questões relacionadas com **programação**!")
      .setColor(0xFF0000)
      .setFooter({ text: "Por favor mantém o foco no tema certo." })
      .setTimestamp();

    await this.chatService.sendEmbedToChannel(embed, channelId, content);
  }
}
