import { Client, TextChannel, User, MessageReaction, GuildMember, Guild } from "discord.js";
import { RoleInterface, RoleInterfaceMap } from "./roles/roleInterface";

export default class ReactionRoles {
  private client: Client;

  private channel: TextChannel;

  private guild: Guild;

  constructor({ client, channelId }: { client: Client; channelId: string }) {
    this.client = client;
    this.channel = this.client.channels.cache.get(channelId) as TextChannel;
    this.guild = this.channel.guild;
  }

  async execute({ messageId, rolesMap }: { messageId: string; rolesMap: RoleInterfaceMap }): Promise<void> {
    // Fetch message by id
    this.channel?.messages
      .fetch(messageId)
      .then(async (message) => {
        // Map roles with server role id
        const roles = this.mapRolesId(rolesMap);

        // Read current reactions (if bot was offline)
        message.reactions.cache.forEach((reaction) => {
          // Fetch users who reacted with this emoji
          reaction.users.fetch().then((users) => {
            users.forEach(async (user) => {
              // If user is not the bot
              if (user.id === this.client.user?.id) return;

              // Get role by emoji
              const role = roles.find((r) => r.emoji === reaction.emoji.name);

              if (role && role.id) {
                try {
                  const member = await this.guild.members.fetch(user.id);

                  if (member) {
                    member.roles.add(role.id).catch((error) => {
                      console.log(error);
                    });
                  } else {
                    console.log("member not found");
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            });
          });
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

  private mapRolesId(roleMap: RoleInterfaceMap): RoleInterface[] {
    return Object.values(roleMap).reduce((prev, curr: RoleInterface) => {
      const currCopy = curr;

      // If role doesn't have id configured, fetch it
      if (!curr.id && this.guild.roles?.cache) {
        const role = this.guild.roles?.cache?.find((r) => r.name === curr.name);

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
      console.error(error);
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
            member.roles.add(role.id);
          } else {
            member.roles.remove(role.id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
