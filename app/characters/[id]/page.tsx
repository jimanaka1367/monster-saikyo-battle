import Link from "next/link";
import { notFound } from "next/navigation";
import { MonsterArtwork } from "@/src/components/MonsterArtwork";
import { characters, getCharacterById } from "@/src/data/characters";
import type { MonsterCharacter } from "@/src/data/characters";
import { getDangerLevelStars } from "@/src/data/characters";

export function generateStaticParams() {
  return characters.map((character) => ({
    id: character.id,
  }));
}

const statLabels: Array<[keyof MonsterCharacter["stats"], string]> = [
  ["hp", "HP"],
  ["attack", "攻撃"],
  ["defense", "防御"],
  ["speed", "速さ"],
  ["magic", "魔力"],
];

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = getCharacterById(id);

  if (!character) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-zinc-50">
      <section className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(127,29,29,0.36),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(88,28,135,0.34),transparent_34%),linear-gradient(145deg,#050505_0%,#170809_45%,#08050d_100%)]" />
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/#characters"
            className="inline-flex min-h-11 items-center rounded-lg border border-amber-300/30 bg-black/45 px-4 py-2 text-sm font-black text-amber-100"
          >
            図鑑へ戻る
          </Link>

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div
              className={`fantasy-card relative min-h-[28rem] min-w-0 overflow-hidden bg-gradient-to-br ${character.themeColor}`}
            >
              <MonsterArtwork
                character={character}
                imageClassName="object-cover object-[50%_24%]"
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(251,191,36,0.18),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.9),transparent_70%)]" />
              <div className="absolute inset-4 rounded-lg border border-amber-200/15" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-black tracking-[0.18em] text-amber-200">
                  {character.ruby}
                </p>
                <h1 className="mt-2 break-words text-4xl font-black leading-tight text-zinc-50 sm:text-6xl">
                  {character.name}
                </h1>
              </div>
            </div>

            <aside className="fantasy-panel min-w-0 p-5">
              <div className="flex flex-wrap gap-2">
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
                <span className="fantasy-badge border-amber-200/40 bg-amber-300 text-black">
                  {character.rarity}
                </span>
              </div>

              <p className="mt-5 text-xs font-black tracking-[0.16em] text-amber-200">
                危険度
              </p>
              <p className="text-xl text-amber-300">
                {getDangerLevelStars(character.dangerLevel)}
              </p>

              <p className="mt-5 break-words text-base font-bold leading-8 text-zinc-100">
                {character.description}
              </p>

              <div className="mt-5 rounded-lg border border-red-300/20 bg-red-950/20 p-4">
                <p className="text-xs font-black tracking-[0.16em] text-red-200">
                  必殺技
                </p>
                <h2 className="mt-1 break-words text-2xl font-black text-amber-100">
                  {character.specialMove.name}
                </h2>
                <p className="mt-2 break-words text-sm font-bold leading-7 text-zinc-200">
                  {character.specialMove.description}
                </p>
              </div>

              <dl className="mt-5 grid gap-3 text-sm">
                <DetailRow label="すみか" value={character.habitat} />
                <DetailRow label="戦い方" value={character.battleStyle} />
                <DetailRow
                  label="弱点"
                  value={character.weaknesses.join("・")}
                />
              </dl>
            </aside>
          </div>

          <section className="fantasy-panel mt-6 p-5">
            <p className="fantasy-kicker">STATUS</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              {statLabels.map(([key, label]) => (
                <div
                  key={key}
                  className="rounded-lg border border-white/10 bg-black/45 p-4"
                >
                  <p className="text-xs font-black text-zinc-400">{label}</p>
                  <p className="mt-2 text-3xl font-black text-amber-100">
                    {character.stats[key]}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/35 p-3">
      <dt className="text-xs font-black tracking-[0.16em] text-amber-200">
        {label}
      </dt>
              <dd className="mt-1 break-words font-bold leading-7 text-zinc-200">
                {value}
              </dd>
    </div>
  );
}
