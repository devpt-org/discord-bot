const uuid = require("uuid");
const questions = require("../assets/jobs/jobs.json");

module.exports = {
  callback: (message) => {
    // Cria Canal Com Apenas acesso ao  que mandou o comando
    message.guild.channels
      .create(uuid.v4(), {
        type: "text",
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
        const answers = [];
        // Mensagem Inicial Canal Privado
        channel.send(`${message.user.toString()}, Por favor responda as perguntas abaixo para criar um novo job.`);

        // Inicializar Colector de Respostas
        const collector = channel.createMessageCollector({
          time: 1000 * 300, // 5m await
        });

        channel.send(questions[counter]);
        collector.on("collect", (m) => {
          if (m.author.id === message.user.id) {
            answers.push(m.content);
            // eslint-disable-next-line no-plusplus
            counter++;
            if (counter === questions.length) {
              collector.stop();
              return;
            }
            m.channel.send(questions[counter]);
          }
        });
        collector.on("end", (collected) => {
          if (collected.size <= questions.length) {
            channel.delete();
            return;
          }
          const exampleEmbed = {
            color: 0x0099ff,
            title: answers[0],
            author: {
              name: `${message.user.username}#${message.user.discriminator}`,
              icon_url: message.user.displayAvatarURL(),
            },
            description: answers[7],
            fields: [
              {
                name: questions[1],
                value: answers[1],
              },
              {
                name: questions[2],
                value: answers[2],
              },
              {
                name: questions[3],
                value: answers[3],
              },
              {
                name: questions[4],
                value: answers[4],
              },
              {
                name: questions[5],
                value: answers[5],
              },
              {
                name: questions[6],
                value: answers[6],
              },
              {
                name: "Contacte",
                value: `<@${message.user.id}>`,
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: message.guild.name,
              icon_url: message.guild.iconURL(),
            },
          };

          message.channel
            .send({ embeds: [exampleEmbed] })
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
              channel.delete();
            });
        });
      });
  },
};
