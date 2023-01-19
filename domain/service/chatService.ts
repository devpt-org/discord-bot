import { CostumMessage } from "../interface/message.interface";

export default interface ChatService {
  sendMessageToChannel(message: string | CostumMessage, channelId: string): Promise<void>;

  addMemberRole(guildId: string, userId: string, roleId: string): Promise<void>;

  removeMemberRole(guildId: string, userId: string, roleId: string): Promise<void>;

  sendInteractionReply(interaction: any, message: string | CostumMessage): Promise<void>;

  sendInteractionUpdate(interaction: any, message: string | CostumMessage): Promise<void>;
}
