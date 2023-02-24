import { Message, Client, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ChannelSlug } from "../../types";
import QuestionChatService from "./sendMessageToChannel/sendPerguntaToChannel";
import ChatService from "../../domain/service/chatService";
import ChannelResolver from "../../domain/service/channelResolver";

const askedRecently = new Set();
const messageSize = 1500;
class ReadDirectMessageUseCase {
  constructor(
    private message: Message,
    private client: Client,
    private channelResolver: ChannelResolver,
    private chatService: ChatService,
    private questionChatService: QuestionChatService
  ) {}

  async isValid() {
    if (askedRecently.has(this.message.author.id) && this.message.channel.type === "DM") {
      this.message.channel.send("Ainda não podes enviar outra pergunta. Tenta mais tarde.");
      return false;
    }
    if (this.message.author.id === this.client.user?.id || this.message.channel.type !== "DM") {
      return false;
    }
    if (
      this.message.channel.type === "DM" &&
      this.message.content.startsWith("!pergunta") &&
      this.message.content.split(" ").length > 1 &&
      this.message.content.length <= messageSize
    ) {
      askedRecently.add(this.message.author.id);
      setTimeout(() => {
        askedRecently.delete(this.message.author.id);
      }, 60000);
      return true;
    }
    this.chatService.sendDirectMessageToUser(
      this.message.author.id,
      "Por favor usa o seguinte formato:\n!pergunta <mensagem>"
    );

    return false;
  }

  async approveMessage(): Promise<void> {
    const channelAnonQuestion = this.client.channels.cache.get(this.channelResolver.getBySlug(ChannelSlug.QUESTION));
   // const questionChatService: QuestionChatService = new DiscordEmbedService(this.client);
    const originalUserId = this.message.author.id;
    const sentence = this.message.content.split(" ").slice(1).join(" ");
    const buttons = new MessageActionRow().addComponents(
      new MessageButton().setLabel("Aprovar").setStyle("SUCCESS").setCustomId(`apr${originalUserId}`),
      new MessageButton().setLabel("Eliminar").setStyle("DANGER").setCustomId(`rej${originalUserId}`)
    );
    const mensagem = new MessageEmbed().setColor("#0099ff").setTitle("Pergunta Anónima").setDescription(sentence);

    await this.questionChatService.sendEmbedToChannel(
      mensagem,
      buttons,
      this.channelResolver.getBySlug(ChannelSlug.MOD_CHANNEL)
    );

    await this.chatService.sendDirectMessageToUser(
      this.message.author.id,
      `A tua pergunta foi colocada com sucesso.\nApós aprovação poderás visualizar no ${channelAnonQuestion} `
    );
  }
}

export default ReadDirectMessageUseCase;
