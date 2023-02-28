import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import ConfirmRemoveRoleDropdownUseCase from "../../../application/usecases/confirmRemoveRoleDropdownUseCase";
import { InteractionInterface } from "../../../domain/interface";
import ChatService from "../../../domain/service/chatService";
import LoggerService from "../../../domain/service/loggerService";

describe("send roles dropdown message use case", () => {
  let mockChatService: MockProxy<ChatService>;
  let mockLoggerService: MockProxy<LoggerService>;
  let mockInteraction: MockProxy<InteractionInterface>;

  beforeEach(() => {
    mockChatService = mock<ChatService>();
    mockLoggerService = mock<LoggerService>();
    mockInteraction = mock<InteractionInterface>();

    mockChatService.removeUserRole.mockResolvedValue();
    mockChatService.sendInteractionUpdate.mockResolvedValue();

    mockInteraction.getCustomId.mockReturnValue("confirm-remove:SECURITY");
    mockInteraction.getGuildId.mockReturnValue("855861944930402342");
    mockInteraction.getUserId.mockReturnValue("855861944930402342");
    mockInteraction.update.mockResolvedValue();
  });

  it("should send a interaction referring selected role is removed", async () => {
    const spyRemoveUserRole = vi.spyOn(mockChatService, "removeUserRole");
    const spySendInteractionUpdate = vi.spyOn(mockChatService, "sendInteractionUpdate");

    await new ConfirmRemoveRoleDropdownUseCase({
      chatService: mockChatService,
      loggerService: mockLoggerService,
    }).execute(mockInteraction);

    // removeUserRole
    expect(spyRemoveUserRole).toHaveBeenCalledTimes(1);
    expect(spyRemoveUserRole).toHaveBeenCalledWith("855861944930402342", "855861944930402342", "SECURITY");

    // sendInteractionUpdate
    expect(spySendInteractionUpdate).toHaveBeenCalledTimes(1);
    expect(spySendInteractionUpdate).toHaveBeenCalledWith(
      mockInteraction,
      ConfirmRemoveRoleDropdownUseCase.removedRoleMessage()
    );
  });
});
