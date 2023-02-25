import { ActionRowBuilderInterface } from "@/domain/interface";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export class DiscordStringSelectMenuActionRowBuilder extends ActionRowBuilderInterface<ActionRowBuilder> {
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
