import { beforeEach, describe, expect, it } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import ChatService from "../../../domain/service/chatService";

describe("send roles dropdown message use case", () => {
  let mockChatService: MockProxy<ChatService>;

  beforeEach(() => {
    mockChatService = mock<ChatService>();

    mockChatService.sendInteractionReply.mockResolvedValue();
  });

  it("should send message with dropdown roles", async () => {
    // TODO: implement test
    expect(1).toBe(1);
  });
});
