import ConfirmRemoveRoleDropdownUseCase from "../../application/usecases/confirmRemoveRoleDropdownUseCase";
import SelectRoleDropdownUseCase from "../../application/usecases/selectRoleDropdownUseCase";
import { ActionRowBuilderInterface, InteractionInterface } from "../interface";
import ChatService from "./chatService";
import LoggerService from "./loggerService";

export default class InterationCreateUseCaseResolver<A> {
  private chatService: ChatService;

  private loggerService: LoggerService;

  private actionRowBuilder: ActionRowBuilderInterface<A>;

  constructor({
    chatService,
    loggerService,
    actionRowBuilder,
  }: {
    chatService: ChatService;
    loggerService: LoggerService;
    actionRowBuilder: ActionRowBuilderInterface<A>;
  }) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.actionRowBuilder = actionRowBuilder;
  }

  async resolve(interaction: InteractionInterface) {
    if (interaction.isButton() && interaction.getCustomId().startsWith("confirm-remove:")) {
      await new ConfirmRemoveRoleDropdownUseCase({
        chatService: this.chatService,
        loggerService: this.loggerService,
      }).execute(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await new SelectRoleDropdownUseCase<A>({
        chatService: this.chatService,
        loggerService: this.loggerService,
        actionRowBuilder: this.actionRowBuilder,
      }).execute(interaction);
    }
  }
}
