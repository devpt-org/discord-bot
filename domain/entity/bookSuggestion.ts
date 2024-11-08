export default class BookSuggestion {
  private readonly title: string;

  private readonly link: string;

  constructor({ title, link }: { title: string; link: string }) {
    this.title = title;
    this.link = link;
  }

  getTitle(): string {
    return this.title;
  }

  getLink(): string {
    return this.link;
  }
}
