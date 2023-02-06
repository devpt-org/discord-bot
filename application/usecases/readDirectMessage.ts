import { Message, Client, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ChannelSlug } from "../../types";
import QuestionChatService from "./sendMessageToChannel/sendPerguntaToChannel";
import DiscordEmbedService from "../../infrastructure/service/discordEmbedService";
import ChatService from "../../domain/service/chatService";
import DiscordChatService from "../../infrastructure/service/discordChatService";
import ChannelResolver from "../../domain/service/channelResolver";

class DirectMessage {
  constructor(private message: Message, private client: Client, private channelResolver: ChannelResolver) {}

  async validate() {
    const chatService: ChatService = new DiscordChatService(this.client);
    if (this.message.author.id === this.client.user?.id) {
      return false;
    }

    if (
      this.message.channel.type === "DM" &&
      this.message.content.startsWith("!pergunta") &&
      this.message.content.split(" ").length > 1 &&
      this.message.content.length <= 1500
    ) {
      return true;
    }
    chatService.sendDM(this.message.author.id, "Por favor usa o seguinte formato:\n!pergunta <mensagem>");
    return false;
  }

  async messageApprove() {
    const chatService: ChatService = new DiscordChatService(this.client);
    const channelAnonQuestion = this.client.channels.cache.get(this.channelResolver.getBySlug(ChannelSlug.QUESTION));
    const questionChatService: QuestionChatService = new DiscordEmbedService(this.client);
    const sentence = this.message.content.split(" ").slice(1).join(" ");
    const buttons = new MessageActionRow().addComponents(
      new MessageButton().setLabel("Aprovar").setStyle("SUCCESS").setCustomId("bt1"),
      new MessageButton().setLabel("Eliminar").setStyle("DANGER").setCustomId("bt2")
    );
    const mensagem = new MessageEmbed().setColor("#0099ff").setTitle("Pergunta Anónima").setDescription(sentence);

    await questionChatService.sendEmbedToChannel(
      mensagem,
      buttons,
      this.channelResolver.getBySlug(ChannelSlug.MOD_CHANNEL)
    );

    await chatService.sendDM(
      this.message.author.id,
      `A tua pergunta foi colocada com sucesso.\nApós aprovação poderás visualizar no ${channelAnonQuestion} `
    );
  }
}

export default DirectMessage;
