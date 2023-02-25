
export interface InteractionInterface {
  isButton(): boolean;

  isStringSelectMenu(): boolean;

  getCustomId(): string;

  getGuildId(): string | null;

  getValues(): string[];

  getUserId(): string;

  isRepliable(): boolean;

  reply(message: any): void;

  update(message: any): void;
}