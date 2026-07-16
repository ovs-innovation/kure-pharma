import {
  CATEGORY_THERAPY_ICON_BY_NAME,
  CATEGORY_THERAPY_ICON_MAP,
  IconAwarenessRibbon,
} from "@components/home/CategoryTherapyIcons";

const normalizeKey = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCategoryTherapyIcon = (category) => {
  if (!category) return IconAwarenessRibbon;

  if (category.icon && CATEGORY_THERAPY_ICON_MAP[category.icon]) {
    return CATEGORY_THERAPY_ICON_MAP[category.icon];
  }

  if (CATEGORY_THERAPY_ICON_BY_NAME[category.name]) {
    return CATEGORY_THERAPY_ICON_BY_NAME[category.name];
  }

  if (CATEGORY_THERAPY_ICON_BY_NAME[category.category]) {
    return CATEGORY_THERAPY_ICON_BY_NAME[category.category];
  }

  const key = normalizeKey(category.category || category.name);
  if (key.includes("anti-cancer")) return CATEGORY_THERAPY_ICON_MAP["anti-cancer"];
  if (key.includes("oncology")) return CATEGORY_THERAPY_ICON_MAP.oncology;
  if (key.includes("critical")) return CATEGORY_THERAPY_ICON_MAP["critical-care"];
  if (key.includes("lifesav")) return CATEGORY_THERAPY_ICON_MAP.lifesaving;
  if (key.includes("imported")) return CATEGORY_THERAPY_ICON_MAP.imported;
  if (key === "hiv" || key.includes("hiv")) return CATEGORY_THERAPY_ICON_MAP.hiv;
  if (key.includes("nephrology")) return CATEGORY_THERAPY_ICON_MAP.nephrology;
  if (key.includes("immuno")) return CATEGORY_THERAPY_ICON_MAP.oncology;
  if (key.includes("target")) return CATEGORY_THERAPY_ICON_MAP["anti-cancer"];

  return IconAwarenessRibbon;
};

export const renderCategoryTherapyIcon = (
  category,
  className = "kure-cat-circle__icon",
) => {
  const Icon = getCategoryTherapyIcon(category);
  return <Icon className={className} aria-hidden />;
};
