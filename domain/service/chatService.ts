import { CustomEmoji } from "../interface/customEmoji.interface";
import { CustomMessage } from "../interface/customMessage.interface";
import { InteractionInterface } from "../model/interaction.interface";

export default interface ChatService {
  sendMessageToChannel(message: string | CustomMessage, channelId: string): Promise<void>;

  getRoleIdByName(guildId: string, role: string): Promise<string>;

  isUserWithRole(guildId: string, userId: string, roleId: string): Promise<boolean>;

  isUserWithRoleName(guildId: string, userId: string, roles: string[]): Promise<boolean>;

  addUserRole(guildId: string, userId: string, roleId: string): Promise<void>;

  removeUserRole(guildId: string, userId: string, roleId: string): Promise<void>;

  sendInteractionReply(interaction: InteractionInterface, message: any): Promise<void>;

  sendInteractionUpdate(interaction: InteractionInterface, message: any): Promise<void>;

  getGuildEmojis(guildId: string): Promise<CustomEmoji[]>;
}
