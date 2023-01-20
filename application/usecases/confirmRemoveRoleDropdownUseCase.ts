import { ButtonInteraction, CacheType } from "discord.js";
import { CustomMessage } from "../../domain/interface/customMessage.interface";
import ChatService from "../../domain/service/chatService";

export default class ConfirmRemoveRoleDropdownUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute(interaction: ButtonInteraction<CacheType>) {
    if (!interaction.guildId) return;

    const roleId = interaction.customId.replaceAll("confirm-remove:", "");

    this.chatService.removeUserRole(interaction.guildId, interaction.user.id, roleId);

    this.chatService.sendInteractionUpdate(interaction, ConfirmRemoveRoleDropdownUseCase.removedRoleMessage());
  }

  public static removedRoleMessage(): CustomMessage {
    return { content: "Posição removida", components: [] };
  }
}
