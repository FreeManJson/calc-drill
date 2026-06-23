# Git 運用ルール

## 基本方針
- 作業は **フェーズ / 分割単位** で刻む
- 1作業 = 1 commit を原則とする
- commit メッセージは日本語
- tag 名は短い英数字
- tag 本文は詳細を残す

## commit メッセージ形式
`PhaseX-Y: 内容`

### 例
- `Phase0-0: Vite React TypeScript プロジェクトを初期作成`
- `Phase0-1: プロジェクト骨組みとダミーページを追加`

## tag 名形式
`phaseX-Y-name`

### 例
- `phase0-0-init`
- `phase0-1-skeleton`

## tag 本文テンプレ
Tag: phase0-1-skeleton

Phase:
  Phase 0 / 1 of 5

Type:
  [ ] Project Bootstrap
  [x] Skeleton
  [ ] Routing
  [ ] Types / Defaults
  [ ] Layout / Build Stabilize

Summary:
  今回の要約を 2～3 行で書く。

Details:
  - 変更内容1
  - 変更内容2
  - 変更内容3

Files:
  - 追加 / 修正ファイル一覧

Verification:
  - npm run build: OK / NG
  - 画面遷移確認: OK / NG

Impact:
  - 他フェーズへの影響
  - 既存仕様への影響

Next:
  - 次にやる Phase / Part

## Codex への依頼
作業完了時は必ず以下を提示すること。
- 日本語 commit メッセージ案
- tag 名案
- 詳細付き tag 本文案

## まだやらないこと
- 勝手な squash
- まとめて大きな commit
- 仕様未確定部分の独断実装
