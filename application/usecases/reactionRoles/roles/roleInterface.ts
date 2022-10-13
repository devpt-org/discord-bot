export interface RoleInterfaceMap {
  [key: string]: RoleInterface;
}

export interface RoleInterface {
  id: string | null;
  name: string;
  emoji: string;
}
