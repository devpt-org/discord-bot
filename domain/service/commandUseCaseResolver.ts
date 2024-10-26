import { promises as fs } from "fs";
import path from "path";
import { Context } from "../../types";
import UseCaseNotFound from "../exception/useCaseNotFound";
import SendMessageToChannelUseCase from "../../application/usecases/sendMessageToChannel/sendMessageToChannelUseCase";
import MessageRepository from "../repository/messageRepository";
import ChatService from "./chatService";
import LoggerService from "./loggerService";
import ChannelResolver from "./channelResolver";
import KataService from "./kataService/kataService";
import SendCodewarsLeaderboardToChannelUseCase from "../../application/usecases/sendCodewarsLeaderboardToChannel/sendCodewarsLeaderboardToChannelUseCase";

export default class CommandUseCaseResolver {
  private messageRepository: MessageRepository;

  private chatService: ChatService;

  private loggerService: LoggerService;

  private channelResolver: ChannelResolver;

  private kataService: KataService;

  private commandMessages: Record<string, string> = {};

  constructor({
    messageRepository,
    chatService,
    loggerService,
    channelResolver,
    kataService,
  }: {
    messageRepository: MessageRepository;
    chatService: ChatService;
    loggerService: LoggerService;
    channelResolver: ChannelResolver;
    kataService: KataService;
  }) {
    this.messageRepository = messageRepository;
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.channelResolver = channelResolver;
    this.kataService = kataService;
  }

  private async loadCommands(): Promise<void> {
    const filePath = path.join(__dirname, "commands.json");
    const data = await fs.readFile(filePath, "utf-8");
    this.commandMessages = JSON.parse(data);
  }

  async resolveByCommand(command: string, context: Context): Promise<void> {
    this.loggerService.log(`Command received: "${command}"`);

    const deps = {
      messageRepository: this.messageRepository,
      chatService: this.chatService,
      loggerService: this.loggerService,
      channelResolver: this.channelResolver,
      kataService: this.kataService,
    };

    if (Object.keys(this.commandMessages).length === 0) {
      await this.loadCommands();
    }

    if (this.commandMessages[command]) {
      new SendMessageToChannelUseCase(deps).execute({
        channelId: context.channelId,
        message: this.commandMessages[command],
      });
      return;
    }

    if (command === "!cwl") {
      new SendCodewarsLeaderboardToChannelUseCase(deps).execute({
        channelId: context.channelId,
      });
      return;
    }

    throw new UseCaseNotFound().byCommand(command);
  }
}
