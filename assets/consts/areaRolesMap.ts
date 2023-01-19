import { RoleInterface } from "../interfaces/roleInterface";

const AREA_ROLES_MAP: Record<string, RoleInterface> = {
  SECURITY: {
    id: null,
    value: "SECURITY",
    name: "Security",
    emoji: "🛡️",
    native: true,
  },
  BACKEND: {
    id: null,
    value: "BACKEND",
    name: "Back End",
    emoji: "✨",
    native: true,
  },
  FRONTEND: {
    id: null,
    value: "FRONTEND",
    name: "Front End",
    emoji: "💻",
    native: true,
  },
  ANDROID: {
    id: null,
    value: "ANDROID",
    name: "Android",
    emoji: "📱",
    native: true,
  },
  IOS: {
    id: null,
    value: "IOS",
    name: "iOS",
    emoji: "🍏",
    native: true,
  },
  DEVOPS: {
    id: null,
    value: "DEVOPS",
    name: "DevOps",
    emoji: "🧰",
    native: true,
  },
  GAMEDEV: {
    id: null,
    value: "GAMEDEV",
    name: "Game Dev",
    emoji: "🎮",
    native: true,
  },
  IOT: {
    id: null,
    value: "IOT",
    name: "IoT",
    emoji: "🖲️",
    native: true,
  },
};

export default AREA_ROLES_MAP;
