import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ActionRowBuilderInterface } from "../../interface/action-row.builder.interface";

export class DiscordButtonActionRowBuilder extends ActionRowBuilderInterface<ActionRowBuilder> {
  build(): ActionRowBuilder<ButtonBuilder> {
    if (!this.customId || !this.label || !this.style) {
      throw new Error("Missing required fields to build a button");
    }

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(this.customId).setLabel(this.label).setStyle(this.style)
    );
  }

  setDangerStyle(): this {
    this.style = ButtonStyle.Danger;
    return this;
  }
}
