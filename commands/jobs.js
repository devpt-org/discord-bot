const uuid = require("uuid");
const { MessageEmbed } = require("discord.js");
const questions = require("../assets/jobs/jobs.json");
/// <summary>
///     JOBS COMMAND
///     Criar classificados mais organizados obedecendo um layout fixo
/// </summary>
module.exports = {
  callback: (message) => {
    // Cria Canal Com Apenas acesso ao  que mandou o comando
    message.guild.channels
      .create(uuid.v4(), {
        type: "text",
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
      .then((channel) => {
        let counter = 0;
        // Array de respostas
        const answers = [];
        // Mensagem Inicial Canal Privado
        channel.send(`${message.user.toString()}, Por favor responda as perguntas abaixo para criar um novo anúncio.`);

        // Inicializar Colector de Respostas
        const collector = channel.createMessageCollector({
          time: 1000 * 300, // 5m await
        });
        // Enviar Questões
        channel.send(questions[counter]);
        collector.on("collect", (m) => {
          if (m.author.id === message.user.id) {
            // Armazenar as respostas em uma array
            answers.push(m.content);
            // eslint-disable-next-line no-plusplus
            counter++;
            // Caso o utilizador tenha respondido todas as perguntas, parar de recolher informação
            if (counter === questions.length) {
              collector.stop();
              return;
            }
            m.channel.send(questions[counter]);
          }
        });
        // Gerar Embed com a informação do pedido
        collector.on("end", (collected) => {
          // Caso o user não tenha finalizado o pedido este será cancelado
          if (collected.size <= questions.length) {
            channel.delete();
            return;
          }
          // Embed Info with questions and answers
          const jobEmbed = new MessageEmbed()
            .setColor(0x0099ff)
            .setTitle(answers[0])
            .setAuthor({
              name: `${message.user.username}#${message.user.discriminator}`,
              iconURL: message.user.displayAvatarURL(),
            })
            .setDescription(answers[7])
            .addFields(
              { name: questions[1], value: answers[1] },
              { name: questions[2], value: answers[2] },
              { name: questions[3], value: answers[3] },
              { name: questions[4], value: answers[4] },
              { name: questions[5], value: answers[5] },
              { name: questions[6], value: answers[6] },
              { name: "Contacte", value: `<@${message.user.id}>`, inline: true }
            )
            .setTimestamp(new Date().toISOString())
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });
          // Gerar Thread para seguimento da proposta
          message.channel
            .send({ embeds: [jobEmbed] })
            .then((m) => {
              m.react("👍");
              m.react("👎");
              m.startThread({
                name: `${m.author.username}#${m.author.discriminator}`,
                autoArchiveDuration: 60,
                type: "GUILD_PUBLIC_THREAD",
              });
            })
            .then(() => {
              // Delete do channel temporário
              channel.delete();
              console.log("JOBS COMMAND - Finished");
            });
        });
      });
  },
};
