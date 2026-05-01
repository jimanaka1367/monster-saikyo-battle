"use client";

import { useMemo, useState } from "react";
import { characters } from "@/src/data/characters";
import type { MonsterCharacter } from "@/src/data/characters";
import { createBattleResult } from "@/src/lib/battle";
import type { BattleResult } from "@/src/lib/battle";

type BattlePhase = "ready" | "opening" | "middle" | "result";

const phaseLabels: Record<BattlePhase, string> = {
  ready: "対戦準備",
  opening: "開始",
  middle: "中間演出",
  result: "決着",
};

const statTotal = (character: MonsterCharacter): number => {
  return (
    character.stats.hp +
    character.stats.attack +
    character.stats.defense +
    character.stats.speed +
    character.stats.magic
  );
};

const formatScore = (score: number): string => {
  return score.toFixed(1);
};

type FighterPanelProps = {
  label: string;
  character: MonsterCharacter;
  selectedId: string;
  blockedId: string;
  onChange: (id: string) => void;
};

function FighterPanel({
  label,
  character,
  selectedId,
  blockedId,
  onChange,
}: FighterPanelProps) {
  return (
    <div className="fantasy-panel p-4 sm:p-5">
      <label className="fantasy-kicker">
        {label}
      </label>
      <select
        value={selectedId}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-12 w-full rounded-lg border border-red-300/35 bg-zinc-950 px-3 text-base font-black text-zinc-50 outline-none ring-1 ring-white/5 focus:border-amber-300"
      >
        {characters.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={option.id === blockedId}
          >
            {option.name}
          </option>
        ))}
      </select>

      <div className={`mt-4 rounded-lg bg-gradient-to-br ${character.themeColor} p-px`}>
        <div className="rounded-lg bg-black/75 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-zinc-400">
                {character.category}
              </p>
              <h3 className="mt-1 text-2xl font-black text-zinc-50">
                {character.name}
              </h3>
            </div>
            <span className="rounded-md border border-amber-100/50 bg-amber-300 px-2 py-1 text-sm font-black text-black">
              {character.rarity}
            </span>
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

          <p className="mt-4 text-sm font-bold leading-7 text-zinc-200">
            {character.shortDescription}
          </p>

          <div className="mt-4 grid grid-cols-5 gap-2 text-center">
            <MiniStat label="HP" value={character.stats.hp} />
            <MiniStat label="攻撃" value={character.stats.attack} />
            <MiniStat label="防御" value={character.stats.defense} />
            <MiniStat label="速さ" value={character.stats.speed} />
            <MiniStat label="魔力" value={character.stats.magic} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-zinc-950/85 px-1 py-2">
      <p className="text-[0.65rem] font-bold text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-black text-amber-100">{value}</p>
    </div>
  );
}

function BattleLog({
  phase,
  result,
  challenger,
  opponent,
}: {
  phase: BattlePhase;
  result: BattleResult | null;
  challenger: MonsterCharacter;
  opponent: MonsterCharacter;
}) {
  if (phase === "ready" || !result) {
    return (
      <div className="rounded-lg border border-dashed border-amber-300/30 bg-black/40 p-4 sm:p-5">
        <p className="text-sm font-bold leading-7 text-zinc-300">
          対戦する2体を選び、「バトル開始」を押すと闘技場に召喚されます。
          勝敗にはランダム補正が入るので、同じ組み合わせでも結果が変わります。
        </p>
      </div>
    );
  }

  if (phase === "opening") {
    return (
      <BattleMessage
        title="開始演出"
        message={result.openingMessage}
        note={`${challenger.name} と ${opponent.name} が闇の闘技場で向かい合った！`}
      />
    );
  }

  if (phase === "middle") {
    const leader =
      result.challengerScore.total >= result.opponentScore.total
        ? result.challenger
        : result.opponent;

    return (
      <BattleMessage
        title="中間演出"
        message={result.midBattleMessage}
        note={`${leader.name} が流れをつかみかけている。しかし勝負はまだ終わらない！`}
      />
    );
  }

  return (
    <div className="fantasy-panel bg-gradient-to-br from-amber-950/35 via-black to-purple-950/45 p-4 sm:p-5">
      <p className="fantasy-kicker">
        決着
      </p>
      <h3 className="mt-2 text-3xl font-black text-amber-100 sm:text-4xl">
        勝者 {result.winner.name}
      </h3>
      <p className="mt-4 whitespace-pre-line text-base font-bold leading-8 text-zinc-50">
        {result.victoryMessage}
      </p>
      {result.isUpset ? (
        <p className="mt-3 rounded-md border border-red-300/30 bg-red-950/50 px-3 py-2 text-sm font-black text-red-100">
          まさかの番狂わせ！最後の一撃が勝負をひっくり返した！
        </p>
      ) : null}
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <ScorePanel name={result.challenger.name} score={result.challengerScore} />
        <ScorePanel name={result.opponent.name} score={result.opponentScore} />
      </div>
    </div>
  );
}

function BattleMessage({
  title,
  message,
  note,
}: {
  title: string;
  message: string;
  note: string;
}) {
  return (
    <div className="fantasy-panel bg-gradient-to-br from-red-950/40 via-black to-purple-950/40 p-4 sm:p-5">
      <p className="fantasy-kicker">
        {title}
      </p>
      <p className="mt-3 whitespace-pre-line text-base font-bold leading-8 text-zinc-50">
        {message}
      </p>
      <p className="mt-3 text-sm leading-7 text-zinc-300">{note}</p>
    </div>
  );
}

function ScorePanel({
  name,
  score,
}: {
  name: string;
  score: BattleResult["challengerScore"];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/50 p-3">
      <p className="font-black text-zinc-50">{name}</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-zinc-300">
        <dt>基本</dt>
        <dd className="text-right">{formatScore(score.base)}</dd>
        <dt>ランダム</dt>
        <dd className="text-right">{formatScore(score.random)}</dd>
        <dt>属性</dt>
        <dd className="text-right">+{formatScore(score.elementBonus)}</dd>
        <dt className="font-black text-amber-200">合計</dt>
        <dd className="text-right font-black text-amber-200">
          {formatScore(score.total)}
        </dd>
      </dl>
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

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="fantasy-kicker">
          BATTLE ARENA
        </p>
        <h2 className="mt-2 text-3xl font-black text-zinc-50">
          1対1バトル
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          2体を選んで、開始、中間、決着の順にバトルを進めよう。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <FighterPanel
          label="挑戦者"
          character={challenger}
          selectedId={challengerId}
          blockedId={opponentId}
          onChange={(id) => {
            setChallengerId(id);
            resetBattle();
          }}
        />
        <div className="flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/40 bg-red-950 text-xl font-black text-amber-100 shadow-xl shadow-black/40">
            VS
          </div>
        </div>
        <FighterPanel
          label="対戦相手"
          character={opponent}
          selectedId={opponentId}
          blockedId={challengerId}
          onChange={(id) => {
            setOpponentId(id);
            resetBattle();
          }}
        />
      </div>

      <div className="fantasy-panel mt-5 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-red-300">
              {phaseLabels[phase]}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              ステータス合計 {statTotal(challenger)} vs {statTotal(opponent)}
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

        <BattleLog
          phase={phase}
          result={result}
          challenger={challenger}
          opponent={opponent}
        />
      </div>
    </div>
  );
}
