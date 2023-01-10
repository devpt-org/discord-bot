import { ActionRowBuilder, GuildMember, StringSelectMenuBuilder } from "discord.js";
import ChatService from "../../../domain/service/chatService";
import ROLES_MESSAGES_MAP from "./consts/rolesMap";

export default class RolesMessageUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute({ channelId, member }: { channelId: string; member: GuildMember | null }) {
    // Verify is ther member is a admin or moderator
    const allowedRoles = ["Admin", "Moderador"];

    const hasPermission = member?.roles.cache.some((role) => allowedRoles.includes(role.name));

    if (!hasPermission) {
      console.log(`User does not have permission to execute this command '!roles'`);
      return;
    }

    // await this.chatService.sendMessageToChannel(ROLES_MESSAGES_MAP.AREA_ROLES_MAP.text, channelId);
    // ROLES_MESSAGES_MAP.AREA_ROLES_MAP.OPTIONS
    // let emoji: string  = '✖️';

    // if (guild) {
    //     const _emoji = guild.emojis.cache.find((e) => e.name === 'C_');
    //     emoji = new APIMessageComponentEmoji
    // }

    Object.values(ROLES_MESSAGES_MAP).forEach(async (message) => {
      const areaOptions = message.OPTIONS.map((option) => ({
        label: option.name,
        value: option.value,
      }));

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(message.id)
          .setPlaceholder(message.placeholder)
          .addOptions(...areaOptions)
      );

      this.chatService.sendMessageToChannel(
        {
          content: message.content,
          components: [row],
        },
        channelId
      );
    });
  }
}
