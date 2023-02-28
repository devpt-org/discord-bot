import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import SelectRoleDropdownUseCase from "../../../application/usecases/selectRoleDropdownUseCase";
import AREA_ROLES_MAP from "../../../assets/consts/areaRolesMap";
import { ActionRowBuilderInterface, InteractionInterface } from "../../../domain/interface";
import ChatService from "../../../domain/service/chatService";
import LoggerService from "../../../domain/service/loggerService";

describe("select role dropdown use case", () => {
  let mockChatService: MockProxy<ChatService>;
  let mockLoggerService: MockProxy<LoggerService>;
  let mockInteraction: MockProxy<InteractionInterface>;
  let mockActionRowBuilder: MockProxy<ActionRowBuilderInterface<any>>;

  const actionRow = {};

  // const mockInteraction = {
  //   guildId: "855861944930402342",
  //   values: ["SECURITY"],
  //   user: {
  //     id: "855861944930402342",
  //   },
  // } as StringSelectMenuInteraction<CacheType>;

  beforeEach(() => {
    mockChatService = mock<ChatService>();
    mockLoggerService = mock<LoggerService>();
    mockInteraction = mock<InteractionInterface>();
    mockActionRowBuilder = mock<ActionRowBuilderInterface<any>>();

    mockChatService.getRoleIdByName.mockResolvedValue("855861944930402342");
    mockChatService.sendInteractionReply.mockResolvedValue();
    mockChatService.addUserRole.mockResolvedValue();

    mockInteraction.getGuildId.mockReturnValue("855861944930402342");
    mockInteraction.getValues.mockReturnValue(["SECURITY"]);
    mockInteraction.getUserId.mockReturnValue("855861944930402342");

    mockActionRowBuilder.setCustomId.mockReturnThis();
    mockActionRowBuilder.setLabel.mockReturnThis();
    mockActionRowBuilder.setDangerStyle.mockReturnThis();
    mockActionRowBuilder.build.mockReturnValue(actionRow);
  });

  it("should send a interaction referring selected role is added", async () => {
    mockChatService.isUserWithRoleName.mockResolvedValue(false);

    const spyGetRoleIdByName = vi.spyOn(mockChatService, "getRoleIdByName");
    const spyIsUserWithRoleName = vi.spyOn(mockChatService, "isUserWithRoleName");
    const spyAddUserRole = vi.spyOn(mockChatService, "addUserRole");
    const spySendInteractionReply = vi.spyOn(mockChatService, "sendInteractionReply");

    await new SelectRoleDropdownUseCase({
      chatService: mockChatService,
      loggerService: mockLoggerService,
      actionRowBuilder: mockActionRowBuilder,
    }).execute(mockInteraction);

    // getRoleIdByName
    expect(spyGetRoleIdByName).toHaveBeenCalledTimes(1);
    expect(spyGetRoleIdByName).toHaveBeenCalledWith("855861944930402342", AREA_ROLES_MAP.SECURITY.name);

    // isUserWithRoleName
    expect(spyIsUserWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsUserWithRoleName).toHaveBeenCalledWith("855861944930402342", "855861944930402342", [
      AREA_ROLES_MAP.SECURITY.name,
    ]);

    // addUserRole
    expect(spyAddUserRole).toHaveBeenCalledTimes(1);
    expect(spyAddUserRole).toHaveBeenCalledWith("855861944930402342", "855861944930402342", "855861944930402342");

    // sendInteractionReply
    expect(spySendInteractionReply).toHaveBeenCalledTimes(1);
    expect(spySendInteractionReply).toHaveBeenCalledWith(
      mockInteraction,
      SelectRoleDropdownUseCase.addedRoleMessage(AREA_ROLES_MAP.SECURITY.name)
    );
  });

  it("should send a interaction referring already has the selected role", async () => {
    mockChatService.isUserWithRoleName.mockResolvedValue(true);

    const spyGetRoleIdByName = vi.spyOn(mockChatService, "getRoleIdByName");
    const spyIsUserWithRoleName = vi.spyOn(mockChatService, "isUserWithRoleName");
    const spyAddUserRole = vi.spyOn(mockChatService, "addUserRole");
    const spySendInteractionReply = vi.spyOn(mockChatService, "sendInteractionReply");

    await new SelectRoleDropdownUseCase({
      chatService: mockChatService,
      loggerService: mockLoggerService,
      actionRowBuilder: mockActionRowBuilder,
    }).execute(mockInteraction);

    // getRoleIdByName
    expect(spyGetRoleIdByName).toHaveBeenCalledTimes(1);
    expect(spyGetRoleIdByName).toHaveBeenCalledWith("855861944930402342", AREA_ROLES_MAP.SECURITY.name);

    // isUserWithRoleName
    expect(spyIsUserWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsUserWithRoleName).toHaveBeenCalledWith("855861944930402342", "855861944930402342", [
      AREA_ROLES_MAP.SECURITY.name,
    ]);

    // addUserRole
    expect(spyAddUserRole).toHaveBeenCalledTimes(0);

    // sendInteractionReply
    expect(spySendInteractionReply).toHaveBeenCalledTimes(1);
    expect(spySendInteractionReply).toHaveBeenCalledWith(
      mockInteraction,
      SelectRoleDropdownUseCase.confirmRemoveRoleMessage(AREA_ROLES_MAP.SECURITY.name, actionRow)
    );
  });
});
