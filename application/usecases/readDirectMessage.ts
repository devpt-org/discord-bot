import { Message, Client, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import sendDM from "../../application/usecases/sendMessageToChannel/sendDM";
import ChatService from "../usecases/sendMessageToChannel/sendPerguntaToChannel";
import DiscordChatService from "../../infrastructure/service/discordEmbedService";
import * as _ from "lodash";

class DirectMessage {
  constructor(private message: Message, private client: Client) {}

  async validate() {
    const chatService: ChatService = new DiscordChatService(this.client);

    if (this.message.author.id == this.client.user?.id) {
      return false;
    }

    if (
      this.message.channel.type === "DM" &&
      this.message.content.startsWith("!pergunta") &&
      this.message.content.split(" ").length > 1 &&
      this.message.content.length <= 1500
    ) {
      return true;
    } else {
      sendDM(this.client, this.message.author.id, "Por favor usa o seguinte formato:\n!pergunta <mensagem>");
      return false;
    }
  }
  async messageApprove() {
    const chatService: ChatService = new DiscordChatService(this.client);
    const modChannel = "987719981443723266";
    const sentence = this.message.content.split(" ").slice(1).join(" ");
    const userName = this.message.author.username;

    const row = new MessageActionRow().addComponents(
      // BT Aceitar
      new MessageButton().setLabel("Aprovar").setStyle("SUCCESS").setCustomId("bt1"),

      // BT Eliminar
      new MessageButton().setCustomId("bt2").setLabel("Eliminar").setStyle("DANGER")
    );

    // Mensagem formato embed
    const Mensagem = new MessageEmbed().setColor("#0099ff").setTitle("Pergunta Anónima").setDescription(sentence);

    // Passa como parametros mensagem(embed), row(2 butoes), e string com id do canal
    await chatService.sendEmbedToChannel(Mensagem, row, modChannel);
    const dmSent = sendDM(
      this.client,
      this.message.author.id,
      "A tua pergunta foi colocada com sucesso.\nApós aprovação poderás visualizar no #canal."
    );
    if (!dmSent) console.log("dm não enviada");
  }
}

export default DirectMessage;
