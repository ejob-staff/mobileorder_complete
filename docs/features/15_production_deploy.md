# 15章 本番環境へのデプロイ

### 目次
- [構成の概要](#構成の概要)
- [設定ファイルの作成](#設定ファイルの作成)
- [DBを起動する](#DBを起動する)
- [SpringBootを起動する](#SpringBootを起動する)
- [Reactを起動する](#Reactを起動する)
- [ローカルでの動作確認](#ローカルでの動作確認)
- [NeonでのDB作成](#NeonでのDB作成)
- [Renderでのデプロイ](#Renderでのデプロイ)
- [Vercelでのデプロイ](#Vercelでのデプロイ)
- [本番環境で動作確認](#本番環境で動作確認)

フロントエンドであるReact/ViteをVercel、バックエンドであるSpring BootをRenderにデプロイし、<br>
DBはPostgreSQLを使って外部公開するまでの手順。

## 構成の概要

- フロント: `mobileorder-react/` → **Vercel**（Hobby / 無料プラン）
- バックエンド: リポジトリ直下（`pom.xml`）→ **Render**（Free Web Service）
- DB: **PostgreSQL** → **Neon**（無料枠、Renderとは別サービス）。旧MySQLから移行済み
- 認証: 既存のセッションCookie方式（Spring Security formLogin, JSESSIONID）のまま変更なし
- クロスオリジン対策: Vercelの`rewrites`で`/api/*`をRenderのバックエンドにプロキシする。<br>
  ブラウザからは常にVercelドメインへの同一オリジン通信に見えるため、CORS設定やSameSite=None Cookie対応は不要。<br>
- フロントの`fetch('/api/...', { credentials: 'include' })`という既存コードも無改修で動く。

## 設定ファイルの作成

`.env.example`を参考に`.env`を作成する

## DBを起動する

```
docker compose up -d
```

`docker-compose.yml`は`postgres:16`イメージを使う。

## SpringBootを起動する

起動後に指定しているローカルのアプリケーションポートでAPIが動く。
`DataInitializer`が空のDBに初期ユーザー・商品・注文のサンプルデータを自動投入する。

## Reactを起動する

```
cd mobileorder-react
npm run dev
```

表示されているURLを開いて画面が表示されればOK。

## ローカルでの動作確認

- [ ] ログインできる
- [ ] 新規アカウント作成できる
- [ ] パスワード再設定できる
- [ ] 商品を注文できる
- [ ] 注文履歴を確認できる
- [ ] 評価を登録できる
- [ ] （管理者）商品管理できる
- [ ] （管理者）注文ステータスを更新できる
- [ ] （管理者）注文分析を確認できる
- [ ] （管理者）ユーザー管理できる

## NeonでのDB作成

1. Neonの公式サイトにサインアップし、新規プロジェクト（Postgres）を作成する
2. 発行される接続情報（ホスト・ポート・DB名・ユーザー名・パスワード）を控える
    - NeonはSSL接続必須。`application.yml`の接続URLは`DB_SSLMODE`環境変数でsslmodeを切り替えられるようにしてある（ローカルは`prefer`、Renderでは`require`を設定する）

## Renderでのデプロイ

1. Renderの公式サイトにサインアップし、このGitHubリポジトリと連携する
2. **Web Service** を新規作成し、リポジトリのルート（`pom.xml`がある場所）を指定する
    - Language: **Docker**（RenderはJavaをネイティブ言語としてサポートしていないため、リポジトリ直下の`Dockerfile`を使ってビルド・実行する）
    - Branch: **deploy**（Postgres対応やRender/Vercel向けの設定ファイルはdeployブランチにのみ存在する）
    - Build/Start command: 指定不要（`Dockerfile`の内容がそのまま使われる）
    - Plan: **Free**
3. 環境変数を設定する
    - Renderの管理画面 - Environment - Environment Variablesで設定する
    - Neonの接続情報から`APP_PORT` `DB_HOST` `DB_NAME` `DB_PASSWORD` `DB_PORT` `DB_SSLMODE` `DB_USERNAME`を設定する
    - 上記は`application.yml`を確認しながら設定する
    - `DB_SSLMODE=require`（NeonはSSL接続必須のため。ローカルの`prefer`のままだと接続できない）
    - `PORT`はRenderが自動で注入するので設定不要
    - `system.properties`でJavaのバージョンをRenderに明示している
4. デプロイが完了したら発行される`https://<service名>.onrender.com`のURLを控える

## Vercelでのデプロイ

1. Vercelの公式サイトにサインアップし、同じGitHubリポジトリと連携してプロジェクトを作成する
2. **Root Directory** を`mobileorder-react`に設定する
3. Build/Output設定はデフォルト（`vite build` / `dist`）のままでよい
4. `mobileorder-react/vercel.json`の`destination`を、Renderでのデプロイの手順4で控えたURLに書き換える
5. コミット・プッシュしてVercelに再デプロイさせる
6. デプロイ完了後、発行されたURLにアクセスする

## 本番環境で動作確認

「ローカルでの動作確認」と同じチェックリストを、本番URL（Vercelのドメイン）上で確認する。

- [ ] ログインできる
- [ ] 新規アカウント作成できる
- [ ] パスワード再設定できる
- [ ] 商品を注文できる
- [ ] 注文履歴を確認できる
- [ ] 評価を登録できる
- [ ] （管理者）商品管理できる
- [ ] （管理者）注文ステータスを更新できる
- [ ] （管理者）ユーザー管理できる
- [ ] （管理者）注文分析を確認できる
- [ ] ログイン後にページをリロードしてもログイン状態が保たれる（Cookieが正しくVercelドメインに乗っている確認）

## 補足: なぜCORS設定が要らないのか

RenderのバックエンドはVercelとは別ドメイン（`*.onrender.com`）で動いているが、<br>
ブラウザは常にVercelドメイン（`*.vercel.app`）にしかアクセスしない。`/api/*`へのリクエストは<br>
Vercel側のrewrite設定によってサーバー間でRenderに転送される仕組みのため、ブラウザから見ると同一オリジン通信になる。<br>
そのためCORSヘッダーの設定も、Cookieの`SameSite=None`対応も不要になっている。
