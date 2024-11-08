import { vi, describe, it, expect } from "vitest";
import SaveBookSuggestionForBookClubUseCase from "../../../application/usecases/saveBookSuggestionForBookClubUseCase/saveBookSuggestionForBookClubUseCase";
import BookSuggestion from "../../../domain/entity/bookSuggestion";

describe("send book suggestion for book club use case", () => {
  it("should save in book suggestions repository the suggested book", async () => {
    const bookSuggestionsRepository = {
      add: vi.fn(),
      findByTitle: vi.fn(),
    };

    const chatService = {
      sendMessageToChannel: vi.fn(),
    };

    await new SaveBookSuggestionForBookClubUseCase({
      bookSuggestionsRepository,
      chatService,
    }).execute({
      title: "The Lord of the Rings",
      link: "https://www.amazon.com/Lord-Rings-1-3-J-R-R-Tolkien/dp/0618260307",
      channelId: "855861944930402342",
    });

    expect(bookSuggestionsRepository.add).toHaveBeenCalledWith({
      title: "The Lord of the Rings",
      link: "https://www.amazon.com/Lord-Rings-1-3-J-R-R-Tolkien/dp/0618260307",
    });
  });

  it("should send a message from chatService thanking the user", async () => {
    const bookSuggestionsRepository = {
      add: vi.fn(),
      findByTitle: vi.fn(),
    };

    const chatService = {
      sendMessageToChannel: vi.fn(),
    };

    const spy = vi.spyOn(chatService, "sendMessageToChannel");

    await new SaveBookSuggestionForBookClubUseCase({
      bookSuggestionsRepository,
      chatService,
    }).execute({
      title: "The Lord of the Rings",
      link: "https://www.amazon.com/Lord-Rings-1-3-J-R-R-Tolkien/dp/0618260307",
      channelId: "855861944930402342",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('A sugestão **"The Lord of the Rings"** foi enviada.', "855861944930402342");
  });

  it("should send a message from chatService in case the book was already suggested", async () => {
    const bookSuggestionsRepository = {
      add: vi.fn(),
      findByTitle: () =>
        new BookSuggestion({
          title: "The Lord of the Rings",
          link: "https://www.amazon.com/Lord-Rings-1-3-J-R-R-Tolkien/dp/0618260307",
        }),
    };

    const chatService = {
      sendMessageToChannel: vi.fn(),
    };

    const spy = vi.spyOn(chatService, "sendMessageToChannel");

    await new SaveBookSuggestionForBookClubUseCase({
      bookSuggestionsRepository,
      chatService,
    }).execute({
      title: "The Lord of the Rings",
      link: "https://www.amazon.com/Lord-Rings-1-3-J-R-R-Tolkien/dp/0618260307",
      channelId: "855861944930402342",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      'Infelizmente o conteúdo **"The Lord of the Rings"** já tinha sido sugerido.',
      "855861944930402342"
    );
  });
});
