import { InteractionInterface } from "@/domain/model/interaction.interface";
import LoggerService from "@/domain/service/loggerService";
import { CustomMessage } from "../../domain/interface/customMessage.interface";
import ChatService from "../../domain/service/chatService";

export default class ConfirmRemoveRoleDropdownUseCase {
  private chatService: ChatService;
  private loggerService: LoggerService;

  constructor({ chatService, loggerService }: { chatService: ChatService; loggerService: LoggerService }) {
    this.chatService = chatService;
    this.loggerService = loggerService;
  }

  async execute(interaction: InteractionInterface) {
    const guildId = interaction.getGuildId();

    if (!guildId) return;

    const roleId = interaction.getCustomId().replaceAll("confirm-remove:", "");

    try {
      this.chatService.removeUserRole(guildId, interaction.getUserId(), roleId);

      this.chatService.sendInteractionUpdate(interaction, ConfirmRemoveRoleDropdownUseCase.removedRoleMessage());
    } catch (error) {
      this.loggerService.log(error);
    }
  }

  public static removedRoleMessage(): CustomMessage {
    return { content: "Posição removida", components: [] };
  }
}
