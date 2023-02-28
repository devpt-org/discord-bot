import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { AbstractActionRowBuilder } from "./abstract-action-row.builder";

export class DiscordStringSelectMenuActionRowBuilder extends AbstractActionRowBuilder<ActionRowBuilder> {
  build(): ActionRowBuilder<StringSelectMenuBuilder> {
    if (!this.customId || !this.label || !this.options) {
      throw new Error("Missing required fields to build a string select menu");
    }

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(this.customId)
        .setPlaceholder(this.label)
        .addOptions(...this.options)
    );
  }

  setDangerStyle(): this {
    return this;
  }
}

export default DiscordStringSelectMenuActionRowBuilder;
