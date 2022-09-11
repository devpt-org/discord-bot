import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
import MessageRepository from "./repository/messageRepository";
import DiscordService from "./services/discordService";
import SendWelcomeMessageUseCase from "./usecases/sendWelcomeMessageUseCase";
import LoggerService from "./services/loggerService";

const { DISCORD_TOKEN } = process.env;

dotenv.config();

const messageRepository = new MessageRepository();
const discordService = new DiscordService();
const loggerService = new LoggerService();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

client.once("ready", () => loggerService.log("Ready!"));

client.login(DISCORD_TOKEN);

client.on("guildMemberAdd", (member) =>
  new SendWelcomeMessageUseCase({
    messageRepository,
    discordService,
    loggerService,
  }).execute(member)
);
