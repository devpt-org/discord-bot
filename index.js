require('dotenv').config()
const { Client, Intents } = require('discord.js');
const fs = require("fs");

const { DISCORD_TOKEN } = process.env

const JustAsk = require("../commands/JustAsk")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

const DESTINATION_CHANNEL_ID = '730385705070755982' // #geral
// const DESTINATION_CHANNEL_ID = '807190194268012554' // #comandos-testes

client.once('ready', async () => {
	console.log('Ready!');
});

client.login(DISCORD_TOKEN);

client.on('guildMemberAdd', async function (member) {
	console.log('Member joined the server!');
    const message = await welcome(member.id)
    member.guild.channels.cache.get(DESTINATION_CHANNEL_ID).send(message)
});

client.on("messageCreate", (msg) => {
    JustAsk.execute(msg)
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
