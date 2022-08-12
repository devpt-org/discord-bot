module.exports = {
  name: "ja",
  description: "Não perguntes para perguntar",
  run(message) {
    if (message.content === "!ja") {
      message.channel.send(":point_right:  https://dontasktoask.com/pt-pt/");
    }
  },
};
