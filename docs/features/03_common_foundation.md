## 3-1.共通基盤と画面遷移
### 共通基盤と画面遷移とは
　システム全体で共通して利用する機能や仕組みをまとめたもの

### 目次
- [設計資料](#設計資料)
- [React側ソース](#React側ソース)
- [Java側ソース](#Java側ソース)
- [各画面のURL](#各画面のURL)
- [Reactアプリ全体の中心](#Reactアプリ全体の中心)
- [ログイン状態の確認](#ログイン状態の確認)
- [URLと画面遷移の管理](#URLと画面遷移の管理)
- [ユーザー権限による画面分岐](#ユーザー権限による画面分岐)
- [権限エラー画面](#権限エラー画面)
- [必要なデータの読み込み](#必要なデータの読み込み)
- [共通ヘッダー](#共通ヘッダー)
- [確認モーダル](#確認モーダル)
- [API通信の共通処理](#API通信の共通処理)
- [エラーレスポンス共通化](#エラーレスポンス共通化)
- [SpringSecurityの基本設定](#SpringSecurityの基本設定)
- [共通部品](#共通部品)

### 設計資料
`docs/`<br>
　01_requirements.md ---- 要件定義<br>
　02_basic_design.md ---- 基本設計<br>
　03_detail_design.md --- 詳細設計<br>
　04_database_design.md - DB設計<br><br>
　`features/`<br>
　　03_common_foundation.md -- 共通基盤と画面遷移<br>
　　04_authentication.md ----- 認証機能<br>
　　05_ordering.md ----------- 注文機能<br>
　　06_order_review.md ------- 注文評価機能<br>
　　07_account_management.md - アカウント管理機能<br>
　　08_product_management.md - 商品管理機能<br>
　　09_order_management.md --- 注文対応管理機能<br>
　　10_review_management.md -- 注文評価確認機能<br>
　　11_user_management.md ---- ユーザー管理機能<br>
　　12_order_analytics.md ---- 注文分析機能<br>
　　13_initial_data.md ------- 初期データ登録<br>
　　14_complete_repository.md - 完成版のリポジトリ<br>
　　15_production_deploy.md -- 本番環境へのデプロイ<br>

### React側ソース
`mobileorder-react/src/`<br>
　main.jsx ---------------------- Reactアプリの起動処理<br>
　App.jsx ----------------------- Reactアプリ全体の中心<br>
　App.css ----------------------- 共通CSS<br>
　index.css --------------------- 全体の基本CSS<br><br>
　`api/`<br>
　　client.js --------------------- API通信の共通処理<br><br>
　`components/`<br>
　　Header.jsx -------------------- 共通ヘッダー<br>
　　ConfirmModal.jsx -------------- 確認モーダル<br>
　　RatingStars.jsx --------------- スター評価表示部品<br>
　　ProductVisual.jsx ------------- 商品ビジュアル部品<br><br>
　`pages/`<br>
　　LoginPage.jsx ----------------- ログイン画面<br>
　　SignupPage.jsx ---------------- 新規アカウント作成画面<br>
　　PasswordResetPage.jsx --------- パスワード再設定画面<br>
　　MenuPage.jsx ------------------ 商品選択画面<br>
　　OrderConfirmPage.jsx ---------- 注文確認画面<br>
　　OrderCompletePage.jsx --------- 注文完了画面<br>
　　OrderStatusPage.jsx ----------- 注文状況確認画面<br>
　　HistoryPage.jsx --------------- 注文履歴確認画面<br>
　　ReviewPage.jsx ---------------- 注文評価登録画面<br>
　　AccountPage.jsx --------------- アカウント管理画面<br>
　　AccessDeniedPage.jsx ---------- 権限エラー画面<br><br>
　　`admin/`<br>
　　　AdminProductsPage.jsx --------- 商品管理画面<br>
　　　ProductFormPage.jsx ----------- 商品登録、商品編集画面<br>
　　　AdminOrdersPage.jsx ----------- 注文対応管理画面<br>
　　　AdminReviewsPage.jsx ---------- 注文評価確認画面<br>
　　　AnalyticsPage.jsx ------------- 注文分析画面<br>
　　　UserManagementPage.jsx -------- ユーザー管理画面<br>
　　　AdminUserRegistrationPage.jsx - 新規管理者ユーザー登録画面<br>

### Java側ソース
`src/main/java/jp/co/mobileorder/`<br>
　Application.java ------------------- Spring Bootアプリの起動クラス<br><br>
　`config/`<br>
　　SecurityConfig.java --------------- SpringSecurityの基本設定<br>
　　DataInitializer.java -------------- 初期データ登録<br><br>
　`controller/`<br>
　　AccountController.java ------------ 新規登録、パスワード再設定API<br>
　　AccountProfileController.java ----- アカウント情報API<br>
　　AdminUserController.java ---------- ユーザー管理API<br>
　　AnalyticsController.java ---------- 注文分析API<br>
　　ApiExceptionHandler.java ---------- エラーレスポンス共通化<br>
　　AuthController.java --------------- ログイン状態確認API<br>
　　OrderController.java -------------- 注文API<br>
　　ProductController.java ------------ 商品API<br>
　　ProductReviewController.java ------ 注文評価API<br><br>
　`dto/`<br>
　　AccountResponse.java -------------- アカウント情報レスポンス<br>
　　AccountUpdateRequest.java --------- アカウント更新リクエスト<br>
　　AdminUserRequest.java ------------- 管理者ユーザー登録リクエスト<br>
　　AdminUserResponse.java ------------ ユーザー情報レスポンス<br>
　　AnalyticsResponse.java ------------ 注文分析レスポンス<br>
　　AuthStatusResponse.java ----------- ログイン状態レスポンス<br>
　　LoginCheckRequest.java ------------ ログイン確認リクエスト<br>
　　OrderRequest.java ----------------- 注文登録リクエスト<br>
　　OrderResponse.java ---------------- 注文情報レスポンス<br>
　　OrderStatusUpdateRequest.java ----- 注文ステータス更新リクエスト<br>
　　PasswordResetRequest.java --------- パスワード再設定リクエスト<br>
　　ProductRequest.java --------------- 商品登録、商品更新リクエスト<br>
　　ProductResponse.java -------------- 商品情報レスポンス<br>
　　ProductReviewRequest.java --------- 注文評価登録リクエスト<br>
　　ProductReviewResponse.java -------- 注文評価レスポンス<br>
　　SignupRequest.java ---------------- 新規アカウント作成リクエスト<br>
　　UserManagementCodeResponse.java --- ユーザー管理番号レスポンス<br><br>
　`entity/`<br>
　　AppUser.java ---------------------- ユーザー「app_user」<br>
　　MobileOrder.java ------------------ 注文「mobile_order」<br>
　　OrderItem.java -------------------- 注文商品「order_item」<br>
　　OrderStatus.java ------------------ 注文ステータス「テーブルなし」<br>
　　Product.java ---------------------- 商品「product」<br>
　　ProductReview.java ---------------- 注文評価「product_review」<br>
　　Role.java ------------------------- ユーザー権限「テーブルなし」<br>
　　UserManagementCode.java ----------- ユーザー管理番号「user_management_code」<br><br>
　`repository/`<br>
　　AppUserRepository.java ------------ ユーザーRepository<br>
　　MobileOrderRepository.java -------- 注文Repository<br>
　　ProductRepository.java ------------ 商品Repository<br>
　　ProductReviewRepository.java ------ 注文評価Repository<br>
　　UserManagementCodeRepository.java - 管理番号Repository<br><br>
　`service/`<br>
　　AccountProfileService.java -------- アカウント情報処理<br>
　　AccountService.java --------------- 新規登録、パスワード再設定処理<br>
　　AdminUserService.java ------------- ユーザー管理処理<br>
　　AnalyticsService.java ------------- 注文分析処理<br>
　　AppUserDetailsService.java -------- ログイン時のユーザー情報取得<br>
　　OrderService.java ----------------- 注文処理<br>
　　ProductReviewService.java --------- 注文評価処理<br>
　　ProductService.java --------------- 商品処理<br>

### 各画面のURL
`未ログインの場合`<br>
　/signup -- 新規アカウント作成画面<br>
　/password-reset -- パスワード再設定画面<br>
　/login -- ログイン画面<br><br>

`ログイン済みの場合`
- 管理者ユーザー<br>
　/admin/products -- 商品管理画面<br>
　/admin/orders -- 注文対応管理画面<br>
　/admin/reviews -- 注文評価確認画面<br>
　/admin/analytics -- 注文分析画面<br>
　/admin/users -- ユーザー管理画面<br>
　/admin/users/admin/new -- 新規管理者ユーザー登録画面<br>
　/admin/products/new -- 商品登録画面<br>
　/admin/products/edit/:id -- 商品編集画面<br><br>

- 一般ユーザー<br>
　/menu -- 商品選択画面<br>
　/order-confirm -- 注文確認画面<br>
　/order-complete -- 注文完了画面<br>
　/order-status -- 注文状況確認画面<br>
　/history -- 注文履歴確認画面<br>
　/reviews -- 注文評価登録画面<br>
　/account -- アカウント管理画面<br><br>

- 権限エラー画面の表示条件<br>
　一般ユーザーが管理者ユーザー用の画面にアクセスした場合<br>
　管理者ユーザーが一般ユーザー用の画面にアクセスした場合<br>
　定義されていないURLにアクセスした場合<br>

### Reactアプリ全体の中心
- 画面表示時<br>
  React側<br>
　`Appコンポーネント`<br>
　　ログイン状態をauthで管理する<br>
　　現在のURLをrouteとして扱う<br>
　　routeとauth.roleを見て表示する画面を決める<br>
　　各画面に必要なデータや処理をpropsで渡す<br>
　　最後にHeader、表示画面、ConfirmModalをまとめて表示する<br><br>

- ここで確認すること<br>
　画面表示、ログイン状態、データ取得、共通モーダルを`Appコンポーネント`でまとめて管理している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>

### ログイン状態の確認
- 画面表示時<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadAuthを実行する<br>
　　GET /api/auth/statusでリクエスト送信<br>
  <br>
  Java側<br>
　`AuthController`<br>
　　GET /api/auth/statusのリクエスト受取<br>
　　ログインしていない場合は未ログイン状態を返す<br>
　　ログイン済みの場合は`AuthStatusResponse`でユーザー情報を返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　ログイン済みの場合はauthにログイン情報を保存する<br>
　　ログインしていない場合はauthをnullにする<br><br>

- ここで確認すること<br>
　authがあるかどうかでログイン済みか判断している<br>
　auth.roleがuserなら一般ユーザー、adminなら管理者ユーザーとして扱う<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/AuthController.java<br>
　dto/AuthStatusResponse.java<br>

### URLと画面遷移の管理
　URLと画面遷移の管理では、現在のURLを見て表示する画面を決める<br>

- URLを確認する場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　useLocationで現在表示している画面のURLを取得する<br>
　　location.pathnameをrouteとして扱う<br><br>

- 画面を移動する場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　useNavigateから取得したnavigateを使う<br>
　　navigate('/menu')のように指定したURLへ移動する<br><br>

- ここで確認すること<br>
　React側ではURLを見て表示画面を決めている<br>
　ボタン押下時はnavigateを使って別画面へ移動している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>

### ユーザー権限による画面分岐
　ユーザー権限による画面分岐では、一般ユーザーと管理者ユーザーで表示できる画面を分ける<br>

- ログイン状態を確認した後<br>
  React側<br>
　`Appコンポーネント`<br>
　　auth.roleを確認する<br>
　　一般ユーザーの場合はisUserとして扱う<br>
　　管理者ユーザーの場合はisAdminとして扱う<br><br>
  <br>
  Java側<br>
　`Role`<br>
　　ROLE_USERを一般ユーザーとして扱う<br>
　　ROLE_ADMINを管理者ユーザーとして扱う<br><br>

- 一般ユーザーの場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　一般ユーザー用画面を表示する<br>
　　管理者ユーザー用画面へアクセスした場合は権限エラー画面を表示する<br><br>

- 管理者ユーザーの場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　管理者ユーザー用画面を表示する<br>
　　一般ユーザー用画面へアクセスした場合は権限エラー画面を表示する<br><br>

- ここで確認すること<br>
　画面側ではisUser、isAdminを使って表示可否を分けている<br>
　API側ではSpring Securityでアクセス権限を分けている<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　entity/Role.java<br>

### 権限エラー画面
　ログイン中ユーザーが利用できない画面へアクセスした場合の表示を行う<br>

- 権限のないURLへアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　現在のURLとログイン中ユーザーの権限を確認する<br>
　　表示できる画面ではない場合、AccessDeniedPageコンポーネントを表示する<br><br>
　`AccessDeniedPageコンポーネント`<br>
　　この画面を利用する権限がないことを表示する<br><br>
  Java側<br>
　`SecurityConfig`<br>
　　APIのアクセス権限を確認する<br>
　　権限がないAPIへのアクセスは拒否する<br><br>

- ここで確認すること<br>
　React側は画面表示を制御している<br>
　Java側はAPIアクセスを制御している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/AccessDeniedPage.jsx<br>
  <br>
  Java側<br>
　config/SecurityConfig.java<br>

### 必要なデータの読み込み
　表示する画面に応じて商品、注文、評価、ユーザー情報などを取得する<br>

- 画面表示時<br>
  React側<br>
　`Appコンポーネント`<br>
　　routeとauth.roleを確認する<br>
　　表示する画面に必要な読み込み処理を実行する<br>
　　取得したデータをstateに保存する<br>
　　画面コンポーネントへpropsで渡す<br>
  <br>
  Java側<br>
　`Controller`<br>
　　APIリクエストを受け取る<br>
　　Serviceへ処理を渡す<br>
　`Service`<br>
　　必要なデータを取得する<br>
　　DTOに変換してReact側へ返す<br><br>

- ここで確認すること<br>
　Appコンポーネントが各画面に必要なデータをまとめて取得している<br>
　各画面コンポーネントは受け取ったデータを表示する役割が中心になる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/ProductController.java<br>
　controller/OrderController.java<br>
　controller/ProductReviewController.java<br>
　controller/AnalyticsController.java<br>
　controller/AdminUserController.java<br>

### 共通ヘッダー
　共通ヘッダーでは、ログイン中ユーザーに応じたメニューを表示する<br>

- 画面表示時<br>
  React側<br>
　`Appコンポーネント`<br>
　　Headerコンポーネントへauth、route、画面遷移処理、ログアウト処理を渡す<br>
　`Headerコンポーネント`<br>
　　auth.roleを確認する<br>
　　一般ユーザー用メニュー、管理者ユーザー用メニューを切り替える<br>
　　routeを見て現在表示中のメニューを選択状態にする<br><br>

- ここで確認すること<br>
　ヘッダーは全画面共通で表示している<br>
　表示するメニューはログイン中ユーザーの権限で変わる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/components/Header.jsx<br>
　mobileorder-react/src/App.jsx<br>

### 確認モーダル
　確認モーダルでは、削除やログアウトなどの重要操作の前に確認を行う<br>

- 確認が必要な操作を押した場合<br>
  React側<br>
　画面コンポーネント:<br>
　　確認したい内容をAppコンポーネントへ渡す<br>
　`Appコンポーネント`<br>
　　showConfirmを実行する<br>
　　確認モーダルの内容をconfirmModalに保存する<br>
　　ConfirmModalコンポーネントへmodal情報を渡す<br>
　`ConfirmModalコンポーネント`<br>
　　タイトル、本文、確認ボタンを表示する<br><br>

- 確認ボタンを押した場合<br>
  React側<br>
　`ConfirmModalコンポーネント`<br>
　　確定処理を呼び出す<br>
　`Appコンポーネント`<br>
　　登録、削除、キャンセルなどの本処理を実行する<br><br>

- ここで確認すること<br>
　確認モーダルは全画面共通で使っている<br>
　各画面でモーダルを個別に作らず、Appコンポーネントでまとめて管理している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/components/ConfirmModal.jsx<br>
　mobileorder-react/src/App.jsx<br>

### API通信の共通処理
　API通信の共通処理では、React側からJava側へリクエストを送る処理をまとめている<br>

- APIを呼び出す場合<br>
  React側<br>
　画面コンポーネント、またはAppコンポーネント<br>
　　apiRequestを呼び出す<br>
　`apiRequest`<br>
　　fetchでJava側APIへリクエスト送信する<br>
　　Cookieを含めて通信する<br>
　　正常時はJSONを返す<br>
　　204 No Contentの場合はnullを返す<br>
　　エラー時はmessageを読み取ってErrorとして扱う<br><br>

- ここで確認すること<br>
　API通信の共通処理はclient.jsにまとめている<br>
　各画面で同じfetch処理を何度も書かないようにしている<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/api/client.js<br>

### エラーレスポンス共通化
　エラーレスポンス共通化では、Java側で発生したエラーをReact側で表示しやすい形に変換する<br>

- Java側でエラーが発生した場合<br>
  Java側<br>
　`Service`<br>
　　入力チェックエラーやIllegalArgumentExceptionが発生する<br>
　`ApiExceptionHandler`<br>
　　エラーを受け取る<br>
　　messageを含むレスポンスに変換する<br>
  <br>
  React側<br>
　`apiRequest`<br>
　　messageを読み取る<br>
　　Errorとして画面側へ渡す<br>
　`画面コンポーネント:`<br>
　　エラーメッセージを表示する<br><br>

- ここで確認すること<br>
　Java側のエラー文言をReact側で表示できる<br>
　エラーレスポンスの形をApiExceptionHandlerで共通化している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/api/client.js<br>
  <br>
  Java側<br>
　controller/ApiExceptionHandler.java<br>

### SpringSecurityの基本設定
　SpringSecurityの基本設定では、ログイン処理とAPIアクセス権限を管理する<br>

- ログインする場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　POST /api/loginでリクエスト送信する<br>
  <br>
  Java側<br>
　`SecurityConfig`<br>
　　/api/loginをログイン処理として扱う<br>
　　AppUserDetailsServiceへユーザー検索を依頼する<br>
　`AppUserDetailsService`<br>
　　ユーザー名をもとにユーザー情報を取得する<br>
　`SecurityConfig`<br>
　　パスワードを確認する<br>
　　ログインできるか判定する<br><br>

- APIへアクセスする場合<br>
  Java側<br>
　`SecurityConfig`<br>
　　requestMatchersでURLごとの権限を確認する<br>
　　/api/admin/**は管理者ユーザーだけ利用できる<br>
　　/api/orders/**や/api/reviews/**は一般ユーザーだけ利用できる<br><br>

- ここで確認すること<br>
　Spring Securityはログイン処理とAPIアクセス制御を担当している<br>
　画面表示だけでなく、Java側でも権限を確認している<br><br>

- 参照ファイル<br>
  Java側<br>
　config/SecurityConfig.java<br>
　service/AppUserDetailsService.java<br>

### 共通部品
　共通部品では、複数画面で使う表示やUIをまとめている<br>

- スター評価を表示する場合<br>
  React側<br>
　`RatingStarsコンポーネント`<br>
　　評価値とレビュー件数を受け取る<br>
　　スター、数値、レビュー件数を表示する<br><br>

- 商品ビジュアルを表示する場合<br>
  React側<br>
　`ProductVisualコンポーネント`<br>
　　商品のaccentを受け取る<br>
　　商品ごとの色味を画面に表示する<br><br>

- ここで確認すること<br>
　複数画面で使う表示は共通部品として切り出している<br>
　商品選択画面、商品管理画面、注文評価画面などで再利用できる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/components/RatingStars.jsx<br>
　mobileorder-react/src/components/ProductVisual.jsx<br>
