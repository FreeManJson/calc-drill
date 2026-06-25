いいタイミングです。
今の段階なら、**GitHub → Netlify 自動デプロイ**までつないで、以後は `main` に push するたびスマホで確認できる状態にするのが良いです。

対象は Vite + React なので、Netlify 側の基本設定は **Build command: `npm run build` / Publish directory: `dist`** です。Netlify 公式の Vite ガイドでもこの組み合わせが推奨されています。([Netlify Docs][1])

---

## 全体の流れ

```text
ローカル calc-drill
  ↓ git push
GitHub repository
  ↓ Netlify が自動 build
Netlify URL
  ↓
スマホで確認
```

---

# 1. 事前確認

まずローカルで確認します。

```bash
cd C:\_Creater\calc-training\calc-drill
npm run build
git status
```

`npm run build` が通ること。
`git status` は、commit 済みなら `working tree clean` に近い表示が望ましいです。

`node_modules` と `dist` は通常 Git 管理しません。`node_modules` は絶対に不要です。`dist` も Netlify 側で build して生成させるので、基本は push 対象外でOKです。

`.gitignore` に最低限これがあるか確認してください。

```gitignore
node_modules
dist
.env
.env.local
```

---

# 2. GitHub に repository を作る

GitHub の画面で新規 repo を作ります。

おすすめ設定:

```text
Repository name: calc-drill
Visibility: Private でも Public でもOK
README: 追加しない
.gitignore: 追加しない
License: 追加しない
```

ローカル側ですでに README や `.gitignore` があるので、GitHub 側では空の repo にするのが安全です。GitHub 公式も、既存ローカルコードを GitHub に追加する方法として、Git コマンドまたは GitHub CLI / Desktop を使う流れを案内しています。([GitHub Docs][2])

---

# 3. ローカル repo を GitHub に push

GitHub で repo を作ると、HTTPS の URL が出ます。
例:

```text
https://github.com/<your-name>/calc-drill.git
```

ローカルで実行します。

```bash
git remote -v
```

何も出なければ:

```bash
git remote add origin https://github.com/<your-name>/calc-drill.git
```

すでに `origin` がある場合は、URL を確認します。

```bash
git remote set-url origin https://github.com/<your-name>/calc-drill.git
```

push:

```bash
git branch -M main
git push -u origin main
```

タグも GitHub に上げたいなら:

```bash
git push --tags
```

今後も annotated tag を使っているので、`git push --tags` は一度やっておくとよいです。

---

# 4. Netlify で GitHub repo を連携

Netlify にログインして、以下の流れです。

```text
Add new project
  → Import an existing project
  → GitHub を選択
  → calc-drill repository を選択
```

Netlify は GitHub などの Git provider 上の repo から project を作成でき、連携後は push のたびに build command を実行して deploy します。([Netlify Docs][3])

---

# 5. Netlify の build 設定

Vite なので、基本はこれです。

```text
Base directory: 空欄
Build command: npm run build
Publish directory: dist
```

ただし、GitHub repo の直下が `calc-drill` ではなく、たとえば

```text
calc-training/
└─calc-drill/
```

のような monorepo になっている場合は、Netlify 側でこうします。

```text
Base directory: calc-drill
Build command: npm run build
Publish directory: dist
```

Netlify の build 設定では、build command は build 時に実行するコマンド、publish directory は build 後の公開対象ディレクトリです。Netlify 公式の Vite ガイドでは `npm run build` と `dist` が推奨され、build 設定は UI または設定ファイルで指定できます。([Netlify Docs][1])

今回のあなたの repo が **`calc-drill` 直下を GitHub repo root にする** なら、Base directory は空欄でOKです。

---

# 6. `netlify.toml` を追加しておくと安定

Netlify UI で設定してもよいですが、repo に `netlify.toml` を置くと設定が履歴に残るのでおすすめです。

`calc-drill/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

React Router などで URL 直打ち時に 404 になる可能性があるなら、SPA fallback も入れておくと安全です。

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Netlify の redirects は `_redirects` または `netlify.toml` で定義でき、SPA では `/*` を `/index.html` に返す設定がよく使われます。Netlify のリダイレクト記法では、元パスと遷移先、ステータスを指定します。([Netlify Docs][4])

今のアプリが HashRouter や単一画面遷移だけなら必須ではありませんが、**入れておいて問題になりにくい**ので、私は `netlify.toml` に書く派です。

---

# 7. Codex にやらせるならこのプロンプト

`netlify.toml` 追加と docs 更新だけを小さい commit にすると良いです。

Deploy-001 を進めてください。

目的:
GitHub → Netlify 連携に備えて、Netlify 用の build 設定を repository に追加する。

背景:
現在のアプリは Vite + React + TypeScript 構成で、スマホ実機確認のために GitHub repository と Netlify を連携して自動デプロイする予定。
Netlify の Vite 用 build 設定は npm run build / dist を基本とする。

最初に読むファイル:

* docs/codex/00_START_HERE.md
* docs/codex/02_GIT_RULES.md
* docs/codex/06_IMPROVEMENT_BACKLOG.md
* package.json
* vite.config.ts
* .gitignore

今回やること:

1. repository root に netlify.toml を追加する
2. Netlify build 設定を追加する

   * command = "npm run build"
   * publish = "dist"
3. SPA fallback 用の redirect を追加する

   * from = "/*"
   * to = "/index.html"
   * status = 200
4. .gitignore に node_modules / dist / .env / .env.local が含まれているか確認し、不足があれば追加する
5. docs/codex/06_IMPROVEMENT_BACKLOG.md に Deploy-001 の完了メモを最小限追記する
6. 最後に npm run build を実行する

今回やらないこと:

* GitHub repository の作成
* Netlify project の作成
* GitHub Actions の追加
* 独自ドメイン設定
* 環境変数の追加
* アプリ機能の変更
* UI の変更

完了条件:

* netlify.toml が追加されている
* build command が npm run build になっている
* publish directory が dist になっている
* SPA fallback redirect が設定されている
* .gitignore に node_modules / dist / .env / .env.local が含まれている
* npm run build が通る

最後に必ず提示してください:

* 変更ファイル一覧
* 変更内容要約
* 実施した確認内容
* 日本語 commit メッセージ案
* tag 名案
* 詳細付き tag 本文案

希望する commit メッセージ案:
Deploy-001: Netlify デプロイ設定を追加

希望する tag 名案:
deploy-001-netlify-config

---

# 8. GitHub に push する

Codex の Deploy-001 が終わって commit / tag したら push します。

```bash
git push
git push --tags
```

初回 push がまだなら:

```bash
git push -u origin main
git push --tags
```

---

# 9. Netlify 初回デプロイ後に確認すること

Netlify の Deploy log で見るポイント:

```text
npm install 相当が成功しているか
npm run build が成功しているか
Publish directory が dist になっているか
Deploy succeeded になっているか
```

成功したら Netlify の URL が出ます。

```text
https://xxxxx.netlify.app
```

これをスマホに送って確認します。

---

# 10. スマホ確認ポイント

まずはこのくらいでOKです。

* Top が表示される
* Settings に入れる
* 言語切り替えが動く
* Play が開始できる
* カウントダウンが出る
* 数字タイルが押せる
* Result が表示される
* Score が更新される
* 画面横向きでも崩れすぎない

iPhone / Android 両方で見られるなら理想です。

---

# 11. 以後の運用

今後はこの流れになります。

```bash
# Codex が実装
npm run build
git add .
git commit -m "..."
git tag -a ...
git push
git push --tags
```

GitHub に push すると、Netlify が自動 deploy します。
スマホでは Netlify URL を再読み込みして確認します。

---

## まずやること

次の順番で進めるのがよいです。

1. Codex に **Deploy-001** を投げる
2. commit / tag
3. GitHub repo 作成
4. `git remote add origin ...`
5. `git push -u origin main`
6. `git push --tags`
7. Netlify で GitHub repo を import
8. Build command / Publish directory を確認
9. Deploy
10. スマホ確認

[1]: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/?utm_source=chatgpt.com "Vite on Netlify"
[2]: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github?utm_source=chatgpt.com "Adding locally hosted code to GitHub"
[3]: https://docs.netlify.com/start/choose-your-path/?utm_source=chatgpt.com "Choose your path | Netlify Docs"
[4]: https://docs.netlify.com/manage/routing/redirects/overview/?utm_source=chatgpt.com "Redirects and rewrites"
