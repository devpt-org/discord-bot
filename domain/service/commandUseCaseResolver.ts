import CodewarsLeaderboardCommand from "../../application/command/codewarsLeaderboardCommand";
import DontAskToAskCommand from "../../application/command/dontAskToAskCommand";
import OnlyCodeQuestionsCommand from "../../application/command/onlyCodeQuestionsCommand";
import { Command, Context } from "../../types";
import UseCaseNotFound from "../exception/useCaseNotFound";
import ChatService from "./chatService";
import KataService from "./kataService/kataService";
import LoggerService from "./loggerService";

export default class CommandUseCaseResolver {
  private commands: Command[] = [];

  private loggerService: LoggerService;

  constructor({
    chatService,
    kataService,
    loggerService,
  }: {
    chatService: ChatService;
    kataService: KataService;
    loggerService: LoggerService;
  }) {
    this.loggerService = loggerService;

    this.commands.push(
      new CodewarsLeaderboardCommand(chatService, kataService),
      new DontAskToAskCommand(chatService),
      new OnlyCodeQuestionsCommand(chatService)
    );
  }

  async resolveByCommand(command: string, context: Context): Promise<void> {
    this.loggerService.log(`Command received: "${command}"`);

    const commandInstance = this.commands.find((cmd) => cmd.name === command);

    if (!commandInstance) {
      throw new UseCaseNotFound().byCommand(command);
    }

    await commandInstance.execute(context);
  }
}
