import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import { SendRolesDropdownMessageInput } from "../../../application/usecases/sendRolesDropdownMessage/sendRolesDropdownMessageInput";
import SendRolesDropdownMessageUseCase from "../../../application/usecases/sendRolesDropdownMessage/sendRolesDropdownMessageUseCase";
import ROLES_MESSAGES_MAP from "../../../assets/consts/rolesMap";
import { ActionRowBuilderInterface } from "../../../domain/interface";
import ChatService from "../../../domain/service/chatService";
import LoggerService from "../../../domain/service/loggerService";

describe("send roles dropdown message use case", () => {
  let mockChatService: MockProxy<ChatService>;
  let mockLoggerService: MockProxy<LoggerService>;
  let mockActionRowBuilder: MockProxy<ActionRowBuilderInterface<unknown>>;

  const actionRow = {};

  const allowedRoles = ["Admin", "Moderador"];

  beforeEach(() => {
    mockChatService = mock<ChatService>();
    mockLoggerService = mock<LoggerService>();
    mockActionRowBuilder = mock<ActionRowBuilderInterface<unknown>>();

    mockChatService.getGuildEmojis.mockResolvedValue([]);
    mockChatService.sendMessageToChannel.mockResolvedValue();

    mockActionRowBuilder.setCustomId.mockReturnThis();
    mockActionRowBuilder.setLabel.mockReturnThis();
    mockActionRowBuilder.setDangerStyle.mockReturnThis();
    mockActionRowBuilder.setOptions.mockReturnThis();
    mockActionRowBuilder.build.mockReturnValue(actionRow);
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

    await new SendRolesDropdownMessageUseCase({
      chatService: mockChatService,
      loggerService: mockLoggerService,
      actionRowBuilder: mockActionRowBuilder,
    }).execute(mockInput);

    expect(spyIsUserWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsUserWithRoleName).toHaveBeenCalledWith("855861944930402342", "855861944930402342", allowedRoles);

    expect(spySendMessageToChannel).toHaveBeenCalledTimes(3);

    Object.values(ROLES_MESSAGES_MAP).forEach(async (roleMessage) => {
      expect(spySendMessageToChannel).toHaveBeenCalledWith(
        {
          content: roleMessage.content,
          components: [actionRow],
        },
        "855861944930402342"
      );
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

    await new SendRolesDropdownMessageUseCase({
      chatService: mockChatService,
      loggerService: mockLoggerService,
      actionRowBuilder: mockActionRowBuilder,
    }).execute(mockInput);

    expect(spyIsUserWithRoleName).toHaveBeenCalledTimes(1);
    expect(spyIsUserWithRoleName).toHaveBeenCalledWith("855861944930402342", "855861944930402342", allowedRoles);

    expect(spySendMessageToChannel).toHaveBeenCalledTimes(0);
  });
});
