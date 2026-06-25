## 詳細設計
この資料は、モバイルオーダーアプリの詳細設計として<br>
主なAPI一覧を整理したものです。

### エンドポイント一覧
#### 認証関連

`POST /api/login` - ログインする<br>
`POST /api/logout` -  ログアウトする<br>
`GET /api/auth/status` - ログイン状態を取得する<br>
`POST /api/auth/login-check` - ユーザー名とパスワードを確認する<br>
`POST /api/signup` - 新規アカウントを作成する<br>
`POST /api/password-reset` - パスワードを再設定する

#### 商品関連

`GET /api/products` - 一般ユーザー向けの商品一覧を取得する<br>
`GET /api/admin/products` - 管理者向けの商品一覧を取得する<br>
`POST /api/admin/products` - 商品を登録する<br>
`PUT /api/admin/products/{id}` - 商品情報を更新する<br>
`POST /api/admin/products/{id}/toggle-published` - 商品の公開状態を切り替える<br>
`DELETE /api/admin/products/{id}` - 商品を削除する

#### 注文関連

`POST /api/orders` - 注文を登録する<br>
`GET /api/orders` - ログイン中ユーザーの注文履歴を取得する<br>
`GET /api/orders/active` - ログイン中ユーザーの進行中の注文を取得する<br>
`POST /api/orders/{orderNumber}/received` - 注文を受取完了にする<br>
`GET /api/admin/orders` - 全ユーザーの注文一覧を取得する<br>
`PUT /api/admin/orders/{orderNumber}/status` - 注文ステータスを更新する

#### 注文評価関連

`GET /api/reviews` - ログイン中ユーザーが登録した評価を取得する<br>
`POST /api/reviews` - 商品の評価を登録する<br>
`GET /api/admin/reviews?period=all` - すべての評価を取得する<br>
`GET /api/admin/reviews?period=week` - 直近1週間の評価を取得する<br>
`GET /api/admin/reviews?period=month` - 直近1か月の評価を取得する

#### 注文分析関連

`GET /api/admin/analytics` - 売上や注文に関する分析データを取得する

#### アカウント管理関連

`GET /api/account` - ログイン中ユーザーのアカウント情報を取得する<br>
`PUT /api/account` - ログイン中ユーザーのパスワードを変更する

#### ユーザー管理関連

`GET /api/admin/users` - ユーザー一覧を取得する<br>
`POST /api/admin/users/admin` - 管理者ユーザーを登録する<br>
`POST /api/admin/users/{id}/toggle-enabled` - ユーザーの利用状態を切り替える<br>
`DELETE /api/admin/users/{id}` - ユーザーを削除する<br>
`GET /api/admin/user-management-codes` - ユーザー管理番号一覧を取得する<br>
`POST /api/admin/user-management-codes/user` - 一般ユーザー用管理番号を発行する<br>
`POST /api/admin/user-management-codes/admin` - 管理者用管理番号を発行する
