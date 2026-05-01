"use client";

import { useMemo, useState } from "react";
import { characters } from "@/src/data/characters";
import type { MonsterCharacter } from "@/src/data/characters";
import { MonsterArtwork } from "@/src/components/MonsterArtwork";
import { createBattleResult } from "@/src/lib/battle";
import type { BattleResult, BattleScore } from "@/src/lib/battle";

type BattlePhase = "ready" | "opening" | "middle" | "result";

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

const formatScore = (score: number): string => score.toFixed(1);

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

function SelectFighter({
  label,
  value,
  blockedId,
  onChange,
}: {
  label: string;
  value: string;
  blockedId: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="block">
      <span className="fantasy-kicker">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-14 w-full rounded-lg border border-amber-300/25 bg-zinc-950 px-3 text-base font-black text-zinc-50 outline-none ring-1 ring-white/5 focus:border-amber-300"
      >
        {characters.map((character) => (
          <option
            key={character.id}
            value={character.id}
            disabled={character.id === blockedId}
          >
            {character.name}
          </option>
        ))}
      </select>
    </label>
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
    <div className="rounded-lg border border-white/10 bg-black/65 p-2">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-black">
        <span className="text-amber-100">HP</span>
        <span className="text-zinc-200">
          {hp} / {character.stats.hp}
        </span>
      </div>
      <div className="h-5 overflow-hidden rounded-full bg-zinc-950 ring-1 ring-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-700 via-amber-300 to-emerald-300 shadow-[0_0_18px_rgba(251,191,36,0.45)] transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
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
  const isOpening = phase === "opening";
  const alignClass = side === "left" ? "items-start text-left" : "items-end text-right";

  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col ${alignClass} ${
        isWinner ? "scale-[1.06]" : isAttacking ? "scale-[1.03]" : ""
      } transition-transform duration-700`}
    >
      <div className="z-10 mb-2 w-full">
        <p className="text-xs font-black text-zinc-400">{character.category}</p>
        <h3 className="text-xl font-black leading-tight text-zinc-50 sm:text-2xl">
          {character.name}
        </h3>
      </div>

      <div
        className={`relative h-64 w-full overflow-hidden rounded-lg border bg-gradient-to-br ${character.themeColor} ${
          isWinner
            ? "border-amber-200/70 shadow-[0_0_34px_rgba(251,191,36,0.35)]"
            : "border-amber-300/20 shadow-2xl shadow-black/50"
        } ${isLoser ? "opacity-70 grayscale-[0.25]" : ""} ${
          isOpening ? "animate-pulse" : ""
        }`}
      >
        <MonsterArtwork
          character={character}
          imageClassName="scale-110 object-cover object-[50%_24%]"
          priority
          sizes="(max-width: 768px) 48vw, 38vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(251,191,36,0.16),transparent_35%),linear-gradient(to_top,rgba(0,0,0,0.85),transparent_70%)]" />
        {isAttacking ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(248,113,113,0.32),transparent_38%)]" />
            <div className="absolute -left-10 top-1/2 h-8 w-[140%] -translate-y-1/2 rotate-12 bg-gradient-to-r from-transparent via-amber-200/45 to-transparent blur-sm" />
          </>
        ) : null}
        {isWinner ? (
          <div className="absolute inset-x-4 top-4 rounded-full border border-amber-200/35 bg-amber-300/15 py-2 text-center text-xs font-black tracking-[0.18em] text-amber-100">
            WINNER
          </div>
        ) : null}
      </div>

      <div className="z-10 mt-2 w-full">
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
      <div className="relative z-20 mb-4 rounded-lg border border-red-200/40 bg-black/75 p-4 text-center shadow-2xl shadow-red-950/70">
        <p className="text-xs font-black tracking-[0.22em] text-red-200">
          SPECIAL MOVE
        </p>
        <p className="mt-1 bg-gradient-to-r from-amber-100 via-red-300 to-purple-200 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-2xl sm:text-6xl">
          {result.winner.specialMove.name}
        </p>
        <p className="mt-2 text-sm font-bold text-zinc-200">
          {result.winner.name} の必殺技が闘技場を照らす！
        </p>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="relative z-20 mb-4 rounded-lg border border-amber-200/50 bg-black/78 p-5 text-center shadow-2xl shadow-amber-950/70">
        <p className="text-xs font-black tracking-[0.24em] text-amber-200">
          BATTLE WINNER
        </p>
        <p className="mt-2 text-4xl font-black text-amber-100 sm:text-6xl">
          {result.winner.name}
        </p>
        <p className="mt-3 text-sm font-bold leading-7 text-zinc-200">
          {result.victoryMessage}
        </p>
      </div>
    );
  }

  if (phase === "opening" && result) {
    return (
      <div className="relative z-20 mb-4 rounded-lg border border-amber-200/30 bg-black/65 px-4 py-3 text-center shadow-xl shadow-black/60">
        <p className="text-xs font-black tracking-[0.22em] text-amber-200">
          SUMMON
        </p>
        <p className="mt-1 text-xl font-black text-zinc-50">
          闇の闘技場に2体が現れた！
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-20 mb-4 rounded-lg border border-amber-200/20 bg-black/55 px-4 py-3 text-center">
      <p className="text-xs font-black tracking-[0.22em] text-amber-200">
        READY
      </p>
      <p className="mt-1 text-lg font-black text-zinc-50">
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
    <div className="rounded-lg border border-white/10 bg-black/45 p-3 text-sm">
      <p className="font-black text-zinc-50">{label}</p>
      <p className="mt-1 text-xs font-bold text-zinc-400">バトルスコア</p>
      <p className="text-2xl font-black text-amber-100">
        {score ? formatScore(score.total) : "---"}
      </p>
    </div>
  );
}

export function BattleArena() {
  const [challengerId, setChallengerId] = useState(characters[0].id);
  const [opponentId, setOpponentId] = useState(characters[1].id);
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
    setResult(createBattleResult(challenger, opponent));
    setPhase("opening");
  };

  const resetBattle = () => {
    setPhase("ready");
    setResult(null);
  };

  const challengerScore = getScoreForCharacter(challenger, result);
  const opponentScore = getScoreForCharacter(opponent, result);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="fantasy-kicker">BATTLE ARENA</p>
        <h2 className="mt-2 text-3xl font-black text-zinc-50">
          1対1ビジュアルバトル
        </h2>
        <p className="mt-3 text-sm font-bold leading-7 text-zinc-300">
          左右のモンスター、HPバー、必殺技で勝負の流れを見よう。
        </p>
      </div>

      <div className="fantasy-panel mb-5 grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <SelectFighter
          label="挑戦者"
          value={challengerId}
          blockedId={opponentId}
          onChange={(id) => {
            setChallengerId(id);
            resetBattle();
          }}
        />
        <SelectFighter
          label="対戦相手"
          value={opponentId}
          blockedId={challengerId}
          onChange={(id) => {
            setOpponentId(id);
            resetBattle();
          }}
        />
      </div>

      <div
        className={`relative overflow-hidden rounded-lg border border-amber-300/25 bg-gradient-to-br ${phaseStyles[phase]} p-3 shadow-2xl shadow-black/60 sm:p-6`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(251,191,36,0.16),transparent_26%),linear-gradient(rgba(251,191,36,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.035)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
        <div className="absolute bottom-0 left-1/2 h-44 w-[120%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-2xl" />

        <PhaseBanner phase={phase} result={result} />

        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-end gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <BattleFighter
            character={challenger}
            phase={phase}
            result={result}
            side="left"
          />
          <div className="flex items-center justify-center pb-24">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/45 bg-red-950/90 text-lg font-black text-amber-100 shadow-xl shadow-black/60 sm:h-16 sm:w-16 sm:text-2xl">
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

        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
          <ScoreMini label={challenger.name} score={challengerScore} />
          <ScoreMini label={opponent.name} score={opponentScore} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black tracking-[0.18em] text-red-300">
            {phaseLabels[phase]}
          </p>
          <p className="mt-1 text-sm font-bold text-zinc-400">
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
            className="fantasy-button fantasy-button-gold"
          >
            バトル開始
          </button>
        ) : null}
        {phase === "opening" ? (
          <button
            type="button"
            onClick={() => setPhase("middle")}
            className="fantasy-button fantasy-button-red"
          >
            中間演出を見る
          </button>
        ) : null}
        {phase === "middle" ? (
          <button
            type="button"
            onClick={() => setPhase("result")}
            className="fantasy-button fantasy-button-gold"
          >
            決着を見る
          </button>
        ) : null}
        {phase === "result" ? (
          <button
            type="button"
            onClick={startBattle}
            className="fantasy-button fantasy-button-purple"
          >
            もう一度バトル
          </button>
        ) : null}
      </div>
    </div>
  );
}
