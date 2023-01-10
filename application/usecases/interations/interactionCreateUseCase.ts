import { CacheType, Interaction } from "discord.js";
import ButtonInteractionUseCase from "./buttonInteractionUseCase";
import StringSelectMenuInteractionUseCase from "./stringSelectMenuInteractionUseCase";

export default class InterationCreateUseCase {
  async execute(interaction: Interaction<CacheType>) {
    if (interaction.isButton()) {
      await new ButtonInteractionUseCase().execute(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await new StringSelectMenuInteractionUseCase().execute(interaction);
    }
  }
}
