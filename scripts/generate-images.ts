import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

type ImageMode = "normal" | "battle";
type RunMode = ImageMode | "all" | "missing";

type PromptMonster = {
  id: string;
  name: string;
  slug: string;
  normalPrompt: string;
  battlePrompt: string;
};

type PromptData = {
  version: number;
  templates: Record<ImageMode, string>;
  monsters: PromptMonster[];
};

type StatusItem = {
  status: "generated" | "skipped" | "failed" | "dry-run";
  outputPath: string;
  promptHash: string;
  updatedAt: string;
  message?: string;
};

type GenerationStatus = {
  version: number;
  updatedAt: string | null;
  items: Record<string, StatusItem>;
};

type GenerateImageInput = {
  id: string;
  name: string;
  slug: string;
  mode: ImageMode;
  prompt: string;
  outputPath: string;
};

type ImageGeneratorModule = {
  generateImage: (input: GenerateImageInput) => Promise<void>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const promptPath = path.join(repoRoot, "data", "monster-image-prompts.json");
const statusPath = path.join(__dirname, "generation-status.json");
const normalOutputDir = path.join(repoRoot, "public", "images", "characters");
const battleOutputDir = path.join(
  repoRoot,
  "public",
  "images",
  "characters",
  "battle",
);

const parseArgs = () => {
  const args = process.argv.slice(2);
  const readValue = (name: string) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const mode = (readValue("--mode") ?? "missing") as RunMode;
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const limitValue = readValue("--limit");
  const limit = limitValue ? Number(limitValue) : undefined;

  if (!["normal", "battle", "all", "missing"].includes(mode)) {
    throw new Error(`Unsupported --mode "${mode}". Use normal, battle, all, or missing.`);
  }

  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }

  return { mode, dryRun, force, limit };
};

const readJson = async <T>(filePath: string): Promise<T> => {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
};

const writeJson = async (filePath: string, value: unknown) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const createPrompt = (
  template: string,
  characterPrompt: string,
  monster: PromptMonster,
): string => {
  return template
    .replace("{{characterPrompt}}", characterPrompt)
    .replace("{{id}}", monster.id)
    .replace("{{name}}", monster.name)
    .replace("{{slug}}", monster.slug);
};

const outputPathFor = (slug: string, mode: ImageMode): string => {
  if (mode === "battle") {
    return path.join(battleOutputDir, `${slug}-battle.png`);
  }

  return path.join(normalOutputDir, `${slug}.png`);
};

const statusKeyFor = (id: string, mode: ImageMode) => `${id}:${mode}`;

const hashPrompt = (prompt: string): string => {
  let hash = 0;

  for (let index = 0; index < prompt.length; index += 1) {
    hash = (hash * 31 + prompt.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
};

const loadStatus = async (): Promise<GenerationStatus> => {
  if (!existsSync(statusPath)) {
    return { version: 1, updatedAt: null, items: {} };
  }

  return readJson<GenerationStatus>(statusPath);
};

const loadGenerator = async (): Promise<ImageGeneratorModule> => {
  const modulePath = process.env.MONSTER_IMAGE_GENERATOR_MODULE;

  if (!modulePath) {
    throw new Error(
      "MONSTER_IMAGE_GENERATOR_MODULE is not set. Run with --dry-run, or set it to a module exporting generateImage(input).",
    );
  }

  const resolvedPath = path.isAbsolute(modulePath)
    ? modulePath
    : path.join(repoRoot, modulePath);
  const moduleUrl = pathToFileURL(resolvedPath).href;
  const loaded = (await import(moduleUrl)) as Partial<ImageGeneratorModule>;

  if (typeof loaded.generateImage !== "function") {
    throw new Error(
      `Generator module must export generateImage(input). Module: ${resolvedPath}`,
    );
  }

  return { generateImage: loaded.generateImage };
};

const modesForRun = (mode: RunMode): ImageMode[] =>
  mode === "all" || mode === "missing" ? ["normal", "battle"] : [mode];

const main = async () => {
  const { mode, dryRun, force, limit } = parseArgs();
  const promptData = await readJson<PromptData>(promptPath);
  const status = await loadStatus();
  const generator = dryRun ? null : await loadGenerator();
  const modes = modesForRun(mode);
  let processed = 0;

  await mkdir(normalOutputDir, { recursive: true });
  await mkdir(battleOutputDir, { recursive: true });

  for (const monster of promptData.monsters) {
    for (const imageMode of modes) {
      if (limit !== undefined && processed >= limit) {
        break;
      }

      const characterPrompt =
        imageMode === "battle" ? monster.battlePrompt : monster.normalPrompt;
      const prompt = createPrompt(
        promptData.templates[imageMode],
        characterPrompt,
        monster,
      );
      const outputPath = outputPathFor(monster.slug, imageMode);
      const promptHash = hashPrompt(prompt);
      const statusKey = statusKeyFor(monster.id, imageMode);
      const outputExists = existsSync(outputPath);
      const statusMatches =
        status.items[statusKey]?.status === "generated" &&
        status.items[statusKey]?.promptHash === promptHash;
      const shouldSkip =
        !force &&
        (outputExists || (mode === "missing" && statusMatches));

      if (shouldSkip) {
        status.items[statusKey] = {
          status: "skipped",
          outputPath,
          promptHash,
          updatedAt: new Date().toISOString(),
          message: outputExists ? "Output file already exists." : "Status already generated.",
        };
        processed += 1;
        console.log(`[skip] ${monster.id} ${imageMode}`);
        continue;
      }

      if (dryRun) {
        status.items[statusKey] = {
          status: "dry-run",
          outputPath,
          promptHash,
          updatedAt: new Date().toISOString(),
          message: prompt,
        };
        processed += 1;
        console.log(`[dry-run] ${monster.id} ${imageMode} -> ${outputPath}`);
        continue;
      }

      if (!generator) {
        throw new Error("Image generator is not available.");
      }

      try {
        await generator.generateImage({
          id: monster.id,
          name: monster.name,
          slug: monster.slug,
          mode: imageMode,
          prompt,
          outputPath,
        });
        status.items[statusKey] = {
          status: "generated",
          outputPath,
          promptHash,
          updatedAt: new Date().toISOString(),
        };
        processed += 1;
        console.log(`[generated] ${monster.id} ${imageMode}`);
      } catch (error) {
        status.items[statusKey] = {
          status: "failed",
          outputPath,
          promptHash,
          updatedAt: new Date().toISOString(),
          message: error instanceof Error ? error.message : String(error),
        };
        status.updatedAt = new Date().toISOString();
        await writeJson(statusPath, status);
        throw error;
      }
    }

    if (limit !== undefined && processed >= limit) {
      break;
    }
  }

  status.updatedAt = new Date().toISOString();
  await writeJson(statusPath, status);
  console.log(`Done. Processed ${processed} image task(s).`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
