const DESTINATION_CHANNEL_ID = "855861944930402344"; // #geral
// const DESTINATION_CHANNEL_ID = '807190194268012554'; // #comandos-testes

const replacePlaceholders = (phrases, memberID) => {
  const memberIdTag = `<@${memberID}>`;
  return phrases.replace("{MEMBER_ID}", memberIdTag);
};

export default class SendWelcomeMessageUseCase {
  constructor({ messageRepository, discordService, loggerService }) {
    this.messageRepository = messageRepository;
    this.discordService = discordService;
    this.loggerService = loggerService;
  }

  async execute(member) {
    this.loggerService.log("Member joined the server!");

    const introPhrase = this.messageRepository.getRandomIntroMessage();
    const welcomingPhrase = this.messageRepository.getRandomWelcomingMessage();
    const finalPhrase = replacePlaceholders(`${introPhrase}${welcomingPhrase}`, member.id);

    this.loggerService.log(`[NEW JOIN] ${finalPhrase}`);

    await this.discordService.sendMessageToChannel(member, finalPhrase, DESTINATION_CHANNEL_ID);

    return finalPhrase;
  }
}
