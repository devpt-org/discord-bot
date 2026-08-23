import { describe, it, expect } from "vitest";
import EmbedFriendlyLinkService from "../../domain/service/embedFriendlyLinkService";
import DiscordEmbedFriendlyLinkService from "../../infrastructure/service/embedFriendlyLinkService";

describe("EmbedFriendlyLinkService", () => {
  const embedFriendlyLinkService: EmbedFriendlyLinkService = new DiscordEmbedFriendlyLinkService();

  describe("replaceLinkWithEmbedFriendly", () => {
    it("should replace an X link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "Check this out https://x.com/user/status/123456"
      );

      expect(result).toBe("https://fxtwitter.com/user/status/123456");
    });

    it("should replace a Twitter link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://twitter.com/user/status/123456"
      );

      expect(result).toBe("https://fxtwitter.com/user/status/123456");
    });

    it("should replace an Instagram link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "Check this out https://instagram.com/p/ABC123"
      );

      expect(result).toBe("https://kkinstagram.com/p/ABC123");
    });

    it("should replace a TikTok link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://tiktok.com/@user/video/123456"
      );

      expect(result).toBe("https://tnktok.com/@user/video/123456");
    });

    it("should replace a Bluesky link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://bsky.app/profile/user.bsky.social/post/123456"
      );

      expect(result).toBe("https://fxbsky.app/profile/user.bsky.social/post/123456");
    });

    it("should replace a Reddit link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://reddit.com/r/programming/comments/abc123/example"
      );

      expect(result).toBe("https://vxreddit.com/r/programming/comments/abc123/example");
    });

    it("should replace a redd.it link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly("https://redd.it/abc123");

      expect(result).toBe("https://vxreddit.com/abc123");
    });

    it("should return null when the message contains no URL", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly("This message contains no links");

      expect(result).toBeNull();
    });

    it("should return null when the URL is not supported", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly("https://google.com/something");

      expect(result).toBeNull();
    });

    it("should preserve the URL path and query parameters", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://x.com/foo/status/123456789?foo=bar"
      );

      expect(result).toBe("https://fxtwitter.com/foo/status/123456789?foo=bar");
    });

    it("should support www domains", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://www.x.com/user/status/123456"
      );

      expect(result).toBe("https://fxtwitter.com/user/status/123456");
    });

    it("should support HTTP URLs", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly("http://x.com/user/status/123456");

      expect(result).toBe("http://fxtwitter.com/user/status/123456");
    });

    it("should replace the first supported link", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://google.com https://x.com/user/status/123"
      );

      expect(result).toBe("https://fxtwitter.com/user/status/123");
    });

    it("should return null when all URLs are unsupported", async () => {
      const result = await embedFriendlyLinkService.replaceLinkWithEmbedFriendly(
        "https://google.com https://example.com/foo"
      );

      expect(result).toBeNull();
    });
  });
});
