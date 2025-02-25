import { Command, Context } from "../../types";
import LoggerService from "./loggerService";

export default class CommandUseCaseResolver {
  private commands: Command[];

  private loggerService: LoggerService;

  constructor({ commands, loggerService }: { commands: Command[]; loggerService: LoggerService }) {
    this.loggerService = loggerService;

    this.commands = commands;
  }

  async resolveByCommand(command: string, context: Context): Promise<boolean> {
    this.loggerService.log(`Command received: "${command}"`);

    const commandInstance = this.commands.find((cmd) => cmd.name === command);

    if (!commandInstance) {
      this.loggerService.log(`Command not found: "${command}"`);
      return false;
    }

    await commandInstance.execute(context);
    return true;
  }
}
