## 9章.注文対応管理機能
### 注文対応管理機能
　この章では、管理者ユーザーが注文状況を確認し、注文ステータスを更新できる機能<br>
　キャンセル理由の入力や、受け取り時間が近い注文の注意表示も扱う<br>

- [この章について](#この章について)
- [注文対応管理機能について](#注文対応管理機能について)
- [注文状況画面](#注文状況画面)
- [管理者用注文一覧の取得](#管理者用注文一覧の取得)
- [注文ステータスの絞り込み](#注文ステータスの絞り込み)
- [受け取り時間が近い注文の注意表示](#受け取り時間が近い注文の注意表示)
- [注文ステータス更新](#注文ステータス更新)
- [キャンセル理由の入力](#キャンセル理由の入力)
- [注文対応管理で使う主なデータ](#注文対応管理で使う主なデータ)
- [注文対応管理機能のエラー表示](#注文対応管理機能のエラー表示)
- [注文対応管理機能のまとめ](#注文対応管理機能のまとめ)

### 注文状況画面
注文状況画面では、管理者ユーザーが全注文の状況を確認する<br>

- /admin/ordersにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadAdminOrdersを実行する<br>
　　GET /api/admin/ordersでリクエスト送信<br>
　　取得したordersをAdminOrdersPageへ渡す<br>
　`AdminOrdersPageコンポーネント`<br>
　　注文番号、注文日時、受取日時、ユーザー名を表示する<br>
　　注文商品、合計金額、注文ステータスを表示する<br>
　　注文ステータスの更新フォームを表示する<br><br>

- ここで確認すること<br>
　注文状況画面は管理者ユーザーだけが表示できる<br>
　一般ユーザー側の注文状況確認画面とは取得するAPIが異なる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminOrdersPage.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>

### 管理者用注文一覧の取得
管理者用注文一覧の取得では、全ユーザーの注文を取得する<br>

- GET /api/admin/ordersを呼び出した場合<br>
  Java側<br>
　`OrderController`<br>
　　管理者用の注文一覧リクエストを受け取る<br>
　　OrderServiceへ処理を渡す<br>
　`OrderService`<br>
　　mobile_orderテーブルから全注文を取得する<br>
　　新しい注文から順番に並べる<br>
　　OrderResponseへ変換して返す<br><br>

- ここで確認すること<br>
　管理者用注文一覧ではユーザーを限定しない<br>
　OrderResponseには注文商品、合計金額、ステータス、キャンセル情報も含まれる<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　dto/OrderResponse.java<br>

### 注文ステータスの絞り込み
注文ステータスの絞り込みでは、表示する注文をステータス別に切り替える<br>

- ステータスタブを押した場合<br>
  React側<br>
　`AdminOrdersPageコンポーネント`<br>
　　activeFilterをstateで管理する<br>
　　すべての場合は全注文を表示する<br>
　　ステータスが選択されている場合は一致する注文だけを表示する<br>
　　対象注文がない場合はステータスに応じた空メッセージを表示する<br><br>

- ここで確認すること<br>
　絞り込みはReact側で行っている<br>
　絞り込み対象はPENDING、COOKING、READY、SERVED、CANCELEDである<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AdminOrdersPage.jsx<br>

### 受け取り時間が近い注文の注意表示
受け取り時間が近い注文の注意表示では、準備開始が必要な注文を分かりやすく表示する<br>

- 注文カードを表示する場合<br>
  React側<br>
　`AdminOrdersPageコンポーネント`<br>
　　注文ステータスがPENDINGか確認する<br>
　　受取日時をDateへ変換する<br>
　　受取日時まで20分以内か確認する<br>
　　条件を満たす場合は注意文言を表示する<br>

- 表示文言<br>
　受け取り日時がもうすぐです。商品の準備を始めましょう。<br><br>

- ここで確認すること<br>
　注意表示はReact側で判定している<br>
　PENDING以外の注文には表示しない<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AdminOrdersPage.jsx<br>

### 注文ステータス更新
注文ステータス更新では、店舗側が注文の準備状況を変更する<br>

- ステータスを変更した場合<br>
  React側<br>
　`AdminOrdersPageコンポーネント`<br>
　　注文ごとの入力内容をformsとしてstateで管理する<br>
　　変更がある場合だけステータス更新ボタンを有効にする<br>
　　更新前に確認モーダルを表示する<br>
　`Appコンポーネント`<br>
　　PUT /api/admin/orders/{orderNumber}/statusでリクエスト送信<br>
　　更新後に管理者用注文一覧を再取得する<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　注文番号、OrderStatusUpdateRequest、管理者ユーザー名を受け取る<br>
　　OrderServiceへ更新処理を渡す<br>
　`OrderService`<br>
　　注文番号で注文を検索する<br>
　　ステータスをOrderStatusへ変換する<br>
　　注文ステータスを更新する<br><br>

- ここで確認すること<br>
　更新前に「注文状況を更新しますか？」の確認モーダルを表示する<br>
　更新後は一覧を再取得して画面へ反映する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminOrdersPage.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　dto/OrderStatusUpdateRequest.java<br>

### キャンセル理由の入力
キャンセル理由の入力では、キャンセルに切り替える場合に理由を必須にする<br>

- ステータスをCANCELEDにした場合<br>
  React側<br>
　`AdminOrdersPageコンポーネント`<br>
　　キャンセル理由のtextareaを表示する<br>
　　キャンセル理由が未入力の場合は確認モーダルで入力を促す<br>
  <br>
  Java側<br>
　`OrderService`<br>
　　ステータスがCANCELEDでcancelReasonが空の場合はエラーにする<br>
　　キャンセル理由と管理者ユーザー名を注文に保存する<br><br>

- ここで確認すること<br>
　キャンセル理由は一般ユーザー側の注文状況や注文履歴で店舗からの連絡として表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AdminOrdersPage.jsx<br>
  <br>
  Java側<br>
　service/OrderService.java<br>
　dto/OrderStatusUpdateRequest.java<br>

### 注文対応管理で使う主なデータ
- `OrderResponse`<br>
　注文情報をReact側へ返すDTO<br>
　管理者画面ではユーザー名、商品一覧、合計金額、ステータスを表示する<br>
  <br>
- `OrderStatusUpdateRequest`<br>
　注文ステータス更新APIへ送るDTO<br>
　status、cancelReasonを持つ<br>
  <br>
- `MobileOrder`<br>
　mobile_orderテーブルに対応する注文Entity<br>
　注文ステータス、キャンセル理由、キャンセル担当者を保持する<br>

### 注文対応管理機能のエラー表示
- 主なエラー例<br>
　対象の注文が見つからない<br>
　キャンセルの理由が未入力になっている<br>
　不正な注文ステータスを指定している<br><br>

- ここで確認すること<br>
　Java側で返したmessageはapiRequestを通して画面に表示する<br>
　キャンセル理由の未入力はReact側でも確認する<br>

### 注文対応管理機能のまとめ
管理者ユーザーは全ユーザーの注文状況を確認できる<br>
注文ステータスで絞り込みできる<br>
受け取り時間が近い未対応注文は注意表示する<br>
注文ステータス更新前に確認モーダルを表示する<br>
キャンセル時はキャンセル理由を入力する<br>
キャンセル理由は一般ユーザー側にも表示される<br>
