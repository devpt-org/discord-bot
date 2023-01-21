import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import ROLES_MESSAGES_MAP from "../../../assets/consts/rolesMap";
import { RoleInterface } from "../../../assets/interfaces/roleInterface";
import { CustomEmoji } from "../../../domain/interface/customEmoji.interface";
import ChatService from "../../../domain/service/chatService";
import { SendRolesDropdownMessageInput } from "./sendRolesDropdownMessageInput";

export default class SendRolesDropdownMessageUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute({ channelId, guildId, memberId }: SendRolesDropdownMessageInput) {
    try {
      if (!guildId || !memberId) return;

      // Verify is ther member is a admin or moderator
      const allowedRoles = ["Admin", "Moderador"];

      const hasPermission = await this.chatService.isUserWithRoleName(guildId, memberId, allowedRoles);

      if (!hasPermission) {
        console.log(`User does not have permission to execute this command '!roles'`);
        return;
      }

      const emojis: CustomEmoji[] | undefined = (await this.chatService.getGuildEmojis(guildId)) || undefined;

      Object.values(ROLES_MESSAGES_MAP).forEach(async (roleMessage) => {
        const message = SendRolesDropdownMessageUseCase.getRolesDropdownMessage(roleMessage, emojis);

        await this.chatService.sendMessageToChannel(message, channelId);
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static getRolesDropdownMessage(
    message: {
      id: string;
      content: string;
      placeholder: string;
      OPTIONS: RoleInterface[];
    },
    emojis: CustomEmoji[] | undefined
  ) {
    const areaOptions = message.OPTIONS.map((option) => {
      let emoji = option.native && option.emoji ? option.emoji : "✖️";
      if (emojis && option.emoji) {
        const findedEmoji = emojis.find((e) => e.name === option.emoji);

        if (findedEmoji) {
          emoji = findedEmoji.string || "✖️";
        }
      }

      return {
        label: option.name,
        value: option.value,
        emoji,
      };
    });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(message.id)
        .setPlaceholder(message.placeholder)
        .addOptions(...areaOptions)
    );

    return {
      content: message.content,
      components: [row],
    };
  }
}
