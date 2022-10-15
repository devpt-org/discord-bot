import { GuildMember, Message, Client, Intents } from "discord.js";
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
import ReactionRoles from "./application/usecases/reactionRoles/reactionRoles";
import LANGUAGE_ROLES_MAP from "./application/usecases/reactionRoles/consts/languageRolesMap";
import AREA_ROLES_MAP from "./application/usecases/reactionRoles/consts/areaRolesMap";
import EXTRA_AREA_ROLES_MAP from "./application/usecases/reactionRoles/consts/extraAreaRolesMap";

dotenv.config();

const {
  DISCORD_TOKEN,
  CHANNEL_ROLE_MESSAGE_ID = "888554491396386816",
  AREA_ROLE_MESSAGE_ID = "888783297260437525",
  EXTRA_AREA_ROLE_MESSAGE_ID = "915019654181826580",
  LANGUAGE_ROLE_MESSAGE_ID = "1029463702988128376",
} = process.env;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const messageRepository: MessageRepository = new FileMessageRepository();
const chatService: ChatService = new DiscordChatService(client);
const loggerService: LoggerService = new ConsoleLoggerService();
const channelResolver: ChannelResolver = new ChannelResolver();
const useCaseResolver = new CommandUseCaseResolver({
  messageRepository,
  chatService,
  loggerService,
  channelResolver,
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
    });
  } catch (error: unknown) {
    loggerService.log(error);
  }
});

client.once("ready", async () => {
  try {
    // Channel of messages id
    const channelId = CHANNEL_ROLE_MESSAGE_ID;
    const reactionRoles = new ReactionRoles({ client, channelId });

    // Language roles message id
    const languageMessageId = LANGUAGE_ROLE_MESSAGE_ID;
    reactionRoles.execute({ messageId: languageMessageId, rolesMap: LANGUAGE_ROLES_MAP });

    // Area roles message id
    const areaMessageId = AREA_ROLE_MESSAGE_ID;
    reactionRoles.execute({ messageId: areaMessageId, rolesMap: AREA_ROLES_MAP });

    // Extra area roles message id
    const extraAreaMessageId = EXTRA_AREA_ROLE_MESSAGE_ID;
    reactionRoles.execute({ messageId: extraAreaMessageId, rolesMap: EXTRA_AREA_ROLES_MAP });
  } catch (error) {
    loggerService.log(error);
  }
});
