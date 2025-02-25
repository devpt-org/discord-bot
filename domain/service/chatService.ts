export interface EmbedOptions {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string; iconURL?: string };
}

export interface ButtonOptions {
  customId: string;
  label: string;
  style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER";
}

export default interface ChatService {
  sendMessageToChannel(message: string, channelId: string): Promise<void>;

  sendEmbedWithButtons(channelId: string, embedOptions: EmbedOptions, buttons: ButtonOptions[]): Promise<void>;
}
