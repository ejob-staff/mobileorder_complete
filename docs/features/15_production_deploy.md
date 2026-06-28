## 15章.本番環境へのデプロイ
### 本番環境へのデプロイとは
　開発したソフトウェアをユーザーが使える環境に反映する<br>

### 目次
- [この章について](#この章について)
- [デプロイについて](#デプロイについて)
- [環境変数の設定](#環境変数の設定)
- [DBの準備](#DBの準備)
- [Spring Bootの起動設定](#Spring Bootの起動設定)
- [Reactのビルド](#Reactのビルド)
- [デプロイ前の確認項目](#デプロイ前の確認項目)
- [本番環境へのデプロイのまとめ](#本番環境へのデプロイのまとめ)

### 環境変数の設定
　環境変数の設定では、.env.exampleを参考に.envを作成する<br>

- 設定する値<br>
　DB_PORT -- MySQLの接続ポート<br>
　DB_NAME -- DB名<br>
　DB_USERNAME -- DBユーザー名<br>
　DB_PASSWORD -- DBパスワード<br>
　DB_ROOT_PASSWORD -- rootユーザーのパスワード<br>
　DB_CONTAINER_NAME -- DBコンテナ名<br>
　APP_PORT -- Spring Bootの起動ポート<br>

- ここで確認すること<br>
　本番環境では推測されにくいパスワードを設定する<br>
　.envはGit管理に含めない<br>

- 参照ファイル<br>
　.env.example<br>
　src/main/resources/application.yml<br>

### DBの準備
　DBの準備では、MySQLコンテナまたは本番環境のMySQLを用意する<br>

- Docker Composeを使う場合<br>
　docker-compose.ymlを使用する<br>
　mysql:8.4イメージを使用する<br>
　database-volumeにDBデータを保存する<br>
　TZはAsia/Tokyoに設定する<br>
　DB_PORTでホスト側ポートを指定する<br>

- ここで確認すること<br>
　DB_NAME、DB_USERNAME、DB_PASSWORDがapplication.ymlと一致している必要がある<br>
　初回起動時はDataInitializerが初期データを登録する<br>

- 参照ファイル<br>
　docker-compose.yml<br>
　.env.example<br>

### Spring Bootの起動設定
　Spring Bootの起動設定では、application.ymlが環境変数を読み込む<br>

- 起動時に使用する設定<br>
　spring.config.importで.envを読み込む<br>
　datasource.urlにDB_PORTとDB_NAMEを使用する<br>
　datasource.usernameにDB_USERNAMEを使用する<br>
　datasource.passwordにDB_PASSWORDを使用する<br>
　server.portにAPP_PORTを使用する<br>
　spring.jpa.hibernate.ddl-autoはupdateを使用する<br>

- ここで確認すること<br>
　本番環境ではDB接続先、ポート、認証情報が正しいか確認する<br>
　ddl-auto=updateの扱いは運用方針に合わせて確認する<br>

- 参照ファイル<br>
　src/main/resources/application.yml<br>
　pom.xml<br>

### Reactのビルド
　Reactのビルドでは、Viteでフロントエンドをビルドする<br>

- ビルドする場合<br>
　mobileorder-react/package.jsonを確認する<br>
　npm installで依存関係を準備する<br>
　npm run buildで本番用ファイルを作成する<br>
　npm run previewでビルド結果を確認できる<br>

- ここで確認すること<br>
　React側のAPI呼び出し先が本番環境で正しく解決できるか確認する<br>
　ログイン状態はCookieを使うため、同一オリジンやプロキシ設定も確認する<br>

- 参照ファイル<br>
　mobileorder-react/package.json<br>
　mobileorder-react/vite.config.js<br>

### デプロイ前の確認項目
　デプロイ前の確認項目では、主要機能が本番環境で動くか確認する<br>

- 確認する機能<br>
　ログインできる<br>
　新規アカウント作成できる<br>
　パスワード再設定できる<br>
　一般ユーザーが商品を注文できる<br>
　注文状況と注文履歴を確認できる<br>
　受取完了後に評価を登録できる<br>
　管理者ユーザーが商品管理できる<br>
　管理者ユーザーが注文ステータスを更新できる<br>
　管理者ユーザーがユーザー管理できる<br>
　注文分析を確認できる<br>

- 確認する設定<br>
　DB接続情報が正しい<br>
　APP_PORTが使用可能である<br>
　初期データが必要な状態で登録されている<br>
　.envがGit管理されていない<br>
