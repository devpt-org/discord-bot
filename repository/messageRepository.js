import intro from "../assets/phrases/intro.json" assert { type: "json" };
import welcoming from "../assets/phrases/welcoming.json" assert { type: "json" };

const config = { phrases: {} };
config.phrases.intro = intro;
config.phrases.welcoming = welcoming;

const getRandomStringFromCollection = (collection) => collection[Math.floor(Math.random() * collection.length)].trim();

export default class MessageRepository {
  static getRandomIntroMessage = () => getRandomStringFromCollection(config.phrases.intro).trim();

  static getRandomWelcomingMessage = () => getRandomStringFromCollection(config.phrases.welcoming).trim();
}
