import type { MonsterCharacter } from "@/src/data/characters";

export type BattleScore = {
  base: number;
  random: number;
  elementBonus: number;
  total: number;
};

export type BattleResult = {
  challenger: MonsterCharacter;
  opponent: MonsterCharacter;
  winner: MonsterCharacter;
  loser: MonsterCharacter;
  challengerScore: BattleScore;
  opponentScore: BattleScore;
  openingMessage: string;
  midBattleMessage: string;
  victoryMessage: string;
  isUpset: boolean;
};

const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const pickRandom = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

export const calculateBaseScore = (character: MonsterCharacter): number => {
  return (
    character.stats.hp * 0.03 +
    character.stats.attack * 1.1 +
    character.stats.defense * 0.9 +
    character.stats.speed * 0.8 +
    character.stats.magic * 1.0
  );
};

export const calculateElementBonus = (
  attacker: MonsterCharacter,
  defender: MonsterCharacter,
): number => {
  const hasAdvantage = attacker.elements.some((element) =>
    defender.weaknesses.includes(element),
  );

  return hasAdvantage ? 16 : 0;
};

export const calculateBattleScore = (
  attacker: MonsterCharacter,
  defender: MonsterCharacter,
): BattleScore => {
  const base = calculateBaseScore(attacker);
  const random = randomBetween(-25, 25);
  const elementBonus = calculateElementBonus(attacker, defender);
  const total = base + random + elementBonus;

  return {
    base,
    random,
    elementBonus,
    total,
  };
};

export const createBattleResult = (
  challenger: MonsterCharacter,
  opponent: MonsterCharacter,
): BattleResult => {
  const challengerScore = calculateBattleScore(challenger, opponent);
  const opponentScore = calculateBattleScore(opponent, challenger);
  const challengerWins = challengerScore.total >= opponentScore.total;
  const winner = challengerWins ? challenger : opponent;
  const loser = challengerWins ? opponent : challenger;
  const isUpset =
    calculateBaseScore(winner) + calculateElementBonus(winner, loser) <
    calculateBaseScore(loser) + calculateElementBonus(loser, winner);

  return {
    challenger,
    opponent,
    winner,
    loser,
    challengerScore,
    opponentScore,
    openingMessage: `${challenger.openingMessage}\n${opponent.openingMessage}`,
    midBattleMessage: pickRandom(winner.midBattleMessages),
    victoryMessage: pickRandom(winner.victoryMessages),
    isUpset,
  };
};
