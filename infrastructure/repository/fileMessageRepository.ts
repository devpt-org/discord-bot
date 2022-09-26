import intro from "../../assets/phrases/intro.json";
import welcoming from "../../assets/phrases/welcoming.json";
import MessageRepository from "../../domain/repository/messageRepository";

interface Phrases {
  intro: Array<string>;
  welcoming: Array<string>;
}

const config = { phrases: {} as Phrases };
config.phrases.intro = intro;
config.phrases.welcoming = welcoming;

const getRandomStringFromCollection = (collection: Array<string>) =>
  collection[Math.floor(Math.random() * collection.length)].trim();

export default class FileMessageRepository implements MessageRepository {
  getRandomIntroMessage = () => getRandomStringFromCollection(config.phrases.intro).trim();

  getRandomWelcomingMessage = () => getRandomStringFromCollection(config.phrases.welcoming).trim();
}
