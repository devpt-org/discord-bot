import EmbedMessage from "../entity/embedMessage";

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export default class EmbedBuilder {
  private color: number = 0x0099ff;
  private title: string = "";
  private author: {
    name: string;
    iconURL: string;
  } = { name: "", iconURL: "" };
  private description: string = "";
  private fields: EmbedField[] = [];
  private timestamp: Date = new Date();
  private footer: {
    text: string;
    iconURL: string;
  } = { text: "", iconURL: "" };

  public withColor(color: number): EmbedBuilder {
    this.color = color;
    return this;
  }

  public withTitle(title: string): EmbedBuilder {
    this.title = title;
    return this;
  }

  public withAuthor(name: string, iconURL: string | null): EmbedBuilder {
    this.author = { name, iconURL };
    return this;
  }

  public withDescription(description: string): EmbedBuilder {
    this.description = description;
    return this;
  }

  public withTimestamp(timestamp: Date): EmbedBuilder {
    this.timestamp = timestamp;
    return this;
  }

  public withFooter(text: string, iconURL: string): EmbedBuilder {
    this.footer = { text, iconURL };
    return this;
  }

  public addField(name: string, value: string, inline?: boolean): EmbedBuilder {
    this.fields.push({
      name,
      value,
      inline,
    });
    return this;
  }

  public build(): EmbedMessage {
    return {
      color: this.color,
      title: this.title,
      author: this.author,
      description: this.description,
      fields: this.fields,
      timestamp: this.timestamp,
      footer: this.footer,
    };
  }
}
