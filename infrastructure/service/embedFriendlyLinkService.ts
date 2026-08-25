import EmbedFriendlyLinkService from "../../domain/service/embedFriendlyLinkService";

export default class DiscordEmbedFriendlyLinkService implements EmbedFriendlyLinkService {
  private readonly providers = new Map<string, string>([
    ["instagram.com", "kkinstagram.com"],
    ["x.com", "fxtwitter.com"],
    ["twitter.com", "fxtwitter.com"],
    ["tiktok.com", "tnktok.com"],
    ["bsky.app", "fxbsky.app"],
    ["reddit.com", "vxreddit.com"],
    ["redd.it", "vxreddit.com"],
  ]);

  async replaceLinkWithEmbedFriendly(message: string): Promise<string | null> {
    const matches = message.match(/https?:\/\/[^\s]+/g) ?? [];

    const match = matches
      .map((value) => {
        try {
          const url = new URL(value);
          const hostname = url.hostname.replace(/^www\./, "");
          const replacement = this.providers.get(hostname);

          return replacement ? { url, replacement } : null;
        } catch {
          return null;
        }
      })
      .find((value) => value !== null);

    if (!match) {
      return null;
    }

    match.url.hostname = match.replacement;

    return match.url.toString();
  }
}
