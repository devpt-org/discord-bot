export default interface EmbedMessage {
  color: number;
  title: string;
  author: {
    name: string;
    iconURL: string;
  };
  description: string;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp: Date;
  footer: {
    text: string;
    iconURL: string;
  };
}
