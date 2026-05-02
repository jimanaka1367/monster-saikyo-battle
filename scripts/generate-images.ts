import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ImageType = "normal" | "battle";
type RequestedType = ImageType | "all";

type PromptMonster = {
  id: string;
  name: string;
  slug: string;
  normalFile: string;
  battleFile: string;
  normalPrompt: string;
  battlePrompt: string;
};

type PromptData = {
  version: number;
  description?: string;
  commonTemplates: Record<ImageType, string>;
  monsters: PromptMonster[];
};

type TypeStatus = {
  generated: boolean;
  file: string;
  updatedAt: string | null;
  skipped?: boolean;
  dryRun?: boolean;
  promptHash?: string;
  error?: string;
};

type MonsterStatus = Partial<Record<ImageType, TypeStatus>>;
type GenerationStatus = Record<string, MonsterStatus>;

type GenerateTask = {
  monster: PromptMonster;
  type: ImageType;
  prompt: string;
  absoluteOutputPath: string;
  relativeOutputPath: string;
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

const readValue = (args: string[], name: string) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const requestedType = (readValue(args, "--type") ??
    readValue(args, "--mode") ??
    "all") as RequestedType;
  const id = readValue(args, "--id");
  const limitValue = readValue(args, "--limit");
  const limit = limitValue ? Number(limitValue) : undefined;
  const force = args.includes("--force");
  const dryRun = args.includes("--dry-run");

  if (!["normal", "battle", "all"].includes(requestedType)) {
    throw new Error('Unsupported --type. Use "normal", "battle", or "all".');
  }

  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }

  return { requestedType, id, limit, force, dryRun };
};

const readJson = async <T>(filePath: string): Promise<T> => {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
};

const writeJson = async (filePath: string, value: unknown) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const loadEnvFile = async (fileName: string) => {
  const filePath = path.join(repoRoot, fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const content = await readFile(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

const loadLocalEnv = async () => {
  await loadEnvFile(".env.local");
  await loadEnvFile(".env");
};

export const buildPrompt = (
  template: string,
  characterPrompt: string,
): string => `${template}\n\n${characterPrompt}`;

const promptHash = (prompt: string): string => {
  let hash = 0;

  for (let index = 0; index < prompt.length; index += 1) {
    hash = (hash * 31 + prompt.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
};

const normalizeRelativePath = (filePath: string): string =>
  path.relative(repoRoot, filePath).replaceAll(path.sep, "/");

const outputPathFor = (monster: PromptMonster, type: ImageType) => {
  const absoluteOutputPath =
    type === "normal"
      ? path.join(normalOutputDir, monster.normalFile)
      : path.join(battleOutputDir, monster.battleFile);

  return {
    absoluteOutputPath,
    relativeOutputPath: normalizeRelativePath(absoluteOutputPath),
  };
};

const imageTypesFor = (requestedType: RequestedType): ImageType[] =>
  requestedType === "all" ? ["normal", "battle"] : [requestedType];

const loadStatus = async (): Promise<GenerationStatus> => {
  if (!existsSync(statusPath)) {
    return {};
  }

  const parsed = await readJson<unknown>(statusPath);

  if (
    parsed &&
    typeof parsed === "object" &&
    "items" in parsed &&
    (parsed as { items?: unknown }).items
  ) {
    return {};
  }

  return parsed as GenerationStatus;
};

export const updateStatus = async (
  status: GenerationStatus,
  task: GenerateTask,
  nextStatus: Omit<TypeStatus, "file">,
) => {
  status[task.monster.id] ??= {};
  status[task.monster.id][task.type] = {
    ...nextStatus,
    file: task.relativeOutputPath,
  };
  await writeJson(statusPath, status);
};

export const saveImage = async (
  outputPath: string,
  image: { b64Json?: string; url?: string },
) => {
  await mkdir(path.dirname(outputPath), { recursive: true });

  if (image.b64Json) {
    await writeFile(outputPath, Buffer.from(image.b64Json, "base64"));
    return;
  }

  if (image.url) {
    const response = await fetch(image.url);

    if (!response.ok) {
      throw new Error(`Failed to download image URL: ${response.status}`);
    }

    await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
    return;
  }

  throw new Error("Image API response did not include b64_json or url.");
};

export const generateImage = async (task: GenerateTask) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.IMAGE_MODEL ?? "gpt-image-2";
  const apiUrl =
    process.env.OPENAI_IMAGE_API_URL ??
    "https://api.openai.com/v1/images/generations";

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local or export it before running without --dry-run.",
    );
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: task.prompt,
      size: process.env.IMAGE_SIZE ?? "1024x1536",
      response_format: "b64_json",
    }),
  });

  const responseBody = (await response.json().catch(() => null)) as
    | {
        data?: Array<{ b64_json?: string; url?: string }>;
        error?: { message?: string };
      }
    | null;

  if (!response.ok) {
    throw new Error(
      responseBody?.error?.message ??
        `Image API request failed with status ${response.status}.`,
    );
  }

  const image = responseBody?.data?.[0];

  if (!image) {
    throw new Error("Image API response did not include data[0].");
  }

  await saveImage(task.absoluteOutputPath, {
    b64Json: image.b64_json,
    url: image.url,
  });
};

const createTasks = (
  promptData: PromptData,
  requestedType: RequestedType,
  id?: string,
): GenerateTask[] => {
  const selectedMonsters = id
    ? promptData.monsters.filter((monster) => monster.id === id)
    : promptData.monsters;

  if (id && selectedMonsters.length === 0) {
    throw new Error(`Monster id not found: ${id}`);
  }

  return selectedMonsters.flatMap((monster) =>
    imageTypesFor(requestedType).map((type) => {
      const characterPrompt =
        type === "normal" ? monster.normalPrompt : monster.battlePrompt;
      const { absoluteOutputPath, relativeOutputPath } = outputPathFor(
        monster,
        type,
      );

      return {
        monster,
        type,
        prompt: buildPrompt(promptData.commonTemplates[type], characterPrompt),
        absoluteOutputPath,
        relativeOutputPath,
      };
    }),
  );
};

const printDryRun = (task: GenerateTask, skipped: boolean) => {
  console.log(
    `[dry-run${skipped ? ":skip-existing" : ""}] ${task.monster.id} ${task.type}`,
  );
  console.log(`file: ${task.relativeOutputPath}`);
  console.log(`prompt:\n${task.prompt}`);
  console.log("---");
};

const main = async () => {
  await loadLocalEnv();

  const { requestedType, id, limit, force, dryRun } = parseArgs();
  const promptData = await readJson<PromptData>(promptPath);
  const status = await loadStatus();
  const tasks = createTasks(promptData, requestedType, id).slice(0, limit);
  let generated = 0;
  let skipped = 0;

  await mkdir(normalOutputDir, { recursive: true });
  await mkdir(battleOutputDir, { recursive: true });

  for (const task of tasks) {
    const now = new Date().toISOString();
    const exists = existsSync(task.absoluteOutputPath);
    const hash = promptHash(task.prompt);

    if (dryRun) {
      printDryRun(task, exists && !force);
      await updateStatus(status, task, {
        generated: false,
        skipped: exists && !force,
        dryRun: true,
        updatedAt: now,
        promptHash: hash,
      });
      continue;
    }

    if (exists && !force) {
      skipped += 1;
      console.log(`[skip] ${task.monster.id} ${task.type}: ${task.relativeOutputPath}`);
      await updateStatus(status, task, {
        generated: true,
        skipped: true,
        updatedAt: now,
        promptHash: hash,
      });
      continue;
    }

    try {
      console.log(`[generate] ${task.monster.id} ${task.type}`);
      await generateImage(task);
      generated += 1;
      await updateStatus(status, task, {
        generated: true,
        skipped: false,
        updatedAt: new Date().toISOString(),
        promptHash: hash,
      });
    } catch (error) {
      await updateStatus(status, task, {
        generated: false,
        skipped: false,
        updatedAt: new Date().toISOString(),
        promptHash: hash,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  console.log(
    `Done. tasks=${tasks.length}, generated=${generated}, skipped=${skipped}, dryRun=${dryRun}`,
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
