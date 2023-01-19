import { ButtonInteraction, CacheType } from "discord.js";
import { CostumMessage } from "../../domain/interface/message.interface";
import ChatService from "../../domain/service/chatService";

export default class ConfirmRemoveRoleDropdownUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute(interaction: ButtonInteraction<CacheType>) {
    if (!interaction.guild) return;

    const roleId = interaction.customId.replaceAll("confirm-remove:", "");

    this.chatService.removeMemberRole(interaction.guild.id, interaction.user.id, roleId);

    const message: CostumMessage = { content: "Posição removida", components: [] };
    this.chatService.sendInteractionUpdate(interaction, message);
  }
}
