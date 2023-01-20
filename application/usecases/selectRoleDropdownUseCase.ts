import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, StringSelectMenuInteraction } from "discord.js";
import AREA_ROLES_MAP from "../../assets/consts/areaRolesMap";
import EXTRA_AREA_ROLES_MAP from "../../assets/consts/extraAreaRolesMap";
import LANGUAGE_ROLES_MAP from "../../assets/consts/languageRolesMap";
import { CustomMessage } from "../../domain/interface/customMessage.interface";
import ChatService from "../../domain/service/chatService";

export default class SelectRoleDropdownUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute(interaction: StringSelectMenuInteraction<CacheType>) {
    if (!interaction.guildId) return;

    const selected = interaction.values[0];

    const allowedRoles = { ...AREA_ROLES_MAP, ...LANGUAGE_ROLES_MAP, ...EXTRA_AREA_ROLES_MAP };
    const selectedRoleMap = allowedRoles ? allowedRoles[selected] : undefined;

    if (!selectedRoleMap) return;

    selectedRoleMap.id = await this.chatService.getRoleIdByName(interaction.guildId, selectedRoleMap.name);

    if (!selectedRoleMap.id) return;

    const hasRole = await this.chatService.isUserWithRoleName(interaction.guildId, interaction.user.id, [
      selectedRoleMap.name,
    ]);

    if (hasRole) {
      this.chatService.sendInteractionReply(
        interaction,
        SelectRoleDropdownUseCase.confirmRemoveRoleMessage(selectedRoleMap.id, selectedRoleMap.name)
      );
    } else {
      await this.chatService.addUserRole(interaction.guildId, interaction.user.id, selectedRoleMap.id);

      this.chatService.sendInteractionReply(
        interaction,
        SelectRoleDropdownUseCase.addedRoleMessage(selectedRoleMap.name)
      );
    }
  }

  public static addedRoleMessage(roleName: string): CustomMessage {
    return {
      content: `Agora tens a posição: ${roleName} ✅`,
      ephemeral: true,
    };
  }

  public static confirmRemoveRoleMessage(roleId: string, roleName: string): CustomMessage {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`confirm-remove:${roleId}`).setLabel("Remover").setStyle(ButtonStyle.Danger)
    );

    return {
      content: `Só para confirmar, deseja remover a posição: ${roleName}?`,
      ephemeral: true,
      components: [row],
    };
  }
}
