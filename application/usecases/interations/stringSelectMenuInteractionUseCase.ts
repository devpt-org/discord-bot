import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, StringSelectMenuInteraction } from "discord.js";
import AREA_ROLES_MAP from "../roles/consts/areaRolesMap";
import EXTRA_AREA_ROLES_MAP from "../roles/consts/extraAreaRolesMap";
import LANGUAGE_ROLES_MAP from "../roles/consts/languageRolesMap";

export default class StringSelectMenuInteractionUseCase {
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

      await interaction.reply({
        content: `Só para confirmar, deseja remover a posição: ${role.name}?`,
        ephemeral: true,
        components: [row],
      });
    } else {
      await member.roles.add(role);
      await interaction.reply({ content: `Agora tens a posição: ${role.name} ✅`, ephemeral: true });
    }
  }
}
