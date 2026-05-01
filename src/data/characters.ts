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
  | "多頭竜";

export type MonsterStats = {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  magic: number;
};

export type MonsterCharacter = {
  id: string;
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
  themeColor: string;
  openingMessage: string;
  midBattleMessages: string[];
  victoryMessages: string[];
};

export const characters: MonsterCharacter[] = [
  {
    id: "black-dragon-valgald",
    name: "黒竜ヴァルガルド",
    ruby: "こくりゅうヴァルガルド",
    category: "古代竜",
    elements: ["闇", "炎"],
    dangerLevel: 5,
    rarity: "UR",
    stats: {
      hp: 920,
      attack: 95,
      defense: 88,
      speed: 62,
      magic: 96,
    },
    specialMove: {
      name: "ダークネス・インフェルノ",
      description:
        "黒い炎のブレスで戦場を包みこみ、敵全体にすさまじいダメージを与える。",
    },
    weaknesses: ["光", "水"],
    habitat: "闇に包まれた古代火山",
    shortDescription: "闇と炎をあやつる最古の黒竜。",
    description:
      "闇の大地を支配する巨大な黒竜。黒い炎のブレスは、岩山すら焼きつくすと言われている。圧倒的な攻撃力と魔力を持つが、素早い相手に回り込まれると苦戦することもある。",
    battleStyle:
      "高い攻撃力と魔力で押し切る重量級タイプ。素早さは低めだが、一撃の破壊力は最強クラス。",
    image: "/images/characters/black-dragon-valgald.png",
    themeColor: "from-red-950 via-purple-950 to-black",
    openingMessage:
      "黒竜ヴァルガルドが翼を広げ、戦場に黒い炎をまとった！",
    midBattleMessages: [
      "ヴァルガルドの黒炎が地面を走り、相手の足元を焼きつくす！",
      "巨大な翼が巻き起こす風で、戦場全体が暗い炎に包まれる！",
      "ヴァルガルドが低くうなり、闇の魔力を一気に高めた！",
    ],
    victoryMessages: [
      "最後はダークネス・インフェルノが炸裂し、黒竜ヴァルガルドが勝利をつかんだ！",
      "黒い炎が戦場を包みこみ、ヴァルガルドが圧倒的な力を見せつけた！",
    ],
  },
  {
    id: "thunder-emperor-wyvern",
    name: "雷帝ワイバーン",
    ruby: "らいていワイバーン",
    category: "飛竜",
    elements: ["雷"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: {
      hp: 760,
      attack: 82,
      defense: 68,
      speed: 98,
      magic: 86,
    },
    specialMove: {
      name: "サンダー・ダイブ",
      description:
        "雷をまとって空から急降下し、一瞬で敵に大ダメージを与える。",
    },
    weaknesses: ["地", "氷"],
    habitat: "嵐が止まない天空の山脈",
    shortDescription: "雷をまとって空を切り裂く高速の飛竜。",
    description:
      "嵐の空を切り裂く青い飛竜。雷をまとった急降下攻撃は非常に速く、目で追うことすらむずかしい。防御は高くないが、スピードで相手を翻弄する。",
    battleStyle:
      "素早さ特化型。先制攻撃や回避で流れをつかむが、防御力の高い相手には押し負けることもある。",
    image: "/images/characters/thunder-emperor-wyvern.png",
    themeColor: "from-blue-950 via-sky-900 to-black",
    openingMessage:
      "雷帝ワイバーンが上空を旋回し、雷鳴とともに戦場へ降り立った！",
    midBattleMessages: [
      "ワイバーンが雷をまとい、相手の背後へ一気に回り込む！",
      "空からまばゆい雷が落ち、戦場に大きな衝撃が走った！",
      "ワイバーンの翼が光り、次の一撃に向けて雷の力をためている！",
    ],
    victoryMessages: [
      "雷帝ワイバーンのサンダー・ダイブが決まり、勝負は一瞬で決まった！",
      "空を切り裂く雷の一撃で、ワイバーンが勝利をつかんだ！",
    ],
  },
  {
    id: "ice-fang-fenrir",
    name: "氷牙フェンリル",
    ruby: "ひょうがフェンリル",
    category: "魔狼",
    elements: ["氷"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: {
      hp: 810,
      attack: 84,
      defense: 74,
      speed: 92,
      magic: 78,
    },
    specialMove: {
      name: "フロスト・ファング",
      description:
        "氷をまとった牙で敵に飛びかかり、動きを鈍らせる一撃を放つ。",
    },
    weaknesses: ["炎", "雷"],
    habitat: "月明かりに照らされた氷の森",
    shortDescription: "月夜に現れる氷の魔狼。",
    description:
      "月夜に現れる氷の魔狼。吐く息で大地を凍らせ、鋭い牙で相手の動きを止める。スピードと攻撃のバランスがよく、強敵相手にも立ち回れる。",
    battleStyle:
      "素早さと攻撃を両立したバランス型。相手の動きを鈍らせながら、素早く攻める。",
    image: "/images/characters/ice-fang-fenrir.png",
    themeColor: "from-slate-950 via-cyan-950 to-black",
    openingMessage:
      "氷牙フェンリルが月明かりの下で遠吠えし、冷たい霧が広がった！",
    midBattleMessages: [
      "フェンリルが白い残像を残して走り、氷の牙で相手に迫る！",
      "戦場の地面が凍りつき、相手の動きが少し鈍った！",
      "フェンリルが鋭く身をかわし、すぐさま反撃の姿勢に入った！",
    ],
    victoryMessages: [
      "フロスト・ファングが決まり、氷牙フェンリルが勝利をつかんだ！",
      "冷たい霧の中からフェンリルが姿を現し、勝負を決めた！",
    ],
  },
  {
    id: "underworld-cerberus",
    name: "冥界ケルベロス",
    ruby: "めいかいケルベロス",
    category: "魔獣",
    elements: ["闇"],
    dangerLevel: 5,
    rarity: "SSR",
    stats: {
      hp: 880,
      attack: 90,
      defense: 82,
      speed: 76,
      magic: 80,
    },
    specialMove: {
      name: "トリプル・ヘルバイト",
      description:
        "三つの首が別々の方向から同時に襲いかかり、逃げ場をなくす。",
    },
    weaknesses: ["光"],
    habitat: "冥界の門",
    shortDescription: "冥界の門を守る三つ首の魔獣。",
    description:
      "冥界の門を守る三つ首の魔獣。三方向から同時に攻撃し、どんな相手にも逃げ場を与えない。攻撃、防御、HPのバランスがよく、安定した強さを持つ。",
    battleStyle:
      "攻撃・防御・HPが高い安定型。大きな弱点は少ないが、空中の相手にはやや不利。",
    image: "/images/characters/underworld-cerberus.png",
    themeColor: "from-zinc-950 via-red-950 to-black",
    openingMessage:
      "冥界ケルベロスが三つの首をもたげ、不気味なうなり声を響かせた！",
    midBattleMessages: [
      "三つの首が別々の方向から迫り、相手の逃げ道をふさいだ！",
      "ケルベロスの咆哮が戦場に響き、空気が重く震えた！",
      "鋭い爪が地面を削り、ケルベロスが一気に間合いを詰める！",
    ],
    victoryMessages: [
      "トリプル・ヘルバイトが決まり、冥界ケルベロスが勝利した！",
      "三つの首による連続攻撃で、ケルベロスが戦いを制した！",
    ],
  },
  {
    id: "deep-sea-leviathan",
    name: "深海リヴァイアサン",
    ruby: "しんかいリヴァイアサン",
    category: "海竜",
    elements: ["水"],
    dangerLevel: 5,
    rarity: "UR",
    stats: {
      hp: 980,
      attack: 86,
      defense: 92,
      speed: 55,
      magic: 88,
    },
    specialMove: {
      name: "アビス・タイダルウェーブ",
      description:
        "深海の力を呼び起こし、巨大な波で戦場を飲みこむ。",
    },
    weaknesses: ["雷"],
    habitat: "光の届かない深海神殿",
    shortDescription: "深海に眠る巨大な海竜。",
    description:
      "深い海の底に眠る巨大な海竜。ひとたび目覚めると、大波を起こして戦場を飲みこむ。素早さは低いが、圧倒的なHPと防御力で攻撃を受け止める。",
    battleStyle:
      "HPと防御が非常に高い耐久型。長期戦に強く、相手の攻撃を受けながら反撃する。",
    image: "/images/characters/deep-sea-leviathan.png",
    themeColor: "from-slate-950 via-blue-950 to-black",
    openingMessage:
      "深海リヴァイアサンが水しぶきを上げ、巨大な体を戦場に現した！",
    midBattleMessages: [
      "リヴァイアサンが尾を振ると、大波が戦場を押し流した！",
      "深海の魔力がうずを巻き、相手の動きを飲みこもうとしている！",
      "巨大な体で攻撃を受け止め、リヴァイアサンが反撃の機会をうかがう！",
    ],
    victoryMessages: [
      "アビス・タイダルウェーブが戦場を包み、深海リヴァイアサンが勝利した！",
      "圧倒的な耐久力で攻撃をしのぎ、リヴァイアサンが戦いを制した！",
    ],
  },
  {
    id: "phoenix-of-rebirth",
    name: "不死鳥フェニクス",
    ruby: "ふしちょうフェニクス",
    category: "神鳥",
    elements: ["炎", "光"],
    dangerLevel: 4,
    rarity: "SSR",
    stats: {
      hp: 740,
      attack: 76,
      defense: 64,
      speed: 90,
      magic: 98,
    },
    specialMove: {
      name: "リバース・フレア",
      description:
        "まばゆい炎で自らの力を高めながら、敵に光の炎を放つ。",
    },
    weaknesses: ["水", "闇"],
    habitat: "太陽の光が差す天空の祭壇",
    shortDescription: "炎の中からよみがえる伝説の神鳥。",
    description:
      "炎の中から何度でもよみがえる伝説の神鳥。まばゆい炎で敵を包みこみ、自らの力を取り戻す。耐久力は低めだが、魔力と素早さが非常に高い。",
    battleStyle:
      "魔力と素早さが高い逆転型。ランダム要素による大逆転が起きやすいキャラ。",
    image: "/images/characters/phoenix-of-rebirth.png",
    themeColor: "from-orange-950 via-red-900 to-yellow-950",
    openingMessage:
      "不死鳥フェニクスが炎の翼を広げ、まばゆい光を放った！",
    midBattleMessages: [
      "フェニクスの炎が大きく燃え上がり、再び力を取り戻していく！",
      "光の羽が戦場に舞い、フェニクスが空高く飛び上がった！",
      "フェニクスが炎をまとい、逆転の一撃を狙っている！",
    ],
    victoryMessages: [
      "リバース・フレアが輝き、不死鳥フェニクスが逆転勝利をつかんだ！",
      "炎の中から力を取り戻し、フェニクスが戦場を制した！",
    ],
  },
  {
    id: "rock-armor-golem",
    name: "岩鎧ゴーレム",
    ruby: "いわよろいゴーレム",
    category: "巨人",
    elements: ["地"],
    dangerLevel: 4,
    rarity: "SR",
    stats: {
      hp: 960,
      attack: 88,
      defense: 98,
      speed: 38,
      magic: 52,
    },
    specialMove: {
      name: "グランド・ブレイク",
      description:
        "巨大な拳を地面に叩きつけ、地響きと衝撃波で敵を吹き飛ばす。",
    },
    weaknesses: ["水", "光"],
    habitat: "古代遺跡の地下神殿",
    shortDescription: "古代遺跡を守る岩の巨人。",
    description:
      "古代遺跡を守る岩の巨人。全身をおおう岩の鎧は、どんな攻撃も受け止める。動きは遅いが、防御力はトップクラス。",
    battleStyle:
      "防御特化型。素早さは低いが、攻撃を耐えて重い一撃で反撃する。",
    image: "/images/characters/rock-armor-golem.png",
    themeColor: "from-stone-950 via-amber-950 to-black",
    openingMessage:
      "岩鎧ゴーレムが大地を揺らしながら、ゆっくりと立ち上がった！",
    midBattleMessages: [
      "ゴーレムは相手の攻撃を岩の鎧で受け止めた！",
      "巨大な拳が地面にめり込み、戦場に地響きが広がる！",
      "ゴーレムは動じない。重い一撃を放つタイミングを待っている！",
    ],
    victoryMessages: [
      "グランド・ブレイクの衝撃波が決まり、岩鎧ゴーレムが勝利した！",
      "相手の攻撃を受けきったゴーレムが、重い一撃で勝負を決めた！",
    ],
  },
  {
    id: "venom-hydra",
    name: "毒蛇ヒュドラ",
    ruby: "どくじゃヒュドラ",
    category: "多頭竜",
    elements: ["毒"],
    dangerLevel: 5,
    rarity: "SSR",
    stats: {
      hp: 850,
      attack: 80,
      defense: 78,
      speed: 70,
      magic: 92,
    },
    specialMove: {
      name: "ヴェノム・テンペスト",
      description:
        "毒の霧を嵐のように広げ、相手の力を少しずつ奪っていく。",
    },
    weaknesses: ["炎", "光"],
    habitat: "毒霧に包まれた沼地の遺跡",
    shortDescription: "いくつもの首を持つ毒の竜。",
    description:
      "いくつもの首を持つ毒の竜。毒の息をまき散らし、相手の力を少しずつうばっていく。正面からの力比べよりも、じわじわ追い詰める戦いを得意とする。",
    battleStyle:
      "魔力と状態異常風の演出が得意なタイプ。中間演出で相手を弱らせる展開に向いている。",
    image: "/images/characters/venom-hydra.png",
    themeColor: "from-green-950 via-purple-950 to-black",
    openingMessage:
      "毒蛇ヒュドラがいくつもの首をもたげ、毒の霧を吐き出した！",
    midBattleMessages: [
      "ヒュドラの毒霧が広がり、相手の動きが少し鈍っていく！",
      "いくつもの首が別々の方向からにらみつけ、相手を追い詰める！",
      "毒の魔力が戦場に満ち、ヒュドラがじわじわと有利な流れを作る！",
    ],
    victoryMessages: [
      "ヴェノム・テンペストが決まり、毒蛇ヒュドラが勝利をつかんだ！",
      "毒の霧で相手の力を奪い、ヒュドラが戦いを制した！",
    ],
  },
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
