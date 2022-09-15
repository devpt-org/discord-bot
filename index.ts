import { GuildMember, Message, Client, Intents, TextChannel } from "discord.js";
import introPhrases from "./assets/phrases/intro.json";
import welcomingPhrases from "./assets/phrases/welcoming.json";
import "dotenv/config.js";

interface Phrases {
  intro: Array<string>;
  welcoming: Array<string>;
}

// #geral
const DESTINATION_CHANNEL_ID = "1019589159020675135";
// #comandos-testes
// const DESTINATION_CHANNEL_ID = '807190194268012554';

const config = { phrases: {} as Phrases };
config.phrases.intro = introPhrases;
config.phrases.welcoming = welcomingPhrases;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});
client.once("ready", async () => {
  console.log("Ready!");
});
client.login(process.env.DISCORD_TOKEN);

const getRandomStringFromCollection = (collection: Array<string>) =>
  collection[Math.floor(Math.random() * collection.length)].trim();

const replacePlaceholders = (phrases: string, memberID: string) => {
  const memberIdTag = `<@${memberID}>`;
  return phrases.replace("{MEMBER_ID}", memberIdTag);
};

const welcome = (memberID: string) => {
  const introPhrase = getRandomStringFromCollection(config.phrases.intro).trim();
  const welcomingPhrase = getRandomStringFromCollection(config.phrases.welcoming).trim();
  const finalPhrase = replacePlaceholders(`${introPhrase}${welcomingPhrase}`, memberID);
  console.log(`[NEW JOIN] ${finalPhrase}`);
  return finalPhrase;
};

client.on("guildMemberAdd", async (member: GuildMember) => {
  const message = await welcome(member.id);
  const textChannelData = member.guild.channels.cache.get(DESTINATION_CHANNEL_ID);

  console.log("Member joined the server!");
  if (!textChannelData)
    return console.log("There was an error finding the text channel data, cannot send welcome message.");

  (textChannelData as TextChannel).send(message);
});

client.on("messageCreate", (messages: Message) => {
  switch (messages.content) {
    case "!ja":
      messages.channel.send(":point_right: https://dontasktoask.com/pt-pt/");
      break;
    case "!oc":
      messages.channel.send(":warning: Este servidor é APENAS para questões relacionadas com programação! :warning:");
      break;

    // no default
  }
});
