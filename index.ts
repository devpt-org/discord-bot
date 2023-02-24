import { GuildMember, Message, Client, Intents, MessageEmbed } from "discord.js";
import * as dotenv from "dotenv";
import { ChannelSlug } from "./types";
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
import DirectMessage from "./application/usecases/readDirectMessage";

dotenv.config();

const { DISCORD_TOKEN } = process.env;

const client = new Client({
  partials: ["CHANNEL"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
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

client.on("message", async (message) => {
  const directMessage = new DirectMessage(message, client, channelResolver, chatService);

  if (await directMessage.isValid()) {
    directMessage.messageApprove();
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const {
    message: {
      id: messageId,
      embeds: [{ description: messageContent }],
    },
    channelId,
  } = interaction;

  const userName = interaction.member?.user.username;
  if (!messageContent) return;
  const messageApprovedEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Pergunta Anónima")
    .setDescription(messageContent)
    .setFooter({ text: `Aprovado por ${userName}` });

  switch (interaction.customId.slice(0, 3)) {
    case "apr":
      {
        const sentence = `PERGUNTA ANÓNIMA:\n${messageContent}`;
        chatService.sendMessageToChannel(sentence, channelResolver.getBySlug(ChannelSlug.QUESTION));
        interaction.update({ components: [], embeds: [messageApprovedEmbed] });
        chatService.sendDirectMessageToUser(interaction.customId.slice(3), "A tua mensagem foi aprovada.");
      }
      break;

    case "rej":
      chatService.deleteMessageFromChannel(messageId, channelId);
      chatService.sendDirectMessageToUser(
        interaction.customId.slice(3),
        "A tua mensagem não foi aprovada.\nVerifica se está de acordo com as regras."
      );
      break;
  }
});
