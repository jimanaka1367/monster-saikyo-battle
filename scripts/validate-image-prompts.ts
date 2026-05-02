import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ImagePromptMonster = {
  id?: unknown;
  name?: unknown;
  slug?: unknown;
  normalFile?: unknown;
  battleFile?: unknown;
  normalPrompt?: unknown;
  battlePrompt?: unknown;
};

type ImagePromptData = {
  version?: unknown;
  commonTemplates?: {
    normal?: unknown;
    battle?: unknown;
  };
  monsters?: unknown;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const promptPath = path.join(repoRoot, "data", "monster-image-prompts.json");
const requiredMonsterFields = [
  "id",
  "slug",
  "normalFile",
  "battleFile",
  "normalPrompt",
  "battlePrompt",
] as const;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validate = async () => {
  const raw = await readFile(promptPath, "utf8");
  const data = JSON.parse(raw) as ImagePromptData;
  const errors: string[] = [];

  if (!data.commonTemplates || typeof data.commonTemplates !== "object") {
    errors.push("commonTemplates is missing.");
  } else {
    if (!isNonEmptyString(data.commonTemplates.normal)) {
      errors.push("commonTemplates.normal is missing or empty.");
    }

    if (!isNonEmptyString(data.commonTemplates.battle)) {
      errors.push("commonTemplates.battle is missing or empty.");
    }
  }

  if (!Array.isArray(data.monsters)) {
    errors.push("monsters must be an array.");
  } else {
    if (data.monsters.length !== 30) {
      errors.push(`monsters must contain 30 items, got ${data.monsters.length}.`);
    }

    const ids = new Set<string>();
    const slugs = new Set<string>();

    data.monsters.forEach((monsterValue, index) => {
      const monster = monsterValue as ImagePromptMonster;
      const label = isNonEmptyString(monster.id)
        ? monster.id
        : `monsters[${index}]`;

      for (const field of requiredMonsterFields) {
        if (!isNonEmptyString(monster[field])) {
          errors.push(`${label}: ${field} is missing or empty.`);
        }
      }

      if (isNonEmptyString(monster.id)) {
        if (ids.has(monster.id)) {
          errors.push(`${label}: duplicate id.`);
        }
        ids.add(monster.id);
      }

      if (isNonEmptyString(monster.slug)) {
        if (slugs.has(monster.slug)) {
          errors.push(`${label}: duplicate slug.`);
        }
        slugs.add(monster.slug);
      }

      if (
        isNonEmptyString(monster.normalFile) &&
        !monster.normalFile.endsWith(".png")
      ) {
        errors.push(`${label}: normalFile must end with .png.`);
      }

      if (
        isNonEmptyString(monster.battleFile) &&
        !monster.battleFile.endsWith("-battle.png")
      ) {
        errors.push(`${label}: battleFile must end with -battle.png.`);
      }
    });
  }

  if (errors.length > 0) {
    console.error("Image prompt validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Image prompt validation passed.");
  console.log(`- JSON: ${promptPath}`);
  console.log("- commonTemplates.normal: ok");
  console.log("- commonTemplates.battle: ok");
  console.log(`- monsters: ${(data.monsters as unknown[]).length}`);
};

validate().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
