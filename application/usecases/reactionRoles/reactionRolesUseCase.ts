import { Guild, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import ChatService from "../../../domain/service/chatService";
import LoggerService from "../../../domain/service/loggerService";
import { RoleInterface, RoleInterfaceMap } from "./interfaces/roleInterface";

export default class ReactionRolesUseCase {
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
    } else {
      this.roles = [];
    }
  }

  async execute({
    type,
    reaction,
    user,
  }: {
    type: "add" | "remove";
    reaction: MessageReaction | PartialMessageReaction;
    user: User | PartialUser;
  }): Promise<void> {
    const { message } = reaction;

    if (!message) {
      throw new Error("Message not found");
    }

    const { guild } = message;

    if (!guild) {
      throw new Error("Guild not found");
    }

    let userFetched = user as User;

    if (user.partial) {
      userFetched = await user.fetch();
    }

    const member = await this.chatService.getMember(guild, userFetched);

    if (!member) {
      throw new Error("Member not found");
    }

    const role = this.roles.find((r) => r.emoji === reaction.emoji.name);

    if (!role) {
      throw new Error("Role not found");
    }

    role.id = this.getRoleId({ guild, name: role.name });

    if (role.id) {
      if (type === "add") {
        await this.chatService.addMemberRole(member, role.id);
      } else {
        await this.chatService.removeMemberRole(member, role.id);
      }
    }
  }

  private getRoleId({ guild, name }: { guild: Guild; name: string }): string | null {
    const roleFound = guild.roles.cache.find((r) => r.name === name);

    return roleFound ? roleFound.id : null;
  }
}
