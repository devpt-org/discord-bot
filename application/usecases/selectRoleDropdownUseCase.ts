import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, StringSelectMenuInteraction } from "discord.js";
import { CostumMessage } from "../../domain/interface/message.interface";
import ChatService from "../../domain/service/chatService";
import AREA_ROLES_MAP from "../../assets/consts/areaRolesMap";
import EXTRA_AREA_ROLES_MAP from "../../assets/consts/extraAreaRolesMap";
import LANGUAGE_ROLES_MAP from "../../assets/consts/languageRolesMap";

export default class SelectRoleDropdownUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute(interaction: StringSelectMenuInteraction<CacheType>) {
    if (!interaction.guild) return;

    const selected = interaction.values[0];

    const allowedRoles = { ...AREA_ROLES_MAP, ...LANGUAGE_ROLES_MAP, ...EXTRA_AREA_ROLES_MAP };
    const selectedRoleMap = allowedRoles ? allowedRoles[selected] : undefined;

    if (!selectedRoleMap) return;

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const roles = await interaction.guild.roles.fetch();
    const role = await roles.find((_role) => _role.name === selectedRoleMap.name);

    if (!role) return;

    const hasRole = member.roles.cache.some((_role) => _role.name === role.name);

    if (hasRole) {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`confirm-remove:${role.id}`).setLabel("Remover").setStyle(ButtonStyle.Danger)
      );

      const message: CostumMessage = {
        content: `Só para confirmar, deseja remover a posição: ${role.name}?`,
        ephemeral: true,
        components: [row],
      };

      this.chatService.sendInteractionReply(interaction, message);
    } else {
      await this.chatService.addMemberRole(interaction.guild.id, interaction.user.id, role.id);

      const message: CostumMessage = {
        content: `Agora tens a posição: ${role.name} ✅`,
        ephemeral: true,
      };

      this.chatService.sendInteractionReply(interaction, message);
    }
  }
}
