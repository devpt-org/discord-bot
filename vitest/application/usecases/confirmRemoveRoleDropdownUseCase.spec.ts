import { ButtonInteraction, CacheType } from "discord.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import ConfirmRemoveRoleDropdownUseCase from "../../../application/usecases/confirmRemoveRoleDropdownUseCase";
import ChatService from "../../../domain/service/chatService";

describe("send roles dropdown message use case", () => {
  let mockChatService: MockProxy<ChatService>;

  const mockInteraction = {
    guildId: "855861944930402342",
    customId: "confirm-remove:SECURITY",
    user: {
      id: "855861944930402342",
    },
  } as ButtonInteraction<CacheType>;

  beforeEach(() => {
    mockChatService = mock<ChatService>();

    mockChatService.removeMemberRole.mockResolvedValue();
    mockChatService.sendInteractionUpdate.mockResolvedValue();
  });

  it("should send a interaction referring selected role is removed", async () => {
    const spyRemoveMemberRole = vi.spyOn(mockChatService, "removeMemberRole");
    const spySendInteractionUpdate = vi.spyOn(mockChatService, "sendInteractionUpdate");

    await new ConfirmRemoveRoleDropdownUseCase({
      chatService: mockChatService,
    }).execute(mockInteraction);

    // removeMemberRole
    expect(spyRemoveMemberRole).toHaveBeenCalledTimes(1);
    expect(spyRemoveMemberRole).toHaveBeenCalledWith("855861944930402342", "855861944930402342", "SECURITY");

    // sendInteractionUpdate
    expect(spySendInteractionUpdate).toHaveBeenCalledTimes(1);
    expect(spySendInteractionUpdate).toHaveBeenCalledWith(
      mockInteraction,
      ConfirmRemoveRoleDropdownUseCase.removedRoleMessage()
    );
  });
});
