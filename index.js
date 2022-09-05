require("dotenv").config();
const { Client, Intents } = require("discord.js");

const config = { phrases: {} };
config.phrases.intro = require("./assets/phrases/intro.json");
config.phrases.welcoming = require("./assets/phrases/welcoming.json");

const DropdownRoles = require("./commands/DropdownRoles")
const ReactionRoles = require("./listeners/ReactionRoles")

const prefix = "!"

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS','GUILD_MEMBERS'] });

const { DISCORD_TOKEN } = process.env;

// #geral
const DESTINATION_CHANNEL_ID = "855861944930402344";
// #comandos-testes
// const DESTINATION_CHANNEL_ID = '807190194268012554';

client.once("ready", async () => {
  console.log("Ready!");
});

client.login(DISCORD_TOKEN);

const getRandomStringFromCollection = (collection) => collection[Math.floor(Math.random() * collection.length)].trim();

const replacePlaceholders = (phrases, memberID) => {
  const memberIdTag = `<@${memberID}>`;
  return phrases.replace("{MEMBER_ID}", memberIdTag);
};

const welcome = async (memberID) => {
  const introPhrase = getRandomStringFromCollection(config.phrases.intro).trim();
  const welcomingPhrase = getRandomStringFromCollection(config.phrases.welcoming).trim();
  const finalPhrase = replacePlaceholders(`${introPhrase}${welcomingPhrase}`, memberID);
  console.log(`[NEW JOIN] ${finalPhrase}`);
  return finalPhrase;
};

client.on("guildMemberAdd", async (member) => {
  console.log("Member joined the server!");
  const message = await welcome(member.id);
  member.guild.channels.cache.get(DESTINATION_CHANNEL_ID).send(message);
});

client.on("messageCreate", (message) => {    
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (command == "dropdown") {
            DropdownRoles.execute(message, client)
        }
    }
})

client.on('interactionCreate', (interaction) => {
    ReactionRoles.execute(interaction)
})

const welcome = async function (memberID) {
    const introPhrases = fetchFormattedPhrases(`./assets/sentences/intro.txt`);
    const introPhrase = getRandomStringFromCollection(introPhrases).trim();
    
    const welcomingPhrases = fetchFormattedPhrases(`./assets/sentences/welcoming.txt`);
    const welcomingPhrase = getRandomStringFromCollection(welcomingPhrases).trim();
    
    const finalPhrase = replacePlaceholders(`${introPhrase}${welcomingPhrase}`, memberID);

    console.log(`[NEW JOIN] ${finalPhrase}`);

    return finalPhrase;
}

const getRandomStringFromCollection = function (collection) {
    return collection[Math.floor(Math.random() * collection.length)].trim()
}

const fetchFormattedPhrases = function (filename) {
    let phrases = fs.readFileSync(filename, "utf8");
    return phrases.split(/\r?\n/)
	    .filter(el => el) // remove empty lines (because an empty string is a falsy value)
	    .map(item => item.replace(/^\s+|\s+$/g, '')); // replace multiple white-spaces by one white-space
}

const replacePlaceholders = function (phrases, memberID) {
    const memberIdTag = `<@${memberID}>`
    return phrases
        .replace('{MEMBER_ID}', memberIdTag) // replace dynamic user id placeholder by member id
}
