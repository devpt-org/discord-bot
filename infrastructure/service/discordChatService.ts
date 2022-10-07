import { AnyChannel, Client, Collection, Message, MessageCollector, MessageEmbed, ThreadChannel } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { v4 as uuidv4 } from "uuid";
import ChatService from "../../domain/service/chatService";
import Channel from "../../domain/entity/channel";
import EmbedMessage from "../../domain/entity/embedMessage";
import User from "../../domain/entity/user";
import LoggerService from "../../domain/service/loggerService";

export default class DiscordChatService implements ChatService {
  constructor(private client: Client) {}

  async sendMessageToChannel(message: string, channelId: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);

    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (!channel.isText()) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    channel.send(message);
  }

  async sendMessageEmbedToChannel(
    loggerService: LoggerService,
    embed: EmbedMessage,
    channelId: string,
    author: User
  ): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);
    if (channel === null) {
      throw new Error(`Channel with id ${channelId} not found!`);
    }

    if (!channel.isText()) {
      throw new Error(`Channel with id ${channelId} is not a text channel!`);
    }

    const messageEmbed = new MessageEmbed()
      .setColor(embed.color)
      .setTitle(embed.title)
      .setAuthor({
        name: embed.author.name,
        iconURL: embed.author.iconURL,
      })
      .setDescription(embed.description)
      .addFields(embed.fields)
      .setTimestamp(embed.timestamp)
      .setFooter(embed.footer);
    channel.send({ embeds: [messageEmbed] }).then((m: Message) => {
      m.react("👍");
      m.react("👎");
      m.startThread({
        name: `${author.username}`,
      }).then((thread: ThreadChannel) => {
        thread.send(`Thread automatically created by ${author.username} in <#${channel.id}>`);
      });
    });
    loggerService.log(`Embed Message sent to channel with id ${channelId}`);
  }

  async createPrivateChannel(loggerService: LoggerService, guildId: string, user: User): Promise<Channel> {
    const guild = await this.client.guilds.fetch(guildId);

    if (guild === null) {
      throw new Error(`Guild with id ${guildId} not found!`);
    }

    const channel = await guild.channels.create(uuidv4(), {
      type: ChannelTypes.GUILD_TEXT,
      permissionOverwrites: [
        {
          id: user.id,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        },
        {
          id: guild.roles.everyone.id,
          deny: ["VIEW_CHANNEL"],
        },
      ],
    });
    loggerService.log(`Private channel created with id ${channel.id}`);
    return { id: channel.id };
  }

  async deleteChannel(loggerService: LoggerService, channel: Channel): Promise<void> {
    const discordChannel = await this.client.channels.fetch(channel.id);

    if (discordChannel === null) {
      throw new Error(`Channel with id ${channel.id} not found!`);
    }

    discordChannel.delete();
    loggerService.log(`Channel with id ${channel.id} deleted`);
  }

  async askAndCollectAnswersFromChannel(
    loggerService: LoggerService,
    channel: Channel,
    author: User,
    questions: string[]
  ): Promise<string[]> {
    const channelMessage = await this.client.channels.fetch(channel.id);

    let counter = 0;
    // Array de respostas
    const answers: string[] = [];

    if (channelMessage === null) {
      throw new Error(`Channel with id ${channel.id} not found!`);
    }

    if (!channelMessage.isText()) {
      throw new Error(`Channel with id ${channel.id} is not a text channel!`);
    }

    // Mensagem inicial do canal privado
    channelMessage.send(`${author.toString()}, Por favor responda as perguntas abaixo para criar um novo anúncio.`);

    // Inicializar colector de respostas
    const collector: MessageCollector = channelMessage.createMessageCollector({
      time: 1000 * 300, // Esperar 5 minutos pelas respostas
    });

    // Enviar Questões
    channelMessage.send(questions[counter]);

    // Captar as questões
    collector.on("collect", (message: Message) => {
      if (message.author.id === author.id) {
        // Guardar as respostas em um array
        answers.push(message.content);
        // eslint-disable-next-line no-plusplus
        counter++;
        // Parar de recolher informação caso o utilizador tenha respondido a todas as perguntas.
        if (counter === Object.keys(questions).length) {
          collector.stop();
          loggerService.log("JOBS COMMAND - Collector stopped");
          return;
        }

        message.channel.send(questions[counter]);
      }
    });

    return new Promise((resolve) => {
      // Após captar as questões
      collector.on("end", async (collected: Collection<string, Message<boolean>>) => {
        // Cancelar o job caso o user não tenha respondido a todas as perguntas.
        if (collected.size <= Object.keys(questions).length - 1) {
          channelMessage.delete();
          loggerService.log("JOBS COMMAND - Collector canceled");
        } else {
          resolve(answers);
          loggerService.log("JOBS COMMAND - Collector collected all answers");
        }
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteMessageFromChannel(loggerService: LoggerService, messageId: string, channelId: string): Promise<void> {
    // TODO
  }

  getUserById(userId: string): User {
    const user = this.client.users.cache.get(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found!`);
    }

    return user;
  }
}
