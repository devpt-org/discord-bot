const Discord = require("discord.js")
const config = require("../../config.json")
const JustAsk = require("../commands/JustAsk")

const client = new Discord.Client({ restTimeOffset: 0, intents: ['GUILDS', 'GUILD_MESSAGES'], partials: ["MESSAGE", "CHANNEL"]});

client.on("error", (err) => {
    console.error(err)
});

client.on("ready", async () => {
    console.log(`√ ${client.user.username} #${client.user.discriminator} is online!`)
});

client.on("messageCreate", (msg) => {
    JustAsk.execute(msg)
})

client.login(config.token)