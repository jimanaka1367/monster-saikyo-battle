export type MonsterElement =
  | "炎"
  | "水"
  | "雷"
  | "氷"
  | "地"
  | "闇"
  | "光"
  | "毒";

export type MonsterCategory =
  | "古代竜"
  | "飛竜"
  | "魔狼"
  | "魔獣"
  | "海竜"
  | "神鳥"
  | "巨人"
  | "多頭竜"
  | "幻獣"
  | "怪鳥"
  | "騎士"
  | "大蛇"
  | "守護者";

export type MonsterStats = {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  magic: number;
};

export type MonsterCharacter = {
  id: string;
  fileName: string;
  name: string;
  ruby: string;
  category: MonsterCategory;
  elements: MonsterElement[];
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  rarity: "N" | "R" | "SR" | "SSR" | "UR";
  stats: MonsterStats;
  specialMove: {
    name: string;
    description: string;
  };
  weaknesses: MonsterElement[];
  habitat: string;
  shortDescription: string;
  description: string;
  battleStyle: string;
  image: string;
  normalImage: string;
  battleImage: string;
  themeColor: string;
  openingMessage: string;
  midBattleMessages: string[];
  victoryMessages: string[];
};

type MonsterSeed = Omit<MonsterCharacter, "image" | "normalImage" | "battleImage">;

const imagePaths = (fileName: string) => ({
  image: `/images/characters/${fileName}.png`,
  normalImage: `/images/characters/${fileName}.png`,
  battleImage: `/images/characters/battle/${fileName}-battle.png`,
});

const createCharacter = (character: MonsterSeed): MonsterCharacter => ({
  ...character,
  ...imagePaths(character.fileName),
});

export const characters: MonsterCharacter[] = [
  createCharacter({
    id: "black-dragon-valgald",
    fileName: "black-dragon-valgald",
    name: "黒竜ヴァルガルド",
    ruby: "こくりゅうヴァルガルド",
    category: "古代竜",
    elements: ["闇", "炎"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 920, attack: 95, defense: 88, speed: 62, magic: 96 },
    specialMove: {
      name: "ダークネス・インフェルノ",
      description: "黒い炎のブレスで戦場を包みこむ、闇と炎の大技。",
    },
    weaknesses: ["光", "水"],
    habitat: "闇に包まれた古代火山",
    shortDescription: "闇と炎をあやつる最古の黒竜。",
    description:
      "闇の大地を支配する巨大な黒竜。黒い炎のブレスは岩山すら焼きつくすと言われている。",
    battleStyle:
      "高い攻撃力と魔力で押し切る重量級タイプ。素早さは低めだが一撃の破壊力は最強クラス。",
    themeColor: "from-red-950 via-purple-950 to-black",
    openingMessage: "黒竜ヴァルガルドが翼を広げ、戦場に黒い炎をまとった！",
    midBattleMessages: [
      "ヴァルガルドの黒炎が地面を走り、相手の足元を焼きつくす！",
      "巨大な翼が巻き起こす風で、戦場全体が暗い炎に包まれる！",
      "ヴァルガルドが低くうなり、闇の魔力を一気に高めた！",
    ],
    victoryMessages: [
      "最後はダークネス・インフェルノが炸裂し、黒竜ヴァルガルドが勝利をつかんだ！",
      "黒い炎が戦場を包みこみ、ヴァルガルドが圧倒的な力を見せつけた！",
    ],
  }),
  createCharacter({
    id: "thunder-emperor-wyvern",
    fileName: "thunder-emperor-wyvern",
    name: "雷帝ワイバーン",
    ruby: "らいていワイバーン",
    category: "飛竜",
    elements: ["雷"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 760, attack: 82, defense: 68, speed: 98, magic: 86 },
    specialMove: {
      name: "サンダー・ダイブ",
      description: "雷をまとって空から急降下し、一瞬で勝負を動かす。",
    },
    weaknesses: ["地", "氷"],
    habitat: "嵐が止まない天空の山脈",
    shortDescription: "雷をまとって空を切り裂く高速の飛竜。",
    description:
      "青白い雷をまとって空を飛ぶ飛竜。目で追えないほどの速さで相手を翻弄する。",
    battleStyle: "素早さを生かして先手を取るスピードタイプ。守りの固い相手は苦手。",
    themeColor: "from-blue-950 via-sky-900 to-black",
    openingMessage: "雷帝ワイバーンが雷鳴とともに戦場へ降り立った！",
    midBattleMessages: [
      "ワイバーンが雷をまとい、相手の背後へ一気に回り込む！",
      "空から青白い雷が落ち、戦場に大きな衝撃が走った！",
      "ワイバーンの翼が光り、次の一撃へ向けて雷をためている！",
    ],
    victoryMessages: [
      "サンダー・ダイブが決まり、雷帝ワイバーンが勝利をつかんだ！",
      "空を切り裂く雷の一撃で、ワイバーンが勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "ice-fang-fenrir",
    fileName: "ice-fang-fenrir",
    name: "氷牙フェンリル",
    ruby: "ひょうがフェンリル",
    category: "魔狼",
    elements: ["氷"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 810, attack: 84, defense: 74, speed: 92, magic: 78 },
    specialMove: {
      name: "フロスト・ファング",
      description: "氷をまとった牙で相手の動きを封じる一撃。",
    },
    weaknesses: ["炎", "雷"],
    habitat: "月明かりに照らされた氷の森",
    shortDescription: "月夜に現れる氷の魔狼。",
    description:
      "冷たい息で大地を凍らせる魔狼。速さと攻撃のバランスがよく、強敵にも立ち向かう。",
    battleStyle: "素早さと攻撃を両立したバランス型。相手の動きを止めながら攻める。",
    themeColor: "from-slate-950 via-cyan-950 to-black",
    openingMessage: "氷牙フェンリルが月明かりの下で遠吠えし、冷たい霧が広がった！",
    midBattleMessages: [
      "フェンリルが白い足跡を残して走り、氷の牙で相手に迫る！",
      "戦場の地面が凍りつき、相手の動きが少し鈍った！",
      "フェンリルが低く身をかがめ、反撃の姿勢に入った！",
    ],
    victoryMessages: [
      "フロスト・ファングが決まり、氷牙フェンリルが勝利をつかんだ！",
      "冷たい霧の中からフェンリルが姿を現し、勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "underworld-cerberus",
    fileName: "underworld-cerberus",
    name: "冥界ケルベロス",
    ruby: "めいかいケルベロス",
    category: "魔獣",
    elements: ["闇"],
    dangerLevel: 5,
    rarity: "SSR",
    stats: { hp: 880, attack: 90, defense: 82, speed: 76, magic: 80 },
    specialMove: {
      name: "トリプル・ヘルバイト",
      description: "三つの頭が別々の方向から同時に迫る連続攻撃。",
    },
    weaknesses: ["光"],
    habitat: "冥界の門",
    shortDescription: "冥界の門を守る三つ首の魔獣。",
    description:
      "三方向から同時に攻める、すきを見せない魔獣。攻撃、防御、HPのバランスが高い。",
    battleStyle: "安定した強さで相手を追い詰める万能型。空中の相手には少し不利。",
    themeColor: "from-zinc-950 via-red-950 to-black",
    openingMessage: "冥界ケルベロスが三つの頭をもたげ、不気味なうなり声を響かせた！",
    midBattleMessages: [
      "三つの頭が別々の方向から迫り、相手の逃げ道をふさぐ！",
      "ケルベロスの咆哮が戦場に響き、空気が重く震えた！",
      "鋭い爪が地面を削り、ケルベロスが一気に間合いを詰める！",
    ],
    victoryMessages: [
      "トリプル・ヘルバイトが決まり、冥界ケルベロスが勝利した！",
      "三つの頭による連続攻撃で、ケルベロスが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "deep-sea-leviathan",
    fileName: "deep-sea-leviathan",
    name: "深海リヴァイアサン",
    ruby: "しんかいリヴァイアサン",
    category: "海竜",
    elements: ["水"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 980, attack: 86, defense: 92, speed: 55, magic: 88 },
    specialMove: {
      name: "アビス・タイダルウェーブ",
      description: "深海の力を呼び起こし、巨大な波で戦場を飲みこむ。",
    },
    weaknesses: ["雷"],
    habitat: "光の届かない深海神殿",
    shortDescription: "深海に眠る巨大な海竜。",
    description:
      "深い海の底に眠る海竜。圧倒的なHPと防御力で攻撃を受け止め、反撃する。",
    battleStyle: "HPと防御が非常に高い耐久型。長期戦になるほど強さを発揮する。",
    themeColor: "from-slate-950 via-blue-950 to-black",
    openingMessage: "深海リヴァイアサンが水しぶきを上げ、巨大な体を戦場に現した！",
    midBattleMessages: [
      "リヴァイアサンが尾を振ると、大波が戦場を洗い流した！",
      "深海の魔力が渦を巻き、相手の動きを飲みこもうとしている！",
      "巨大な体で攻撃を受け止め、リヴァイアサンが反撃の機会をうかがう！",
    ],
    victoryMessages: [
      "アビス・タイダルウェーブが戦場を包み、深海リヴァイアサンが勝利した！",
      "圧倒的な耐久力で攻撃をしのぎ、リヴァイアサンが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "phoenix-of-rebirth",
    fileName: "phoenix-of-rebirth",
    name: "不死鳥フェニクス",
    ruby: "ふしちょうフェニクス",
    category: "神鳥",
    elements: ["炎", "光"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 740, attack: 76, defense: 64, speed: 90, magic: 98 },
    specialMove: {
      name: "リバース・フレア",
      description: "まばゆい炎で自らの力を高めながら、光の炎を放つ。",
    },
    weaknesses: ["水", "闇"],
    habitat: "太陽の光が差す天空の祭壇",
    shortDescription: "炎の中からよみがえる伝説の神鳥。",
    description:
      "炎の中から何度でも舞い上がる神鳥。魔力と素早さが高く、大逆転を起こしやすい。",
    battleStyle: "魔力と素早さが高い逆転型。守りは低めだが流れを変える力がある。",
    themeColor: "from-orange-950 via-red-900 to-yellow-950",
    openingMessage: "不死鳥フェニクスが炎の翼を広げ、まばゆい光を放った！",
    midBattleMessages: [
      "フェニクスの炎が大きく燃え上がり、ふたたび力を取り戻していく！",
      "光の羽が戦場に舞い、フェニクスが空高く飛び上がった！",
      "フェニクスが炎をまとい、逆転の一撃を狙っている！",
    ],
    victoryMessages: [
      "リバース・フレアが輝き、不死鳥フェニクスが逆転勝利をつかんだ！",
      "炎の中から力を取り戻し、フェニクスが戦場を制した！",
    ],
  }),
  createCharacter({
    id: "rock-armor-golem",
    fileName: "rock-armor-golem",
    name: "岩鎧ゴーレム",
    ruby: "いわよろいゴーレム",
    category: "巨人",
    elements: ["地"],
    dangerLevel: 4,
    rarity: "SR",
    stats: { hp: 960, attack: 88, defense: 98, speed: 38, magic: 52 },
    specialMove: {
      name: "グランド・ブレイク",
      description: "巨大な拳を地面に叩きつけ、衝撃波で相手を押し返す。",
    },
    weaknesses: ["水", "光"],
    habitat: "古代遺跡の地下神殿",
    shortDescription: "古代遺跡を守る岩の巨人。",
    description:
      "全身をおおう岩の鎧で攻撃を受け止める巨人。防御力はトップクラス。",
    battleStyle: "防御特化型。動きは遅いが、耐えて重い一撃で反撃する。",
    themeColor: "from-stone-950 via-amber-950 to-black",
    openingMessage: "岩鎧ゴーレムが大地を揺らしながら、ゆっくりと立ち上がった！",
    midBattleMessages: [
      "ゴーレムは相手の攻撃を岩の鎧で受け止めた！",
      "巨大な拳が地面にめり込み、戦場に地響きが広がる！",
      "ゴーレムは動かず、重い一撃を放つタイミングを待っている！",
    ],
    victoryMessages: [
      "グランド・ブレイクの衝撃波が決まり、岩鎧ゴーレムが勝利した！",
      "相手の攻撃を受けきったゴーレムが、重い一撃で勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "venom-hydra",
    fileName: "venom-hydra",
    name: "毒蛇ヒュドラ",
    ruby: "どくじゃヒュドラ",
    category: "多頭竜",
    elements: ["毒"],
    dangerLevel: 5,
    rarity: "SSR",
    stats: { hp: 850, attack: 80, defense: 78, speed: 70, magic: 92 },
    specialMove: {
      name: "ヴェノム・テンペスト",
      description: "毒の霧を嵐のように広げ、相手の力を少しずつ奪う。",
    },
    weaknesses: ["炎", "光"],
    habitat: "毒霧に包まれた沼地の遺跡",
    shortDescription: "いくつもの首を持つ毒の竜。",
    description:
      "毒の息をまき散らし、相手の力をじわじわ奪う多頭竜。長い戦いを得意とする。",
    battleStyle: "魔力と毒の演出が得意な持久型。中盤から有利な流れを作る。",
    themeColor: "from-green-950 via-purple-950 to-black",
    openingMessage: "毒蛇ヒュドラがいくつもの首をもたげ、毒の霧を吐き出した！",
    midBattleMessages: [
      "ヒュドラの毒霧が広がり、相手の動きが少し鈍っていく！",
      "いくつもの首が別々の方向からにらみつけ、相手を追い詰める！",
      "毒の魔力が戦場に満ち、ヒュドラがじわじわと有利な流れを作る！",
    ],
    victoryMessages: [
      "ヴェノム・テンペストが決まり、毒蛇ヒュドラが勝利をつかんだ！",
      "毒の霧で相手の力を奪い、ヒュドラが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "golden-griffon",
    fileName: "golden-griffon",
    name: "黄金グリフォン",
    ruby: "おうごんグリフォン",
    category: "怪鳥",
    elements: ["光"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 830, attack: 87, defense: 76, speed: 89, magic: 74 },
    specialMove: {
      name: "ソーラー・クロー",
      description: "金色に輝く爪で、空からまっすぐ切り込む。",
    },
    weaknesses: ["闇", "雷"],
    habitat: "黄金の朝日が差す高山",
    shortDescription: "太陽の光をまとう翼の守護獣。",
    description: "金色の翼で空を舞うグリフォン。光の爪で素早く戦場を駆ける。",
    battleStyle: "攻撃と素早さのバランスがよい空中タイプ。",
    themeColor: "from-yellow-950 via-amber-800 to-black",
    openingMessage: "黄金グリフォンが朝日のような光をまとって飛び込んできた！",
    midBattleMessages: [
      "金色の羽が舞い、グリフォンが空から角度を変えて迫る！",
      "まばゆい爪の光が、相手の守りを切り開こうとしている！",
      "グリフォンが大きく旋回し、次の急降下に備えた！",
    ],
    victoryMessages: [
      "ソーラー・クローが輝き、黄金グリフォンが勝利をつかんだ！",
      "空からの光の一撃で、グリフォンが勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "blaze-basilisk",
    fileName: "blaze-basilisk",
    name: "灼熱バジリスク",
    ruby: "しゃくねつバジリスク",
    category: "魔獣",
    elements: ["炎", "毒"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 780, attack: 83, defense: 72, speed: 85, magic: 88 },
    specialMove: {
      name: "ブレイズ・ペトロアイズ",
      description: "炎の眼光で相手をすくませ、熱い突進につなげる。",
    },
    weaknesses: ["水", "地"],
    habitat: "赤く光る溶岩の谷",
    shortDescription: "炎と毒の眼光を持つ魔獣。",
    description: "灼熱の体と毒のにらみを持つバジリスク。すばやく相手の足を止める。",
    battleStyle: "魔力と素早さで流れを作るかく乱タイプ。",
    themeColor: "from-red-950 via-orange-900 to-green-950",
    openingMessage: "灼熱バジリスクの眼が赤く光り、熱い空気が広がった！",
    midBattleMessages: [
      "バジリスクの眼光が走り、相手の動きが一瞬止まる！",
      "炎の火花と毒の霧が混ざり、戦場を不思議な色に染める！",
      "低い姿勢から、バジリスクが一気に間合いを詰めた！",
    ],
    victoryMessages: [
      "ブレイズ・ペトロアイズが決まり、灼熱バジリスクが勝利した！",
      "炎のにらみからの突進で、バジリスクが勝負を制した！",
    ],
  }),
  createCharacter({
    id: "phantom-kraken",
    fileName: "phantom-kraken",
    name: "霧幻クラーケン",
    ruby: "むげんクラーケン",
    category: "海竜",
    elements: ["水", "闇"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 930, attack: 84, defense: 86, speed: 58, magic: 94 },
    specialMove: {
      name: "ミスト・アビスグラスプ",
      description: "霧と深海の魔力で相手を包みこむ大技。",
    },
    weaknesses: ["雷", "光"],
    habitat: "霧に隠れた沈没船の海域",
    shortDescription: "霧の中から触手を伸ばす深海の怪物。",
    description: "濃い霧に姿を隠すクラーケン。水と闇の魔力で相手を惑わせる。",
    battleStyle: "高いHPと魔力でじわじわ追い詰める耐久魔法型。",
    themeColor: "from-slate-950 via-blue-950 to-purple-950",
    openingMessage: "霧幻クラーケンが白い霧の中から巨大な影を現した！",
    midBattleMessages: [
      "霧の中から水の渦が生まれ、相手の足元をすくう！",
      "クラーケンの触手が影のように伸び、戦場の空気を重くする！",
      "深海の魔力が広がり、相手は距離を測りにくくなった！",
    ],
    victoryMessages: [
      "ミスト・アビスグラスプが決まり、霧幻クラーケンが勝利した！",
      "深海の霧が勝負を包みこみ、クラーケンが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "judgement-minotaur",
    fileName: "judgement-minotaur",
    name: "断罪ミノタウロス",
    ruby: "だんざいミノタウロス",
    category: "巨人",
    elements: ["地", "闇"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 900, attack: 94, defense: 84, speed: 60, magic: 58 },
    specialMove: {
      name: "ラビリンス・スマッシュ",
      description: "迷宮の壁を砕くような重い突撃を放つ。",
    },
    weaknesses: ["光", "水"],
    habitat: "黒い石でできた迷宮",
    shortDescription: "迷宮を守る重戦士の魔獣。",
    description: "巨大な角と斧を思わせる腕で戦うミノタウロス。攻撃力がとても高い。",
    battleStyle: "高い攻撃で正面から押し切るパワータイプ。",
    themeColor: "from-stone-950 via-red-950 to-black",
    openingMessage: "断罪ミノタウロスが迷宮の扉を砕き、重い足音で現れた！",
    midBattleMessages: [
      "ミノタウロスが大地を蹴り、一直線に突進する！",
      "黒い石片が飛び散り、重い一撃の気配が近づく！",
      "迷宮のような圧力で、相手の逃げ道をふさいだ！",
    ],
    victoryMessages: [
      "ラビリンス・スマッシュが決まり、断罪ミノタウロスが勝利した！",
      "重い突進が相手を押し切り、ミノタウロスが勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "storm-chimera",
    fileName: "storm-chimera",
    name: "嵐刃キマイラ",
    ruby: "らんじんキマイラ",
    category: "魔獣",
    elements: ["雷", "炎"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 860, attack: 91, defense: 79, speed: 82, magic: 80 },
    specialMove: {
      name: "テンペスト・トライファング",
      description: "雷、炎、風圧を重ねた三連撃。",
    },
    weaknesses: ["地", "水"],
    habitat: "雷雲が渦巻く荒野",
    shortDescription: "雷と炎をまとった合成魔獣。",
    description: "いくつもの獣の力をあわせ持つキマイラ。攻撃の手数が多い。",
    battleStyle: "攻撃、速度、魔力のバランスが高い連撃タイプ。",
    themeColor: "from-blue-950 via-red-950 to-black",
    openingMessage: "嵐刃キマイラが雷と炎をまとい、荒野から飛び出した！",
    midBattleMessages: [
      "雷の牙と炎の爪が交差し、相手に連続で迫る！",
      "キマイラの咆哮が風圧となり、戦場の砂を巻き上げた！",
      "三つの力が重なり、次の一撃がさらに鋭くなる！",
    ],
    victoryMessages: [
      "テンペスト・トライファングが決まり、嵐刃キマイラが勝利した！",
      "雷と炎の連撃で、キマイラが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "netherfrost-dullahan",
    fileName: "netherfrost-dullahan",
    name: "冥氷デュラハン",
    ruby: "めいひょうデュラハン",
    category: "騎士",
    elements: ["闇", "氷"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 820, attack: 88, defense: 81, speed: 74, magic: 90 },
    specialMove: {
      name: "フロスト・ギロチン",
      description: "氷の刃を闇の魔力で加速させる一閃。",
    },
    weaknesses: ["炎", "光"],
    habitat: "凍った古城の回廊",
    shortDescription: "氷の剣を持つ闇の騎士。",
    description: "静かに迫るデュラハン。冷気と闇で相手の動きを読みにくくする。",
    battleStyle: "魔力と攻撃をあわせた技巧派。中距離からの一撃が得意。",
    themeColor: "from-zinc-950 via-cyan-950 to-purple-950",
    openingMessage: "冥氷デュラハンが氷の馬音とともに、静かに現れた！",
    midBattleMessages: [
      "デュラハンの剣先から冷気が広がり、戦場が白く染まる！",
      "闇の魔力が刃に集まり、鋭い一閃の気配が走る！",
      "氷の足音が響き、デュラハンが間合いを詰めた！",
    ],
    victoryMessages: [
      "フロスト・ギロチンが決まり、冥氷デュラハンが勝利した！",
      "氷と闇の一閃で、デュラハンが勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "moonshadow-sphinx",
    fileName: "moonshadow-sphinx",
    name: "月影スフィンクス",
    ruby: "つきかげスフィンクス",
    category: "幻獣",
    elements: ["光", "闇"],
    dangerLevel: 4,
    rarity: "UR",
    stats: { hp: 800, attack: 79, defense: 77, speed: 83, magic: 95 },
    specialMove: {
      name: "ムーンリドル・バースト",
      description: "月光と影のなぞかけで相手のリズムをくずす。",
    },
    weaknesses: ["毒", "地"],
    habitat: "月明かりの砂漠神殿",
    shortDescription: "月光となぞを操る神秘の幻獣。",
    description: "静かな目で相手を見つめるスフィンクス。光と闇を切り替えて戦う。",
    battleStyle: "高い魔力で相手の流れを乱すテクニック型。",
    themeColor: "from-indigo-950 via-purple-950 to-yellow-950",
    openingMessage: "月影スフィンクスが月光を背に、静かになぞを告げた！",
    midBattleMessages: [
      "月の光と影が交互に広がり、相手の目を惑わせる！",
      "スフィンクスのなぞかけが響き、戦場の流れが変わる！",
      "光の輪が開き、闇の影が一気に伸びた！",
    ],
    victoryMessages: [
      "ムーンリドル・バーストが決まり、月影スフィンクスが勝利した！",
      "月光と影の術で、スフィンクスが勝負を読み切った！",
    ],
  }),
  createCharacter({
    id: "inferno-salamander",
    fileName: "inferno-salamander",
    name: "業火サラマンダー",
    ruby: "ごうかサラマンダー",
    category: "魔獣",
    elements: ["炎"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 770, attack: 86, defense: 70, speed: 92, magic: 84 },
    specialMove: {
      name: "クリムゾン・スラッシュ",
      description: "真っ赤な炎の尾で鋭く切り込む。",
    },
    weaknesses: ["水", "氷"],
    habitat: "燃える鉱石の洞窟",
    shortDescription: "赤い炎を背負う俊敏な魔獣。",
    description: "炎の尾をしならせて戦うサラマンダー。すばやい連続攻撃が得意。",
    battleStyle: "速度を生かした炎の連撃タイプ。",
    themeColor: "from-red-950 via-orange-950 to-black",
    openingMessage: "業火サラマンダーが赤い火花を散らして走り込んだ！",
    midBattleMessages: [
      "炎の尾が弧を描き、相手の守りをゆさぶる！",
      "サラマンダーが地面を蹴るたび、赤い火花が舞った！",
      "熱気が高まり、次の斬撃がさらに鋭くなる！",
    ],
    victoryMessages: [
      "クリムゾン・スラッシュが決まり、業火サラマンダーが勝利した！",
      "炎の速攻で、サラマンダーが戦いを押し切った！",
    ],
  }),
  createCharacter({
    id: "thunderhorn-behemoth",
    fileName: "thunderhorn-behemoth",
    name: "雷角ベヒモス",
    ruby: "らいかくベヒモス",
    category: "巨人",
    elements: ["地", "雷"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 970, attack: 92, defense: 93, speed: 42, magic: 64 },
    specialMove: {
      name: "サンダー・クエイク",
      description: "雷を帯びた角で大地を揺らす超重量の一撃。",
    },
    weaknesses: ["氷", "水"],
    habitat: "雷が落ちる巨岩平原",
    shortDescription: "雷の角を持つ巨大な大地の獣。",
    description: "山のような体を持つベヒモス。防御とHPが高く、近づくだけで迫力がある。",
    battleStyle: "遅いが非常に固い重戦車タイプ。",
    themeColor: "from-stone-950 via-yellow-950 to-blue-950",
    openingMessage: "雷角ベヒモスが大地を揺らし、角に雷を集めた！",
    midBattleMessages: [
      "ベヒモスの踏み込みで地面が揺れ、雷が角から弾ける！",
      "重い体が前へ進み、相手は圧力に押されていく！",
      "巨岩のような肩が光り、反撃の準備が整った！",
    ],
    victoryMessages: [
      "サンダー・クエイクが決まり、雷角ベヒモスが勝利した！",
      "大地と雷の一撃で、ベヒモスが勝負を押し切った！",
    ],
  }),
  createCharacter({
    id: "deepforest-unicorn",
    fileName: "deepforest-unicorn",
    name: "深森ユニコーン",
    ruby: "しんりんユニコーン",
    category: "幻獣",
    elements: ["光"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 760, attack: 73, defense: 75, speed: 90, magic: 97 },
    specialMove: {
      name: "セイクリッド・ホーン",
      description: "聖なる角から金色の光を放つ。",
    },
    weaknesses: ["闇", "毒"],
    habitat: "光の木漏れ日が差す深い森",
    shortDescription: "森の奥に住む聖なる幻獣。",
    description: "清らかな光をまとうユニコーン。魔力が高く、味方する光を呼び込む。",
    battleStyle: "高い魔力と速さで流れを整える光属性タイプ。",
    themeColor: "from-emerald-950 via-yellow-950 to-black",
    openingMessage: "深森ユニコーンが木漏れ日のような光をまとって現れた！",
    midBattleMessages: [
      "金色の光が角に集まり、戦場をやさしく照らす！",
      "ユニコーンが軽やかに跳び、相手の攻撃をかわした！",
      "森の気配が広がり、光の魔力が高まっていく！",
    ],
    victoryMessages: [
      "セイクリッド・ホーンが輝き、深森ユニコーンが勝利した！",
      "聖なる光で流れを変え、ユニコーンが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "sky-pegasus",
    fileName: "sky-pegasus",
    name: "天空ペガサス",
    ruby: "てんくうペガサス",
    category: "幻獣",
    elements: ["光", "雷"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 780, attack: 78, defense: 72, speed: 96, magic: 86 },
    specialMove: {
      name: "スカイライト・チャージ",
      description: "光と雷をまとい、空からまっすぐ突撃する。",
    },
    weaknesses: ["地", "闇"],
    habitat: "雲の上の白い回廊",
    shortDescription: "空を駆ける光の翼馬。",
    description: "白い翼で空を走るペガサス。速さを生かした美しい突撃が得意。",
    battleStyle: "高い素早さで一気に勝負を動かす空中タイプ。",
    themeColor: "from-sky-950 via-indigo-950 to-yellow-950",
    openingMessage: "天空ペガサスが雲を切り裂き、光の軌跡を描いた！",
    midBattleMessages: [
      "ペガサスの翼が光り、雷の筋が空を走る！",
      "空中からの突撃で、相手の守りを大きく揺さぶる！",
      "白い羽が舞い、ペガサスが次の加速に入った！",
    ],
    victoryMessages: [
      "スカイライト・チャージが決まり、天空ペガサスが勝利した！",
      "空からの光速突撃で、ペガサスが勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "abyss-manticore",
    fileName: "abyss-manticore",
    name: "奈落マンティコア",
    ruby: "ならくマンティコア",
    category: "魔獣",
    elements: ["毒", "闇"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 850, attack: 89, defense: 78, speed: 80, magic: 82 },
    specialMove: {
      name: "アビス・スコーピオン",
      description: "毒針と闇の魔力で相手の動きを鈍らせる。",
    },
    weaknesses: ["光", "地"],
    habitat: "底の見えない谷",
    shortDescription: "毒針を持つ奈落の魔獣。",
    description: "獅子のような体と毒針を持つマンティコア。毒と闇で相手を追い詰める。",
    battleStyle: "攻撃と魔力のバランスがよい妨害タイプ。",
    themeColor: "from-purple-950 via-green-950 to-black",
    openingMessage: "奈落マンティコアが低くうなり、毒針を光らせた！",
    midBattleMessages: [
      "毒針が闇の軌跡を描き、相手の動きをけん制する！",
      "マンティコアが影の中から飛び出し、鋭い爪で迫る！",
      "奈落の気配が広がり、毒の霧が戦場を覆った！",
    ],
    victoryMessages: [
      "アビス・スコーピオンが決まり、奈落マンティコアが勝利した！",
      "毒針と闇の連携で、マンティコアが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "ancient-anubis",
    fileName: "ancient-anubis",
    name: "古代アヌビス",
    ruby: "こだいアヌビス",
    category: "守護者",
    elements: ["闇", "光"],
    dangerLevel: 4,
    rarity: "UR",
    stats: { hp: 810, attack: 84, defense: 80, speed: 88, magic: 91 },
    specialMove: {
      name: "ソウル・ジャッジメント",
      description: "光と闇の天秤で相手の力を見極める裁きの魔法。",
    },
    weaknesses: ["毒", "水"],
    habitat: "砂漠の古代王墓",
    shortDescription: "古代の王墓を守る光と闇の番人。",
    description: "静かに戦況を見つめるアヌビス。高い魔力と速さで正確に攻める。",
    battleStyle: "魔力と素早さを生かした判断型。番狂わせも起こしやすい。",
    themeColor: "from-yellow-950 via-zinc-950 to-purple-950",
    openingMessage: "古代アヌビスが金色の天秤を掲げ、静かに戦場へ現れた！",
    midBattleMessages: [
      "光と闇の天秤が揺れ、相手の弱点を見つけ出す！",
      "アヌビスの瞳が光り、次の一手を読み切ろうとしている！",
      "砂の魔法陣が広がり、戦場に古代の力が満ちた！",
    ],
    victoryMessages: [
      "ソウル・ジャッジメントが決まり、古代アヌビスが勝利した！",
      "光と闇の裁きで、アヌビスが勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "doom-bahamut",
    fileName: "doom-bahamut",
    name: "終焉バハムート",
    ruby: "しゅうえんバハムート",
    category: "古代竜",
    elements: ["闇", "炎"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 990, attack: 99, defense: 90, speed: 65, magic: 98 },
    specialMove: {
      name: "カタストロフ・ノヴァ",
      description: "闇と炎を一点に集め、超巨大な爆発を起こす。",
    },
    weaknesses: ["光", "水"],
    habitat: "崩れた星の祭壇",
    shortDescription: "終焉の名を持つ最強級の古代竜。",
    description: "圧倒的な力で戦場を支配するバハムート。全能力が高い伝説級の竜。",
    battleStyle: "攻撃、魔力、耐久すべてが高い超重量級タイプ。",
    themeColor: "from-black via-red-950 to-purple-950",
    openingMessage: "終焉バハムートが黒い炎をまとい、空を震わせながら降り立った！",
    midBattleMessages: [
      "闇と炎が一点に集まり、戦場の空気が大きく揺れる！",
      "バハムートの咆哮で、足元の魔法陣が赤黒く輝いた！",
      "巨大な翼が影を落とし、次の一撃への圧力が高まる！",
    ],
    victoryMessages: [
      "カタストロフ・ノヴァが炸裂し、終焉バハムートが勝利した！",
      "闇と炎の超火力で、バハムートが戦場を制した！",
    ],
  }),
  createCharacter({
    id: "peak-garuda",
    fileName: "peak-garuda",
    name: "霊峰ガルーダ",
    ruby: "れいほうガルーダ",
    category: "神鳥",
    elements: ["光", "雷"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 790, attack: 85, defense: 74, speed: 94, magic: 89 },
    specialMove: {
      name: "ボルト・サイクロン",
      description: "光る翼で雷の竜巻を作り出す。",
    },
    weaknesses: ["闇", "地"],
    habitat: "霊峰の頂上",
    shortDescription: "山頂の風を支配する神鳥。",
    description: "高い山の上にすむガルーダ。風と雷をまとい、空から戦場を支配する。",
    battleStyle: "高い速度と魔力で空中から攻めるタイプ。",
    themeColor: "from-sky-950 via-yellow-950 to-black",
    openingMessage: "霊峰ガルーダが山頂の風を連れて、戦場の上空に舞い上がった！",
    midBattleMessages: [
      "雷を帯びた風が渦を巻き、相手の足元を乱す！",
      "ガルーダの翼が光り、鋭い風切り音が響く！",
      "空中からの旋回で、ガルーダが攻める角度を変えた！",
    ],
    victoryMessages: [
      "ボルト・サイクロンが決まり、霊峰ガルーダが勝利した！",
      "雷の竜巻で、ガルーダが戦いを空から制した！",
    ],
  }),
  createCharacter({
    id: "frost-jormungandr",
    fileName: "frost-jormungandr",
    name: "冷獄ヨルムンガンド",
    ruby: "れいごくヨルムンガンド",
    category: "大蛇",
    elements: ["氷", "毒"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 950, attack: 90, defense: 88, speed: 57, magic: 85 },
    specialMove: {
      name: "グレイシャル・コイル",
      description: "氷の大蛇が巻きつくように冷気と毒を広げる。",
    },
    weaknesses: ["炎", "光"],
    habitat: "凍りついた地下湖",
    shortDescription: "氷と毒をまとった巨大な大蛇。",
    description: "長い体で戦場を囲むヨルムンガンド。冷気と毒で相手を追い込む。",
    battleStyle: "高い耐久力でじわじわ勝つ持久型。",
    themeColor: "from-cyan-950 via-green-950 to-black",
    openingMessage: "冷獄ヨルムンガンドが氷の湖を割り、巨大な体を現した！",
    midBattleMessages: [
      "氷の体がうねり、毒の冷気が戦場に広がっていく！",
      "ヨルムンガンドが円を描き、相手の動ける場所を狭める！",
      "冷たい霧が濃くなり、相手の足取りが重くなる！",
    ],
    victoryMessages: [
      "グレイシャル・コイルが決まり、冷獄ヨルムンガンドが勝利した！",
      "氷と毒の包囲で、ヨルムンガンドが勝負を制した！",
    ],
  }),
  createCharacter({
    id: "hellfire-tartarus",
    fileName: "hellfire-tartarus",
    name: "獄炎タルタロス",
    ruby: "ごくえんタルタロス",
    category: "巨人",
    elements: ["炎", "地"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 940, attack: 96, defense: 89, speed: 48, magic: 76 },
    specialMove: {
      name: "ヘルフレイム・クラッシュ",
      description: "炎をまとった巨腕で地面ごと押し切る。",
    },
    weaknesses: ["水", "氷"],
    habitat: "地底の炎の牢獄",
    shortDescription: "地底の炎をまとった巨人。",
    description: "岩の体に炎を宿すタルタロス。重い攻撃と高い防御で戦う。",
    battleStyle: "高攻撃、高防御の鈍足パワータイプ。",
    themeColor: "from-red-950 via-stone-950 to-black",
    openingMessage: "獄炎タルタロスが地底の炎を背負い、戦場に巨腕を振り下ろした！",
    midBattleMessages: [
      "燃える岩石が砕け、戦場に赤い衝撃波が走る！",
      "タルタロスの巨腕がうなり、相手を正面から押し込む！",
      "地面の割れ目から炎が吹き上がり、力が増していく！",
    ],
    victoryMessages: [
      "ヘルフレイム・クラッシュが決まり、獄炎タルタロスが勝利した！",
      "炎の巨腕で押し切り、タルタロスが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "thunder-raiju",
    fileName: "thunder-raiju",
    name: "雷神獣ライジュウ",
    ruby: "らいじんじゅうライジュウ",
    category: "魔獣",
    elements: ["雷", "光"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 800, attack: 82, defense: 73, speed: 97, magic: 87 },
    specialMove: {
      name: "ライトニング・ファントム",
      description: "雷の残像を残しながら何度も切り込む。",
    },
    weaknesses: ["地", "闇"],
    habitat: "雷雲の下に広がる竹林",
    shortDescription: "雷の残像をまとって走る神獣。",
    description: "雷そのもののように素早いライジュウ。光る残像で相手を惑わせる。",
    battleStyle: "非常に高い素早さで先手を取るスピード型。",
    themeColor: "from-blue-950 via-cyan-950 to-yellow-950",
    openingMessage: "雷神獣ライジュウが青白い残像を残して戦場に走り込んだ！",
    midBattleMessages: [
      "ライジュウの残像がいくつも走り、相手は本体を見失う！",
      "雷の足音が連続して響き、次の攻撃が読めない！",
      "光る尾が弧を描き、雷の力がさらに高まる！",
    ],
    victoryMessages: [
      "ライトニング・ファントムが決まり、雷神獣ライジュウが勝利した！",
      "雷の残像で相手を翻弄し、ライジュウが勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "yamata-orochi",
    fileName: "yamata-orochi",
    name: "八岐オロチ",
    ruby: "やまたオロチ",
    category: "多頭竜",
    elements: ["毒", "水"],
    dangerLevel: 5,
    rarity: "UR",
    stats: { hp: 960, attack: 91, defense: 85, speed: 54, magic: 92 },
    specialMove: {
      name: "ヤマタノ・ポイズンストーム",
      description: "八つの首が毒の嵐と水流を同時に放つ。",
    },
    weaknesses: ["炎", "光"],
    habitat: "古い川の奥にある霧の谷",
    shortDescription: "八つの首を持つ伝説の大蛇。",
    description: "いくつもの首が同時に攻めるオロチ。毒と水の波で戦場を包む。",
    battleStyle: "高HPと高魔力で押し切る持久魔法型。",
    themeColor: "from-green-950 via-blue-950 to-black",
    openingMessage: "八岐オロチが水面を割り、八つの首をゆっくりともたげた！",
    midBattleMessages: [
      "八つの首が別々の方向から毒の息を放つ！",
      "水流が渦を作り、オロチの攻撃範囲がどんどん広がる！",
      "毒の嵐が戦場を包み、相手の進路をふさいでいく！",
    ],
    victoryMessages: [
      "ヤマタノ・ポイズンストームが決まり、八岐オロチが勝利した！",
      "毒と水の嵐で、オロチが戦場を飲みこんだ！",
    ],
  }),
  createCharacter({
    id: "nine-tailed-kitsune",
    fileName: "nine-tailed-kitsune",
    name: "九尾ノ妖狐",
    ruby: "きゅうびのようこ",
    category: "幻獣",
    elements: ["炎", "闇"],
    dangerLevel: 4,
    rarity: "UR",
    stats: { hp: 780, attack: 77, defense: 68, speed: 93, magic: 99 },
    specialMove: {
      name: "イリュージョン・フレア",
      description: "幻の炎で相手の目を惑わせる大魔法。",
    },
    weaknesses: ["水", "光"],
    habitat: "赤い月が浮かぶ竹林",
    shortDescription: "九つの尾で幻を生む妖狐。",
    description: "九つの尾に炎と闇の魔力を宿す妖狐。高い魔力で相手を翻弄する。",
    battleStyle: "魔力と素早さに特化したトリック型。",
    themeColor: "from-red-950 via-purple-950 to-black",
    openingMessage: "九尾ノ妖狐が赤い炎の尾を揺らし、幻の影を広げた！",
    midBattleMessages: [
      "炎の分身がいくつも現れ、相手は本物を見失う！",
      "九つの尾が闇をまとい、戦場に幻の輪を作った！",
      "妖狐の目が光り、次の魔法の気配が高まる！",
    ],
    victoryMessages: [
      "イリュージョン・フレアが決まり、九尾ノ妖狐が勝利した！",
      "幻の炎で流れを支配し、妖狐が勝負を決めた！",
    ],
  }),
  createCharacter({
    id: "sand-apophis",
    fileName: "sand-apophis",
    name: "砂塵アポピス",
    ruby: "さじんアポピス",
    category: "大蛇",
    elements: ["地", "闇"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 910, attack: 88, defense: 83, speed: 66, magic: 86 },
    specialMove: {
      name: "サンド・イクリプス",
      description: "砂嵐と闇で一瞬だけ戦場を覆い隠す。",
    },
    weaknesses: ["水", "光"],
    habitat: "黒い砂の砂漠",
    shortDescription: "砂嵐の中を進む巨大な闇の蛇。",
    description: "砂と闇を操るアポピス。相手の視界を奪いながら重い攻撃を仕掛ける。",
    battleStyle: "耐久と魔力を生かすじわじわ型。",
    themeColor: "from-amber-950 via-stone-950 to-purple-950",
    openingMessage: "砂塵アポピスが黒い砂嵐をまとい、ゆっくりと姿を現した！",
    midBattleMessages: [
      "砂嵐が巻き上がり、相手の視界を一気に奪う！",
      "アポピスの長い体が砂の中を走り、次の場所が読めない！",
      "闇の砂が魔法陣を描き、戦場を包み込む！",
    ],
    victoryMessages: [
      "サンド・イクリプスが決まり、砂塵アポピスが勝利した！",
      "砂と闇で相手を翻弄し、アポピスが戦いを制した！",
    ],
  }),
  createCharacter({
    id: "heaven-gargoyle",
    fileName: "heaven-gargoyle",
    name: "天獄ガーゴイル",
    ruby: "てんごくガーゴイル",
    category: "守護者",
    elements: ["地", "闇"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: { hp: 840, attack: 81, defense: 91, speed: 63, magic: 79 },
    specialMove: {
      name: "ストーンウィング・ダイブ",
      description: "石の翼を広げ、高所から重く急降下する。",
    },
    weaknesses: ["水", "光"],
    habitat: "黒い塔の最上階",
    shortDescription: "石像の姿で空を見張る守護者。",
    description: "普段は石像のように動かないガーゴイル。戦いになると翼で急降下する。",
    battleStyle: "高い防御で耐え、重い一撃を狙う守備型。",
    themeColor: "from-zinc-950 via-stone-900 to-purple-950",
    openingMessage: "天獄ガーゴイルの石の翼が開き、塔の影から飛び降りた！",
    midBattleMessages: [
      "石の翼が風を切り、重い影が相手の上に落ちる！",
      "ガーゴイルは攻撃を受け止め、翼をたたんで力をためる！",
      "黒い塔の気配が広がり、守護者の魔力が高まる！",
    ],
    victoryMessages: [
      "ストーンウィング・ダイブが決まり、天獄ガーゴイルが勝利した！",
      "石の翼の急降下で、ガーゴイルが勝負を決めた！",
    ],
  }),
];

export const getCharacterById = (id: string): MonsterCharacter | undefined => {
  return characters.find((character) => character.id === id);
};

export const getCharactersByElement = (
  element: MonsterElement,
): MonsterCharacter[] => {
  return characters.filter((character) => character.elements.includes(element));
};

export const getDangerLevelStars = (dangerLevel: number): string => {
  return "★".repeat(dangerLevel) + "☆".repeat(5 - dangerLevel);
};
