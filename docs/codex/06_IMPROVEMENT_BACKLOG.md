# Improvement Backlog

Phase 9 以降は、改善チケット方式で進める。
各作業は 1 commit に収まる粒度に分け、既知不具合の修正と改善を優先順位に沿って進める。

## Known Issues

- Result の Duration に誤答フィードバック中の待ち時間が含まれている
- Score の Total Plays が1プレイにつき2回増えている
- Play で未入力 OK が誤答扱いになる
- 問題表示直後および誤答後は解答欄を空にし、未入力 OK は無視したい

## Priority

1. Stabilize-001: Result / Score / 未入力 OK / 二重完了防止の修正
2. Play-001: 開始カウントダウン追加
3. Play-002: 次の問題表示
4. Question-001: 掛け算・割り算追加
5. UI-001: 表示文言の辞書化と日本語化
6. Settings-001: 言語・背景・数字タイル配置設定の追加
7. UI-002: 背景テーマ追加
8. Special-001: 10分サバイバルモード仕様化
9. Special-002: ひらめきモード仕様化

## UI

- UI-001: 表示文言の辞書化と日本語化
- UI-002: 背景テーマ追加
- 横長 / 縦長の表示崩れ確認を改善チケットごとに行う

## Play

- Stabilize-001: 未入力 OK を無視する
- Stabilize-001: 二重完了を防ぐ
- Play-001: 開始カウントダウン追加
- Play-002: 次の問題表示
- PlayStart-001A: プレイ開始導線の土台を追加する
- PlayStart-001B: モード別コース選択 UI を追加する
- Question-001: 掛け算・割り算追加

## Result

- Stabilize-001: Duration から誤答フィードバック中の待ち時間を除外する
- Result 表示の文言は UI-001 で辞書化する

## Score

- Stabilize-001: Total Plays が1プレイにつき2回増える問題を修正する
- Score-001B: Score 画面をモードタブ表示に変更する
- 詳細成績は有料候補として扱い、無料MVPでは最小集計に留める

## Settings

- Settings-001: 言語設定を追加する
- Settings-001: 背景設定を追加する
- Settings-001: 数字タイル配置設定を追加する
- Settings-002A: Play 開始導線実装後、Settings をアプリ設定中心に整理する
- 設定項目追加時は localStorage 構造変更の影響を明示する

## Unlock Candidates

- 操作感を損なう課金要素は避ける
- 基本の反復計算体験は無料でも気持ちよく遊べるようにする
- 有料候補は追加モード、追加難易度、詳細成績、テーマ、上級者向け機能を中心にする
- Special-001: 10分サバイバルモード
- Special-002: ひらめきモード

## Survival Future Tickets

- Survival-001B: サバイバルモードの最小実装
- Survival-001C: サバイバル成績表示を整える
- Survival-001D: サバイバルバランス調整

## Not Now

- 既存仕様の全面改稿
- localStorage 構造の大幅変更
- 効果音や演出の大幅追加
- 課金導線の実装
- 詳細な履歴管理
- アカウント機能

## Working Rule

- 1 ticket = 1 commit を目安にする
- 1 commit に収まらない場合は、さらに小さい改善チケットへ分ける
- build が失敗した場合は、同じ作業単位で修正まで行う
- 仕様を広げる場合は、先にこの backlog へ追記してから実装する

## Completed

- Stabilize-001: Fixed empty OK handling, single completion guard, active duration, and score increment stability.
- Stabilize-002: Fixed empty answer display so blank input and typed 0 are visually distinct.
- Play-001: Added start countdown before timer and answer input begin.
- Play-002: Added current and next question display with promotion on correct answers.
- Question-001: Added beginner multiplication and division generation behind locked operation UI with dev unlock.
- UI-001A: Added ja/en message dictionary and switched default display text to Japanese.
- UI-001B: Added persisted language setting and runtime ja/en message switching.
- Deploy-001: Added Netlify build and SPA fallback configuration.
- MobileQA-001: Added browser translation suppression and temporary QA unlock for multiplication/division.
- Settings-001A: Added persisted number pad layout setting for auto/bottom/side play layouts.
- UI-002A: Added persisted CSS background theme setting for none/wood/classroom/notebook/blackboard.
- UI-002B: Improved blackboard theme contrast for controls, play content, and dev tools.
- Play-003A: Added lightweight correct/incorrect visual feedback during play.
- Play-003B: Added persisted sound effects setting and guarded correct/incorrect tones.
- Play-002B: Adjusted next question preview to a smaller supporting position.
- Play-003C: Simplified answer feedback effects so play layout stays stable.
- Play-001B: Moved start countdown into the current question card without revealing questions.
- Docs-002: Added game mode, difficulty, ranking, insight, and lock planning notes.
- Result-001A: Added detailed answer history cards to the result screen.
- Result-001B: Changed result history to a per-question summary table with mistake counts.
- Difficulty-001A: Added four difficulty levels to settings, storage, and display labels.
- Difficulty-001B: Added difficulty-based question ranges for all four operations.
- Difficulty-001C: Changed division generation to use matching multiplication pairs by difficulty.
- Mode-001A: Added a 10-question goal mode foundation alongside time limit mode.
- Score-001A: Added mode-based score categories and current-setting score display.
- Mode-001B: Added 10/30/100 question goal count selection.
- Mode-001C: Added optional 1/3/10 minute limits for question goal mode.
- PlayStart-001A: Added a Top screen play settings panel for mode, difficulty, and course selection.
- Settings-002A: Reorganized Settings around app preferences while keeping operations temporary.
- Score-001B: Changed Score to mode tabs for time limit and question goal records.
- Docs-003: Added play start flow and Settings role planning notes.
- Survival-001A: Documented survival mode rules, timing, result/score direction, and future tickets.
- Survival-001B: Added minimum playable survival mode with time recovery, result display, and score tab support.
- Survival-001C: Improved survival score summaries, best record display, and recent survival history.
