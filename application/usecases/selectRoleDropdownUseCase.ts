import { ActionRowBuilderInterface, CustomMessage, InteractionInterface } from "@/domain/interface";
import AREA_ROLES_MAP from "../../assets/consts/areaRolesMap";
import EXTRA_AREA_ROLES_MAP from "../../assets/consts/extraAreaRolesMap";
import LANGUAGE_ROLES_MAP from "../../assets/consts/languageRolesMap";

import ChatService from "../../domain/service/chatService";
import LoggerService from "../../domain/service/loggerService";

export default class SelectRoleDropdownUseCase<A> {
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

  async execute(interaction: InteractionInterface) {
    const guildId = interaction.getGuildId();
    if (!guildId) return;

    const values = interaction.getValues();

    if (!values || !values.length) return;

    const selected = values[0];

    const allowedRoles = { ...AREA_ROLES_MAP, ...LANGUAGE_ROLES_MAP, ...EXTRA_AREA_ROLES_MAP };
    const selectedRoleMap = allowedRoles ? allowedRoles[selected] : undefined;

    if (!selectedRoleMap) return;

    try {
      selectedRoleMap.id = await this.chatService.getRoleIdByName(guildId, selectedRoleMap.name);

      if (!selectedRoleMap.id) return;

      const hasRole = await this.chatService.isUserWithRoleName(guildId, interaction.getUserId(), [
        selectedRoleMap.name,
      ]);

      if (hasRole) {
        const row = this.actionRowBuilder
          .setCustomId(`confirm-remove:${selectedRoleMap.id}`)
          .setLabel("Remover")
          .setDangerStyle()
          .build();

        this.chatService.sendInteractionReply(
          interaction,
          SelectRoleDropdownUseCase.confirmRemoveRoleMessage<A>(selectedRoleMap.name, row)
        );
      } else {
        await this.chatService.addUserRole(guildId, interaction.getUserId(), selectedRoleMap.id);

        this.chatService.sendInteractionReply(
          interaction,
          SelectRoleDropdownUseCase.addedRoleMessage(selectedRoleMap.name)
        );
      }
    } catch (error) {
      this.loggerService.log(error);
    }
  }

  public static addedRoleMessage(roleName: string): CustomMessage {
    return {
      content: `Agora tens a posição: ${roleName} ✅`,
      ephemeral: true,
    };
  }

  public static confirmRemoveRoleMessage<A>(roleName: string, row: A): CustomMessage {
    return {
      content: `Só para confirmar, deseja remover a posição: ${roleName}?`,
      ephemeral: true,
      components: [row],
    };
  }
}
