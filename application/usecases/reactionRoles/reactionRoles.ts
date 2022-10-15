import {
  Client,
  Guild,
  GuildMember,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  TextChannel,
  User,
} from "discord.js";
import { RoleInterface, RoleInterfaceMap } from "./interfaces/roleInterface";

export default class ReactionRoles {
  private client: Client;

  private roles: RoleInterface[] = [];

  constructor({ client, roles }: { client: Client; roles: RoleInterfaceMap }) {
    this.client = client;
    if (roles) {
      this.roles = Object.values(roles);
    }
  }

  async execute({ channelId, messageId }: { channelId: string; messageId: string }): Promise<void> {
    const channel = this.client.channels.cache.get(channelId) as TextChannel;

    if (!channel) {
      throw new Error("Channel not found");
    }

    // Fetch message by id
    channel.messages
      .fetch(messageId)
      .then(async (message) => {
        const { guild } = message;

        if (!guild) {
          throw new Error("Guild not found");
        }

        // Map roles with server role id
        const roles = this.mapRolesId({ guild, roles: this.roles });

        // Read current reactions (if bot was offline)
        message.reactions.cache.forEach((reaction) => {
          // Fetch users who reacted with this emoji
          reaction.users.fetch().then((users) => {
            users.forEach(async (user) => {
              // If user is not the bot
              if (user.id === this.client.user?.id) return;

              // Add role to user
              await this.userRoles({ type: "add", reaction, user });
            });
          });
        });

        // Add all emojis to message (for easy access)
        roles.forEach((role) => {
          try {
            if (!role.native) {
              // Verify if emoji is valid on server
              const emoji = guild.emojis.cache.find((e) => e.name === role.emoji);

              if (emoji) {
                message.react(emoji).catch((error) => {
                  console.error("Error trying to react to message", error, role.emoji);
                });
              } else {
                console.error("Emoji not found", role.emoji);
              }
            } else {
              message.react(role.emoji).catch((error) => {
                console.error("Error trying to react to message", error, role.emoji);
              });
            }
          } catch (error) {
            console.log("Error trying to react to message", error);
          }
        });
      })
      .catch(console.error);
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

  private async fetchMember({
    guild,
    user,
  }: {
    guild: Guild;
    user: User | PartialUser;
  }): Promise<GuildMember | undefined> {
    try {
      if (user && guild) {
        // Fetch user
        const member = await guild?.members.fetch(user.id);

        return member;
      }
    } catch (error) {
      console.error("Error trying to fetch user", error);
    }

    return undefined;
  }

  async userRoles({
    type = "add",
    reaction,
    user,
  }: {
    type: "add" | "remove";
    reaction: MessageReaction | PartialMessageReaction;
    user: User | PartialUser;
  }): Promise<void> {
    if (user?.id === this.client.user?.id) return;

    // Get role by emoji
    const role = this.roles.find((r) => r.emoji === reaction.emoji.name);

    if (role && role.id) {
      try {
        const { guild } = reaction.message;

        if (guild) {
          // Add role to user
          const member = await this.fetchMember({ guild, user });

          if (member) {
            if (type === "add") {
              member.roles.add(role.id).catch((error) => {
                console.error("Error trying to add role to user", error);
              });
            } else {
              member.roles.remove(role.id).catch((error) => {
                console.error("Error trying to remove role to user", error);
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error trying to ${type} user/member role`, error);
      }
    }
  }
}
