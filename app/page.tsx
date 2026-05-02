import { BattleArena } from "@/src/components/BattleArena";
import { CharacterCard } from "@/src/components/CharacterCard";
import { TournamentBracket } from "@/src/components/TournamentBracket";
import { characters } from "@/src/data/characters";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden text-zinc-50">
      <section className="relative flex min-h-screen items-center px-4 py-12 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.14),transparent_20%),radial-gradient(circle_at_18%_18%,rgba(127,29,29,0.46),transparent_30%),radial-gradient(circle_at_82%_28%,rgba(88,28,135,0.42),transparent_34%),linear-gradient(145deg,#050505_0%,#170809_45%,#08050d_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-35" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1 fantasy-kicker">
              DARK MONSTER ENCYCLOPEDIA
            </p>
            <h1 className="text-5xl font-black leading-[1.05] text-zinc-50 drop-shadow-2xl sm:text-7xl">
              モンスター
              <span className="block bg-gradient-to-r from-amber-200 via-red-400 to-purple-300 bg-clip-text text-transparent">
                最強決定バトル
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-zinc-200 sm:text-lg">
              古代竜、魔狼、海竜、神鳥たちが闇の闘技場に集結。
              図鑑で能力を読み解き、最強の一体を見つけよう。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#characters" className="fantasy-button fantasy-button-gold">
              図鑑を見る
            </a>
            <a href="#battle" className="fantasy-button fantasy-button-red">
              バトル開始
            </a>
            <a
              href="#tournament"
              className="fantasy-button fantasy-button-purple"
            >
              トーナメント
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="fantasy-panel p-4">
              <p className="text-3xl font-black text-amber-200">
                {characters.length}
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-300">
                初期モンスター
              </p>
            </div>
            <div className="fantasy-panel p-4">
              <p className="text-3xl font-black text-red-300">3</p>
              <p className="mt-1 text-sm font-bold text-zinc-300">
                段階バトル演出
              </p>
            </div>
            <div className="fantasy-panel p-4">
              <p className="text-3xl font-black text-purple-200">UR</p>
              <p className="mt-1 text-sm font-bold text-zinc-300">
                伝説級レアリティ
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="battle"
        className="fantasy-section border-y border-red-900/50 bg-gradient-to-b from-zinc-950 via-black to-zinc-950"
      >
        <BattleArena />
      </section>

      <section
        id="tournament"
        className="fantasy-section border-b border-purple-900/50 bg-gradient-to-b from-black via-purple-950/20 to-black"
      >
        <TournamentBracket />
      </section>

      <section id="characters" className="fantasy-section bg-black">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <p className="fantasy-kicker text-red-300">
              MONSTER FILES
            </p>
            <h2 className="mt-2 text-3xl font-black text-zinc-50">
              モンスター図鑑
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              属性、危険度、ステータスを見比べて、最強候補を探そう。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {characters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                priorityImage={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
