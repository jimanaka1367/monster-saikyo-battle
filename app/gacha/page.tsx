"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MonsterArtwork } from "@/src/components/MonsterArtwork";
import { characters } from "@/src/data/characters";
import type { MonsterCharacter } from "@/src/data/characters";

const STORAGE_KEY = "monster-gacha-owned-cards";

type GachaPhase = "idle" | "drawing" | "reveal";

type OwnedCards = Record<string, number>;

const rarityWeight: Record<MonsterCharacter["rarity"], number> = {
  UR: 4,
  SSR: 10,
  SR: 24,
  R: 30,
  N: 32,
};

const rarityStyle: Record<MonsterCharacter["rarity"], string> = {
  UR: "border-amber-100 bg-amber-300 text-black",
  SSR: "border-purple-200 bg-purple-300 text-black",
  SR: "border-sky-200 bg-sky-300 text-black",
  R: "border-emerald-200 bg-emerald-300 text-black",
  N: "border-zinc-300 bg-zinc-300 text-black",
};

const pullCharacter = (): MonsterCharacter => {
  const weightedPool = characters.flatMap((character) => {
    const copies = rarityWeight[character.rarity] ?? 1;
    return Array.from({ length: copies }, () => character);
  });
  const index = Math.floor(Math.random() * weightedPool.length);

  return weightedPool[index] ?? characters[0];
};

export default function GachaPage() {
  const [phase, setPhase] = useState<GachaPhase>("idle");
  const [latestCard, setLatestCard] = useState<MonsterCharacter | null>(null);
  const [ownedCards, setOwnedCards] = useState<OwnedCards>(() => {
    if (typeof window === "undefined") {
      return {};
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    try {
      return JSON.parse(raw) as OwnedCards;
    } catch {
      return {};
    }
  });
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedCards));
  }, [ownedCards]);

  const ownedList = useMemo(() => {
    return characters
      .map((character) => ({
        character,
        count: ownedCards[character.id] ?? 0,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => {
        if (a.character.rarity === b.character.rarity) {
          return b.count - a.count;
        }
        return rarityWeight[a.character.rarity] - rarityWeight[b.character.rarity];
      });
  }, [ownedCards]);

  const handleDraw = () => {
    if (phase === "drawing") {
      return;
    }

    setPhase("drawing");
    setLatestCard(null);

    window.setTimeout(() => {
      const drawn = pullCharacter();
      setLatestCard(drawn);
      setOwnedCards((previous) => ({
        ...previous,
        [drawn.id]: (previous[drawn.id] ?? 0) + 1,
      }));
      setPhase("reveal");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-50">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="fantasy-kicker text-amber-300">GACHA PORTAL</p>
            <h1 className="mt-2 text-4xl font-black">モンスターカードガチャ</h1>
            <p className="mt-3 text-sm text-zinc-300">
              魔導石を使ってカードを召喚し、君だけの図鑑を集めよう。
            </p>
          </div>
          <Link
            href="/"
            className="fantasy-button fantasy-button-gold"
          >
            トップへ戻る
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="fantasy-panel p-5">
            <p className="text-xs font-black tracking-[0.16em] text-red-300">召喚演出</p>
            <div className="mt-4 min-h-[23rem] rounded-lg border border-amber-300/25 bg-zinc-950/80 p-4">
              {phase === "drawing" ? (
                <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
                  <div className="h-24 w-24 animate-spin rounded-full border-4 border-amber-200/35 border-t-amber-200" />
                  <p className="text-xl font-black text-amber-100">召喚中...</p>
                  <p className="text-sm font-bold text-zinc-300">闘技場に魔力が満ちている！</p>
                </div>
              ) : latestCard ? (
                <div className="space-y-4">
                  <div className={`relative min-h-72 overflow-hidden rounded-lg border bg-gradient-to-br ${latestCard.themeColor}`}>
                    <MonsterArtwork
                      character={latestCard}
                      imageClassName="object-cover object-[50%_24%]"
                      priority
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85),transparent_65%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-black text-amber-200">新規入手</p>
                      <h2 className="mt-1 text-3xl font-black">{latestCard.name}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`fantasy-badge ${rarityStyle[latestCard.rarity]}`}>{latestCard.rarity}</span>
                    <span className="text-sm text-zinc-300">{latestCard.category}</span>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 text-center">
                  <p className="text-2xl font-black text-amber-100">召喚を開始しよう</p>
                  <p className="text-sm text-zinc-300">ボタンを押すと1枚ランダムで獲得できます。</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDraw}
                disabled={phase === "drawing"}
                className="fantasy-button fantasy-button-red disabled:cursor-not-allowed disabled:opacity-60"
              >
                1回ガチャを引く
              </button>
              <button
                type="button"
                onClick={() => {
                  setOwnedCards({});
                  setLatestCard(null);
                  setPhase("idle");
                }}
                className="fantasy-button fantasy-button-purple"
              >
                所持カードをリセット
              </button>
            </div>
          </section>

          <section className="fantasy-panel p-5">
            <p className="text-xs font-black tracking-[0.16em] text-purple-200">所持カード一覧</p>
            <p className="mt-2 text-sm text-zinc-300">
              所持種類: {ownedList.length} / {characters.length}
            </p>

            <div className="mt-4 space-y-3">
              {ownedList.length === 0 ? (
                <p className="rounded-md border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
                  まだカードを持っていません。ガチャを引いて集めよう！
                </p>
              ) : (
                ownedList.map(({ character, count }) => (
                  <article
                    key={character.id}
                    className="rounded-lg border border-white/10 bg-black/45 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black text-zinc-50">{character.name}</p>
                      <span className="rounded bg-amber-300 px-2 py-1 text-xs font-black text-black">x{count}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`fantasy-badge ${rarityStyle[character.rarity]}`}>{character.rarity}</span>
                      <span className="text-xs text-zinc-400">{character.elements.join("・")}</span>
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
