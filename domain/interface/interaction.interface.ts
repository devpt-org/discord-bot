import { CustomMessage } from "./customMessage.interface";

export interface InteractionInterface {
  isButton(): boolean;

  isStringSelectMenu(): boolean;

  getCustomId(): string;

  getGuildId(): string | null;

  getValues(): string[];

  getUserId(): string;

  isRepliable(): boolean;

  reply(message: CustomMessage): void;

  update(message: CustomMessage): void;
}
