import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import { SendRolesDropdownMessageInput } from "../../../application/usecases/sendRolesDropdownMessage/sendRolesDropdownMessageInput";
import SendRolesDropdownMessageUseCase from "../../../application/usecases/sendRolesDropdownMessage/sendRolesDropdownMessageUseCase";
import ROLES_MESSAGES_MAP from "../../../assets/consts/rolesMap";
import ChatService from "../../../domain/service/chatService";

describe("send roles dropdown message use case", () => {
  let mockChatService: MockProxy<ChatService>;
  // const mockEmoji: CustomEmoji = {
  //   id: "855861944930402342",
  //   name: AREA_ROLES_MAP.SECURITY.name,
  //   string: `<:${AREA_ROLES_MAP.SECURITY.name}:855861944930402342>`,
  // };

  const allowedRoles = ["Admin", "Moderador"];

  beforeEach(() => {
    mockChatService = mock<ChatService>();

    mockChatService.getGuildEmojis.mockResolvedValue([]);
    mockChatService.sendMessageToChannel.mockResolvedValue();
  });

  it("should send message with dropdown roles", async () => {
    mockChatService.isUserWithRoleName.mockResolvedValue(true);

    const spyIsUserWithRoleName = vi.spyOn(mockChatService, "isUserWithRoleName");
    const spySendMessageToChannel = vi.spyOn(mockChatService, "sendMessageToChannel");

    const mockInput: SendRolesDropdownMessageInput = {
      channelId: "855861944930402342",
      guildId: "855861944930402342",
      memberId: "855861944930402342",
    };

    await new SendRolesDropdownMessageUseCase({ chatService: mockChatService }).execute(mockInput);

    expect(spyIsUserWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsUserWithRoleName).toHaveBeenCalledWith("855861944930402342", "855861944930402342", allowedRoles);

    expect(spySendMessageToChannel).toHaveBeenCalledTimes(3);

    Object.values(ROLES_MESSAGES_MAP).forEach(async (roleMessage) => {
      const message = SendRolesDropdownMessageUseCase.getRolesDropdownMessage(roleMessage, []);
      expect(spySendMessageToChannel).toHaveBeenCalledWith(message, "855861944930402342");
    });
  });

  it("should not send message with dropdown roles user doesn't have permissions", async () => {
    mockChatService.isUserWithRoleName.mockResolvedValue(false);

    const spyIsUserWithRoleName = vi.spyOn(mockChatService, "isUserWithRoleName");
    const spySendMessageToChannel = vi.spyOn(mockChatService, "sendMessageToChannel");

    const mockInput: SendRolesDropdownMessageInput = {
      channelId: "855861944930402342",
      guildId: "855861944930402342",
      memberId: "855861944930402342",
    };

    await new SendRolesDropdownMessageUseCase({ chatService: mockChatService }).execute(mockInput);

    expect(spyIsUserWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsUserWithRoleName).toHaveBeenCalledWith("855861944930402342", "855861944930402342", allowedRoles);

    expect(spySendMessageToChannel).toHaveBeenCalledTimes(0);
  });
});
