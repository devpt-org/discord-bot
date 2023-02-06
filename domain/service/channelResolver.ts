import { ChannelSlug } from "../../types";

const fallbackChannelIds: Record<ChannelSlug, string> = {
  [ChannelSlug.ENTRANCE]: "855861944930402344",
  [ChannelSlug.JOBS]: "876826576749215744",
  [ChannelSlug.QUESTION]: "1066328934825865216",
  [ChannelSlug.MOD_CHANNEL]: "987719981443723266",
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
