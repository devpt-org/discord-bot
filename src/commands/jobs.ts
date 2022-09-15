import { Guild, Message, User, MessageEmbed, MessageCollector } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { v4 as uuidv4 } from "uuid";
import * as questions from "../../assets/jobs/jobs.json";
/// <summary>
///     JOBS COMMAND
///     Criar classificados mais organizados obedecendo um layout fixo
/// </summary>
//

// Embed Info with questions and answers
const createEmbed = (guild: Guild, user: User, answers: string[]) => {
  return new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(answers[0])
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setDescription(answers[7])
    .addFields(
      { name: questions[1], value: answers[1] },
      { name: questions[2], value: answers[2] },
      { name: questions[3], value: answers[3] },
      { name: questions[4], value: answers[4] },
      { name: questions[5], value: answers[5] },
      { name: questions[6], value: answers[6] },
      { name: "Contacte", value: `<@${user.id}>`, inline: true }
    )
    .setTimestamp(new Date())
    .setFooter({ text: guild.name, iconURL: guild.iconURL() || "" });
};
export default {
  callback: (message: any) => {
    if (message.guild === null) return;
    // Cria canal apenas para o utilizador que criou o anúncio
    message.guild.channels
      .create(uuidv4(), {
        type: ChannelTypes.GUILD_TEXT,
        // Atribuir permissões apenas ao utilizador que abriu o pedido
        permissionOverwrites: [
          {
            id: message.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
          {
            id: message.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
        ],
      })
      .then((channel: any) => {
        let counter = 0;
        // Array de respostas
        const answers: string[] = [];
        // Mensagem inicial do canal privado
        channel.send(`${message.user.toString()}, Por favor responda as perguntas abaixo para criar um novo anúncio.`);

        // Inicializar colector de respostas
        const collector: MessageCollector = channel.createMessageCollector({
          time: 1000 * 300, // Esperar 5 minutos pelas respostas
        });
        // Enviar Questões
        channel.send(questions[counter]);
        collector.on("collect", (m) => {
          if (m.author.id === message.user.id) {
            // Guardar as respostas em um array
            answers.push(m.content);
            // eslint-disable-next-line no-plusplus
            counter++;
            // Parar de recolher informação caso o utilizador tenha respondido a todas as perguntas.
            if (counter === Object.keys(questions).length - 1) {
              console.log("stop");
              collector.stop();
              return;
            }
            m.channel.send(questions[counter]).catch((err) => {
              console.log(err.message);
            });
          }
        });
        collector.on("end", (collected) => {
          // Cancelar o anúncio caso o user não tenha respondido a todas as perguntas.
          if (collected.size <= Object.keys(questions).length - 1) {
            channel.delete();
            return;
          }
          if (message.guild === null) return;

          // Criar embed com a informação do pedido
          const jobEmbed = createEmbed(message.guild, message.user, answers);
          // Criar thread para seguimento da proposta
          message.channel
            .send({ embeds: [jobEmbed] })
            .then((m: any) => {
              m.react("👍");
              m.react("👎");
              m.startThread({
                name: `${message.user.username}#${message.user.discriminator}`,
                autoArchiveDuration: 60,
              });
            })
            .then(() => {
              // Apagar o canal temporário
              channel.delete();
              console.log("JOBS COMMAND - Fim do processo");
            });
        });
      });
  },
};
