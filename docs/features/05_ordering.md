## 5-1.注文機能
### 注文機能とは
　一般ユーザーが商品を選んで、カートに入れて、受け取り日時を指定して、注文を確定するための機能<br>
　注文後の注文状況の確認、受取完了、注文履歴の確認まで含む<br>

### 目次
- [注文機能とは](#注文機能とは)
- [商品選択画面](#商品選択画面)
- [商品検索とカテゴリ絞り込み](#商品検索とカテゴリ絞り込み)
- [商品詳細モーダル](#商品詳細モーダル)
- [カート追加](#カート追加)
- [注文確認画面](#注文確認画面)
- [注文商品の数量変更](#注文商品の数量変更)
- [注文商品の削除](#注文商品の削除)
- [受け取り日時の選択](#受け取り日時の選択)
- [注文確定](#注文確定)
- [注文完了画面](#注文完了画面)
- [注文状況確認画面](#注文状況確認画面)
- [受取完了](#受取完了)
- [キャンセル注文の表示](#キャンセル注文の表示)
- [注文履歴確認画面](#注文履歴確認画面)

### 商品選択画面
　一般ユーザー用の画面であるため、一般ユーザーでのログインが必要<br>

- /menuにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadProductsを実行する<br>
　　GET /api/productsでリクエスト送信<br>
  <br>
  Java側<br>
　`ProductController`<br>
　　GET /api/productsのリクエストを受け取る<br>
　　ProductServiceへ処理を渡す<br>
　`ProductService`<br>
　　公開中の商品を取得する<br>
　　平均評価、レビュー件数、注文数を付けてProductResponseに変換する<br>
　　React側へ商品一覧を返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　取得した商品一覧をproductsに保存する<br>
　　MenuPageへproductsを渡す<br>
　`MenuPageコンポーネント`<br>
　　商品カードを表示する<br><br>

- ここで確認すること<br>
　商品一覧はJava側から取得する<br>
　非公開の商品は一般ユーザーの商品選択画面には表示しない<br>
　商品カードには商品名、カテゴリ、評価、価格を表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/MenuPage.jsx<br>
　mobileorder-react/src/components/ProductVisual.jsx<br>
　mobileorder-react/src/components/RatingStars.jsx<br>
  <br>
  Java側<br>
　controller/ProductController.java<br>
　service/ProductService.java<br>
　dto/ProductResponse.java<br>

### 商品検索とカテゴリ絞り込み
　商品検索とカテゴリ絞り込みでは、取得済みの商品一覧をReact側で絞り込む<br>

- 検索文字を入力した場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　検索文字をsearchTextとしてstateで管理する<br>
　　商品名、カテゴリ、説明文に検索文字が含まれるか確認する<br>
　　条件に合う商品だけを表示する<br>
　　検索結果がない場合は「検索条件に一致する商品はありません。」と表示する<br><br>

- カテゴリを選択した場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　選択中カテゴリをcategoryとしてstateで管理する<br>
　　すべての場合は全商品を表示する<br>
　　カテゴリが選ばれている場合は、そのカテゴリの商品だけを表示する<br>
　　`検索文字がなくカテゴリの商品もない場合 `
　　　「「カテゴリ名」のカテゴリの商品は準備中です。」と表示する<br><br>

- ここで確認すること<br>
　検索とカテゴリ絞り込みはReact側で行っている<br>
　`検索文字が入力されている状態で商品が見つからない場合:`<br>
　　「検索条件に一致する商品はありません。」と表示する（商品検索 練習問題5-1-7-1）<br>
　`検索文字が入力されていない状態でカテゴリの商品が見つからない場合:`<br>
　　「「カテゴリ名」のカテゴリの商品は準備中です。」と表示する（カテゴリの絞り込み 練習問題5-1-8-1）<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/MenuPage.jsx<br>

### 商品詳細モーダル
　選択した商品の詳細確認と数量選択を行う詳細モーダル<br>

- 商品カードを押した場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　選択した商品をselectedProductに保存する<br>
　　selectedProductがある場合だけProductDetailModalを表示する<br><br>

- 数量を変更した場合<br>
  React側<br>
　`ProductDetailModal`<br>
　　quantityをstateで管理する<br>
　　-ボタンで数量を減らす<br>
　　+ボタンで数量を増やす<br>
　　在庫数を超えないように制御する<br><br>

- ここで確認すること<br>
　商品詳細モーダルはMenuPage内で扱っている<br>
　商品在庫が0の場合はカート追加ボタンを非活性にする<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/MenuPage.jsx<br>

### カート追加
　選択した商品と数量をAppコンポーネントのcartに保存する<br>

- カートに追加するボタンを押した場合<br>
  React側<br>
　`ProductDetailModal`<br>
　　選択した商品と数量をMenuPageへ渡す<br>
　`MenuPageコンポーネント`<br>
　　AppコンポーネントのaddToCartへ商品と数量を渡す<br>
　　商品詳細モーダルを閉じる<br>
　`Appコンポーネント`<br>
　　同じ商品がある場合は既存数量に追加する<br>
　　同じ商品がない場合は商品情報と数量をcartに追加する<br>
　　在庫数を超えないように数量を調整する<br><br>

- カートに商品がある場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　画面下部にカートバーを表示する<br>
　　商品点数と合計金額を表示する<br>
　　注文確認へ進むボタンを表示する<br><br>

- ここで確認すること<br>
　cartはAppコンポーネントで管理している<br>
　MenuPageはcartを受け取って画面に表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/MenuPage.jsx<br>

### 注文確認画面
　カート内の商品、数量、受け取り日時、合計金額を確認する画面<br>

- /order-confirmにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　OrderConfirmPageへcartを渡す<br>
　　onChangeQuantity、onRemove、onSubmitOrder、onConfirmを渡す<br>
　`OrderConfirmPageコンポーネント`<br>
　　カート内の商品、数量、合計金額を表示する<br>
　　画面説明文を表示する<br><br>

- カートが空の場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　注文する商品が選択されていないメッセージを表示する<br>
　　商品選択画面へ戻るボタンを表示する<br><br>

- ここで確認すること<br>
　`注文確認画面の案内文:`
　　「内容と受け取り日時を確認して、注文を確定してみましょう。」に変更する（注文確認画面 練習問題5-1-8-1）<br>
　注文確認画面ではcartの内容を確認できる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>

### 注文商品の数量変更
　カート内商品の数量を変更できる機能を追加<br>

- 数量を変更した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　変更後の数量をAppコンポーネントへ渡す<br>
　`Appコンポーネント`<br>
　　changeQuantityを実行する<br>
　　数量が0以下の場合はカートから削除する<br>
　　数量が1以上の場合はカート内の数量を更新する<br>
　　数量を1以上に保持する<br>
　　在庫数を超えないように調整する<br><br>

- ここで確認すること<br>
　数量変更時は数量を1以上に保持する（注文商品の数量変更 練習問題5-1-15-1）<br>
　画面側の-ボタンは数量が1以下の場合に非活性になる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>

### 注文商品の削除
　商品をカートから削除できる機能

- 削除ボタンを押した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　onConfirmで商品の削除確認モーダルを表示する（注文商品の削除 練習問題5-1-16-1）<br>
　　確定時にonRemoveへ商品IDを渡す<br>
　`Appコンポーネント`<br>
　　removeFromCartを実行する<br>
　　対象の商品をcartから削除する<br><br>

- ここで確認すること<br>
　OrderConfirmPageはAppコンポーネントからonConfirmをpropsで受け取っている<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>
　mobileorder-react/src/components/ConfirmModal.jsx<br>

### 受け取り日時の選択
　現在時刻から4時間後までを10分単位で選択する<br>

- 注文確認画面を表示した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　buildPickupOptionsで受け取り日時の選択肢を作成する<br>
　　現在時刻から次の10分単位の時刻を開始にする<br>
　　現在時刻から4時間後までの時刻を作成する<br>
　　10分ごとの時刻を選択肢として表示する<br><br>

- 日付をまたぐ場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　受け取り日の選択肢に翌日の日付も表示する<br>
　　選択した日付に対応する時刻だけを表示する<br><br>

- ここで確認すること<br>
　受け取り日時の候補はReact側で作成している<br>
　最終的な受け取り日時チェックはJava側でも行っている<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>

### 注文確定
　カート内容と受け取り日時をJava側へ送信する処理

- 注文を確定するボタンを押した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　onConfirmで注文確定の確認モーダルを表示する（注文登録の業務ロジック3 練習問題5-1-27-1）<br>
　　確定時にpickupAtをAppコンポーネントへ渡す<br>
　`Appコンポーネント`<br>
　　submitOrderを実行する<br>
　　cartからproductIdとquantityを作成する<br>
　　POST /api/ordersでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　POST /api/ordersのリクエストを受け取る<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　OrderServiceへ処理を渡す<br>
　`OrderService`<br>
　　「MOBILE-CODE-######」形式の注文番号を生成する<br>
　　受け取り日時が現在から4時間以内か確認する<br>
　　商品IDをもとに商品を取得する<br>
　　商品が公開中か確認する<br>
　　在庫数が足りるか確認する<br>
　　商品在庫を減らす<br>
　　OrderItemとして注文商品を追加する<br>
　　合計金額を計算する<br>
　　MobileOrderとして保存する<br>
　　OrderResponseに変換してReact側へ返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　返ってきた注文情報をlatestOrderに保存する<br>
　　cartを空にする<br>
　　/order-completeへ移動する<br><br>

- ここで確認すること<br>
　注文登録時の最終チェックはJava側で行っている<br>
　注文番号はJava側で生成している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　dto/OrderRequest.java<br>
　dto/OrderResponse.java<br>

### 注文完了画面
　直前に登録した注文情報を表示する<br>

- 注文登録に成功した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　latestOrderに注文情報を保存する<br>
　　/order-completeへ移動する<br>
　　OrderCompletePageへlatestOrderを渡す<br><br>

- /order-completeを表示した場合<br>
  React側<br>
　`OrderCompletePageコンポーネント`<br>
　　注文完了メッセージを表示する<br>
　　注文番号を表示する<br>
　　受け取り日時を表示する<br>
　　合計金額を表示する<br>
　　続けて注文するボタンを表示する<br>
　　注文履歴を見るボタンを表示する<br><br>

- ここで確認すること<br>
　注文完了画面の案内文を要件に合わせて修正する（注文完了画面の表示 練習問題5-1-28-1）<br>
　注文番号は「MOBILE-CODE-######」形式で表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/OrderCompletePage.jsx<br>

### 注文状況確認画面
　現在進行中の注文と受取完了可能な注文を確認できる画面<br>

- /order-statusにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadActiveOrdersを実行する<br>
　　GET /api/orders/activeでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　GET /api/orders/activeのリクエストを受け取る<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　OrderServiceへ処理を渡す<br>
　`OrderService`<br>
　　ログイン中ユーザーの注文を取得する<br>
　　進行中の注文を返す<br>
　　受取完了後も10分間は表示対象にする<br>
　　OrderResponseに変換してReact側へ返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　取得した注文一覧をordersに保存する<br>
　　OrderStatusPageへordersを渡す<br>
　`OrderStatusPageコンポーネント`<br>
　　注文番号、注文日時、受取日時、ステータス、商品名、数量、合計金額を表示する<br><br>

- ここで確認すること<br>
　注文状況確認画面は進行中の注文を確認する画面<br>
　受取完了後の注文も10分間は注文状況確認画面に表示される<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/OrderStatusPage.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　dto/OrderResponse.java<br>

### 受取完了
　提供済みの注文を一般ユーザーが受取完了に更新できる処理<br>

- 提供済みの注文がある場合<br>
  React側<br>
　`OrderStatusPageコンポーネント`<br>
　　ステータスがSERVEDの場合に受取完了ボタンを表示する<br>
　　提供済み専用のステータス文言を表示する<br><br>

- 受取完了ボタンを押した場合<br>
  React側<br>
　`OrderStatusPageコンポーネント`<br>
　　onConfirmで受取完了の確認モーダルを表示する<br>
　　確定時に注文番号をAppコンポーネントへ渡す<br>
　`Appコンポーネント`<br>
　　POST /api/orders/{orderNumber}/receivedでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　受取完了リクエストを受け取る<br>
　　OrderServiceへ処理を渡す<br>
　`OrderService`<br>
　　ログイン中ユーザー本人の注文か確認する<br>
　　ステータスがSERVEDか確認する<br>
　　条件を満たす場合はRECEIVEDに更新する<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　更新後の注文情報をordersに反映する<br><br>

- ここで確認すること<br>
　`注文ステータスが提供済みの場合`
　　専用の文言を表示する（注文提供済み 練習問題5-1-34-1）<br>
　`受取完了ボタンを押したとき`
　　確認モーダルを表示する（注文提供済み 練習問題5-1-34-2）<br>
　受取完了にできるのは提供済みの注文だけ<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/OrderStatusPage.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>

### キャンセル注文の表示
　店舗からの連絡としてキャンセル理由を表示する<br>

- キャンセルされた注文がある場合<br>
  React側<br>
　`OrderStatusPageコンポーネント`<br>
　　注文商品見出しを表示する<br>
　　合計金額のレイアウトを整えて表示する<br>
　　ステータス文言を合計金額の下に表示する<br>
　　店舗担当者とキャンセル理由を表示する<br>
　`HistoryPageコンポーネント`<br>
　　注文履歴詳細モーダルにも店舗担当者とキャンセル理由を表示する<br><br>

- ここで確認すること<br>
　キャンセルされた注文では店舗担当者とキャンセル理由を表示する（注文キャンセル 練習問題5-1-33-1）<br>
　ステータス文言とキャンセル時の文言は合計金額の下に表示する（注文キャンセル 練習問題5-1-33-2）<br>
　注文商品の前に「注文商品:」の見出しを表示する（注文キャンセル 練習問題5-1-33-3）<br>
　合計金額の表示レイアウトを整える（注文キャンセル 練習問題5-1-33-4）<br>
　管理者ユーザー名は一般ユーザー画面では店舗担当者として表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/OrderStatusPage.jsx<br>
　mobileorder-react/src/pages/HistoryPage.jsx<br>

### 注文履歴確認画面
　過去の注文も含めて注文内容を確認できる画面<br>

- /historyにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadHistoryとしてloadOrdersを実行する<br>
　　GET /api/ordersでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　GET /api/ordersのリクエストを受け取る<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　OrderServiceへ処理を渡す<br>
　`OrderService`<br>
　　ログイン中ユーザーの注文履歴を取得する<br>
　　新しい注文から順番に並べる<br>
　　OrderResponseに変換してReact側へ返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　取得した注文一覧をordersに保存する<br>
　　HistoryPageへordersを渡す<br>
　`HistoryPageコンポーネント`<br>
　　注文状況カードに近いレイアウトで注文履歴カードを表示する<br><br>

- 注文履歴カードを押した場合<br>
  React側<br>
　`HistoryPageコンポーネント`<br>
　　選択した注文をselectedOrderに保存する<br>
　　OrderDetailModalを表示する<br><br>

- ここで確認すること<br>
　注文履歴カードは注文状況確認画面の注文状況カードのレイアウトに合わせる（注文履歴確認画面 練習問題5-1-37-1）<br>
　注文状況確認画面は進行中の注文、注文履歴確認画面は過去の注文も含めて表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/HistoryPage.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　repository/MobileOrderRepository.java<br>
