import { ChannelSlug } from "../../types";

const fallbackChannelIds: Record<ChannelSlug, string> = {
  [ChannelSlug.ENTRANCE]: "855861944930402344",
  [ChannelSlug.JOBS]: "876826576749215744",
};

export default class ChannelResolver {
  getBySlug(slug: ChannelSlug): string {
    const channelId = process.env[`CHANNEL_${slug}`] || fallbackChannelIds[slug];

    if (!channelId) {
      throw new Error(`Channel ID for "${slug}" not found`);
    }

    return channelId;
  }
}
