import { CacheType, Interaction } from "discord.js";
import ChatService from "./chatService";
import ConfirmRemoveRoleDropdownUseCase from "../../application/usecases/confirmRemoveRoleDropdownUseCase";
import SelectRoleDropdownUseCase from "../../application/usecases/selectRoleDropdownUseCase";

export default class InterationCreateUseCaseResolver {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async resolve(interaction: Interaction<CacheType>) {
    if (interaction.isButton() && interaction.customId.startsWith("confirm-remove:")) {
      await new ConfirmRemoveRoleDropdownUseCase({ chatService: this.chatService }).execute(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await new SelectRoleDropdownUseCase({ chatService: this.chatService }).execute(interaction);
    }
  }
}
