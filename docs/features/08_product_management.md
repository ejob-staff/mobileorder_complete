## 8章.商品管理機能
### 商品管理機能とは
　管理者ユーザーが商品情報を管理する<br>

- [この章について](#この章について)
- [商品管理機能について](#商品管理機能について)
- [商品管理画面](#商品管理画面)
- [商品一覧の取得](#商品一覧の取得)
- [商品検索とカテゴリ絞り込み](#商品検索とカテゴリ絞り込み)
- [商品登録画面](#商品登録画面)
- [商品編集画面](#商品編集画面)
- [商品登録更新API](#商品登録更新API)
- [公開状態の切り替え](#公開状態の切り替え)
- [商品削除](#商品削除)
- [商品管理で使う主なデータ](#商品管理で使う主なデータ)
- [商品管理機能のエラー表示](#商品管理機能のエラー表示)
- [商品管理機能のまとめ](#商品管理機能のまとめ)

### 商品管理画面
　登録済みの商品と実績情報を一覧表示する<br>

- /admin/productsにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadProductsを実行する<br>
　　管理者ユーザーの場合はGET /api/admin/productsでリクエスト送信<br>
　　取得したproductsをAdminProductsPageへ渡す<br>
　`AdminProductsPageコンポーネント`<br>
　　商品カードを一覧表示する<br>
　　商品名、説明、価格、カテゴリ、在庫、公開状態を表示する<br>
　　評価、レビュー件数、注文数を表示する<br>
　　商品登録、商品編集、公開状態変更、商品削除の操作を表示する<br><br>

- ここで確認すること<br>
　商品管理画面は管理者ユーザーだけが表示できる<br>
　管理者側では公開中、非公開の両方の商品を取得する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminProductsPage.jsx<br>
  <br>
  Java側<br>
　controller/ProductController.java<br>
　service/ProductService.java<br>

### 商品一覧の取得
商品一覧の取得では、管理者用APIから全商品を取得する<br>

- GET /api/admin/productsを呼び出した場合<br>
  Java側<br>
　`ProductController`<br>
　　管理者用の商品一覧リクエストを受け取る<br>
　　ProductServiceへ処理を渡す<br>
　`ProductService`<br>
　　全商品を取得する<br>
　　平均評価、レビュー件数、注文数を付けてProductResponseに変換する<br>
　　注文数、平均評価、IDの順で並び替える<br><br>

- ここで確認すること<br>
　一般ユーザー用のGET /api/productsは公開中の商品だけを返す<br>
　管理者用のGET /api/admin/productsは非公開の商品も含めて返す<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/ProductController.java<br>
　service/ProductService.java<br>
　dto/ProductResponse.java<br>

### 商品検索とカテゴリ絞り込み
商品検索とカテゴリ絞り込みでは、取得済みの商品一覧をReact側で絞り込む<br>

- 検索文字を入力した場合<br>
  React側<br>
　`AdminProductsPageコンポーネント`<br>
　　検索文字をsearchTextとしてstateで管理する<br>
　　商品名、カテゴリ、説明文に検索文字が含まれるか確認する<br>
　　条件に合う商品だけを表示する<br>

- カテゴリを選択した場合<br>
  React側<br>
　`AdminProductsPageコンポーネント`<br>
　　選択中カテゴリをcategoryとしてstateで管理する<br>
　　すべての場合は全商品を表示する<br>
　　カテゴリが選ばれている場合は、そのカテゴリの商品だけを表示する<br><br>

- ここで確認すること<br>
　検索とカテゴリ絞り込みはReact側で行っている<br>
　検索結果がない場合とカテゴリ内商品がない場合で表示文言を切り替えている<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AdminProductsPage.jsx<br>

### 商品登録画面
商品登録画面では、新しい商品情報を入力して登録する<br>

- /admin/products/newにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　ProductFormPageにmode=createを渡す<br>
　`ProductFormPageコンポーネント`<br>
　　商品名を入力する<br>
　　説明文を入力する<br>
　　カテゴリを選択する<br>
　　表示用アクセントを選択する<br>
　　価格を入力する<br>
　　在庫数を入力する<br>
　　公開状態を入力する<br>
　　登録前に確認モーダルを表示する<br><br>

- ここで確認すること<br>
　登録完了後は商品管理画面へ戻る<br>
　ProductFormPageは登録と編集で共通利用している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/ProductFormPage.jsx<br>

### 商品編集画面
商品編集画面では、既存の商品情報を編集する<br>

- /admin/products/edit/:idにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　URLから編集対象の商品IDを取得する<br>
　　productsから編集対象の商品を探す<br>
　　ProductFormPageにmode=editとproductを渡す<br>
　`ProductFormPageコンポーネント`<br>
　　既存の商品情報をformに反映する<br>
　　編集反映前に確認モーダルを表示する<br>
　　キャンセル時にも確認モーダルを表示する<br><br>

- ここで確認すること<br>
　編集反映後は商品管理画面へ戻る<br>
　編集画面でも商品登録画面と同じ入力項目を使う<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/ProductFormPage.jsx<br>

### 商品登録更新API
商品登録更新APIでは、商品情報をDBへ保存する<br>

- POST /api/admin/productsを呼び出した場合<br>
  Java側<br>
　`ProductController`<br>
　　ProductRequestを受け取る<br>
　　ProductServiceへ登録処理を渡す<br>
　`ProductService`<br>
　　Productを作成して保存する<br>
　　ProductResponseへ変換して返す<br>

- PUT /api/admin/products/{id}を呼び出した場合<br>
  Java側<br>
　`ProductController`<br>
　　商品IDとProductRequestを受け取る<br>
　　ProductServiceへ更新処理を渡す<br>
　`ProductService`<br>
　　商品IDでProductを検索する<br>
　　商品情報を更新する<br>
　　ProductResponseへ変換して返す<br><br>

- ここで確認すること<br>
　商品登録と商品更新はProductRequestを使う<br>
　価格と在庫数はReact側でNumberに変換して送信する<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/ProductController.java<br>
　service/ProductService.java<br>
　dto/ProductRequest.java<br>
　dto/ProductResponse.java<br>

### 公開状態の切り替え
公開状態の切り替えでは、商品を一般ユーザー画面に表示するかどうかを変更する<br>

- 公開状態変更ボタンを押した場合<br>
  React側<br>
　`AdminProductsPageコンポーネント`<br>
　　公開設定の変更確認モーダルを表示する<br>
　　確定時にonTogglePublishedへ商品IDを渡す<br>
　`Appコンポーネント`<br>
　　POST /api/admin/products/{id}/toggle-publishedでリクエスト送信<br>
  <br>
  Java側<br>
　`ProductService`<br>
　　商品IDでProductを検索する<br>
　　公開状態を反転する<br>
　　ProductResponseへ変換して返す<br><br>

- ここで確認すること<br>
　非公開の商品は一般ユーザーの商品選択画面に表示されない<br>
　公開状態変更前に確認モーダルを表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminProductsPage.jsx<br>
  <br>
  Java側<br>
　controller/ProductController.java<br>
　service/ProductService.java<br>

### 商品削除
商品削除では、確認モーダルを表示してから商品を削除する<br>

- 商品削除ボタンを押した場合<br>
  React側<br>
　`AdminProductsPageコンポーネント`<br>
　　商品削除の確認モーダルを表示する<br>
　　確定時にonDeleteへ商品IDを渡す<br>
　`Appコンポーネント`<br>
　　DELETE /api/admin/products/{id}でリクエスト送信<br>
　　productsから対象商品を削除する<br>
　　cartからも対象商品を削除する<br>
  <br>
  Java側<br>
　`ProductService`<br>
　　商品IDで商品を削除する<br><br>

- ここで確認すること<br>
　削除前には「商品情報テーブルに登録されている商品ですが、本当に削除してもよろしいでしょうか。」で確認する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminProductsPage.jsx<br>
  <br>
  Java側<br>
　controller/ProductController.java<br>
　service/ProductService.java<br>

### 商品管理で使う主なデータ
- `ProductRequest`<br>
　商品登録、商品更新APIへ送る商品情報<br>
　name、description、category、price、stock、published、accentを持つ<br>
  <br>
- `ProductResponse`<br>
　商品情報をReact側へ返すDTO<br>
　平均評価、レビュー件数、注文数も含む<br>
  <br>
- `Product`<br>
　productテーブルに対応する商品Entity<br>
　公開状態や在庫数を持つ<br>

### 商品管理機能のエラー表示
- 主なエラー例<br>
　商品が見つからない<br>
　入力項目が未入力になっている<br>
　価格や在庫数が不正な値になっている<br><br>

- ここで確認すること<br>
　Java側で返したmessageはapiRequestを通して画面に表示する<br>
　入力チェックはProductRequestのバリデーションも使う<br>

### 商品管理機能のまとめ
管理者ユーザーは全商品を確認できる<br>
商品登録、商品編集、商品削除ができる<br>
商品の公開 / 非公開を切り替えできる<br>
非公開の商品は一般ユーザーの商品選択画面には表示されない<br>
商品一覧には評価、レビュー件数、注文数も表示する<br>
