require('dotenv').config();
const { Client, Intents } = require('discord.js');
const config = { phrases:{ } };
config.phrases.intro = require('./assets/phrases/intro.json');
config.phrases.welcoming = require('./assets/phrases/welcoming.json');
config.phrases.ja = require('./assets/phrases/ja.json');

const { DISCORD_TOKEN } = process.env;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });

// #geral
 //const DESTINATION_CHANNEL_ID = '730385705070755982';
// #comandos-testes
 const DESTINATION_CHANNEL_ID = '987719981443723266';

client.once('ready', async () => {
	console.log('Ready!');
});

client.login(DISCORD_TOKEN);

client.on('guildMemberAdd', async function(member) {
	console.log('Member joined the server!');
	const message = await welcome(member.id);
	member.guild.channels.cache.get(DESTINATION_CHANNEL_ID).send(message);
});

const welcome = async function(memberID) {
	const introPhrase = getRandomStringFromCollection(config.phrases.intro).trim();
	const welcomingPhrase = getRandomStringFromCollection(config.phrases.welcoming).trim();
	const finalPhrase = replacePlaceholders(`${introPhrase}${welcomingPhrase}`, memberID);
	console.log(`[NEW JOIN] ${finalPhrase}`);
	return finalPhrase;
};

const getRandomStringFromCollection = function(collection) {
	return collection[Math.floor(Math.random() * collection.length)].trim();
};

const replacePlaceholders = function(phrases, memberID) {
	const memberIdTag = `<@${memberID}>`;
	return phrases
		.replace('{MEMBER_ID}', memberIdTag);
};

client.on('messageCreate',function (messages) {
	const ja = String(config.phrases.ja);
    if(messages.content==='!ja') 
    messages.channel.send(ja); 
})