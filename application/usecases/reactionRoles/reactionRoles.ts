import { Client, TextChannel, User, MessageReaction, GuildMember } from "discord.js";
import LANGUAGES_MAP from "./roles/language";
import { RoleInterface } from "./roles/roleInterface";

export default class ReactionRoles {
  private client: Client;

  private channel: TextChannel;

  constructor({ client, channelId }: { client: Client; channelId: string }) {
    this.client = client;
    this.channel = this.client.channels.cache.get(channelId) as TextChannel;
  }

  async execute({ messageId }: { messageId: string }) {
    // Fetch message by id
    this.channel?.messages
      .fetch(messageId)
      .then(async (message) => {
        // Map roles with server id
        const roles = Object.values(LANGUAGES_MAP).reduce((prev, curr: RoleInterface) => {
          const currCopy = curr;

          if (!curr.id && message.guild?.roles?.cache) {
            const role = message.guild?.roles?.cache?.find((r) => r.name === curr.name);

            currCopy.id = role?.id || null;
          }

          prev.push(currCopy);

          return prev;
        }, [] as RoleInterface[]);

        // Read current reactions (if bot was offline)
        message.reactions.cache.forEach((reaction) => {
          // Fetch users who reacted with this emoji
          reaction.users.fetch().then((users) => {
            users.forEach(async (user) => {
              // If user is not a bot
              if (user.id === this.client.user?.id) return;

              // Get role by emoji
              const role = roles.find((r) => r.emoji === reaction.emoji.name);

              if (role && role.id) {
                try {
                  // Add role to user
                  const { guild } = message;

                  if (guild) {
                    const member = await guild.members.fetch(user.id);

                    if (member) {
                      member.roles.add(role.id).catch((error) => {
                        console.log(error);
                      });
                    } else {
                      console.log("member not found");
                    }
                  } else {
                    console.log("No guild");
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            });
          });
        });

        // Add roles emojies
        message.react("👍");
        message.react("👎");

        // Filter if raction is not from bot ID: 817875314742919198
        const filter = (reaction: MessageReaction, user: User) =>
          !!Object.values(LANGUAGES_MAP).find((role) => role.emoji === reaction.emoji.name) &&
          user.id !== this.client.user?.id;

        // Add reaction listener
        const reactionCollector = message.createReactionCollector({ filter, dispose: true });

        // Listen for added reactions
        reactionCollector.on("collect", async (reaction, user) => {
          // Get role by emoji
          const role = roles.find((r: any) => r.emoji === reaction.emoji.name);

          if (role && role.id) {
            try {
              // Add role to user
              const member = await this.fetchMember({ user });

              if (member) {
                member.roles.add(role.id);
              }
            } catch (error) {
              console.error(error);
            }
          }
        });

        // Listen for removed reactions
        // _Just works for reactions added after bot become online_
        // _Workaround: user must remove reaction, add and remove it again_
        reactionCollector.on("remove", async (reaction, user) => {
          // Get role by emoji
          const role = roles.find((r: any) => r.emoji === reaction.emoji.name);

          if (role && role.id) {
            try {
              // Add role to user
              const member = await this.fetchMember({ user });

              if (member) {
                member.roles.remove(role.id);
              }
            } catch (error) {
              console.error(error);
            }
          }
        });
      })
      .catch(console.error);
  }

  async fetchMember({ user }: { user: User }): Promise<GuildMember | undefined> {
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
}
