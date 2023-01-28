import DmService from '../../domain/service/dmService'
import { Client } from "discord.js";

class DiscordDmService implements DmService {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    sendMessage(userId: string, message: string): void {
        this.client.users.fetch(userId)
            .then(user => user.send(message))
            .catch(console.error);
    }
}

export default DiscordDmService