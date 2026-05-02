# モンスター画像生成パイプライン

30体以上のモンスター画像を、手動保存や手動リネームなしで生成するための土台です。

## 管理ファイル

- `data/monster-image-prompts.json`
  - `templates.normal`: 図鑑・選択画面向けの共通テンプレート
  - `templates.battle`: バトル画面向けの共通テンプレート
  - `monsters[]`: 各モンスターの `id`, `name`, `slug`, `normalPrompt`, `battlePrompt`
- `scripts/generation-status.json`
  - 生成・スキップ・失敗・ドライランの状態を記録します。
  - 途中で止まっても、次回 `generate:missing` で再開しやすくするためのファイルです。

## 出力先

- 通常画像: `public/images/characters/{slug}.png`
- 戦闘画像: `public/images/characters/battle/{slug}-battle.png`

例:

```text
public/images/characters/black-dragon-valgald.png
public/images/characters/battle/black-dragon-valgald-battle.png
```

## コマンド

```bash
npm run generate:normal
npm run generate:battle
npm run generate:all
npm run generate:missing
```

安全に確認する場合は `-- --dry-run` を付けます。

```bash
npm run generate:missing -- --dry-run
npm run generate:all -- --dry-run --limit 4
```

既存ファイルがある場合は、デフォルトでスキップします。作り直す場合は `-- --force` を付けます。

```bash
npm run generate:battle -- --force
```

## 画像生成APIの接続

現時点ではAPI接続部分は差し替え式です。環境変数 `MONSTER_IMAGE_GENERATOR_MODULE` に、`generateImage(input)` を export するモジュールを指定します。

```bash
MONSTER_IMAGE_GENERATOR_MODULE=scripts/providers/my-image-generator.ts npm run generate:missing
```

`generateImage` は以下の形の入力を受け取り、`outputPath` にPNGを書き出します。

```ts
export async function generateImage(input: {
  id: string;
  name: string;
  slug: string;
  mode: "normal" | "battle";
  prompt: string;
  outputPath: string;
}) {
  // ここで画像生成APIを呼び出し、input.outputPath に保存する
}
```

APIキーやモデル名は、プロバイダーモジュール側で環境変数から読む想定です。

## 再開の考え方

通常は以下の流れで運用します。

1. `data/monster-image-prompts.json` にキャラクターを追加する
2. `npm run generate:missing -- --dry-run` で対象と保存先を確認する
3. `MONSTER_IMAGE_GENERATOR_MODULE=... npm run generate:missing` を実行する
4. 途中で失敗したら、原因を直してもう一度 `npm run generate:missing` を実行する

既に存在する画像はスキップされるため、30体でも100体でも差分だけを生成できます。
