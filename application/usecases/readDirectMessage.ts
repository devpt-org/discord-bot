import { Message, Client, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import sendDM from "./sendMessageToChannel/sendDM";
import PerguntaChatService from "./sendMessageToChannel/sendPerguntaToChannel";
import DiscordEmbedService from "../../infrastructure/service/discordEmbedService";

class DirectMessage {
  constructor(private message: Message, private client: Client) {}

  async validate() {
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
    sendDM(this.client, this.message.author.id, "Por favor usa o seguinte formato:\n!pergunta <mensagem>");
    return false;
  }

  async messageApprove() {
    const chatService: PerguntaChatService = new DiscordEmbedService(this.client);
    const modChannel = "987719981443723266";
    const sentence = this.message.content.split(" ").slice(1).join(" ");
    const row = new MessageActionRow().addComponents(
      new MessageButton().setLabel("Aprovar").setStyle("SUCCESS").setCustomId("bt1"),
      new MessageButton().setCustomId("bt2").setLabel("Eliminar").setStyle("DANGER")
    );
    const Mensagem = new MessageEmbed().setColor("#0099ff").setTitle("Pergunta Anónima").setDescription(sentence);

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
