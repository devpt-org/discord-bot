export default interface MessageRepository {
  getJobQuestions(): Array<string>;
  getRandomIntroMessage(): string;
  getRandomWelcomingMessage(): string;
}
