import { Client } from "discord.js";

function sendMessage(client: Client, userId: string, message: string): boolean {
  client.users
    .fetch(userId)
    .then(async (user) => {
      const exists = await user.send(message);
      const res = !!exists;
      return res;
    })
    .catch((e) => {
      console.log(e);
      return false;
    });
  return false;
}

export default sendMessage;
