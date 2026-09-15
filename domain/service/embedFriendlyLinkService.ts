export default interface EmbedFriendlyLinkService {
  replaceLinkWithEmbedFriendly(message: string): Promise<string | null>;
}
