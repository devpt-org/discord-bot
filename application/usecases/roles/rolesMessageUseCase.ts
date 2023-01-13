import { ActionRowBuilder, Collection, Guild, GuildEmoji, GuildMember, StringSelectMenuBuilder } from "discord.js";
import ChatService from "../../../domain/service/chatService";
import ROLES_MESSAGES_MAP from "./consts/rolesMap";

export default class RolesMessageUseCase {
  private chatService: ChatService;

  constructor({ chatService }: { chatService: ChatService }) {
    this.chatService = chatService;
  }

  async execute({ channelId, guild, member }: { channelId: string; guild: Guild | null; member: GuildMember | null }) {
    // Verify is ther member is a admin or moderator
    const allowedRoles = ["Admin", "Moderador"];

    const hasPermission = member?.roles.cache.some((role) => allowedRoles.includes(role.name));

    if (!hasPermission) {
      console.log(`User does not have permission to execute this command '!roles'`);
      return;
    }

    let emojis: Collection<string, GuildEmoji> | undefined;

    if (guild) {
      emojis = await guild.emojis.fetch();
    }

    Object.values(ROLES_MESSAGES_MAP).forEach(async (message) => {
      const areaOptions = message.OPTIONS.map((option) => {
        let emoji = option.native && option.emoji ? option.emoji : "✖️";
        if (emojis && option.emoji) {
          const findedEmoji = emojis.find((e) => e.name === option.emoji);

          if (findedEmoji) {
            emoji = findedEmoji.toString();
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

      await this.chatService.sendMessageToChannel(
        {
          content: message.content,
          components: [row],
        },
        channelId
      );
    });
  }
}
