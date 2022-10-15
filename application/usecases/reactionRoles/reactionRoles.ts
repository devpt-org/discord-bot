import { Client, TextChannel, User, MessageReaction, GuildMember, Guild, GuildEmoji } from "discord.js";
import { RoleInterface, RoleInterfaceMap } from "./interfaces/roleInterface";

export default class ReactionRoles {
  private client: Client;

  private channel: TextChannel;

  constructor({ client, channelId }: { client: Client; channelId: string }) {
    this.client = client;
    this.channel = this.client.channels.cache.get(channelId) as TextChannel;

    if (!this.channel) {
      throw new Error("Channel not found");
    }
  }

  async execute({ messageId, rolesMap }: { messageId: string; rolesMap: RoleInterfaceMap }): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not found");
    }

    console.log("Reaction roles started", messageId);

    // Fetch message by id
    this.channel?.messages
      .fetch(messageId)
      .then(async (message) => {
        const { guild } = message;

        if (!guild) {
          throw new Error("Guild not found");
        }

        // Map roles with server role id
        const roles = this.mapRolesId({ guild, map: rolesMap });

        // Read current reactions (if bot was offline)
        message.reactions.cache.forEach((reaction) => {
          // Fetch users who reacted with this emoji
          reaction.users.fetch().then((users) => {
            users.forEach(async (user) => {
              // If user is not the bot
              if (user.id === this.client.user?.id) return;

              // Add role to user
              await this.userRoles({ type: "add", reaction, user, roles });
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

        // Filter if raction is not from the bot
        // And for valid roles emojis
        const filter = (reaction: MessageReaction, user: User) =>
          !!Object.values(rolesMap).find((role) => role.emoji === reaction.emoji.name) &&
          user.id !== this.client.user?.id;

        // Add reaction listener
        // Dispose true: to listen remove reaction
        const reactionCollector = message.createReactionCollector({ filter, dispose: true });

        // Listen for added reactions
        reactionCollector.on("collect", async (reaction, user) =>
          this.userRoles({ type: "add", roles, reaction, user })
        );

        // Listen for removed reactions
        // _Just works for reactions added after bot become online_
        // _Workaround: user must remove reaction, add and remove it again_
        reactionCollector.on("remove", async (reaction, user) =>
          this.userRoles({ type: "remove", roles, reaction, user })
        );
      })
      .catch(console.error);
  }

  private mapRolesId({ guild, map }: { guild: Guild; map: RoleInterfaceMap }): RoleInterface[] {
    return Object.values(map).reduce((prev, curr: RoleInterface) => {
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

  private async fetchMember({ user }: { user: User }): Promise<GuildMember | undefined> {
    try {
      if (user) {
        // Fetch user
        const member = await this.channel.guild?.members.fetch(user.id);

        return member;
      }
    } catch (error) {
      console.error("Error trying to fetch user", error);
    }

    return undefined;
  }

  private async userRoles({
    type = "add",
    reaction,
    user,
    roles,
  }: {
    type: "add" | "remove";
    reaction: MessageReaction;
    user: User;
    roles: RoleInterface[];
  }): Promise<void> {
    // Get role by emoji
    const role = roles.find((r) => r.emoji === reaction.emoji.name);

    if (role && role.id) {
      try {
        // Add role to user
        const member = await this.fetchMember({ user });

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
      } catch (error) {
        console.error(`Error trying to ${type} user/member role`, error);
      }
    }
  }
}
