import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { AbstractActionRowBuilder } from "./abstract-action-row.builder";

export class DiscordButtonActionRowBuilder extends AbstractActionRowBuilder<ActionRowBuilder> {
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

export default DiscordButtonActionRowBuilder;
