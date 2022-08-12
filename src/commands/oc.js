module.exports = {
  name: "oc",
  description: "Aviso de objetivo do servidor",
  run(message) {
    if (message.content === "!oc") {
      message.channel.send(
        ":warning: Este servidor é **APENAS** para questões relacionadas com programação! :warning:"
      );
    }
  },
};
