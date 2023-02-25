import { CacheType, Interaction } from "discord.js";
import { InteractionInterface } from "../interface";

export class DiscordInteraction implements InteractionInterface {
  private interaction: Interaction<CacheType>;

  constructor(interaction: Interaction<CacheType>) {
    this.interaction = interaction;
  }

  isButton() {
    return this.interaction.isButton()
  }

  isStringSelectMenu() {
    return this.interaction.isStringSelectMenu()
  }

  getCustomId(): string {
    if (this.interaction.isButton()) {
      return this.interaction.customId
    }

    return '';
  }

  getGuildId(): string | null {
    return this.interaction.guildId
  }

  getValues(): string[] {
    if (this.interaction.isStringSelectMenu()) {
      return this.interaction.values
    }

    return []
  }

  getUserId(): string {
    return this.interaction.user.id
  }

  isRepliable() {
    return this.interaction.isRepliable();
  }

  reply(message: any) {
    if (!this.interaction.isRepliable()) {
      throw new Error("Interaction is not repliable!");
    }

    this.interaction.reply(message);
  }

  update(message: any) {
    if (!this.interaction.isButton()) {
      throw new Error("Interaction is not a button!");
    }

    this.interaction.update(message);
  }
}