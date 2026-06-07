## 5章.注文機能
- [商品選択画面](#商品選択画面)
- [商品詳細モーダル](#商品詳細モーダル)
- [カート追加](#カート追加)
- [注文確認画面](#注文確認画面)
- [受け取り日時の選択](#受け取り日時の選択)
- [注文確定](#注文確定)
- [注文完了画面](#注文完了画面)
- [注文状況確認画面](#注文状況確認画面)
- [注文履歴確認画面](#注文履歴確認画面)
- [注文機能で使う主なデータ](#注文機能で使う主なデータ)
- [注文機能のエラー表示](#注文機能のエラー表示)

### 商品選択画面
商品選択画面は一般ユーザー用の画面であるため<br>
一般ユーザーでのログインが必要<br>

- /menuにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadProductsを実行する<br>
　　GET /api/productsでリクエスト送信<br>
  <br>
  Java側<br>
　`ProductController`<br>
　　GET /api/productsのリクエスト受取<br>
　　`ProductService`<br>
　　　公開中の商品を取得<br>
　　　平均評価、レビュー件数、注文数を付けてProductResponseに変換<br>
　　　`ProductResponse`<br>
　　　　商品一覧のレスポンス用DTO<br>
　　→React側へ商品一覧を返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　取得した商品一覧をproductsに保存する<br>
　　MenuPageコンポーネントへproductsを渡す<br>
　　`MenuPageコンポーネント`<br>
　　　商品カードを表示する<br>
  <br>
- 検索機能を使用する場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　検索文字をsearchTextとしてstateで管理する<br>
　　商品名、カテゴリ、説明文に検索文字が含まれるか確認する<br>
　　条件に合う商品だけを表示する<br>
  <br>
- カテゴリを選択した場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　選択中カテゴリをcategoryとしてstateで管理する<br>
　　すべての場合は全商品を表示する<br>
　　カテゴリが選ばれている場合は、そのカテゴリの商品だけを表示する<br>
  <br>
- 商品カードを押した場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　選択した商品をselectedProductに保存する<br>
　　`ProductDetailModal`を表示する<br>
  <br>
- ここで確認すること<br>
　商品一覧はJava側から取得する<br>
　検索とカテゴリ絞り込みはReact側で行っている<br>
　非公開の商品は一般ユーザーの商品選択画面には表示しない<br>
  <br>
- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/MenuPage.jsx<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/components/ProductVisual.jsx<br>
　mobileorder-react/src/components/RatingStars.jsx<br>
  <br>
  Java側<br>
　controller/ProductController.java<br>
　service/ProductService.java<br>
　dto/ProductResponse.java<br>
　repository/ProductRepository.java<br>
　repository/ProductReviewRepository.java<br>
　repository/MobileOrderRepository.java<br>

### 商品詳細モーダル
商品詳細モーダルでは、商品カードで選択した商品の詳細確認と数量選択を行う<br>

- 商品カードを押した場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　選択した商品をselectedProductに保存する<br>
　　selectedProductがある場合だけ`ProductDetailModal`を表示する<br>

- 数量を変更した場合<br>
  React側<br>
　`ProductDetailModal`<br>
　　quantityをstateで管理する<br>
　　-ボタンで数量を減らす<br>
　　+ボタンで数量を増やす<br>
　　在庫数を超えないように制御する<br>

- カートに追加するボタンを押した場合<br>
  React側<br>
　`ProductDetailModal`<br>
　　選択した商品と数量を`MenuPageコンポーネント`へ渡す<br>
　`MenuPageコンポーネント`<br>
　　`Appコンポーネント`のaddToCartへ商品と数量を渡す<br>
　　商品詳細モーダルを閉じる<br>

- ここで確認すること<br>
　商品詳細モーダルは`MenuPageコンポーネント`内で扱っている<br>
　カート情報そのものは`Appコンポーネント`で管理している<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/MenuPage.jsx<br>
　mobileorder-react/src/App.jsx<br>

### カート追加
カート追加では、選択した商品と数量をアプリ全体のcartに保存する<br>

- 商品をカートに追加した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　addToCartを実行する<br>
　　同じ商品がカートにあるか確認する<br>
　　同じ商品がある場合:<br>
　　　既存の数量に追加数量を足す<br>
　　　在庫数を超えないように調整する<br>
　　同じ商品がない場合:<br>
　　　商品情報と数量をcartに追加する<br>
  <br>
- カートに商品がある場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　画面下部にカートバーを表示する<br>
　　商品点数と合計金額を表示する<br>
　　注文確認へ進むボタンを表示する<br>
  <br>
- 注文確認へ進むボタンを押した場合<br>
  React側<br>
　`MenuPageコンポーネント`<br>
　　/order-confirmへ移動する<br>
  <br>
- ここで確認すること<br>
　cartは`Appコンポーネント`で管理している<br>
　`MenuPageコンポーネント`はcartを受け取って画面に表示している<br>
  <br>
- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/MenuPage.jsx<br>

### 注文確認画面
注文確認画面では、カート内の商品、数量、受け取り日時、合計金額を確認する<br>

- /order-confirmにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　`OrderConfirmPageコンポーネント`へcartを渡す<br>
　`OrderConfirmPageコンポーネント`<br>
　　カート内の商品、数量、合計金額を表示する<br>

- カートが空の場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　注文する商品が選択されていないメッセージを表示する<br>
　　商品選択画面へ戻るボタンを表示する<br>

- 数量を変更した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　変更後の数量を`Appコンポーネント`へ渡す<br>
　`Appコンポーネント`<br>
　　changeQuantityを実行する<br>
　　数量が0以下の場合はカートから削除する<br>
　　数量が1以上の場合はカート内の数量を更新する<br>
　　在庫数を超えないように調整する<br>

- 削除ボタンを押した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　削除対象の商品IDを`Appコンポーネント`へ渡す<br>
　`Appコンポーネント`<br>
　　removeFromCartを実行する<br>
　　対象の商品をカートから削除する<br>

- ここで確認すること<br>
　注文確認画面ではcartの内容を確認、変更、削除できる<br>
　数量変更や削除の本処理は`Appコンポーネント`で行っている<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>
　mobileorder-react/src/App.jsx<br>

### 受け取り日時の選択
受け取り日時は、現在時刻から4時間後までを10分単位で選択する<br>

- 注文確認画面を表示した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　buildPickupOptionsで受け取り日時の選択肢を作成する<br>
　　現在時刻から次の10分単位の時刻を開始にする<br>
　　現在時刻から4時間後までの時刻を作成する<br>
　　10分ごとの時刻を選択肢として表示する<br>

- 日付をまたぐ場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　受け取り日の選択肢に翌日の日付も表示する<br>
　　選択した日付に対応する時刻だけを表示する<br>

- 日付が1つだけの場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　受け取り日のselectを非活性にする<br>

- 注文を確定する場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　選択した日付と時刻をpickupAtとして作成する<br>
　　`Appコンポーネント`のsubmitOrderへpickupAtを渡す<br>

- ここで確認すること<br>
　受け取り日時の候補はReact側で作成している<br>
　最終的な受け取り日時チェックはJava側でも行っている<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>

### 注文確定
注文確定では、カート内容と受け取り日時をJava側へ送信して注文を登録する<br>

- 注文を確定するボタンを押した場合<br>
  React側<br>
　`OrderConfirmPageコンポーネント`<br>
　　pickupAtを`Appコンポーネント`へ渡す<br>
　`Appコンポーネント`<br>
　　submitOrderを実行する<br>
　　cartからproductIdとquantityを作成する<br>
　　POST /api/ordersでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　POST /api/ordersのリクエスト受取<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　`OrderService`へ処理を渡す<br>
　`OrderService`<br>
　　MOBILE-CODE-######形式の注文番号を生成する<br>
　　受け取り日時が現在から4時間以内か確認する<br>
　　商品IDをもとに商品を取得する<br>
　　商品が公開中か確認する<br>
　　在庫数が足りるか確認する<br>
　　商品在庫を減らす<br>
　　`OrderItem`として注文商品を追加する<br>
　　合計金額を計算する<br>
　　`MobileOrder`として保存する<br>
　　`OrderResponse`に変換してReact側へ返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　返ってきた注文情報をlatestOrderに保存する<br>
　　cartを空にする<br>
　　/order-completeへ移動する<br>

- 注文登録に失敗した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　Java側から返されたmessageを表示する<br>

- ここで確認すること<br>
　React側でも入力制御をしている<br>
　注文登録時の最終チェックはJava側で行っている<br>
　注文番号はJava側で生成している<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/OrderConfirmPage.jsx<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　dto/OrderRequest.java<br>
　dto/OrderResponse.java<br>
　entity/MobileOrder.java<br>
　entity/OrderItem.java<br>
　repository/ProductRepository.java<br>
　repository/MobileOrderRepository.java<br>

### 注文完了画面
注文完了画面では、直前に登録した注文情報を表示する<br>

- 注文登録に成功した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　latestOrderに注文情報を保存する<br>
　　/order-completeへ移動する<br>
　　`OrderCompletePageコンポーネント`へlatestOrderを渡す<br>

- /order-completeを表示した場合<br>
  React側<br>
　`OrderCompletePageコンポーネント`<br>
　　注文完了メッセージを表示する<br>
　　注文番号を表示する<br>
　　受け取り日時を表示する<br>
　　合計金額を表示する<br>
　　続けて注文するボタンを表示する<br>
　　注文履歴を見るボタンを表示する<br>

- ここで確認すること<br>
　注文完了画面は直前に登録したlatestOrderを表示している<br>
　注文番号はMOBILE-CODE-######形式で表示する<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/OrderCompletePage.jsx<br>
　mobileorder-react/src/App.jsx<br>

### 注文状況確認画面
注文状況確認画面では、現在進行中の注文と受取完了可能な注文を確認する<br>

- /order-statusにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadActiveOrdersを実行する<br>
　　GET /api/orders/activeでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　GET /api/orders/activeのリクエスト受取<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　`OrderService`へ処理を渡す<br>
　`OrderService`<br>
　　ログイン中ユーザーの注文を取得する<br>
　　進行中の注文を返す<br>
　　受取完了後も10分間は表示対象にする<br>
　　`OrderResponse`に変換してReact側へ返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　取得した注文一覧をordersに保存する<br>
　　`OrderStatusPageコンポーネント`へordersを渡す<br>
　`OrderStatusPageコンポーネント`<br>
　　注文番号、注文日時、受取日時、ステータス、商品名、数量、合計金額を表示する<br>

- 提供済みの注文がある場合<br>
  React側<br>
　`OrderStatusPageコンポーネント`<br>
　　受取完了ボタンを表示する<br>

- 受取完了ボタンを押した場合<br>
  React側<br>
　`OrderStatusPageコンポーネント`<br>
　　注文番号を`Appコンポーネント`へ渡す<br>
　`Appコンポーネント`<br>
　　POST /api/orders/{orderNumber}/receivedでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　受取完了リクエストを受け取る<br>
　　`OrderService`へ処理を渡す<br>
　`OrderService`<br>
　　ログイン中ユーザー本人の注文か確認する<br>
　　ステータスがSERVEDか確認する<br>
　　条件を満たす場合はRECEIVEDに更新する<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　更新後の注文情報をordersに反映する<br>

- ここで確認すること<br>
　注文状況確認画面は進行中の注文を確認する画面<br>
　受取完了にできるのは、提供済みの注文だけ<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/OrderStatusPage.jsx<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　dto/OrderResponse.java<br>

### 注文履歴確認画面
注文履歴確認画面では、過去の注文も含めて注文内容を確認する<br>

- /historyにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadHistoryを実行する<br>
　　GET /api/ordersでリクエスト送信<br>
  <br>
  Java側<br>
　`OrderController`<br>
　　GET /api/ordersのリクエスト受取<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　`OrderService`へ処理を渡す<br>
　`OrderService`<br>
　　ログイン中ユーザーの注文履歴を取得する<br>
　　新しい注文から順番に並べる<br>
　　`OrderResponse`に変換してReact側へ返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　取得した注文一覧をordersに保存する<br>
　　`HistoryPageコンポーネント`へordersを渡す<br>
　`HistoryPageコンポーネント`<br>
　　注文履歴カードを表示する<br>

- 注文履歴カードを押した場合<br>
  React側<br>
　`HistoryPageコンポーネント`<br>
　　選択した注文をselectedOrderに保存する<br>
　　`OrderDetailModal`を表示する<br>

- 注文詳細モーダルを表示する場合<br>
  React側<br>
　`OrderDetailModal`<br>
　　注文番号、注文日時、受け取り日時、合計金額、ステータス、商品一覧を表示する<br>
　　キャンセルされた注文の場合は店舗からの連絡も表示する<br>

- ここで確認すること<br>
　注文状況確認画面は進行中の注文を表示する<br>
　注文履歴確認画面は過去の注文も含めて表示する<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/HistoryPage.jsx<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/OrderController.java<br>
　service/OrderService.java<br>
　repository/MobileOrderRepository.java<br>
　dto/OrderResponse.java<br>

### 注文機能で使う主なデータ
- `ProductResponse`<br>
　商品一覧APIからReact側へ返す商品情報<br>
　商品カード、商品詳細モーダルで利用する<br>
  <br>
- `OrderRequest`<br>
　注文登録APIへ送る注文内容<br>
　itemsとpickupAtを持つ<br>
  <br>
- `OrderResponse`<br>
　注文情報をReact側へ返すDTO<br>
　注文完了画面、注文状況確認画面、注文履歴確認画面で利用する<br>
  <br>
- `MobileOrder`<br>
　mobile_orderテーブルに対応する注文Entity<br>
　注文番号、ユーザー名、注文日時、受け取り日時、合計金額、ステータスを持つ<br>
  <br>
- `OrderItem`<br>
　order_itemテーブルに対応する注文商品Entity<br>
　商品ID、商品名、価格、数量を持つ<br>
  <br>
- `OrderStatus`<br>
　注文ステータスを表すenum<br>
　PENDING、COOKING、READY、SERVED、RECEIVED、CANCELEDを扱う<br>

### 注文機能のエラー表示
- Java側で条件を満たさない場合<br>
  Java側<br>
　`OrderService`<br>
　　IllegalArgumentExceptionを投げる<br>
　`ApiExceptionHandler`<br>
　　messageとしてReact側へ返す<br>
  <br>
  React側<br>
　`apiRequest`<br>
　　messageを読み取る<br>
　画面側:<br>
　　エラーメッセージを表示する<br>
  <br>
- 主なエラー例<br>
　受け取り日時が現在から4時間後を超えている<br>
　商品が見つからない<br>
　非公開の商品を注文しようとしている<br>
　在庫数が不足している<br>
　提供済みではない注文を受取完了にしようとしている<br>
