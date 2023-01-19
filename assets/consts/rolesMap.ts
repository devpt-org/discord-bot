import EXTRA_AREA_ROLES_MAP from "./extraAreaRolesMap";
import LANGUAGE_ROLES_MAP from "./languageRolesMap";
import AREA_ROLES_MAP from "./areaRolesMap";

const ROLES_MESSAGES_MAP = {
  AREA_ROLES_MAP: {
    id: "AREA_ROLES_MAP",
    content: `**Escolha as suas áreas**`,
    placeholder: `Selecione a área`,
    OPTIONS: Object.values(AREA_ROLES_MAP),
  },
  LANGUAGE_ROLES_MAP: {
    id: "LANGUAGE_ROLES_MAP",
    content: `**Escolha as suas linguagens de programação**`,
    placeholder: `Selecione a linguagem de programação`,
    OPTIONS: Object.values(LANGUAGE_ROLES_MAP),
  },
  EXTRA_AREA_ROLES_MAP: {
    id: "EXTRA_AREA_ROLES_MAP",
    content: `**Escolha as suas áreas extra**`,
    placeholder: `Selecione a área extra`,
    OPTIONS: Object.values(EXTRA_AREA_ROLES_MAP),
  },
};

export default ROLES_MESSAGES_MAP;
