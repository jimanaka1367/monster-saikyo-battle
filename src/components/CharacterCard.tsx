"use client";

import Image from "next/image";
import { useState } from "react";
import type { MonsterCharacter } from "@/src/data/characters";
import { getDangerLevelStars } from "@/src/data/characters";

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

export function CharacterCard({ character }: CharacterCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const maxStat = 100;

  return (
    <article className="fantasy-card overflow-hidden">
      <div
        className={`relative min-h-52 bg-gradient-to-br ${character.themeColor}`}
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-30 w-30 items-center justify-center rounded-full border border-amber-300/40 bg-black/45 text-5xl font-black text-amber-200 shadow-2xl shadow-black/60 ring-8 ring-black/20">
              {character.name.slice(0, 1)}
            </div>
          </div>
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
