import { Client, Events, GatewayIntentBits, GuildMember, Message, Partials } from "discord.js";
import * as dotenv from "dotenv";
import { CronJob } from "cron";
import SendWelcomeMessageUseCase from "./application/usecases/sendWelcomeMessageUseCase";
import FileMessageRepository from "./infrastructure/repository/fileMessageRepository";
import ChatService from "./domain/service/chatService";
import DiscordChatService from "./infrastructure/service/discordChatService";
import ConsoleLoggerService from "./infrastructure/service/consoleLoggerService";
import MessageRepository from "./domain/repository/messageRepository";
import LoggerService from "./domain/service/loggerService";
import CommandUseCaseResolver from "./domain/service/commandUseCaseResolver";
import ChannelResolver from "./domain/service/channelResolver";
import InteractionResolver from "./domain/service/interactionResolver";
import KataService from "./domain/service/kataService/kataService";
import CodewarsKataService from "./infrastructure/service/codewarsKataService";
import ContentAggregatorService from "./domain/service/contentAggregatorService/contentAggregatorService";
import LemmyContentAggregatorService from "./infrastructure/service/lemmyContentAggregatorService";
import QuestionTrackingService from "./domain/service/questionTrackingService";
import CodewarsLeaderboardCommand from "./application/command/codewarsLeaderboardCommand";
import DontAskToAskCommand from "./application/command/dontAskToAskCommand";
import OnlyCodeQuestionsCommand from "./application/command/onlyCodeQuestionsCommand";
import AnonymousQuestionCommand from "./application/command/anonymousQuestionCommand";
import { Command } from "./types";

dotenv.config();

const { DISCORD_TOKEN } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const messageRepository: MessageRepository = new FileMessageRepository();
const chatService: ChatService = new DiscordChatService(client);
const loggerService: LoggerService = new ConsoleLoggerService();
const channelResolver: ChannelResolver = new ChannelResolver();
const questionTrackingService: QuestionTrackingService = new QuestionTrackingService();
const kataService: KataService = new CodewarsKataService();
const lemmyContentAggregatorService: ContentAggregatorService = new LemmyContentAggregatorService();
const commands: Command[] = [
  new CodewarsLeaderboardCommand(chatService, kataService),
  new DontAskToAskCommand(chatService),
  new OnlyCodeQuestionsCommand(chatService),
  new AnonymousQuestionCommand(chatService, loggerService, channelResolver, questionTrackingService),
];
const useCaseResolver = new CommandUseCaseResolver({
  commands,
  loggerService,
});

const interactionResolver = new InteractionResolver({
  chatService,
  loggerService,
  channelResolver,
  questionTrackingService,
});

const checkForNewPosts = async () => {
  loggerService.log("Checking for new posts on content aggregator...");

  const FEED_CHANNEL_ID = "829694016156205056";
  const lastPosts = await lemmyContentAggregatorService.fetchLastPosts();

  const now = new Date();

  const last5MinutesPosts = lastPosts.filter((post) => {
    const diff = Math.abs(now.getTime() - post.getCreatedAt().getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes <= 5;
  });

  const avoidEmbedInLink = (str: string): string => {
    // convert links to avoid embed (by wrapping them in <>)
    const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    return str.replace(regex, "[$1](<$2>)");
  };

  last5MinutesPosts.forEach((post) => {
    const title = avoidEmbedInLink(post.getTitle());

    const message = `Novo post no Lemmy: **${title}** (*${post?.getAuthorName()}*)

👉 Ver em: ${post?.getLink()}
`;

    chatService.sendMessageToChannel(message, FEED_CHANNEL_ID);
  });

  loggerService.log(`Published ${last5MinutesPosts.length} new posts!`);
};

const setupCron = () => {
  /* eslint-disable no-new */
  new CronJob(
    // run every 5 minutes
    "0 */5 * * * *",
    checkForNewPosts,
    null,
    true,
    "UTC"
  );
};

client.once(Events.ClientReady, () => {
  loggerService.log("Ready!");
  setupCron();
});

client.login(DISCORD_TOKEN);

client.on(Events.GuildMemberAdd, (member: GuildMember) =>
  new SendWelcomeMessageUseCase({
    messageRepository,
    chatService,
    loggerService,
    channelResolver,
  }).execute(member)
);

client.on(Events.MessageCreate, async (message: Message) => {
  const COMMAND_PREFIX = "!";

  if (!message.content.startsWith(COMMAND_PREFIX)) return;

  const command = message.content.split(" ")[0];

  try {
    await useCaseResolver.resolveByCommand(command, {
      channelId: message.channel.id,
      message,
    });
  } catch (error: unknown) {
    loggerService.log(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    await interactionResolver.resolveButtonInteraction(interaction);
  }
});
