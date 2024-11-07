import { Command, Context } from "../../types";
import UseCaseNotFound from "../exception/useCaseNotFound";
import LoggerService from "./loggerService";

export default class CommandUseCaseResolver {
  private commands: Command[];

  private loggerService: LoggerService;

  constructor({ commands, loggerService }: { commands: Command[]; loggerService: LoggerService }) {
    this.loggerService = loggerService;

    this.commands = commands;
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
