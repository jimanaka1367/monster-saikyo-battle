"use client";

import Image from "next/image";
import { useState } from "react";
import type { MonsterCharacter } from "@/src/data/characters";
import { getDangerLevelStars } from "@/src/data/characters";
import type { MonsterElement } from "@/src/data/characters";

type CharacterCardProps = {
  character: MonsterCharacter;
};

const statLabels: Array<[keyof MonsterCharacter["stats"], string]> = [
  ["hp", "HP"],
  ["attack", "攻撃"],
  ["defense", "防御"],
  ["speed", "速さ"],
  ["magic", "魔力"],
];

const elementVisuals: Record<
  MonsterElement,
  { glow: string; core: string; mist: string; mark: string }
> = {
  炎: {
    glow: "rgba(248,113,113,0.58)",
    core: "rgba(251,191,36,0.75)",
    mist: "rgba(127,29,29,0.55)",
    mark: "炎",
  },
  水: {
    glow: "rgba(56,189,248,0.5)",
    core: "rgba(125,211,252,0.7)",
    mist: "rgba(30,64,175,0.55)",
    mark: "水",
  },
  雷: {
    glow: "rgba(250,204,21,0.64)",
    core: "rgba(96,165,250,0.68)",
    mist: "rgba(30,64,175,0.52)",
    mark: "雷",
  },
  氷: {
    glow: "rgba(103,232,249,0.54)",
    core: "rgba(224,242,254,0.74)",
    mist: "rgba(14,116,144,0.5)",
    mark: "氷",
  },
  地: {
    glow: "rgba(180,83,9,0.55)",
    core: "rgba(252,211,77,0.62)",
    mist: "rgba(68,64,60,0.66)",
    mark: "地",
  },
  闇: {
    glow: "rgba(168,85,247,0.56)",
    core: "rgba(244,114,182,0.62)",
    mist: "rgba(24,24,27,0.75)",
    mark: "闇",
  },
  光: {
    glow: "rgba(253,224,71,0.56)",
    core: "rgba(255,255,255,0.72)",
    mist: "rgba(251,191,36,0.38)",
    mark: "光",
  },
  毒: {
    glow: "rgba(34,197,94,0.52)",
    core: "rgba(192,132,252,0.66)",
    mist: "rgba(88,28,135,0.58)",
    mark: "毒",
  },
};

function FallbackMonsterVisual({ character }: CharacterCardProps) {
  const primaryElement = character.elements[0];
  const visual = elementVisuals[primaryElement];
  const isWinged = ["古代竜", "飛竜", "海竜", "神鳥", "多頭竜"].includes(
    character.category,
  );
  const isManyHeaded = character.category === "多頭竜";
  const isBeast = ["魔狼", "魔獣"].includes(character.category);
  const isGiant = character.category === "巨人";

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 35%, ${visual.glow}, transparent 30%), radial-gradient(circle at 20% 78%, ${visual.mist}, transparent 36%), linear-gradient(145deg, #050505 0%, #18060b 46%, #080512 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.04)_1px,transparent_1px)] bg-[size:22px_22px] opacity-35" />
      <div
        className="absolute left-1/2 top-8 h-28 w-28 -translate-x-1/2 rounded-full border border-amber-200/20 opacity-70 shadow-[0_0_45px_rgba(251,191,36,0.16)]"
        style={{
          background: `radial-gradient(circle, transparent 42%, ${visual.glow} 43%, transparent 47%)`,
        }}
      />
      <div className="absolute left-1/2 top-12 h-28 w-28 -translate-x-1/2 rotate-45 rounded-md border border-amber-200/15" />
      <div
        className="absolute left-1/2 top-16 h-24 w-36 -translate-x-1/2 rounded-[52%_52%_42%_42%] bg-black/70 shadow-2xl shadow-black"
        style={{
          boxShadow: `0 0 52px ${visual.glow}`,
        }}
      />

      {isWinged ? (
        <>
          <div
            className="absolute left-9 top-20 h-24 w-24 -rotate-12 rounded-[80%_8%_80%_8%] border border-amber-200/10 bg-black/58"
            style={{ boxShadow: `0 0 28px ${visual.mist}` }}
          />
          <div
            className="absolute right-9 top-20 h-24 w-24 rotate-12 rounded-[8%_80%_8%_80%] border border-amber-200/10 bg-black/58"
            style={{ boxShadow: `0 0 28px ${visual.mist}` }}
          />
        </>
      ) : null}

      <div className="absolute left-1/2 top-9 h-16 w-20 -translate-x-1/2 rounded-[48%_48%_42%_42%] bg-black/85 shadow-xl shadow-black">
        <div
          className="absolute left-4 top-7 h-2 w-5 rounded-full"
          style={{ backgroundColor: visual.core, boxShadow: `0 0 14px ${visual.core}` }}
        />
        <div
          className="absolute right-4 top-7 h-2 w-5 rounded-full"
          style={{ backgroundColor: visual.core, boxShadow: `0 0 14px ${visual.core}` }}
        />
        <div className="absolute -left-3 top-1 h-9 w-4 -rotate-[35deg] rounded-full bg-black/80" />
        <div className="absolute -right-3 top-1 h-9 w-4 rotate-[35deg] rounded-full bg-black/80" />
      </div>

      {isManyHeaded ? (
        <div className="absolute left-1/2 top-12 flex -translate-x-1/2 gap-12">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="h-12 w-12 rounded-[48%] bg-black/78 shadow-xl shadow-black"
            >
              <div
                className="mx-auto mt-6 h-1.5 w-7 rounded-full"
                style={{
                  backgroundColor: visual.core,
                  boxShadow: `0 0 12px ${visual.core}`,
                }}
              />
            </div>
          ))}
        </div>
      ) : null}

      {isBeast ? (
        <div className="absolute left-1/2 top-28 h-8 w-28 -translate-x-1/2 rounded-[50%_50%_20%_20%] bg-black/78">
          <div className="absolute left-5 top-2 h-1.5 w-4 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
          <div className="absolute right-5 top-2 h-1.5 w-4 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
        </div>
      ) : null}

      {isGiant ? (
        <div className="absolute left-1/2 top-32 grid w-36 -translate-x-1/2 grid-cols-3 gap-1 opacity-85">
          {[0, 1, 2, 3, 4, 5].map((stone) => (
            <div
              key={stone}
              className="h-6 rounded-sm border border-amber-200/10 bg-black/70"
            />
          ))}
        </div>
      ) : null}

      <div className="absolute bottom-5 left-1/2 h-16 w-48 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <span className="h-px w-14 bg-amber-200/35" />
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/30 bg-black/50 text-lg font-black text-amber-100"
          style={{ boxShadow: `0 0 24px ${visual.glow}` }}
        >
          {visual.mark}
        </span>
        <span className="h-px w-14 bg-amber-200/35" />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-28 opacity-80"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${visual.mist}, transparent 68%)`,
        }}
      />
    </div>
  );
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const maxStat = 100;

  return (
    <article className="fantasy-card overflow-hidden">
      <div
        className={`relative min-h-72 bg-gradient-to-br ${character.themeColor} sm:min-h-80`}
      >
        {!imageFailed ? (
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <FallbackMonsterVisual character={character} />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(250,204,21,0.18),transparent_34%),linear-gradient(to_top,rgba(0,0,0,0.9),transparent_64%)]" />
        <div className="absolute inset-3 rounded-md border border-amber-200/10" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-amber-200/80">
              {character.ruby}
            </p>
            <h3 className="text-2xl font-black leading-tight text-zinc-50">
              {character.name}
            </h3>
          </div>
          <span className="rounded-md border border-amber-100/50 bg-amber-300 px-2 py-1 text-sm font-black text-black shadow-lg shadow-black/30">
            {character.rarity}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="fantasy-badge border-red-400/30 bg-red-950/75 text-red-100">
            {character.category}
          </span>
          {character.elements.map((element) => (
            <span
              key={element}
              className="fantasy-badge border-purple-300/25 bg-purple-950/75 text-purple-100"
            >
              {element}
            </span>
          ))}
        </div>

        <div>
          <p className="text-xs font-black tracking-[0.14em] text-amber-200">
            危険度
          </p>
          <p className="text-lg tracking-wide text-amber-300">
            {getDangerLevelStars(character.dangerLevel)}
          </p>
        </div>

        <p className="text-sm font-bold leading-7 text-zinc-200">
          {character.shortDescription}
        </p>

        <div className="space-y-2 rounded-lg border border-white/10 bg-black/35 p-3">
          {statLabels.map(([key, label]) => {
            const value = character.stats[key];
            const width =
              key === "hp" ? Math.min(100, Math.round(value / 10)) : value;

            return (
              <div key={key} className="grid grid-cols-[3.5rem_1fr_3rem] items-center gap-2">
                <span className="text-xs font-bold text-zinc-400">{label}</span>
                <div className="h-3 overflow-hidden rounded-full bg-black/70 ring-1 ring-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-700 via-amber-300 to-purple-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                    style={{ width: `${Math.min(width, maxStat)}%` }}
                  />
                </div>
                <span className="text-right text-xs font-bold text-amber-100">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
