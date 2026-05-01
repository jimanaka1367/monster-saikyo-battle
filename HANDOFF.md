# HANDOFF

## アプリ名とコンセプト

アプリ名: モンスター最強決定バトル

小学生向けのダークファンタジー図鑑風モンスターバトルWebアプリ。ドラゴン、神話の怪物、伝説の魔獣などを図鑑で見ながら、1対1バトルや8体トーナメントを楽しめる。

怖かっこいい雰囲気を目指しつつ、血しぶき、切断、内臓などのグロ表現は避ける。炎、雷、闇、氷、煙、咆哮、魔法陣、迫力ある背景で強さを表現する。

## 現在実装済みの機能

- トップ画面
  - アプリタイトル
  - 「図鑑を見る」「バトル開始」「トーナメント」導線
  - 黒、赤、紫、金を基調にしたダークファンタジーUI
- キャラクター一覧
  - 初期キャラクター8体をカード表示
  - 名前、属性、危険度、短い説明、ステータスを表示
  - 詳細画面へのリンク
- キャラクター詳細画面
  - `/characters/[id]`
  - 実画像を大きく表示
  - 説明、必殺技、すみか、戦い方、弱点、ステータスを表示
  - `generateStaticParams` で8体分を静的生成
- 1対1バトル
  - 8体から2体を選択
  - `開始 -> 中間演出 -> 決着` の3段階
  - 左右にモンスター画像を表示
  - HPバー表示
  - 中間演出で必殺技名を大きく表示
  - 決着で勝者を大きく表示
- 8体トーナメント
  - 初期キャラ8体で自動進行
  - 1回戦、準決勝、決勝
  - 各試合は既存バトルロジックを使用
  - 優勝キャラを表示

## 主要ファイル構成

- `app/page.tsx`
  - トップ画面
  - バトル、トーナメント、図鑑一覧を配置
- `app/layout.tsx`
  - ルートレイアウト
  - metadata と `lang="ja"`
- `app/globals.css`
  - Tailwind CSS
  - 共通UIクラス
    - `fantasy-section`
    - `fantasy-panel`
    - `fantasy-card`
    - `fantasy-button`
    - `fantasy-badge`
    - `fantasy-kicker`
- `app/characters/[id]/page.tsx`
  - キャラクター詳細画面
- `src/components/CharacterCard.tsx`
  - 図鑑カード
- `src/components/MonsterArtwork.tsx`
  - 実画像表示と仮ビジュアルのフォールバック
  - Next.js `Image` の loading / fetchPriority 制御もここ
- `src/components/BattleArena.tsx`
  - 1対1バトル画面
  - フェーズ表示、HPバー、左右モンスター表示
- `src/components/TournamentBracket.tsx`
  - 8体トーナメント
- `src/data/characters.ts`
  - キャラクターデータ
- `src/lib/battle.ts`
  - 勝敗ロジック
- `APP_SPEC.md`
  - アプリ仕様書
- `README.md`
  - 概要、起動方法、ビルド方法

## キャラクターデータの場所

`src/data/characters.ts`

定義済み:

- `MonsterElement`
- `MonsterCategory`
- `MonsterStats`
- `MonsterCharacter`
- `characters`
- `getCharacterById`
- `getCharactersByElement`
- `getDangerLevelStars`

初期キャラ8体:

- 黒竜ヴァルガルド
- 雷帝ワイバーン
- 氷牙フェンリル
- 冥界ケルベロス
- 深海リヴァイアサン
- 不死鳥フェニクス
- 岩鎧ゴーレム
- 毒蛇ヒュドラ

## バトルロジックの場所

`src/lib/battle.ts`

主な関数:

- `calculateBaseScore`
- `calculateElementBonus`
- `calculateBattleScore`
- `createBattleResult`

現在の基本スコア:

```text
HP * 0.03
+ 攻撃 * 1.1
+ 防御 * 0.9
+ 素早さ * 0.8
+ 魔力 * 1.0
+ ランダム補正
+ 属性補正
```

ランダム補正は `-25` から `+25`。属性補正は、攻撃側の属性が防御側の弱点に含まれる場合 `+16`。

## 現在のUI改善状況

- 全体は黒、赤、紫、金を基調に調整済み。
- カード、パネル、ボタンは共通クラス化済み。
- スマホ縦長表示を優先。
- 図鑑カード上部は画像がない場合も仮ビジュアルを表示。
- バトル画面はテキスト中心から、左右モンスター、HPバー、技名、勝者表示を中心にしたビジュアルUIへ変更済み。
- 技名や決着表示はモンスターカードと重ならないように、カード上部の通常レイアウトへ移動済み。
- モンスター画像は顔が出やすいように `object-[50%_24%]` を使用中。

## 画像組み込みの現在状況

画像は `public/images/characters/` に配置済み。

確認済みファイル:

- `black-dragon-valgald.png`
- `thunder-emperor-wyvern.png`
- `ice-fang-fenrir.png`
- `underworld-cerberus.png`
- `deep-sea-leviathan.png`
- `phoenix-of-rebirth.png`
- `rock-armor-golem.png`
- `venom-hydra.png`

`characters.ts` の `image` フィールドは上記パスと一致済み。

`MonsterArtwork.tsx` では、画像が存在する場合は実画像を表示し、読み込み失敗時のみ仮ビジュアルに切り替える。

Next.js の LCP 警告対応:

- 図鑑一覧の最初のカード画像のみ `priorityImage` 経由で eager/high
- 詳細画面の大きな画像は eager/high
- バトル画面の左右モンスター画像は eager/high
- 一覧下部の画像は lazy のまま

## 次にやるべき作業

- バトル画面の実操作確認
  - 開始、中間、決着の各フェーズをブラウザで確認
  - 技名の長いモンスターで表示崩れがないか確認
- 画像の個別位置調整
  - 現在は一律 `object-[50%_24%]`
  - モンスターごとに顔位置が違うため、必要ならキャラデータに `imagePosition` を追加する
- トーナメントの拡張
  - 現在は自動進行
  - 後で1試合ずつ演出を見られる形にするとよい
- UIの最終確認
  - 390px幅、iPhone系、Android系で確認
  - 文字の折り返し、ボタン幅、画像切れを確認
- 可能なら Vercel Preview で実機確認

## 注意点

- Next.js 16.2.4 を使用中。AGENTS.md に「この Next.js は通常と違うので node_modules/next/dist/docs を確認すること」とある。
- Next.js 16 では `Image priority` は非推奨。現在は `loading="eager"` と `fetchPriority="high"` を使っている。
- `next.config.ts` で `experimental.workerThreads: true` を有効化済み。以前、ビルド時に `spawn EPERM` が出ていたため。
- `app/characters/[id]/page.tsx` の `params` は Promise として扱っている。Next.js 15以降の仕様に合わせている。
- 画像がない場合でも壊れないように `MonsterArtwork` の `onError` で仮ビジュアルへフォールバックする。
- グロ表現は禁止。勝敗表現は「勝利」「制した」「押し切った」などに寄せる。
- 検証用スクリーンショットやログは `.gitignore` 済み。
  - `.mobile-*.png`
  - `.next-start.*.log`

## npm run dev / npm run build の実行状況

`npm run build` は成功確認済み。

直近の確認:

```bash
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
```

いずれも成功。

`npm run dev` では、以前に画像LCP警告が出た。

```text
Image with src "/images/characters/black-dragon-valgald.png" was detected as the Largest Contentful Paint (LCP).
Please add the loading="eager" property if this image is above the fold.
```

この警告に対して、主要画像のみ `loading="eager"` / `fetchPriority="high"` を追加済み。次スレッドで `npm run dev` を起動して、警告が解消しているか再確認するとよい。
