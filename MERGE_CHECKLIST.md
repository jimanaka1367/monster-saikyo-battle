# Gacha PR マージ前チェックリスト

## 1. 動作確認（ローカル）
- `npm run build` が成功する
- `npm run dev` で `/gacha` が開ける
- 1回召喚が動く
- 10連召喚が動く
- 召喚結果に画像・レア度が表示される
- 新規カードに `NEW!` が表示される
- 重複カードで `かけらゲット！` が表示される
- 所持カード一覧に `レベル / かけら / 所持数` が反映される
- リロード後も所持カードが残る（`localStorage` 永続化）

## 2. 既存機能の回帰確認
- `/` の1対1バトルが開始〜結果まで動く
- `/` のトーナメントが最後まで進行する
- 図鑑一覧と `/characters/[id]` 詳細ページが表示できる

## 3. 実装差分の確認ポイント
- `app/gacha/page.tsx`:
  - 召喚確率（normal 50 / rare 30 / superRare 15 / legend 4 / mythic 1）
  - 重複時は `count` と `fragments` を加算
  - `localStorage` キー: `monster-gacha-collection-v2`
- `app/page.tsx`:
  - `/gacha` への導線リンクが追加されている

## 4. PR運用メモ
- 誤って Close したPRは、リポジトリ権限があれば GitHub UI の `Reopen pull request` で再オープン可能
- 再オープン不可の場合は同一ブランチから新規PRを作成
