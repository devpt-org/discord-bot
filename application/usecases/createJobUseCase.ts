import {
  MessageCollector,
  Message,
  DMChannel,
  PartialDMChannel,
  NewsChannel,
  TextChannel,
  ThreadChannel,
  VoiceChannel,
  Collection,
} from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { v4 as uuidv4 } from "uuid";
import LoggerService from "../../domain/service/loggerService";
import MessageRepository from "../../domain/repository/messageRepository";
import CreateEmbedUseCase from "./createJob/createEmbedUseCase";
import SendMessageToChannelUseCase from "./createJob/sendMessageToChannelUseCase";
/// <summary>
///     JOBS COMMAND
///     Criar classificados mais organizados obedecendo um layout fixo
/// </summary>
//

export default class CreateNewJobUseCase {
  private messageRepository: MessageRepository;

  private loggerService: LoggerService;

  constructor({
    messageRepository,
    loggerService,
  }: {
    messageRepository: MessageRepository;
    loggerService: LoggerService;
  }) {
    this.messageRepository = messageRepository;
    this.loggerService = loggerService;
  }

  async execute(message: Message): Promise<void> {
    const JOB_QUESTIONS = this.messageRepository.getJobQuestions();
    if (message.guild === null) return;
    // Cria canal apenas para o utilizador que criou o anúncio
    message.guild.channels
      .create(uuidv4(), {
        type: ChannelTypes.GUILD_TEXT,
        // Atribuir permissões apenas ao utilizador que abriu o pedido
        permissionOverwrites: [
          {
            id: message.author.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
          {
            id: message.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
        ],
      })
      .then((channel: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel) => {
        let counter = 0;
        // Array de respostas
        const answers: string[] = [];
        // Mensagem inicial do canal privado
        channel.send(
          `${message.author.toString()}, Por favor responda as perguntas abaixo para criar um novo anúncio.`
        );

        // Inicializar colector de respostas
        const collector: MessageCollector = channel.createMessageCollector({
          time: 1000 * 300, // Esperar 5 minutos pelas respostas
        });
        // Enviar Questões
        channel.send(JOB_QUESTIONS[counter]);
        collector.on("collect", (m: Message) => {
          if (m.author.id === message.author.id) {
            // Guardar as respostas em um array
            answers.push(m.content);
            // eslint-disable-next-line no-plusplus
            counter++;
            // Parar de recolher informação caso o utilizador tenha respondido a todas as perguntas.
            if (counter === Object.keys(JOB_QUESTIONS).length) {
              collector.stop();
              this.loggerService.log("JOBS COMMAND - Collector stopped");
              return;
            }
            m.channel.send(JOB_QUESTIONS[counter]).catch((err: Error) => {
              this.loggerService.log(err.message);
            });
          }
        });
        collector.on("end", async (collected: Collection<string, Message<boolean>>) => {
          // Cancelar o anúncio caso o user não tenha respondido a todas as perguntas.
          if (collected.size <= Object.keys(JOB_QUESTIONS).length - 1) {
            channel.delete();
            return;
          }
          if (message.guild === null) return;

          // Criar embed com a informação do pedido
          const embed = await new CreateEmbedUseCase({
            guild: message.guild,
            user: message.author,
            answers,
          }).execute(JOB_QUESTIONS);

          // Criar thread para seguimento da proposta
          new SendMessageToChannelUseCase({
            channelToDelete: channel,
            channelToSendEmbed: message.channel,
            embed,
            author: message.author,
            loggerService: this.loggerService,
          }).execute();
        });
      });
  }
}
