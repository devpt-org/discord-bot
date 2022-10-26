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
import LANGUAGE_ROLES_MAP from "./application/usecases/reactionRoles/consts/languageRolesMap";
import AREA_ROLES_MAP from "./application/usecases/reactionRoles/consts/areaRolesMap";
import EXTRA_AREA_ROLES_MAP from "./application/usecases/reactionRoles/consts/extraAreaRolesMap";
import OldReactionsRolesUseCase from "./application/usecases/reactionRoles/oldReactionsRolesUseCase";
import ReactionRolesUseCase from "./application/usecases/reactionRoles/reactionRolesUseCase";
import { RoleInterfaceMap } from "./application/usecases/reactionRoles/interfaces/roleInterface";
import KataService from "./domain/service/kataService/kataService";
import CodewarsKataService from "./infrastructure/service/codewarsKataService";

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
  partials: ["MESSAGE", "REACTION"],
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
    });
  } catch (error: unknown) {
    loggerService.log(error);
  }
});

const messageRoles: {
  messageId: string;
  rolesMap: RoleInterfaceMap;
}[] = [
  {
    messageId: LANGUAGE_ROLE_MESSAGE_ID,
    rolesMap: LANGUAGE_ROLES_MAP,
  },
  {
    messageId: AREA_ROLE_MESSAGE_ID,
    rolesMap: AREA_ROLES_MAP,
  },
  {
    messageId: EXTRA_AREA_ROLE_MESSAGE_ID,
    rolesMap: EXTRA_AREA_ROLES_MAP,
  },
];

client.once("ready", async () => {
  try {
    // Channel of messages id
    const channelId = CHANNEL_ROLE_MESSAGE_ID;

    messageRoles.forEach(async (messageRole) => {
      const { messageId } = messageRole;

      new OldReactionsRolesUseCase({
        chatService,
        loggerService,
        roles: messageRole.rolesMap,
      }).execute({
        channelId,
        messageId,
      });
    });
  } catch (error) {
    loggerService.log(error);
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const findedMessageRole = messageRoles.find((messageRole) => messageRole.messageId === reaction.message.id);

  if (findedMessageRole) {
    new ReactionRolesUseCase({
      chatService,
      loggerService,
      roles: findedMessageRole.rolesMap,
    }).execute({
      reaction,
      user,
      type: "add",
    });
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const findedMessageRole = messageRoles.find((messageRole) => messageRole.messageId === reaction.message.id);

  if (findedMessageRole) {
    new ReactionRolesUseCase({
      chatService,
      loggerService,
      roles: findedMessageRole.rolesMap,
    }).execute({
      reaction,
      user,
      type: "remove",
    });
  }
});
