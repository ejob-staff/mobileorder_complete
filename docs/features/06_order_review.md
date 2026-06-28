## 6章.注文評価機能
### 注文評価機能とは
　受け取りが完了した注文商品を商品単位で評価する機能<br>

### 目次
- [注文評価機能とは](#注文評価機能とは)
- [この章について](#この章について)
- [注文評価機能について](#注文評価機能について)
- [注文評価登録画面](#注文評価登録画面)
- [注文一覧と登録済み評価の取得](#注文一覧と登録済み評価の取得)
- [評価対象となる注文](#評価対象となる注文)
- [注文評価フォーム](#注文評価フォーム)
- [スター評価入力](#スター評価入力)
- [感想入力](#感想入力)
- [評価済み判定](#評価済み判定)
- [評価登録前の確認モーダル](#評価登録前の確認モーダル)
- [評価登録処理](#評価登録処理)
- [注文評価登録API](#注文評価登録API)
- [注文評価の業務ロジック](#注文評価の業務ロジック)
- [注文評価で使う主なデータ](#注文評価で使う主なデータ)
- [登録済み評価の表示](#登録済み評価の表示)
- [管理者側の注文評価確認](#管理者側の注文評価確認)
- [注文評価機能のエラー表示](#注文評価機能のエラー表示)
- [注文評価機能のまとめ](#注文評価機能のまとめ)

### 注文評価登録画面
　評価できる注文、評価フォーム、登録済み評価を表示することができる画面<br>

- /reviewsにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadOrdersを実行する<br>
　　loadReviewsを実行する<br>
　　ReviewPageへorders、reviews、onSubmitReview、onConfirmを渡す<br>
　`ReviewPageコンポーネント`<br>
　　受取完了済みの注文だけを評価対象として表示する<br>
　　注文番号と受け取り日時を表示する<br>
　　注文商品ごとに評価フォームを表示する<br>
　　スター評価を選択できるようにする<br>
　　レビューを入力できるようにする<br>
　　評価登録前に確認モーダルを表示する<br>
　　登録済みの評価を一覧表示する<br><br>

- ここで確認すること<br>
　画面の内容が伝わりやすい文言に変更する（注文評価登録画面 練習問題6-1-2-1）<br>
　評価フォームには何をすべきものなのかを明確に記載する（注文評価登録画面 練習問題6-1-2-2）<br>
　評価登録画面は一般ユーザーだけが表示できる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>

### 注文一覧と登録済み評価の取得
　注文一覧と登録済み評価をSpring BootのAPIから取得できる機能<br>

- /reviewsを表示した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　routeが/reviewsの場合にloadOrdersを実行する<br>
　　GET /api/ordersでログイン中ユーザーの注文一覧を取得する<br>
　　同じタイミングでloadReviewsを実行する<br>
　　GET /api/reviewsでログイン中ユーザーの登録済み評価を取得する<br>
　　取得したordersとreviewsをReviewPageへpropsとして渡す<br><br>

- ここで確認すること<br>
　評価対象の注文一覧と登録済み評価は別APIで取得している<br>
　登録済み評価は評価済み判定にも使う<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　controller/ProductReviewController.java<br>

### 評価対象となる注文
　注文ステータスが「RECEIVED」の注文に対して評価できる機能<br>

- 注文一覧を受け取った場合<br>
  React側<br>
　`ReviewPageコンポーネント`<br>
　　ordersからstatusがRECEIVEDの注文だけを抽出する<br>
　　抽出した注文をreceivedOrdersとして扱う<br>
　　受取完了していない注文は評価フォームに表示しない<br><br>

- ここで確認すること<br>
　実際に受け取った商品だけ評価できるようにしている<br>
　Java側でも受取完了前の注文は評価登録できないように確認している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>
  <br>
  Java側<br>
　service/ProductReviewService.java<br>

### 注文評価フォーム
　注文商品ごとの評価入力内容をformsとしてstateで管理する<br>

- 評価内容を変更した場合<br>
  React側<br>
　`ReviewPageコンポーネント`<br>
　　注文番号と商品IDを組み合わせてformKeyを作成する<br>
　　formKeyをキーにしてratingとcommentをformsへ保存する<br>
　　同じ注文の中に複数商品がある場合でも商品ごとに入力内容を分けて管理する<br><br>

- ここで確認すること<br>
　フォームの初期評価は5として扱う<br>
　商品単位で評価を登録できる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>

### スター評価入力
　スター評価入力では、1から5までのスターを選択する<br>

- スターを押した場合<br>
  React側<br>
　`RatingInputコンポーネント`<br>
　　1から5までのスターをボタンとして表示する<br>
　　選択した評価以下のスターをactive状態にする<br>
　　スターを押したときに評価値を更新する<br>
　　選択した評価を親コンポーネントへ渡す<br><br>

- ここで確認すること<br>
　スター評価は1から5の範囲で登録する<br>
　Java側のProductReviewRequestでも1から5の範囲をバリデーションしている<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>
  <br>
  Java側<br>
　dto/ProductReviewRequest.java<br>

### 感想入力
　textareaで商品に対するレビューを入力する<br>

- textareaに入力した場合<br>
  React側<br>
　`ReviewPageコンポーネント`<br>
　　入力した内容をcommentとしてstateに保存する<br>
　　商品ごとのformにcommentを保持する<br>
　　評価登録時にratingとcommentをまとめてAPIへ送信する<br><br>

- ここで確認すること<br>
　レビューが未入力でも評価は登録できる<br>
　未入力の場合、登録済み評価の表示ではコメントなしとして扱う<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>

### 評価済み判定
　評価済み判定では、同じ注文商品を重複して評価できないようにする<br>

- 評価フォームを表示する場合<br>
  React側<br>
　`ReviewPageコンポーネント`<br>
　　findReviewで登録済み評価の一覧reviewsを確認する<br>
　　注文番号が一致しているか確認する<br>
　　商品IDが一致しているか確認する<br>
　　一致する評価がある場合は評価済みとして扱う<br>
　　評価済みの商品には評価フォームを表示しない<br>
　　登録済みのスター評価とレビューを表示する<br><br>

- ここで確認すること<br>
　評価済み判定は登録済みレビュー情報を取得して行う（注文評価登録確認 練習問題6-1-12-2）<br>
　React側とJava側の両方で重複評価を防いでいる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>
  <br>
  Java側<br>
　service/ProductReviewService.java<br>

### 評価登録前の確認モーダル
　登録内容を確定する前にユーザーへ確認する（注文評価登録確認 練習問題6-1-12-1）<br>

- 評価登録ボタンを押した場合<br>
  React側<br>
　`ReviewPageコンポーネント`<br>
　　すぐにAPIを呼び出さず、onConfirmで確認モーダルを表示する<br>
　　モーダルのタイトルは「注文評価登録確認」<br>
　　登録するスター評価とレビューは店舗担当者が確認することを伝える<br>
　　ユーザーが確定した場合だけonSubmitReviewを実行する<br><br>

- ここで確認すること<br>
　確認モーダルは共通部品のConfirmModalを使っている<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>
　mobileorder-react/src/components/ConfirmModal.jsx<br>

### 評価登録処理
　ReviewPageコンポーネントから受け取った評価内容をAPIへ送信する<br>

- 評価登録を確定した場合<br>
  React側<br>
　`ReviewPageコンポーネント`<br>
　　注文番号、商品ID、評価、レビューをAppコンポーネントへ渡す<br>
　`Appコンポーネント`<br>
　　submitReviewを実行する<br>
　　POST /api/reviewsでリクエスト送信<br>
　　登録された評価をreviewsの先頭に追加する<br>
　　商品一覧を再取得する<br><br>

- ここで確認すること<br>
　商品一覧を再取得することで、商品選択画面の平均評価やレビュー件数にも反映できる<br>
　登録後の評価は登録済み評価一覧にも表示される<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>

### 注文評価登録API
　ログイン中ユーザーの注文商品に対する評価を受け付ける<br>

- POST /api/reviewsを呼び出した場合<br>
  Java側<br>
　`ProductReviewController`<br>
　　ProductReviewRequestを受け取る<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　ProductReviewServiceへ評価登録処理を依頼する<br>
　　登録した評価をProductReviewResponseとして返す<br>

- GET /api/reviewsを呼び出した場合<br>
  Java側<br>
　`ProductReviewController`<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　ログイン中ユーザーの登録済み評価を新しい順で返す<br><br>

- ここで確認すること<br>
　注文評価登録は一般ユーザーだけが実行できる<br>
　APIの権限制御はSecurityConfig.javaで設定している<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/ProductReviewController.java<br>
　service/ProductReviewService.java<br>
　config/SecurityConfig.java<br>

### 注文評価の業務ロジック
　評価登録できる条件をJava側で確認する<br>

- 評価登録APIを呼び出した場合<br>
  Java側<br>
　`ProductReviewService`<br>
　　同じ注文番号、商品ID、ユーザー名の評価がすでに存在しないか確認する<br>
　　注文番号をもとに注文を検索する<br>
　　ログイン中ユーザー本人の注文か確認する<br>
　　注文ステータスがRECEIVEDか確認する<br>
　　注文内に対象商品が含まれているか確認する<br>
　　ProductReviewとして評価を保存する<br>
　　ProductReviewResponseへ変換して返す<br><br>

- ここで確認すること<br>
　React側で表示制御していても、最終的な登録可否はJava側でも確認する<br>
　商品単位で重複評価を防いでいる<br><br>

- 参照ファイル<br>
  Java側<br>
　service/ProductReviewService.java<br>
　repository/ProductReviewRepository.java<br>
　repository/MobileOrderRepository.java<br>

### 注文評価で使う主なデータ
- `ProductReviewRequest`<br>
　注文評価登録APIへ送る評価内容<br>
　orderNumber、productId、rating、commentを持つ<br>
  <br>
- `ProductReviewResponse`<br>
　登録済みの注文評価をReact側へ返すDTO<br>
　id、orderNumber、productId、productName、username、rating、comment、createdAtを持つ<br>
  <br>
- `ProductReview`<br>
　product_reviewテーブルに対応する注文評価Entity<br>
　注文番号、商品ID、商品名、ユーザー名、評価、レビュー、登録日時を持つ<br>
  <br>
- `ProductReviewRepository`<br>
　注文評価情報をDBから取得、保存するRepository<br>
　ログイン中ユーザーの評価取得、管理者用評価取得、重複評価確認に使用する<br>

### 登録済み評価の表示
　ユーザーが登録した評価を画面下部に一覧表示する<br>

- 登録済み評価がある場合<br>
  React側<br>
　`ReviewPageコンポーネント`<br>
　　登録済み評価一覧を表示する<br>
　　商品名を表示する<br>
　　スター評価を表示する<br>
　　レビューを表示する<br>
　　レビューが未入力の場合は「コメントはありません。」と表示する<br><br>

- ここで確認すること<br>
　登録済み評価一覧は注文評価カードと同じようなレイアウトに調整する（登録済み評価一覧 練習問題6-1-16-1）<br>
　スター評価の表示にはRatingStarsコンポーネントを使用する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/ReviewPage.jsx<br>
　mobileorder-react/src/components/RatingStars.jsx<br>

### 管理者側の注文評価確認
　一般ユーザーが登録した評価を期間で絞り込んで確認する<br>

- /admin/reviewsにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadAdminReviewsを実行する<br>
　　GET /api/admin/reviews?period=allでリクエスト送信<br>
　`AdminReviewsPageコンポーネント`<br>
　　期間タブを表示する<br>
　　商品名、注文番号、ユーザー名、評価登録日時、スター評価、レビューを表示する<br>
  <br>
  Java側<br>
　`ProductReviewController`<br>
　　periodを受け取る<br>
　　ProductReviewServiceへ処理を渡す<br>
　`ProductReviewService`<br>
　　allの場合はすべての評価を取得する<br>
　　weekの場合は直近1週間の評価を取得する<br>
　　monthの場合は直近1か月の評価を取得する<br><br>

- ここで確認すること<br>
　評価登録日時はユーザー名の下に表示する（注文評価の確認 練習問題6-1-19-1）<br>
　管理者側の評価確認は管理者ユーザーだけが表示できる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminReviewsPage.jsx<br>
  <br>
  Java側<br>
　controller/ProductReviewController.java<br>
　service/ProductReviewService.java<br>
