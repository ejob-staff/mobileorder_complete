## 10章.注文評価確認機能
### 注文評価確認機能とは
　管理者ユーザーが一般ユーザーの登録した商品評価を確認できる機能<br>
　期間絞り込み、評価表示、レビュー内容の確認を扱う<br>

### 目次
- [この章について](#この章について)
- [注文評価確認機能について](#注文評価確認機能について)
- [注文評価確認画面](#注文評価確認画面)
- [管理者用評価一覧の取得](#管理者用評価一覧の取得)
- [期間での絞り込み](#期間での絞り込み)
- [注文評価の表示内容](#注文評価の表示内容)
- [注文評価確認で使う主なデータ](#注文評価確認で使う主なデータ)
- [注文評価確認機能のまとめ](#注文評価確認機能のまとめ)

### 注文評価確認画面
注文評価確認画面では、管理者ユーザーが商品評価を一覧で確認する<br>

- /admin/reviewsにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadAdminReviewsを実行する<br>
　　GET /api/admin/reviews?period=allでリクエスト送信<br>
　　取得したreviewsをAdminReviewsPageへ渡す<br>
　`AdminReviewsPageコンポーネント`<br>
　　期間タブを表示する<br>
　　商品名、注文番号、ユーザー名、評価登録日時を表示する<br>
　　スター評価とレビューを表示する<br>

- ここで確認すること<br>
　注文評価確認画面は管理者ユーザーだけが表示できる<br>
　評価登録日時はユーザー名の下に表示する（注文評価の確認 練習問題6-1-19-1）<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminReviewsPage.jsx<br>

### 管理者用評価一覧の取得
管理者用評価一覧の取得では、全ユーザーの評価を取得する<br>

- GET /api/admin/reviewsを呼び出した場合<br>
  Java側<br>
　`ProductReviewController`<br>
　　periodを受け取る<br>
　　ProductReviewServiceへ処理を渡す<br>
　`ProductReviewService`<br>
　　periodに応じて評価一覧を取得する<br>
　　ProductReviewResponseへ変換して返す<br>

- ここで確認すること<br>
　一般ユーザー用のGET /api/reviewsはログイン中ユーザーの評価だけを返す<br>
　管理者用のGET /api/admin/reviewsは全ユーザーの評価を対象にする<br>

- 参照ファイル<br>
  Java側<br>
　controller/ProductReviewController.java<br>
　service/ProductReviewService.java<br>
　dto/ProductReviewResponse.java<br>

### 期間での絞り込み
期間での絞り込みでは、評価一覧の対象期間を切り替える<br>

- 期間タブを押した場合<br>
  React側<br>
　`AdminReviewsPageコンポーネント`<br>
　　periodをstateで管理する<br>
　　periodが変わるたびにonLoadReviewsを実行する<br>
　　すべて、直近1週間、直近1ヶ月を切り替える<br>
  <br>
  Java側<br>
　`ProductReviewService`<br>
　　allの場合はすべての評価を取得する<br>
　　weekの場合は直近1週間の評価を取得する<br>
　　monthの場合は直近1か月の評価を取得する<br>

- ここで確認すること<br>
　期間が変わったタイミングでAPIを再実行する<br>
　対象期間の評価がない場合は空メッセージを表示する<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AdminReviewsPage.jsx<br>
  <br>
  Java側<br>
　service/ProductReviewService.java<br>

### 注文評価の表示内容
注文評価の表示内容では、レビュー確認に必要な情報をまとめて表示する<br>

- 評価カードを表示する場合<br>
  React側<br>
　`AdminReviewsPageコンポーネント`<br>
　　商品名を表示する<br>
　　注文番号を表示する<br>
　　ユーザー名を表示する<br>
　　評価登録日時を表示する<br>
　　スター評価をRatingStarsで表示する<br>
　　お客様からのレビューを表示する<br>
　　レビューが未入力の場合は「コメントはありません。」と表示する<br>

- ここで確認すること<br>
　スター評価の表示には共通部品のRatingStarsを使用する<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AdminReviewsPage.jsx<br>
　mobileorder-react/src/components/RatingStars.jsx<br>

### 注文評価確認で使う主なデータ
- `ProductReviewResponse`<br>
　評価一覧APIからReact側へ返すDTO<br>
　商品名、注文番号、ユーザー名、評価、レビュー、登録日時を持つ<br>
  <br>
- `ProductReview`<br>
　product_reviewテーブルに対応する評価Entity<br>
　管理者用評価一覧の取得元になる<br>

### 注文評価確認機能のまとめ
管理者ユーザーは全ユーザーの商品評価を確認できる<br>
評価はすべて、直近1週間、直近1ヶ月で絞り込みできる<br>
商品名、注文番号、ユーザー名、評価登録日時、スター評価、レビューを確認できる<br>
レビューが未入力の場合はコメントなしとして表示する<br>
