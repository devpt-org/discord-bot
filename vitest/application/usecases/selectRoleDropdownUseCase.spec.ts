import { CacheType, StringSelectMenuInteraction } from "discord.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import SelectRoleDropdownUseCase from "../../../application/usecases/selectRoleDropdownUseCase";
import AREA_ROLES_MAP from "../../../assets/consts/areaRolesMap";
import ChatService from "../../../domain/service/chatService";

describe("select role dropdown use case", () => {
  let mockChatService: MockProxy<ChatService>;

  const mockInteraction = {
    guildId: "855861944930402342",
    values: ["SECURITY"],
    user: {
      id: "855861944930402342",
    },
  } as StringSelectMenuInteraction<CacheType>;

  beforeEach(() => {
    mockChatService = mock<ChatService>();

    mockChatService.getRoleIdByName.mockResolvedValue("855861944930402342");
    mockChatService.sendInteractionReply.mockResolvedValue();
    mockChatService.addMemberRole.mockResolvedValue();
  });

  it("should send a interaction referring selected role is added", async () => {
    mockChatService.isMemberWithRoleName.mockResolvedValue(false);

    const spyGetRoleIdByName = vi.spyOn(mockChatService, "getRoleIdByName");
    const spyIsMemberWithRoleName = vi.spyOn(mockChatService, "isMemberWithRoleName");
    const spyAddMemberRole = vi.spyOn(mockChatService, "addMemberRole");
    const spySendInteractionReply = vi.spyOn(mockChatService, "sendInteractionReply");

    await new SelectRoleDropdownUseCase({
      chatService: mockChatService,
    }).execute(mockInteraction);

    // getRoleIdByName
    expect(spyGetRoleIdByName).toHaveBeenCalledTimes(1);
    expect(spyGetRoleIdByName).toHaveBeenCalledWith("855861944930402342", AREA_ROLES_MAP.SECURITY.name);

    // isMemberWithRoleName
    expect(spyIsMemberWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsMemberWithRoleName).toHaveBeenCalledWith(
      "855861944930402342",
      "855861944930402342",
      AREA_ROLES_MAP.SECURITY.name
    );

    // addMemberRole
    expect(spyAddMemberRole).toHaveBeenCalledTimes(1);
    expect(spyAddMemberRole).toHaveBeenCalledWith("855861944930402342", "855861944930402342", "855861944930402342");

    // sendInteractionReply
    expect(spySendInteractionReply).toHaveBeenCalledTimes(1);
    expect(spySendInteractionReply).toHaveBeenCalledWith(
      mockInteraction,
      SelectRoleDropdownUseCase.addedRoleMessage(AREA_ROLES_MAP.SECURITY.name)
    );
  });

  it("should send a interaction referring already has the selected role", async () => {
    mockChatService.isMemberWithRoleName.mockResolvedValue(true);

    const spyGetRoleIdByName = vi.spyOn(mockChatService, "getRoleIdByName");
    const spyIsMemberWithRoleName = vi.spyOn(mockChatService, "isMemberWithRoleName");
    const spyAddMemberRole = vi.spyOn(mockChatService, "addMemberRole");
    const spySendInteractionReply = vi.spyOn(mockChatService, "sendInteractionReply");

    await new SelectRoleDropdownUseCase({
      chatService: mockChatService,
    }).execute(mockInteraction);

    // getRoleIdByName
    expect(spyGetRoleIdByName).toHaveBeenCalledTimes(1);
    expect(spyGetRoleIdByName).toHaveBeenCalledWith("855861944930402342", AREA_ROLES_MAP.SECURITY.name);

    // isMemberWithRoleName
    expect(spyIsMemberWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsMemberWithRoleName).toHaveBeenCalledWith(
      "855861944930402342",
      "855861944930402342",
      AREA_ROLES_MAP.SECURITY.name
    );

    // addMemberRole
    expect(spyAddMemberRole).toHaveBeenCalledTimes(0);

    // sendInteractionReply
    expect(spySendInteractionReply).toHaveBeenCalledTimes(1);
    expect(spySendInteractionReply).toHaveBeenCalledWith(
      mockInteraction,
      SelectRoleDropdownUseCase.confirmRemoveRoleMessage("855861944930402342", AREA_ROLES_MAP.SECURITY.name)
    );
  });
});
