import { ButtonInteraction, CacheType } from "discord.js";

export default class ButtonInteractionUseCase {
  async execute(interaction: ButtonInteraction<CacheType>) {
    if (!interaction.guild) return;

    const roleId = interaction.customId.replaceAll("confirm-remove:", "");

    const member = await interaction.guild.members.fetch(interaction.user.id);

    await member.roles.remove(roleId);

    interaction.update({ content: "Posição removida", components: [] });
  }
}
