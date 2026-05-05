"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MonsterArtwork } from "@/src/components/MonsterArtwork";
import { characters } from "@/src/data/characters";
import type { MonsterCharacter } from "@/src/data/characters";

const STORAGE_KEY = "monster-gacha-collection-v2";
const DUPLICATE_FRAGMENT_GAIN = 25;
const NEW_BADGE_TTL_MS = 1000 * 60 * 60 * 24;

type GachaPhase = "idle" | "drawing" | "reveal";

type GachaRarity = "normal" | "rare" | "superRare" | "legend" | "mythic";

type OwnedCard = {
  monsterId: string;
  level: number;
  fragments: number;
  obtainedAt: string;
  count: number;
  isNew: boolean;
};

type OwnedCardMap = Record<string, OwnedCard>;

type DrawResult = {
  character: MonsterCharacter;
  rarity: GachaRarity;
  isNew: boolean;
  fragmentGain: number;
};

const rarityChanceTable: Array<{ rarity: GachaRarity; chance: number }> = [
  { rarity: "normal", chance: 50 },
  { rarity: "rare", chance: 30 },
  { rarity: "superRare", chance: 15 },
  { rarity: "legend", chance: 4 },
  { rarity: "mythic", chance: 1 },
];

const gameRarityToGachaRarity: Record<MonsterCharacter["rarity"], GachaRarity> = {
  N: "normal",
  R: "rare",
  SR: "superRare",
  SSR: "legend",
  UR: "mythic",
};

const rarityLabel: Record<GachaRarity, string> = {
  normal: "ノーマル",
  rare: "レア",
  superRare: "スーパーレア",
  legend: "レジェンド",
  mythic: "神レア",
};

const rarityBadge: Record<GachaRarity, string> = {
  normal: "border-zinc-300 bg-zinc-200 text-black",
  rare: "border-emerald-200 bg-emerald-300 text-black",
  superRare: "border-sky-200 bg-sky-300 text-black",
  legend: "border-purple-200 bg-purple-300 text-black",
  mythic: "border-amber-100 bg-amber-300 text-black",
};

const pickRarityByChance = (): GachaRarity => {
  const roll = Math.random() * 100;
  let threshold = 0;

  for (const row of rarityChanceTable) {
    threshold += row.chance;
    if (roll < threshold) {
      return row.rarity;
    }
  }

  return "normal";
};

const pullCharacter = (): { character: MonsterCharacter; rarity: GachaRarity } => {
  const rarity = pickRarityByChance();
  const pool = characters.filter(
    (character) => gameRarityToGachaRarity[character.rarity] === rarity,
  );

  const selectedPool = pool.length > 0 ? pool : characters;
  const index = Math.floor(Math.random() * selectedPool.length);

  return {
    character: selectedPool[index] ?? characters[0],
    rarity,
  };
};

const buildResultText = (result: DrawResult): string => {
  if (result.isNew) {
    return "NEW！";
  }

  return "かけらゲット！";
};

const loadOwnedCards = (): OwnedCardMap => {
  if (typeof window === "undefined") {
    return {};
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as OwnedCardMap;
  } catch {
    return {};
  }
};

const isFreshCard = (obtainedAt: string): boolean => {
  const obtainedAtMs = Date.parse(obtainedAt);
  if (Number.isNaN(obtainedAtMs)) {
    return false;
  }
  return Date.now() - obtainedAtMs <= NEW_BADGE_TTL_MS;
};

export default function GachaPage() {
  const [phase, setPhase] = useState<GachaPhase>("idle");
  const [drawResults, setDrawResults] = useState<DrawResult[]>([]);
  const [drawCountLabel, setDrawCountLabel] = useState("1回召喚");
  const [ownedCards, setOwnedCards] = useState<OwnedCardMap>(() => loadOwnedCards());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedCards));
  }, [ownedCards]);

  const ownedList = useMemo(() => {
    return Object.values(ownedCards)
      .map((owned) => ({
        owned,
        character: characters.find((character) => character.id === owned.monsterId),
      }))
      .filter((row): row is { owned: OwnedCard; character: MonsterCharacter } => Boolean(row.character))
      .sort((a, b) => {
        const rarityDiff =
          rarityChanceTable.findIndex((item) => item.rarity === gameRarityToGachaRarity[b.character.rarity]) -
          rarityChanceTable.findIndex((item) => item.rarity === gameRarityToGachaRarity[a.character.rarity]);

        if (rarityDiff !== 0) {
          return rarityDiff;
        }

        return b.owned.count - a.owned.count;
      });
  }, [ownedCards]);

  const runDraw = (count: number) => {
    if (phase === "drawing") {
      return;
    }

    setPhase("drawing");
    setDrawResults([]);
    setDrawCountLabel(count === 10 ? "10連召喚" : "1回召喚");

    window.setTimeout(() => {
      const now = new Date().toISOString();
      const results: DrawResult[] = [];

      setOwnedCards((previous) => {
        const next = { ...previous };

        for (let index = 0; index < count; index += 1) {
          const pulled = pullCharacter();
          const existing = next[pulled.character.id];

          if (!existing) {
            next[pulled.character.id] = {
              monsterId: pulled.character.id,
              level: 1,
              fragments: 0,
              obtainedAt: now,
              count: 1,
              isNew: true,
            };
            results.push({
              character: pulled.character,
              rarity: pulled.rarity,
              isNew: true,
              fragmentGain: 0,
            });
            continue;
          }

          const fragmentGain = DUPLICATE_FRAGMENT_GAIN;
          next[pulled.character.id] = {
            ...existing,
            fragments: existing.fragments + fragmentGain,
            count: existing.count + 1,
            isNew: false,
          };
          results.push({
            character: pulled.character,
            rarity: pulled.rarity,
            isNew: false,
            fragmentGain,
          });
        }

        return next;
      });

      setDrawResults(results);
      setPhase("reveal");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-50">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="fantasy-kicker text-amber-300">FREE GACHA</p>
            <h1 className="mt-2 text-4xl font-black">モンスター召喚</h1>
            <p className="mt-3 text-sm text-zinc-300">召喚！ カードを集めよう！</p>
          </div>
          <Link href="/" className="fantasy-button fantasy-button-gold">
            トップへ
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="fantasy-panel p-5">
            <p className="text-xs font-black tracking-[0.16em] text-red-300">召喚結果</p>
            <div className="mt-4 min-h-[23rem] rounded-lg border border-amber-300/25 bg-zinc-950/80 p-4">
              {phase === "drawing" ? (
                <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
                  <div className="h-24 w-24 animate-spin rounded-full border-4 border-amber-200/35 border-t-amber-200" />
                  <p className="text-xl font-black text-amber-100">召喚中...</p>
                </div>
              ) : drawResults.length > 0 ? (
                <div>
                  <p className="mb-3 text-sm font-black text-amber-200">{drawCountLabel}の結果</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {drawResults.map((result, index) => (
                      <article key={`${result.character.id}-${index}`} className="rounded-lg border border-white/10 bg-black/45 p-3">
                        <div className={`relative min-h-40 overflow-hidden rounded-md bg-gradient-to-br ${result.character.themeColor}`}>
                          <MonsterArtwork
                            character={result.character}
                            imageClassName="object-cover object-[50%_24%]"
                            sizes="(max-width: 768px) 100vw, 24vw"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85),transparent_65%)]" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-sm font-black text-zinc-50">{result.character.name}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className={`fantasy-badge ${rarityBadge[result.rarity]}`}>{rarityLabel[result.rarity]}</span>
                          <span className="text-xs font-black text-amber-100">
                            {buildResultText(result)}
                            {result.fragmentGain > 0 ? ` +${result.fragmentGain}` : ""}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 text-center">
                  <p className="text-2xl font-black text-amber-100">召喚！</p>
                  <p className="text-sm text-zinc-300">1回か10連をえらんでね。</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => runDraw(1)}
                disabled={phase === "drawing"}
                className="fantasy-button fantasy-button-red min-h-12 disabled:cursor-not-allowed disabled:opacity-60"
              >
                1回召喚
              </button>
              <button
                type="button"
                onClick={() => runDraw(10)}
                disabled={phase === "drawing"}
                className="fantasy-button fantasy-button-purple min-h-12 disabled:cursor-not-allowed disabled:opacity-60"
              >
                10連召喚
              </button>
              <button
                type="button"
                onClick={() => {
                  setOwnedCards({});
                  setDrawResults([]);
                  setPhase("idle");
                }}
                className="fantasy-button fantasy-button-gold min-h-12"
              >
                リセット
              </button>
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              確率: normal 50% / rare 30% / superRare 15% / legend 4% / mythic 1%
            </p>
          </section>

          <section className="fantasy-panel p-5">
            <p className="text-xs font-black tracking-[0.16em] text-purple-200">所持カード</p>
            <p className="mt-2 text-sm text-zinc-300">所持種類: {ownedList.length} / {characters.length}</p>

            <div className="mt-4 space-y-3">
              {ownedList.length === 0 ? (
                <p className="rounded-md border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">まだ0枚だよ。もう一回！</p>
              ) : (
                ownedList.map(({ character, owned }) => (
                  <article key={character.id} className="rounded-lg border border-white/10 bg-black/45 p-3">
                    <div className="flex items-center gap-3">
                      <div className={`relative h-20 w-20 overflow-hidden rounded-md bg-gradient-to-br ${character.themeColor}`}>
                        <MonsterArtwork
                          character={character}
                          imageClassName="object-cover object-[50%_24%]"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-black text-zinc-50">{character.name}</p>
                          {owned.isNew && isFreshCard(owned.obtainedAt) ? (
                            <span className="rounded bg-amber-300 px-2 py-0.5 text-xs font-black text-black">NEW！</span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-zinc-300">Lv {owned.level} / 所持 {owned.count}</p>
                        <p className="mt-1 text-xs text-zinc-400">かけら {owned.fragments}</p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
