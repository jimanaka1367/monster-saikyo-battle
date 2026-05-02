# モンスター画像生成

`data/monster-image-prompts.json` をもとに、通常画像と戦闘画像をバッチ生成するための仕組みです。

## APIキー

`.env.local` を作成し、OpenAI APIキーを設定します。

```bash
OPENAI_API_KEY=your_api_key_here
IMAGE_MODEL=gpt-image-2
```

`.env.local` は `.gitignore` の `.env*` によりコミットされません。例は `.env.example` に置いています。

## dry-run

実際に画像生成せず、対象・保存先・最終プロンプトだけ確認します。

```bash
npm run generate:images -- --type normal --limit 1 --dry-run
npm run generate:battle -- --limit 1 --dry-run
```

## 1枚だけ生成する

通常画像を1枚だけ生成:

```bash
npm run generate:images -- --type normal --limit 1
```

戦闘画像を1枚だけ生成:

```bash
npm run generate:images -- --type battle --limit 1
```

特定モンスターだけ生成:

```bash
npm run generate:images -- --type battle --id black-dragon-valgald
```

## 全件生成

全件生成の前に必ず dry-run で対象を確認してください。

```bash
npm run generate:images -- --type all --dry-run
npm run generate:all
```

30体の場合、`--type all` は通常画像30枚と戦闘画像30枚の合計60タスクになります。API利用料金と生成時間に注意してください。

## スキップと再生成

出力先に画像が既に存在する場合はスキップします。

```text
public/images/characters/{normalFile}
public/images/characters/battle/{battleFile}
```

既存画像を作り直す場合は `--force` を付けます。

```bash
npm run generate:images -- --type normal --id black-dragon-valgald --force
```

## 生成状況

生成・スキップ・dry-run・失敗の状態は `scripts/generation-status.json` に記録します。途中で失敗しても、それまでの状態は残ります。
