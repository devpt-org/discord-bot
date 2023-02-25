import { ActionRowBuilder, Client, Events, GatewayIntentBits, GuildMember, Message, Partials } from "discord.js";
import * as dotenv from "dotenv";
import SendWelcomeMessageUseCase from "./application/usecases/sendWelcomeMessageUseCase";
import { DiscordButtonActionRowBuilder } from "./domain/builder/discord-button-action-row.builder";
import { ActionRowBuilderInterface } from "./domain/builder/action-row.builder.interface";
import MessageRepository from "./domain/repository/messageRepository";
import ChannelResolver from "./domain/service/channelResolver";
import ChatService from "./domain/service/chatService";
import CommandUseCaseResolver from "./domain/service/commandUseCaseResolver";
import InterationCreateUseCaseResolver from "./domain/service/interactionCreateUseCaseResolver";
import KataService from "./domain/service/kataService/kataService";
import LoggerService from "./domain/service/loggerService";
import FileMessageRepository from "./infrastructure/repository/fileMessageRepository";
import CodewarsKataService from "./infrastructure/service/codewarsKataService";
import ConsoleLoggerService from "./infrastructure/service/consoleLoggerService";
import DiscordChatService from "./infrastructure/service/discordChatService";
import { DiscordStringSelectMenuActionRowBuilder } from "./domain/builder/discord-string-select-menu-action-row.builder";
import { DiscordInteraction } from "./domain/model/discord-interaction";
import { InteractionInterface } from "./domain/model/interaction.interface";

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

const actionSelectStringMenuRowBuilder: ActionRowBuilderInterface<ActionRowBuilder> =
  new DiscordStringSelectMenuActionRowBuilder();
const useCaseResolver = new CommandUseCaseResolver<ActionRowBuilder>({
  messageRepository,
  chatService,
  loggerService,
  channelResolver,
  kataService,
  actionRowBuilder: actionSelectStringMenuRowBuilder,
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
      guildId: messages.guildId,
      member: messages.member,
    });
  } catch (error: unknown) {
    loggerService.log(error);
  }
});

const actionButtonRowBuilder: ActionRowBuilderInterface<ActionRowBuilder> = new DiscordButtonActionRowBuilder();
client.on(Events.InteractionCreate, async (i) => {
  const interaction: InteractionInterface = new DiscordInteraction(i);

  await new InterationCreateUseCaseResolver<ActionRowBuilder>({
    chatService,
    loggerService,
    actionRowBuilder: actionButtonRowBuilder,
  }).resolve(interaction);
});
