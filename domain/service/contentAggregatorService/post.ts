export default class Post {
  private authorName: string;

  private title: string;

  private link: string;

  private description: string;

  private createdAt: Date;

  constructor({
    authorName,
    title,
    link,
    description,
    createdAt,
  }: {
    authorName: string;
    title: string;
    link: string;
    description: string;
    createdAt: Date;
  }) {
    this.authorName = authorName;
    this.title = title;
    this.link = link;
    this.description = description;
    this.createdAt = createdAt;
  }

  getAuthorName(): string {
    return this.authorName;
  }

  getTitle(): string {
    return this.title;
  }

  getLink(): string {
    return this.link;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
