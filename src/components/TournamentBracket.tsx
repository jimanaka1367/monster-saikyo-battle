"use client";

import { useState } from "react";
import { characters } from "@/src/data/characters";
import type { MonsterCharacter } from "@/src/data/characters";
import { createBattleResult } from "@/src/lib/battle";
import type { BattleResult } from "@/src/lib/battle";

type TournamentRoundKey = "quarterfinal" | "semifinal" | "final";

type TournamentMatch = {
  id: string;
  round: TournamentRoundKey;
  title: string;
  fighterA: MonsterCharacter;
  fighterB: MonsterCharacter;
  result: BattleResult;
};

type TournamentState = {
  quarterfinals: TournamentMatch[];
  semifinals: TournamentMatch[];
  final: TournamentMatch;
  champion: MonsterCharacter;
};

const roundTitles: Record<TournamentRoundKey, string> = {
  quarterfinal: "1回戦",
  semifinal: "準決勝",
  final: "決勝",
};

const formatScore = (score: number): string => score.toFixed(1);

const shuffleCharacters = (
  sourceCharacters: MonsterCharacter[],
): MonsterCharacter[] => {
  const shuffled = [...sourceCharacters];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = current;
  }

  return shuffled;
};

const createMatch = (
  round: TournamentRoundKey,
  index: number,
  fighterA: MonsterCharacter,
  fighterB: MonsterCharacter,
): TournamentMatch => {
  return {
    id: `${round}-${index}-${fighterA.id}-${fighterB.id}`,
    round,
    title: `${roundTitles[round]} 第${index + 1}試合`,
    fighterA,
    fighterB,
    result: createBattleResult(fighterA, fighterB),
  };
};

const createRound = (
  round: TournamentRoundKey,
  fighters: MonsterCharacter[],
): TournamentMatch[] => {
  const matches: TournamentMatch[] = [];

  for (let index = 0; index < fighters.length; index += 2) {
    matches.push(
      createMatch(round, index / 2, fighters[index], fighters[index + 1]),
    );
  }

  return matches;
};

const createTournament = (): TournamentState => {
  const entrants = shuffleCharacters(characters);
  const quarterfinals = createRound("quarterfinal", entrants);
  const semifinalists = quarterfinals.map((match) => match.result.winner);
  const semifinals = createRound("semifinal", semifinalists);
  const finalists = semifinals.map((match) => match.result.winner);
  const final = createMatch("final", 0, finalists[0], finalists[1]);

  return {
    quarterfinals,
    semifinals,
    final,
    champion: final.result.winner,
  };
};

function FighterLine({
  character,
  isWinner,
}: {
  character: MonsterCharacter;
  isWinner: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 ${
        isWinner
          ? "border-amber-300/60 bg-amber-300/15 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)]"
          : "border-white/10 bg-black/40 text-zinc-300"
      }`}
    >
      <span className="text-sm font-black">{character.name}</span>
      <span className="shrink-0 rounded bg-black/35 px-2 py-1 text-xs font-bold">
        {character.elements.join("・")}
      </span>
    </div>
  );
}

function MatchCard({ match }: { match: TournamentMatch }) {
  const scoreA =
    match.result.challenger.id === match.fighterA.id
      ? match.result.challengerScore
      : match.result.opponentScore;
  const scoreB =
    match.result.challenger.id === match.fighterB.id
      ? match.result.challengerScore
      : match.result.opponentScore;

  return (
    <article className="fantasy-card p-3">
      <p className="text-xs font-black tracking-[0.16em] text-red-300">
        {match.title}
      </p>

      <div className="mt-3 space-y-2">
        <FighterLine
          character={match.fighterA}
          isWinner={match.result.winner.id === match.fighterA.id}
        />
        <div className="text-center text-xs font-black text-zinc-500">VS</div>
        <FighterLine
          character={match.fighterB}
          isWinner={match.result.winner.id === match.fighterB.id}
        />
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-zinc-950/80 p-2 text-xs font-bold text-zinc-300">
        <div className="flex justify-between gap-2">
          <span>{match.fighterA.name}</span>
          <span>{formatScore(scoreA.total)}</span>
        </div>
        <div className="mt-1 flex justify-between gap-2">
          <span>{match.fighterB.name}</span>
          <span>{formatScore(scoreB.total)}</span>
        </div>
      </div>

      <p className="mt-3 text-sm font-black text-amber-100">
        勝ち上がり {match.result.winner.name}
      </p>
    </article>
  );
}

function RoundColumn({
  title,
  matches,
}: {
  title: string;
  matches: TournamentMatch[];
}) {
  return (
    <section className="min-w-0">
      <h3 className="mb-3 rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-center text-sm font-black tracking-[0.16em] text-amber-100">
        {title}
      </h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}

export function TournamentBracket() {
  const [tournament, setTournament] = useState<TournamentState | null>(null);

  const startTournament = () => {
    setTournament(createTournament());
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="fantasy-kicker">
            TOURNAMENT
          </p>
          <h2 className="mt-2 text-3xl font-black text-zinc-50">
            8体トーナメント
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            初期キャラ8体が、1回戦、準決勝、決勝の順に勝ち上がります。
          </p>
        </div>

        <button
          type="button"
          onClick={startTournament}
          className="fantasy-button fantasy-button-gold"
        >
          トーナメント開始
        </button>
      </div>

      {!tournament ? (
        <div className="rounded-lg border border-dashed border-amber-300/30 bg-black/40 p-5">
          <p className="text-sm font-bold leading-7 text-zinc-300">
            ボタンを押すと、8体の組み合わせをランダムに決めて一気に試合を進めます。
            各試合は1対1バトルと同じ勝敗ロジックで判定されます。
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_0.85fr]">
            <RoundColumn title="1回戦" matches={tournament.quarterfinals} />
            <RoundColumn title="準決勝" matches={tournament.semifinals} />
            <RoundColumn title="決勝" matches={[tournament.final]} />
          </div>

          <div
            className={`rounded-lg bg-gradient-to-br ${tournament.champion.themeColor} p-px shadow-2xl shadow-black/50`}
          >
            <div className="rounded-lg bg-black/75 p-5 text-center sm:p-7">
              <p className="fantasy-kicker">
                CHAMPION
              </p>
              <h3 className="mt-2 text-4xl font-black text-amber-100 sm:text-5xl">
                優勝 {tournament.champion.name}
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-200">
                {tournament.final.result.victoryMessage}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {tournament.champion.elements.map((element) => (
                  <span
                    key={element}
                    className="fantasy-badge border-purple-300/25 bg-purple-950/80 text-purple-100"
                  >
                    {element}
                  </span>
                ))}
                <span className="rounded-md border border-amber-300/30 bg-amber-300 px-2 py-1 text-xs font-black text-black">
                  {tournament.champion.rarity}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
