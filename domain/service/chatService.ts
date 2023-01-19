import { CustomMessage } from "../interface/customMessage.interface";

export default interface ChatService {
  sendMessageToChannel(message: string | CustomMessage, channelId: string): Promise<void>;

  getRoleIdByName(guildId: string, roleName: string): Promise<string>;

  isMemberWithRole(guildId: string, userId: string, roleId: string): Promise<boolean>;

  isMemberWithRoleName(guildId: string, userId: string, role: string): Promise<boolean>;

  addMemberRole(guildId: string, userId: string, roleId: string): Promise<void>;

  removeMemberRole(guildId: string, userId: string, roleId: string): Promise<void>;

  sendInteractionReply(interaction: any, message: string | CustomMessage): Promise<void>;

  sendInteractionUpdate(interaction: any, message: string | CustomMessage): Promise<void>;
}
