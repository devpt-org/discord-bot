import { GuildMember, Message, Client, GatewayIntentBits, Partials, Events } from "discord.js";
import * as dotenv from "dotenv";
import SendWelcomeMessageUseCase from "./application/usecases/sendWelcomeMessageUseCase";
import FileMessageRepository from "./infrastructure/repository/fileMessageRepository";
import ChatService from "./domain/service/chatService";
import DiscordChatService from "./infrastructure/service/discordChatService";
import ConsoleLoggerService from "./infrastructure/service/consoleLoggerService";
import MessageRepository from "./domain/repository/messageRepository";
import LoggerService from "./domain/service/loggerService";
import CommandUseCaseResolver from "./domain/service/commandUseCaseResolver";
import ChannelResolver from "./domain/service/channelResolver";
import KataService from "./domain/service/kataService/kataService";
import CodewarsKataService from "./infrastructure/service/codewarsKataService";
import InterationCreateUseCaseResolver from "./domain/service/interactionCreateUseCaseResolver";

dotenv.config();

const { DISCORD_TOKEN } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Reaction],
});

const messageRepository: MessageRepository = new FileMessageRepository();
const chatService: ChatService = new DiscordChatService(client);
const loggerService: LoggerService = new ConsoleLoggerService();
const channelResolver: ChannelResolver = new ChannelResolver();
const kataService: KataService = new CodewarsKataService();
const useCaseResolver = new CommandUseCaseResolver({
  messageRepository,
  chatService,
  loggerService,
  channelResolver,
  kataService,
});

client.once("ready", () => loggerService.log("Ready!"));

client.login(DISCORD_TOKEN);

client.on("guildMemberAdd", (member: GuildMember) =>
  new SendWelcomeMessageUseCase({
    messageRepository,
    chatService,
    loggerService,
    channelResolver,
  }).execute(member)
);

client.on("messageCreate", (messages: Message) => {
  const COMMAND_PREFIX = "!";

  if (!messages.content.startsWith(COMMAND_PREFIX)) return;

  const command = messages.content.split(" ")[0];
  try {
    useCaseResolver.resolveByCommand(command, {
      channelId: messages.channel.id,
      guild: messages.guild,
      member: messages.member,
    });
  } catch (error: unknown) {
    loggerService.log(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  await new InterationCreateUseCaseResolver({ chatService }).resolve(interaction);
});
