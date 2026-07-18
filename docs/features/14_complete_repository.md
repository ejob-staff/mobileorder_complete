## 14-1.完成版のリポジトリ
### 完成版のリポジトリとは
　練習問題確認用のレポジトリ

### 目次
- [リポジトリ構成](#リポジトリ構成)
- [バックエンド構成](#バックエンド構成)
- [フロントエンド構成](#フロントエンド構成)
- [ドキュメント構成](#ドキュメント構成)
- [起動前に確認すること](#起動前に確認すること)

### リポジトリ構成
　バックエンド、フロントエンド、設計資料を分けて管理している<br>

- 主なディレクトリ<br>
　src/main/java/jp/co/mobileorder/ -- Spring Boot側ソース<br>
　src/main/resources/ -- Spring Boot設定ファイル<br>
　mobileorder-react/ -- React側ソース<br>
　docs/ -- 設計資料<br>
　docs/features/ -- 章ごとの機能説明資料<br>

- 主なファイル<br>
　pom.xml -- Maven設定<br>
　docker-compose.yml -- MySQLコンテナ設定<br>
　.env.example -- 環境変数の例<br>
　README.md -- リポジトリ概要<br>

### バックエンド構成
　Spring BootでAPI、業務処理、DBアクセスを管理する<br>

- 主な構成<br>
　controller -- APIの入口<br>
　service -- 業務ロジック<br>
　repository -- DBアクセス<br>
　entity -- DBテーブルに対応するクラス<br>
　dto -- React側とやり取りするデータ<br>
　config -- セキュリティ設定と初期データ登録<br>

- 使用技術<br>
　Spring Boot<br>
　Spring Security<br>
　Spring Data JPA<br>
　Validation<br>
　MySQL Connector/J<br>
　OpenJDK 21<br><br>

- 参照ファイル<br>
　pom.xml<br>
　src/main/java/jp/co/mobileorder/<br>

### フロントエンド構成
　Reactで一般ユーザー用画面と管理者ユーザー用画面を表示する<br>

- 主な構成<br>
　mobileorder-react/src/App.jsx -- Reactアプリ全体の中心<br>
　mobileorder-react/src/api/client.js -- API通信の共通処理<br>
　mobileorder-react/src/components/ -- 共通部品<br>
　mobileorder-react/src/pages/ -- 一般ユーザー用画面<br>
　mobileorder-react/src/pages/admin/ -- 管理者ユーザー用画面<br>

- 使用技術<br>
　React<br>
　React Router<br>
　Vite<br><br>

- 参照ファイル<br>
　mobileorder-react/package.json<br>
　mobileorder-react/src/<br>

### ドキュメント構成
　要件定義、基本設計、DB設計、詳細設計、機能別章を管理する<br>

- docs配下<br>
　01_requirements.md -- 要件定義<br>
　02_basic_design.md -- 基本設計<br>
　03_database_design.md -- DB設計<br>
　04_detail_design.md -- 詳細設計<br>

- docs/features配下<br>
　03_common_foundation.md -- 共通基盤と画面遷移<br>
　04_authentication.md -- 認証機能<br>
　05_ordering.md -- 注文機能<br>
　06_order_review.md -- 注文評価機能<br>
　07_account_management.md -- アカウント管理機能<br>
　08_product_management.md -- 商品管理機能<br>
　09_order_management.md -- 注文対応管理機能<br>
　10_review_management.md -- 注文評価確認機能<br>
　11_order_analytics.md -- 注文分析機能<br>
　12_user_management.md -- ユーザー管理機能<br>
　13_initial_data.md -- 初期データ登録<br>
　14_complete_repository.md -- 完成版のリポジトリ<br>
　15_production_deploy.md -- 本番環境へのデプロイ<br>

### 起動前に確認すること
　起動前に確認することでは、DB設定とアプリケーション設定を確認する<br>

- 確認項目<br>
　.envを作成してDB接続情報を設定する<br>
　docker-compose.ymlのDBポートを確認する<br>
　application.ymlが.envを読み込むことを確認する<br>
　Spring Bootのserver.portをAPP_PORTで指定する<br>
　React側の依存関係をnpm installで準備する<br><br>

- ここで確認すること<br>
　.env.exampleはサンプルなので、実際の.envには任意のパスワードを設定する<br>
