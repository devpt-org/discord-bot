import { Guild, Message } from "discord.js";
import ChatService from "../../../domain/service/chatService";
import LoggerService from "../../../domain/service/loggerService";
import { RoleInterface, RoleInterfaceMap } from "./interfaces/roleInterface";

export default class OldReactionsRolesUseCase {
  private chatService: ChatService;

  private loggerService: LoggerService;

  private roles: RoleInterface[] = [];

  constructor({
    chatService,
    loggerService,
    roles,
  }: {
    chatService: ChatService;
    loggerService: LoggerService;
    roles: RoleInterfaceMap;
  }) {
    this.chatService = chatService;
    this.loggerService = loggerService;
    if (roles) {
      this.roles = Object.values(roles);
    }
  }

  async execute({ channelId, messageId }: { channelId: string; messageId: string }): Promise<void> {
    const channel = this.chatService.getChannel(channelId);

    if (!channel) {
      throw new Error("Channel not found");
    }

    const message = await this.chatService.getChannelMessage(channel, messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const { guild } = message;

    if (!guild) {
      throw new Error("Guild not found");
    }

    // Map roles id
    const roles = this.mapRolesId({ guild, roles: this.roles });

    message.reactions.cache.forEach(async (reaction) => {
      const users = await reaction.users.fetch();
      users.forEach(async (user) => {
        if (user.id === this.chatService.getClientUser()?.id) {
          return;
        }

        const member = await this.chatService.getMember(guild, user);

        if (member) {
          const role = roles.find((r) => r.emoji === reaction.emoji.name);

          if (role && role.id) {
            this.chatService.addMemberRole(member, role.id);
          }
        }
      });
    });

    // Add all emojis to message (for easy access)
    this.addAllRoles(message, roles);
  }

  private mapRolesId({ guild, roles }: { guild: Guild; roles: RoleInterface[] }): RoleInterface[] {
    return roles.reduce((prev, curr: RoleInterface) => {
      const currCopy = curr;

      // If role doesn't have id configured, fetch it
      if (!curr.id && guild.roles?.cache) {
        const role = guild.roles?.cache?.find((r) => r.name === curr.name);

        currCopy.id = role?.id || null;
      }

      prev.push(currCopy);

      return prev;
    }, [] as RoleInterface[]);
  }

  private addAllRoles(message: Message<boolean>, roles: RoleInterface[]): void {
    if (!message || !message.guild || !roles) {
      return;
    }

    const { guild } = message;

    roles.forEach((role) => {
      try {
        if (!role.native) {
          // Verify if emoji is valid on server
          const emoji = guild.emojis.cache.find((e) => e.name === role.emoji);

          if (emoji) {
            this.chatService.addReactionToMessage(message, emoji).catch((error) => {
              this.loggerService.log(`Error adding reaction ${role.emoji} to message ${message.id}: ${error}`);
            });
          } else {
            this.loggerService.log(`Emoji ${role.emoji} not found on server ${guild.name}`);
          }
        } else {
          this.chatService.addReactionToMessage(message, role.emoji).catch((error) => {
            this.loggerService.log(`Error adding reaction ${role.emoji} to message ${message.id}: ${error}`);
          });
        }
      } catch (error) {
        this.loggerService.log(`Error adding reaction ${role?.emoji} to message ${message.id}: ${error}`);
      }
    });
  }
}
