export default class DiscordService {
  static async sendMessageToChannel(member, message, channelId) {
    member.guild.channels.cache.get(channelId).send(message);
  }
}
