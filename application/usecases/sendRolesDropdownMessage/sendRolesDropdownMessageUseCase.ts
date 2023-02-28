import { ActionRowBuilderInterface } from "../../../domain/interface";
import ROLES_MESSAGES_MAP from "../../../assets/consts/rolesMap";
import { RoleInterface } from "../../../assets/interfaces/roleInterface";
import { ActionRowOptions } from "../../../domain/builder/action-row/abstract-action-row.builder";
import { CustomEmoji } from "../../../domain/interface/customEmoji.interface";
import ChatService from "../../../domain/service/chatService";
import LoggerService from "../../../domain/service/loggerService";
import { SendRolesDropdownMessageInput } from "./sendRolesDropdownMessageInput";

export default class SendRolesDropdownMessageUseCase<A> {
  private chatService: ChatService;

  private loggerService: LoggerService;

  private actionRowBuilder: ActionRowBuilderInterface<A>;

  constructor({
    chatService,
    loggerService,
    actionRowBuilder,
  }: {
    chatService: ChatService;
    loggerService: LoggerService;
    actionRowBuilder: ActionRowBuilderInterface<A>;
  }) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    this.actionRowBuilder = actionRowBuilder;
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
        const areaOptions = SendRolesDropdownMessageUseCase.getOptionsWithEmojis(roleMessage.OPTIONS, emojis);

        const row = this.actionRowBuilder
          .setCustomId(roleMessage.id)
          .setLabel(roleMessage.placeholder)
          .setOptions(areaOptions)
          .build();

        await this.chatService.sendMessageToChannel(
          {
            content: roleMessage.content,
            components: [row],
          },
          channelId
        );
      });
    } catch (error) {
      this.loggerService.log(error);
    }
  }

  public static getOptionsWithEmojis(options: RoleInterface[], emojis: CustomEmoji[] | undefined): ActionRowOptions[] {
    const areaOptions = options.map((option) => {
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

    return areaOptions;
  }
}
