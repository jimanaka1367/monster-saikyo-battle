"use client";

import { useMemo, useRef, useState } from "react";
import { characters, getDangerLevelStars } from "@/src/data/characters";
import type { MonsterCharacter, MonsterElement } from "@/src/data/characters";
import { MonsterArtwork } from "@/src/components/MonsterArtwork";
import { createBattleResult } from "@/src/lib/battle";
import type { BattleResult, BattleScore } from "@/src/lib/battle";

type BattlePhase = "ready" | "opening" | "middle" | "result";
type SelectionRole = "challenger" | "opponent";
type BattleEffectPattern = "rush" | "burst" | "spiral";

const phaseLabels: Record<BattlePhase, string> = {
  ready: "対戦準備",
  opening: "召喚開始",
  middle: "必殺技",
  result: "決着",
};

const phaseStyles: Record<BattlePhase, string> = {
  ready: "from-zinc-950 via-black to-purple-950/50",
  opening: "from-amber-950/40 via-black to-red-950/50",
  middle: "from-red-950/55 via-black to-purple-950/70",
  result: "from-amber-900/45 via-black to-purple-950/60",
};

const elementEffects: Record<
  MonsterElement,
  {
    aura: string;
    spark: string;
    beam: string;
    ring: string;
    glyph: string;
  }
> = {
  炎: {
    aura: "bg-red-500/30",
    spark: "bg-amber-200",
    beam: "from-transparent via-red-400/70 to-amber-200/75",
    ring: "border-red-300/55 shadow-[0_0_34px_rgba(248,113,113,0.42)]",
    glyph: "火花",
  },
  雷: {
    aura: "bg-sky-300/28",
    spark: "bg-cyan-100",
    beam: "from-transparent via-cyan-200/80 to-blue-300/75",
    ring: "border-cyan-100/65 shadow-[0_0_36px_rgba(125,211,252,0.48)]",
    glyph: "稲妻",
  },
  氷: {
    aura: "bg-cyan-200/24",
    spark: "bg-sky-100",
    beam: "from-transparent via-cyan-100/75 to-slate-100/70",
    ring: "border-cyan-100/60 shadow-[0_0_34px_rgba(165,243,252,0.42)]",
    glyph: "氷片",
  },
  闇: {
    aura: "bg-purple-700/32",
    spark: "bg-fuchsia-300",
    beam: "from-transparent via-purple-500/75 to-fuchsia-300/65",
    ring: "border-purple-300/55 shadow-[0_0_36px_rgba(168,85,247,0.46)]",
    glyph: "闇",
  },
  水: {
    aura: "bg-blue-400/26",
    spark: "bg-sky-200",
    beam: "from-transparent via-blue-300/72 to-cyan-100/68",
    ring: "border-sky-200/60 shadow-[0_0_34px_rgba(56,189,248,0.44)]",
    glyph: "波",
  },
  毒: {
    aura: "bg-emerald-400/24",
    spark: "bg-lime-200",
    beam: "from-transparent via-emerald-400/70 to-purple-300/68",
    ring: "border-lime-200/55 shadow-[0_0_34px_rgba(74,222,128,0.4)]",
    glyph: "霧",
  },
  地: {
    aura: "bg-amber-700/24",
    spark: "bg-stone-200",
    beam: "from-transparent via-amber-700/70 to-stone-200/72",
    ring: "border-amber-200/50 shadow-[0_0_32px_rgba(180,83,9,0.42)]",
    glyph: "岩",
  },
  光: {
    aura: "bg-yellow-200/28",
    spark: "bg-yellow-100",
    beam: "from-transparent via-yellow-100/82 to-amber-200/76",
    ring: "border-yellow-100/70 shadow-[0_0_40px_rgba(253,224,71,0.54)]",
    glyph: "光",
  },
};

const formatScore = (score: number): string => score.toFixed(1);

const getBattleEffectPattern = (result: BattleResult): BattleEffectPattern => {
  const seed = [
    result.winner.id,
    result.loser.id,
    Math.round(result.challengerScore.total),
    Math.round(result.opponentScore.total),
  ].join("");
  const value = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const patterns: BattleEffectPattern[] = ["rush", "burst", "spiral"];

  return patterns[value % patterns.length];
};

const getScoreForCharacter = (
  character: MonsterCharacter,
  result: BattleResult | null,
): BattleScore | null => {
  if (!result) {
    return null;
  }

  return result.challenger.id === character.id
    ? result.challengerScore
    : result.opponentScore;
};

const getHpPercent = (
  character: MonsterCharacter,
  phase: BattlePhase,
  result: BattleResult | null,
): number => {
  if (!result || phase === "ready" || phase === "opening") {
    return 100;
  }

  const score = getScoreForCharacter(character, result);
  const otherScore =
    result.challenger.id === character.id
      ? result.opponentScore
      : result.challengerScore;
  const scoreGap = Math.abs((score?.total ?? 0) - otherScore.total);

  if (phase === "middle") {
    return result.winner.id === character.id
      ? Math.max(62, 88 - scoreGap * 0.12)
      : Math.max(28, 64 - scoreGap * 0.42);
  }

  return result.winner.id === character.id ? 86 : 8;
};

function SelectedFighterPanel({
  character,
  role,
  isActive,
  onSelectRole,
}: {
  character: MonsterCharacter;
  role: SelectionRole;
  isActive: boolean;
  onSelectRole: (role: SelectionRole) => void;
}) {
  const label = role === "challenger" ? "挑戦者" : "対戦相手";

  return (
    <button
      type="button"
      onClick={() => onSelectRole(role)}
      className={`group relative min-h-36 overflow-hidden rounded-lg border p-3 text-left shadow-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 ${
        isActive
          ? "border-amber-200 bg-amber-300/15 shadow-[0_0_28px_rgba(251,191,36,0.24)]"
          : "border-amber-300/20 bg-black/45 shadow-black/40 hover:border-amber-300/45"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${character.themeColor} opacity-50`}
      />
      <div className="absolute inset-y-0 right-0 w-2/5">
        <MonsterArtwork
          character={character}
          imageClassName="object-cover object-[50%_24%] opacity-90"
          priority={isActive}
          sizes="(max-width: 768px) 45vw, 18vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/35 to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-28 flex-col justify-between">
        <div>
          <span className="inline-flex rounded-md border border-amber-200/40 bg-black/55 px-2 py-1 text-xs font-black tracking-[0.16em] text-amber-100">
            {label}
          </span>
          <h3 className="mt-3 text-2xl font-black leading-tight text-zinc-50">
            {character.name}
          </h3>
          <p className="mt-1 text-xs font-bold text-amber-200/85">
            {character.category}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {character.elements.map((element) => (
            <span
              key={element}
              className="fantasy-badge border-purple-300/25 bg-purple-950/80 text-purple-100"
            >
              {element}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function CharacterSelectCard({
  character,
  selectedRole,
  activeRole,
  onChoose,
}: {
  character: MonsterCharacter;
  selectedRole: SelectionRole | null;
  activeRole: SelectionRole;
  onChoose: (character: MonsterCharacter) => void;
}) {
  const isSelected = selectedRole !== null;
  const selectedLabel = selectedRole === "challenger" ? "挑戦者" : "対戦相手";
  const nextLabel = activeRole === "challenger" ? "挑戦者にする" : "対戦相手にする";

  return (
    <button
      type="button"
      onClick={() => onChoose(character)}
      aria-pressed={isSelected}
      className={`group relative min-h-52 overflow-hidden rounded-lg border text-left shadow-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:min-h-56 ${
        isSelected
          ? "border-amber-200 bg-amber-300/10 shadow-[0_0_30px_rgba(251,191,36,0.26)] ring-1 ring-amber-200/45"
          : "border-white/10 bg-zinc-950/85 shadow-black/50 hover:-translate-y-0.5 hover:border-amber-300/45 hover:bg-zinc-900"
      }`}
    >
      <div
        className={`relative h-32 overflow-hidden bg-gradient-to-br ${character.themeColor} sm:h-36`}
      >
        <MonsterArtwork
          character={character}
          imageClassName="object-cover object-[50%_24%] transition duration-500 group-hover:scale-105"
          priority={isSelected}
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.18),transparent_36%),linear-gradient(to_top,rgba(0,0,0,0.82),transparent_66%)]" />
        {isSelected ? (
          <div className="absolute inset-2 rounded-md border border-amber-100/60 shadow-[inset_0_0_22px_rgba(251,191,36,0.24)]" />
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {isSelected ? (
            <span className="rounded-md border border-amber-100/60 bg-amber-300 px-2 py-1 text-xs font-black text-black shadow-lg shadow-black/40">
              {selectedLabel}
            </span>
          ) : (
            <span className="rounded-md border border-amber-200/25 bg-black/55 px-2 py-1 text-xs font-black text-amber-100 opacity-0 transition group-hover:opacity-100">
              {nextLabel}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div>
          <h4 className="text-base font-black leading-tight text-zinc-50">
            {character.name}
          </h4>
          <p className="mt-1 text-xs font-black tracking-[0.12em] text-amber-200">
            危険度 {getDangerLevelStars(character.dangerLevel)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {character.elements.map((element) => (
            <span
              key={element}
              className="fantasy-badge border-purple-300/25 bg-purple-950/80 text-purple-100"
            >
              {element}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function FighterSelector({
  challenger,
  opponent,
  activeRole,
  onSelectRole,
  onChooseCharacter,
  onStartBattle,
}: {
  challenger: MonsterCharacter;
  opponent: MonsterCharacter;
  activeRole: SelectionRole;
  onSelectRole: (role: SelectionRole) => void;
  onChooseCharacter: (character: MonsterCharacter) => void;
  onStartBattle: () => void;
}) {
  return (
    <div className="fantasy-panel mb-3 overflow-hidden p-4 sm:mb-5 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="fantasy-kicker">CHOOSE FIGHTERS</p>
          <h3 className="mt-2 text-2xl font-black text-zinc-50">
            画像をタップして2体を選ぼう
          </h3>
          <p className="mt-2 text-xs font-bold text-zinc-400">
            登場モンスター {characters.length}体
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/45 p-1">
          {(["challenger", "opponent"] as SelectionRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onSelectRole(role)}
              className={`min-h-11 rounded-md px-3 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 ${
                activeRole === role
                  ? "bg-amber-300 text-black shadow-lg shadow-amber-950/40"
                  : "text-zinc-300 hover:bg-white/10"
              }`}
            >
              {role === "challenger" ? "挑戦者" : "対戦相手"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <SelectedFighterPanel
          character={challenger}
          role="challenger"
          isActive={activeRole === "challenger"}
          onSelectRole={onSelectRole}
        />
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/45 bg-red-950/90 text-lg font-black text-amber-100 shadow-xl shadow-black/60">
            VS
          </div>
        </div>
        <SelectedFighterPanel
          character={opponent}
          role="opponent"
          isActive={activeRole === "opponent"}
          onSelectRole={onSelectRole}
        />
      </div>

      <button
        type="button"
        onClick={onStartBattle}
        className="fantasy-button fantasy-button-gold mt-4 w-full text-lg"
      >
        この2体でバトル開始
      </button>

      <div className="mt-5 max-h-[38rem] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {characters.map((character) => (
            <CharacterSelectCard
              key={character.id}
              character={character}
              activeRole={activeRole}
              selectedRole={
                character.id === challenger.id
                  ? "challenger"
                  : character.id === opponent.id
                    ? "opponent"
                    : null
              }
              onChoose={onChooseCharacter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HpBar({
  character,
  percent,
}: {
  character: MonsterCharacter;
  percent: number;
}) {
  const hp = Math.max(0, Math.round(character.stats.hp * (percent / 100)));

  return (
    <div className="rounded-lg border border-white/10 bg-black/65 p-1.5 sm:p-2">
      <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-black sm:text-xs">
        <span className="text-amber-100">HP</span>
        <span className="text-zinc-200">
          {hp} / {character.stats.hp}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-950 ring-1 ring-white/10 sm:h-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-700 via-amber-300 to-emerald-300 shadow-[0_0_18px_rgba(251,191,36,0.45)] transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ElementFieldEffect({
  character,
  active,
}: {
  character: MonsterCharacter;
  active: boolean;
}) {
  const effect = elementEffects[character.elements[0]];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-55"
      }`}
    >
      <div
        className={`absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full ${effect.aura} blur-3xl sm:h-48 sm:w-48 ${
          active ? "animate-pulse" : ""
        }`}
      />
      <div
        className={`absolute bottom-4 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border sm:bottom-8 sm:h-36 sm:w-36 ${effect.ring}`}
      />
      {[0, 1, 2, 3, 4, 5].map((spark) => (
        <span
          key={spark}
          className={`absolute h-2 w-2 rounded-full ${effect.spark} shadow-[0_0_14px_rgba(255,255,255,0.7)]`}
          style={{
            left: `${18 + spark * 13}%`,
            top: `${18 + ((spark * 17) % 52)}%`,
            opacity: active ? 0.85 : 0.45,
          }}
        />
      ))}
      <span className="absolute bottom-2 right-2 rounded-md border border-white/15 bg-black/45 px-1.5 py-0.5 text-[10px] font-black text-zinc-100 sm:bottom-4 sm:right-4 sm:px-2 sm:py-1 sm:text-xs">
        {effect.glyph}
      </span>
    </div>
  );
}

function ClashEffect({
  result,
  phase,
}: {
  result: BattleResult | null;
  phase: BattlePhase;
}) {
  if (!result || phase !== "middle") {
    return null;
  }

  const effect = elementEffects[result.winner.elements[0]];
  const pattern = getBattleEffectPattern(result);

  if (pattern === "burst") {
    return (
      <div className="battle-impact pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border ${effect.ring} bg-black/25 animate-pulse`}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-24 w-[78%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r ${effect.beam} opacity-75 blur-lg`}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 px-4 py-2 text-sm font-black text-amber-100 shadow-2xl shadow-black/70">
          BURST
        </div>
      </div>
    );
  }

  if (pattern === "spiral") {
    return (
      <div className="battle-impact pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[48%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[42%] border ${effect.ring} bg-black/20`}
        />
        <div
          className={`absolute left-1/2 top-[48%] h-32 w-[86%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full bg-gradient-to-r ${effect.beam} opacity-70 blur-md`}
        />
        <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 px-4 py-2 text-sm font-black text-amber-100 shadow-2xl shadow-black/70">
          SPIN
        </div>
      </div>
    );
  }

  return (
    <div className="battle-impact pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div
        className={`absolute left-1/2 top-[45%] h-12 w-[92%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] bg-gradient-to-r ${effect.beam} blur-sm animate-pulse`}
      />
      <div
        className={`absolute left-1/2 top-[45%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border ${effect.ring} bg-black/30`}
      />
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm font-black text-amber-100 shadow-2xl shadow-black/70">
        HIT
      </div>
    </div>
  );
}

function PhaseSky({
  phase,
  result,
}: {
  phase: BattlePhase;
  result: BattleResult | null;
}) {
  if (phase === "ready") {
    return null;
  }

  const activeCharacter = result?.winner;
  const effect = activeCharacter ? elementEffects[activeCharacter.elements[0]] : null;
  const pattern = result ? getBattleEffectPattern(result) : "rush";

  return (
    <div className="pointer-events-none absolute inset-0">
      {phase === "opening" ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(251,191,36,0.24),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(127,29,29,0.36),transparent_38%)] animate-pulse" />
      ) : null}
      {phase === "middle" && effect ? (
        <>
          <div
            className={`absolute inset-x-[-10%] ${
              pattern === "burst"
                ? "top-1/2 h-36 rotate-0"
                : pattern === "spiral"
                  ? "top-[42%] h-28 -rotate-6"
                  : "top-1/3 h-24 rotate-3"
            } bg-gradient-to-r ${effect.beam} opacity-65 blur-md`}
          />
          <div className="absolute inset-0 bg-black/10" />
        </>
      ) : null}
      {phase === "result" ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(251,191,36,0.24),transparent_30%),linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.45))]" />
      ) : null}
    </div>
  );
}

function BattleFighter({
  character,
  phase,
  result,
  side,
}: {
  character: MonsterCharacter;
  phase: BattlePhase;
  result: BattleResult | null;
  side: "left" | "right";
}) {
  const hpPercent = getHpPercent(character, phase, result);
  const isWinner = phase === "result" && result?.winner.id === character.id;
  const isLoser = phase === "result" && result?.loser.id === character.id;
  const isAttacking = phase === "middle" && result?.winner.id === character.id;
  const isDefending = phase === "middle" && result?.loser.id === character.id;
  const isOpening = phase === "opening";
  const artworkVariant = phase === "opening" || phase === "ready" ? "normal" : "battle";
  const alignClass = side === "left" ? "items-start text-left" : "items-end text-right";
  const effectPattern = result ? getBattleEffectPattern(result) : "rush";
  const attackMotion =
    effectPattern === "burst"
      ? "scale-[1.12] -translate-y-1"
      : effectPattern === "spiral"
        ? side === "left"
          ? "scale-[1.08] translate-x-1 -rotate-1 sm:translate-x-4"
          : "scale-[1.08] -translate-x-1 rotate-1 sm:-translate-x-4"
        : side === "left"
          ? "scale-[1.1] translate-x-2 sm:translate-x-6"
          : "scale-[1.1] -translate-x-2 sm:-translate-x-6";
  const defenseMotion =
    effectPattern === "burst"
      ? "scale-[0.96] translate-y-1"
      : side === "left"
        ? "scale-[0.97] -translate-x-1"
        : "scale-[0.97] translate-x-1";

  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col ${alignClass} ${
        isWinner
          ? "scale-[1.1]"
          : isLoser
            ? "scale-[0.9]"
            : isAttacking
              ? attackMotion
              : isDefending
                ? defenseMotion
                : ""
      } transition-transform duration-700`}
    >
      <div className="z-10 mb-1 w-full sm:mb-2">
        <p className="text-[10px] font-black text-zinc-400 sm:text-xs">{character.category}</p>
        <h3 className="text-sm font-black leading-tight text-zinc-50 sm:text-2xl">
          {character.name}
        </h3>
      </div>

      <div
        className={`relative h-52 w-full overflow-hidden rounded-lg border bg-gradient-to-br ${character.themeColor} sm:h-[26rem] ${
          isWinner
            ? "border-amber-200/80 shadow-[0_0_44px_rgba(251,191,36,0.42)]"
            : isAttacking
              ? "border-amber-100/70 shadow-[0_0_42px_rgba(251,191,36,0.32)]"
              : "border-amber-300/20 shadow-2xl shadow-black/50"
        } ${isLoser ? "opacity-65 grayscale-[0.35]" : ""} ${
          isWinner || isAttacking ? "battle-glow" : ""
        } ${isDefending ? "battle-shake" : ""} ${
          isOpening && !isWinner ? "animate-pulse" : ""
        }`}
      >
        <ElementFieldEffect
          character={character}
          active={isOpening || isAttacking || isWinner}
        />
        <MonsterArtwork
          character={character}
          imageVariant={artworkVariant}
          imageClassName={`object-cover object-[50%_24%] transition duration-700 ${
            isAttacking
              ? "scale-125 brightness-125 saturate-125"
              : isDefending
                ? "scale-105 brightness-75 saturate-75"
                : isWinner
                  ? "scale-[1.28] brightness-125 saturate-125"
                  : isLoser
                    ? "scale-100 brightness-60 saturate-75"
                    : isOpening
                      ? "scale-[1.08] brightness-105"
                      : "scale-[1.15]"
          }`}
          priority
          sizes="(max-width: 768px) 48vw, 38vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(251,191,36,0.16),transparent_35%),linear-gradient(to_top,rgba(0,0,0,0.85),transparent_70%)]" />
        {isAttacking ? (
          <>
            <div className="battle-flash absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(248,113,113,0.32),transparent_38%)]" />
            <div className="battle-slash absolute -left-10 top-1/2 h-8 w-[140%] -translate-y-1/2 rotate-12 bg-gradient-to-r from-transparent via-amber-200/45 to-transparent blur-sm" />
          </>
        ) : null}
        {isWinner ? (
          <div className="absolute inset-x-2 top-2 rounded-full border border-amber-200/50 bg-amber-300/20 py-1 text-center text-[10px] font-black tracking-[0.18em] text-amber-100 sm:inset-x-4 sm:top-4 sm:py-2 sm:text-xs">
            WINNER
          </div>
        ) : null}
        {isDefending ? (
          <div className="absolute inset-0 bg-black/28" />
        ) : null}
      </div>

      <div className="z-10 mt-1.5 w-full sm:mt-2">
        <HpBar character={character} percent={hpPercent} />
      </div>
    </div>
  );
}

function PhaseBanner({
  phase,
  result,
}: {
  phase: BattlePhase;
  result: BattleResult | null;
}) {
  if (phase === "middle" && result) {
    return (
      <div className="relative z-30 mt-2 rounded-lg border border-red-200/40 bg-black/75 p-2 text-center shadow-2xl shadow-red-950/70 sm:mt-4 sm:p-4">
        <p className="text-xs font-black tracking-[0.22em] text-red-200">
          SPECIAL MOVE
        </p>
        <p className="mt-0.5 bg-gradient-to-r from-amber-100 via-red-300 to-purple-200 bg-clip-text text-2xl font-black leading-tight text-transparent drop-shadow-2xl sm:mt-1 sm:text-6xl">
          {result.winner.specialMove.name}
        </p>
        <p className="mt-1 hidden text-sm font-bold text-zinc-200 sm:block">
          {result.winner.name} の必殺技が闘技場を照らす！
        </p>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="relative z-30 mt-2 rounded-lg border border-amber-200/50 bg-black/78 p-2.5 text-center shadow-2xl shadow-amber-950/70 sm:mt-4 sm:p-5">
        <p className="text-xs font-black tracking-[0.24em] text-amber-200">
          BATTLE WINNER
        </p>
        <p className="mt-1 text-2xl font-black text-amber-100 sm:mt-2 sm:text-6xl">
          {result.winner.name}
        </p>
        <p className="mt-1 text-xs font-bold leading-5 text-zinc-200 sm:mt-3 sm:text-sm sm:leading-7">
          {result.victoryMessage}
        </p>
      </div>
    );
  }

  if (phase === "opening" && result) {
    return (
      <div className="relative z-30 mt-2 rounded-lg border border-amber-200/30 bg-black/65 px-3 py-2 text-center shadow-xl shadow-black/60 sm:mt-4 sm:px-4 sm:py-3">
        <p className="text-xs font-black tracking-[0.22em] text-amber-200">
          SUMMON
        </p>
        <p className="mt-0.5 text-base font-black text-zinc-50 sm:mt-1 sm:text-xl">
          闇の闘技場に2体が現れた！
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-30 mt-2 rounded-lg border border-amber-200/20 bg-black/55 px-3 py-2 text-center sm:mt-4 sm:px-4 sm:py-3">
      <p className="text-xs font-black tracking-[0.22em] text-amber-200">
        READY
      </p>
      <p className="mt-0.5 text-base font-black text-zinc-50 sm:mt-1 sm:text-lg">
        モンスターを選んでバトル開始！
      </p>
    </div>
  );
}

function ScoreMini({
  label,
  score,
}: {
  label: string;
  score: BattleScore | null;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/45 p-2 text-xs sm:p-3 sm:text-sm">
      <p className="truncate font-black text-zinc-50">{label}</p>
      <p className="mt-0.5 text-[10px] font-bold text-zinc-400 sm:mt-1 sm:text-xs">バトルスコア</p>
      <p className="text-xl font-black text-amber-100 sm:text-2xl">
        {score ? formatScore(score.total) : "---"}
      </p>
    </div>
  );
}

export function BattleArena() {
  const battleStageRef = useRef<HTMLDivElement>(null);
  const [challengerId, setChallengerId] = useState(characters[0].id);
  const [opponentId, setOpponentId] = useState(characters[1].id);
  const [activeRole, setActiveRole] = useState<SelectionRole>("challenger");
  const [phase, setPhase] = useState<BattlePhase>("ready");
  const [result, setResult] = useState<BattleResult | null>(null);

  const challenger = useMemo(
    () =>
      characters.find((character) => character.id === challengerId) ??
      characters[0],
    [challengerId],
  );
  const opponent = useMemo(
    () =>
      characters.find((character) => character.id === opponentId) ??
      characters[1],
    [opponentId],
  );

  const startBattle = () => {
    if (challenger.id === opponent.id) {
      return;
    }

    setResult(createBattleResult(challenger, opponent));
    setPhase("opening");
    window.requestAnimationFrame(() => {
      battleStageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const resetBattle = () => {
    setPhase("ready");
    setResult(null);
  };

  const chooseCharacter = (character: MonsterCharacter) => {
    if (activeRole === "challenger") {
      if (character.id === challengerId) {
        return;
      }

      if (character.id === opponentId) {
        setOpponentId(challengerId);
      }

      setChallengerId(character.id);
      setActiveRole("opponent");
    } else {
      if (character.id === opponentId) {
        return;
      }

      if (character.id === challengerId) {
        setChallengerId(opponentId);
      }

      setOpponentId(character.id);
      setActiveRole("challenger");
    }

    resetBattle();
  };

  const challengerScore = getScoreForCharacter(challenger, result);
  const opponentScore = getScoreForCharacter(opponent, result);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 sm:mb-6">
        <p className="fantasy-kicker">BATTLE ARENA</p>
        <h2 className="mt-2 text-2xl font-black text-zinc-50 sm:text-3xl">
          1対1ビジュアルバトル
        </h2>
        <p className="mt-2 text-sm font-bold leading-6 text-zinc-300 sm:mt-3 sm:leading-7">
          左右のモンスター、HPバー、必殺技で勝負の流れを見よう。
        </p>
      </div>

      <FighterSelector
        challenger={challenger}
        opponent={opponent}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        onChooseCharacter={chooseCharacter}
        onStartBattle={startBattle}
      />

      <div
        ref={battleStageRef}
        className={`relative scroll-mt-2 overflow-hidden rounded-lg border border-amber-300/25 bg-gradient-to-br ${phaseStyles[phase]} p-2 shadow-2xl shadow-black/60 sm:scroll-mt-4 sm:p-6`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(251,191,36,0.16),transparent_26%),linear-gradient(rgba(251,191,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.035)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
        <PhaseSky phase={phase} result={result} />
        <div className="absolute bottom-0 left-1/2 h-44 w-[120%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-2xl" />
        <ClashEffect result={result} phase={phase} />

        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-end gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <BattleFighter
            character={challenger}
            phase={phase}
            result={result}
            side="left"
          />
          <div className="flex items-center justify-center pb-14 sm:pb-24">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/45 bg-red-950/90 text-base font-black text-amber-100 shadow-xl shadow-black/60 sm:h-16 sm:w-16 sm:text-2xl">
              VS
            </div>
          </div>
          <BattleFighter
            character={opponent}
            phase={phase}
            result={result}
            side="right"
          />
        </div>

        <div className="relative z-10 mt-2 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
          <ScoreMini label={challenger.name} score={challengerScore} />
          <ScoreMini label={opponent.name} score={opponentScore} />
        </div>

        <PhaseBanner phase={phase} result={result} />
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div>
          <p className="text-xs font-black tracking-[0.18em] text-red-300">
            {phaseLabels[phase]}
          </p>
          <p className="mt-0.5 text-xs font-bold text-zinc-400 sm:mt-1 sm:text-sm">
            {phase === "ready"
              ? "モンスターを選んで開始しよう"
              : phase === "opening"
                ? "次は必殺技のぶつかり合い"
                : phase === "middle"
                  ? "HPが削られ、決着が近い"
                  : "勝者が決定！"}
          </p>
        </div>

        {phase === "ready" ? (
          <button
            type="button"
            onClick={startBattle}
            className="fantasy-button fantasy-button-gold min-h-11 py-2 text-sm sm:min-h-14 sm:py-3 sm:text-base"
          >
            バトル開始
          </button>
        ) : null}
        {phase === "opening" ? (
          <button
            type="button"
            onClick={() => setPhase("middle")}
            className="fantasy-button fantasy-button-red min-h-11 py-2 text-sm sm:min-h-14 sm:py-3 sm:text-base"
          >
            中間演出を見る
          </button>
        ) : null}
        {phase === "middle" ? (
          <button
            type="button"
            onClick={() => setPhase("result")}
            className="fantasy-button fantasy-button-gold min-h-11 py-2 text-sm sm:min-h-14 sm:py-3 sm:text-base"
          >
            決着を見る
          </button>
        ) : null}
        {phase === "result" ? (
          <button
            type="button"
            onClick={startBattle}
            className="fantasy-button fantasy-button-purple min-h-11 py-2 text-sm sm:min-h-14 sm:py-3 sm:text-base"
          >
            もう一度バトル
          </button>
        ) : null}
      </div>
    </div>
  );
}
