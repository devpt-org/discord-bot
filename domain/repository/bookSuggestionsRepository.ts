import BookSuggestion from "../entity/bookSuggestion";

export default interface BookSuggestionsRepository {
  add(bookSuggestion: BookSuggestion): void;
  findByTitle(title: string): BookSuggestion | null;
}
