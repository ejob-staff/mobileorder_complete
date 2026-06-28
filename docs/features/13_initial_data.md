## 13-1.初期データ登録
### 初期データ登録について
　動作確認に必要なサンプルデータをDBに登録する処理<br>

### 目次
- [初期データ登録について](#初期データ登録について)
- [DataInitializer](#DataInitializer)
- [初期ユーザー](#初期ユーザー)
- [初期ユーザー管理番号](#初期ユーザー管理番号)
- [初期商品](#初期商品)
- [初期注文](#初期注文)
- [初期評価](#初期評価)
- [初期データを入れ直す場合](#初期データを入れ直す場合)
- [初期データ登録のまとめ](#初期データ登録のまとめ)

### DataInitializer
　アプリケーション起動時に初期データを登録する<br>

- アプリケーションを起動した場合<br>
  Java側<br>
　`DataInitializer`<br>
　　CommandLineRunnerとして起動時に実行する<br>
　　各Repositoryのcountを確認する<br>
　　対象テーブルが空の場合だけ初期データを登録する<br>
　　パスワードはPasswordEncoderで暗号化する<br><br>

- ここで確認すること<br>
　既にデータが存在するテーブルには初期データを追加しない場合がある<br>
　初期データを入れ直す場合はDBデータをリセットする<br><br>

- 参照ファイル<br>
  Java側<br>
　config/DataInitializer.java<br>

### 初期ユーザー
初期ユーザーでは、一般ユーザーと管理者ユーザーを登録する<br>

- app_userが空の場合<br>
  Java側<br>
　`DataInitializer`<br>
　　一般ユーザーとしてuser、user2、user3、user4を登録する<br>
　　管理者ユーザーとしてadmin、admin2を登録する<br>
　　初期パスワードはpasswordとする<br>
　　パスワードはBCryptで暗号化する<br><br>

- ここで確認すること<br>
　一般ユーザーはROLE_USERとして登録する<br>
　管理者ユーザーはROLE_ADMINとして登録する<br><br>

- 参照ファイル<br>
  Java側<br>
　config/DataInitializer.java<br>
　entity/AppUser.java<br>
　entity/Role.java<br>

### 初期ユーザー管理番号
初期ユーザー管理番号では、初期ユーザーに紐づく使用済み管理番号を登録する<br>

- user_management_codeが空の場合<br>
  Java側<br>
　`DataInitializer`<br>
　　USER-CODE-から始まる管理番号を一般ユーザー分登録する<br>
　　ADMIN-CODE-から始まる管理番号を管理者ユーザー分登録する<br>
　　英数字12桁をランダム生成する<br>
　　初期ユーザー名で使用済みにする<br><br>

- ここで確認すること<br>
　管理番号はユーザー登録やパスワード再設定で使用する<br>
　初期ユーザー分の管理番号は既に使用済みとして登録される<br><br>

- 参照ファイル<br>
  Java側<br>
　config/DataInitializer.java<br>
　entity/UserManagementCode.java<br>

### 初期商品
初期商品では、商品選択や商品管理で確認できる商品を登録する<br>

- productが空の場合<br>
  Java側<br>
　`DataInitializer`<br>
　　19件の商品を登録する<br>
　　タピオカ、ケーキ、焼き菓子、季節限定、ドリンク、プレミアムの商品を登録する<br>
　　価格、在庫数、公開状態、表示用アクセントを設定する<br><br>

- ここで確認すること<br>
　初期商品はすべて公開状態で登録される<br>
　商品選択画面と商品管理画面の動作確認に使用する<br><br>

- 参照ファイル<br>
  Java側<br>
　config/DataInitializer.java<br>
　entity/Product.java<br>

### 初期注文
初期注文では、注文状況、注文履歴、注文分析で使うサンプル注文を登録する<br>

- mobile_orderが空の場合<br>
  Java側<br>
　`DataInitializer`<br>
　　いちごタピオカミルクティの注文を36件登録する<br>
　　濃厚タピオカミルクティと焼き菓子を含む注文を18件登録する<br>
　　季節限定商品とドリンクを含む注文を6件登録する<br>
　　プレミアム商品の注文を6件登録する<br>
　　調理中の注文を1件登録する<br>
　　未対応の注文を1件登録する<br>
　　注文番号はMOBILE-CODE-数字6桁でランダム生成する<br><br>

- ここで確認すること<br>
　多くのサンプル注文は提供済み、受取完了として登録される<br>
　注文分析の売上推移やカテゴリ別バランスにも使用する<br><br>

- 参照ファイル<br>
  Java側<br>
　config/DataInitializer.java<br>
　entity/MobileOrder.java<br>
　entity/OrderItem.java<br>

### 初期評価
初期評価では、商品評価や注文分析で使うサンプルレビューを登録する<br>

- product_reviewが空の場合<br>
  Java側<br>
　`DataInitializer`<br>
　　いちごタピオカミルクティにスター評価5の評価を30件登録する<br>
　　濃厚タピオカミルクティにスター評価4または5の評価を14件登録する<br>
　　一部の焼き菓子とケーキにも評価を登録する<br>
　　評価コメントと登録日時を設定する<br><br>

- ここで確認すること<br>
　商品選択画面の平均評価やレビュー件数に反映される<br>
　管理者の注文評価確認画面でも確認できる<br><br>

- 参照ファイル<br>
  Java側<br>
　config/DataInitializer.java<br>
　entity/ProductReview.java<br>

### 初期データを入れ直す場合
初期データを入れ直す場合は、DBの既存データをリセットしてからアプリケーションを起動する<br>

- データをリセットする場合<br>
　MySQLコンテナのvolumeを削除する<br>
　または対象テーブルのデータを削除する<br>
　その後、アプリケーションを起動する<br><br>

- ここで確認すること<br>
　DataInitializerはcountが0の場合だけ登録するため、既存データがあると再投入されない<br>

### 初期データ登録のまとめ
初期ユーザー、初期管理番号、初期商品、初期注文、初期評価を登録する<br>
初期データはアプリケーション起動時にDataInitializerで登録する<br>
対象テーブルにデータがある場合は追加登録されないことがある<br>
初期データを入れ直す場合はDBデータをリセットする<br>
