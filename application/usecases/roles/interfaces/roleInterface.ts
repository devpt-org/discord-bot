/**
 * To use/map native emojis, you need to use discord chat
 * type \:emoji_name: and copy the result
 * For example: \:smile: and copy the result
 * */
export interface RoleInterface {
  id: string | null;
  value: string;
  name: string;
  emoji: string;
  native?: boolean;
}
