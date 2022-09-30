import {
  PartialDMChannel,
  DMChannel,
  NewsChannel,
  ThreadChannel,
  TextChannel,
  VoiceChannel,
  MessageEmbed,
  User,
  Message,
} from "discord.js";
import LoggerService from "../../../domain/service/loggerService";

export default class SendmessageToChannelUseCase {
  private channelToDelete: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel;

  private channelToSendEmbed: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel;

  private embed: MessageEmbed;

  private author: User;

  private loggerService: LoggerService;

  constructor({
    channelToSendEmbed,
    channelToDelete,
    embed,
    author,
    loggerService,
  }: {
    channelToSendEmbed: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel;
    channelToDelete: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel;
    embed: MessageEmbed;
    author: User;
    loggerService: LoggerService;
  }) {
    this.channelToSendEmbed = channelToSendEmbed;
    this.channelToDelete = channelToDelete;
    this.embed = embed;
    this.author = author;
    this.loggerService = loggerService;
  }

  async execute(): Promise<void> {
    this.channelToSendEmbed
      .send({ embeds: [this.embed] })
      .then((m: Message) => {
        m.react("👍");
        m.react("👎");
        m.startThread({
          name: `${this.author.username}#${this.author.discriminator}`,
          autoArchiveDuration: 60,
        });
      })
      .then(() => {
        // Apagar o canal temporário
        this.channelToDelete.delete();
        this.loggerService.log("JOBS COMMAND - END");
      });
  }
}
