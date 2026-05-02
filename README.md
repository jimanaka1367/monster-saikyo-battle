# モンスター最強決定バトル

小学生向けのダークファンタジー図鑑風モンスターバトルWebアプリです。

ドラゴン、神話の怪物、伝説の魔獣など8体の初期キャラクターを図鑑で確認し、1対1バトルや8体トーナメントで勝敗を楽しめます。怖かっこいい雰囲気を目指しつつ、血しぶき、切断、内臓などのグロ表現は使わず、炎、雷、闇、氷、煙、咆哮などで迫力を表現します。

## 主な機能

- 初期キャラクター8体の図鑑表示
- 画像がない場合のグラデーション代替表示
- ステータスとランダム補正による1対1バトル
- 「開始 → 中間演出 → 決着」の3段階バトル表示
- 8体で戦う自動進行トーナメント
- スマートフォンで見やすい縦長レイアウト

## 開発環境

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4

## 起動方法

依存関係をインストールします。

```bash
npm install
```

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで以下を開きます。

```text
http://localhost:3000
```

## ビルド

本番ビルドを確認します。

```bash
npm run build
```

ビルド後に本番サーバーを起動する場合は以下を使います。

```bash
npm run start
```

## 検証コマンド

TypeScriptの型チェック:

```bash
npx tsc --noEmit
```

Lint:

```bash
npm run lint
```

## モンスター画像生成

画像生成のプロンプトとバッチ処理は以下で管理します。

- `data/monster-image-prompts.json`
- `scripts/generate-images.ts`
- `scripts/generation-status.json`

ドライラン:

```bash
npm run generate:images -- --type normal --limit 1 --dry-run
```

通常画像のみ:

```bash
npm run generate:normal -- --limit 1
```

戦闘画像のみ:

```bash
npm run generate:battle -- --limit 1
```

詳しい使い方は `docs/image-generation.md` を参照してください。

## 補足

このプロジェクトでは、ビルド時のTypeScript検証ワーカーを安定して動かすために `next.config.ts` で `experimental.workerThreads` を有効にしています。
