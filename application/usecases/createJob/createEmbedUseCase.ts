import { Guild, Message, User, MessageEmbed, MessageCollector } from "discord.js";
export default class createEmbedUseCase {
  private guild: Guild;
  private user: User;
  private answers: Array<string>;
  constructor({ guild, user, answers }: { guild: Guild; user: User; answers: Array<string> }) {
    this.guild = guild;
    this.user = user;
    this.answers = answers;
  }
  async execute(job_questions: Array<string>): Promise<MessageEmbed> {
    return new MessageEmbed()
      .setColor(0x0099ff)
      .setTitle(this.answers[0])
      .setAuthor({
        name: `${this.user.username}#${this.user.discriminator}`,
        iconURL: this.user.displayAvatarURL(),
      })
      .setDescription(this.answers[7])
      .addFields(
        { name: job_questions[1], value: this.answers[1] },
        { name: job_questions[2], value: this.answers[2] },
        { name: job_questions[3], value: this.answers[3] },
        { name: job_questions[4], value: this.answers[4] },
        { name: job_questions[5], value: this.answers[5] },
        { name: job_questions[6], value: this.answers[6] },
        { name: "Contacte", value: `<@${this.user.id}>`, inline: true }
      )
      .setTimestamp(new Date())
      .setFooter({ text: this.guild.name, iconURL: this.guild.iconURL() || "" });
  }
}
