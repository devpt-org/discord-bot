import ChatService from "../../../domain/service/chatService";
import SaveBookSuggestionForBookClubUseCaseInput from "./saveBookSuggestionForBookClubUseCaseInput";
import BookSuggestionsRepository from "../../../domain/repository/bookSuggestionsRepository";
import BookSuggestion from "../../../domain/entity/bookSuggestion";

export default class SaveBookSuggestionForBookClubUseCase {
  private bookSuggestionsRepository: BookSuggestionsRepository;

  private chatService: ChatService;

  constructor({
    chatService,
    bookSuggestionsRepository,
  }: {
    chatService: ChatService;
    bookSuggestionsRepository: BookSuggestionsRepository;
  }) {
    this.chatService = chatService;
    this.bookSuggestionsRepository = bookSuggestionsRepository;
  }

  async execute({ title, link, channelId }: SaveBookSuggestionForBookClubUseCaseInput): Promise<void> {
    const bookSuggestionAlreadyExists = this.bookSuggestionsRepository.findByTitle(title);
    if (bookSuggestionAlreadyExists) {
      this.chatService.sendMessageToChannel(
        `Infelizmente o conteúdo **"${title}"** já tinha sido sugerido.`,
        channelId
      );
      return;
    }

    this.bookSuggestionsRepository.add(new BookSuggestion({ title, link }));
    this.chatService.sendMessageToChannel(`A sugestão **"${title}"** foi enviada.`, channelId);
  }
}
