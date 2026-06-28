## 4-1.認証機能
### 認証機能とは
　認証機能では、アプリを利用できるユーザーかどうかを確認する<br>

### 目次
- [認証機能とは](#認証機能とは)
- [ログイン画面](#ログイン画面)
- [ログインフォームのstate管理](#ログインフォームのstate管理)
- [React側のログイン処理](#React側のログイン処理)
- [SpringSecurityのログイン処理](#SpringSecurityのログイン処理)
- [ユーザー情報の読み込み](#ユーザー情報の読み込み)
- [ログイン状態確認API](#ログイン状態確認API)
- [利用停止中ユーザーの確認](#利用停止中ユーザーの確認)
- [新規アカウント作成画面](#新規アカウント作成画面)
- [新規アカウント作成API](#新規アカウント作成API)
- [ユーザー管理番号の役割](#ユーザー管理番号の役割)
- [パスワード再設定画面](#パスワード再設定画面)
- [パスワード再設定API](#パスワード再設定API)
- [ログアウト処理](#ログアウト処理)
- [認証機能で使う主なデータ](#認証機能で使う主なデータ)
- [認証機能のエラー表示](#認証機能のエラー表示)
- [認証機能のまとめ](#認証機能のまとめ)

### ログイン画面
　ユーザー名とパスワードを入力してログインする画面<br>

- 画面を表示した場合<br>
  React側<br>
　`LoginPageコンポーネント`<br>
　　ユーザー名の入力欄を表示する<br>
　　パスワードの入力欄を表示する<br>
　　パスワード表示 / 非表示ボタンを表示する<br>
　　新規アカウント作成画面へのボタンを表示する<br>
　　パスワード再設定画面へのボタンを表示する<br>

- ここで確認すること<br>
　ログイン画面は未ログイン状態で表示する<br>
　パスワードはshowPasswordで表示 / 非表示を切り替えている<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/LoginPage.jsx<br>

### ログインフォームのstate管理
　ログインフォームの入力値はReact側のstateで管理する<br>

- 入力欄を変更した場合<br>
  React側<br>
　`LoginPageコンポーネント`<br>
　　formにusernameとpasswordを保存する<br>
　　errorにログイン失敗時のメッセージを保存する<br>
　　showPasswordにパスワード表示状態を保存する<br>
　　updateFormで入力値を更新する<br>

- ログインボタンを押した場合<br>
  React側<br>
　`LoginPageコンポーネント`<br>
　　loginを実行する<br>
　　onLoginへformを渡す<br>

- ここで確認すること<br>
　入力値はformとしてまとめて管理している<br>
　画面固有のエラーはLoginPageのerrorに保存している<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/LoginPage.jsx<br>

### React側のログイン処理
　LoginPageコンポーネントから受け取った入力値をSpringSecurityのログインAPIへ送信する<br>

- ログインする場合<br>
  React側<br>
　`LoginPageコンポーネント`<br>
　　onLoginへユーザー名とパスワードを渡す<br>
　`Appコンポーネント`<br>
　　loginを実行する<br>
　　URLSearchParamsでフォームデータを作成する<br>
　　POST /api/loginでリクエスト送信<br>
　　ログイン成功時はloadAuthを実行する<br>
　　ログイン状態をauthに保存する<br>

- ログインに失敗した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　POST /api/auth/login-checkで利用停止中ユーザーか確認する<br>
　　利用停止中の場合は専用メッセージを表示する<br>
　　それ以外の場合はユーザー名またはパスワード違いとして扱う<br>

- ここで確認すること<br>
　ログイン処理そのものはSpringSecurityが行っている<br>
　ログイン成功後にGET /api/auth/statusでユーザー情報を取得している<br>
　ユーザーの利用停止 / 利用再開を切り替えるときは確認モーダルを表示する（React側のログイン処理 練習問題4-1-4-1）<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/LoginPage.jsx<br>
　mobileorder-react/src/pages/admin/UserManagementPage.jsx<br>

### SpringSecurityのログイン処理
　POST /api/loginに送られたユーザー名とパスワードを判定する<br>

- POST /api/loginされた場合<br>
  Java側<br>
　`SecurityConfig`<br>
　　/api/loginをログイン処理用URLに設定する<br>
　　ログイン成功時は200とJSONを返す<br>
　　ログイン失敗時は401を返す<br>
　　/api/logoutをログアウト処理用URLに設定する<br>
　　BCryptPasswordEncoderをPasswordEncoderとして使用する<br>
　　AppUserDetailsServiceを認証ユーザー取得処理として使用する<br>

- ここで確認すること<br>
　/api/login、/api/logoutはSpringSecurityの機能で処理している<br>
　/api/admin/**は管理者ユーザー、/api/orders/**や/api/reviews/**は一般ユーザーに制限している<br>

- 参照ファイル<br>
  Java側<br>
　config/SecurityConfig.java<br>
　service/AppUserDetailsService.java<br>

### ユーザー情報の読み込み
 ログイン判定時は、DBからユーザー情報を取得してSpringSecurityへ渡す<br>

- ユーザー名を受け取った場合<br>
  Java側<br>
　`AppUserDetailsService`<br>
　　app_userテーブルからユーザー名で検索する<br>
　　ユーザーが存在しない場合はUsernameNotFoundExceptionにする<br>
　　パスワード、権限、利用状態をUserDetailsへ設定する<br>
　　利用停止中ユーザーはdisabledとして扱う<br>

- ここで確認すること<br>
　ユーザーの利用状態はSpringSecurityのログイン可否に影響する<br>
　権限はROLE_USERまたはROLE_ADMINとして渡している<br>

- 参照ファイル<br>
  Java側<br>
　service/AppUserDetailsService.java<br>
　repository/AppUserRepository.java<br>
　entity/AppUser.java<br>

### ログイン状態確認API
 現在ログインしているユーザー情報をReact側へ返す<br>

- GET /api/auth/statusを呼び出した場合<br>
  Java側<br>
　`AuthController`<br>
　　Authenticationがない場合は未ログインとして返す<br>
　　ログイン済みの場合はapp_userテーブルからユーザーを取得する<br>
　　AuthStatusResponseへ変換して返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　authenticatedがtrueの場合はauthに保存する<br>
　　authenticatedがfalseの場合はauthをnullにする<br>

- 返す情報<br>
　authenticated -- ログイン済みかどうか<br>
　username -- ログイン中のユーザー名<br>
　role -- React側で使う権限<br>
　displayName -- 画面表示用の名前<br>

- ここで確認すること<br>
　Java側のROLE_ADMINはReact側でadminとして扱う<br>
　Java側のROLE_USERはReact側でuserとして扱う<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/AuthController.java<br>
　dto/AuthStatusResponse.java<br>

### 利用停止中ユーザーの確認
　ログイン失敗時のメッセージを表示する<br>

- POST /api/loginが失敗した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　POST /api/auth/login-checkでユーザー名とパスワードを送信する<br>
  <br>
  Java側<br>
　`AuthController`<br>
　　ユーザー名でapp_userを検索する<br>
　　パスワードが一致するか確認する<br>
　　matchedとenabledを返す<br>
  <br>
  React側<br>
　`Appコンポーネント`<br>
　　matchedがtrueでenabledがfalseの場合は利用停止中メッセージを表示する<br>

- ここで確認すること<br>
　SpringSecurityのログイン失敗だけでは利用停止中かどうかを画面側で判別しづらい<br>
　login-checkは専用メッセージ表示のために使用している<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/AuthController.java<br>
　dto/LoginCheckRequest.java<br>

### 新規アカウント作成画面
 一般ユーザーがユーザー管理番号を使ってアカウントを作成できる画面<br>

- /signupにアクセスした場合<br>
  React側<br>
　`SignupPageコンポーネント`<br>
　　ユーザー管理番号を入力する<br>
　　ユーザー名を入力する<br>
　　パスワードを入力する<br>
　　パスワード確認用を入力する<br>
　　入力値をformとしてstateで管理する<br>
　　登録ボタン押下時にonSignupを呼び出す<br>
　　登録成功時はログイン画面へ戻る<br>
　　登録失敗時はerrorにメッセージを表示する<br>

- ここで確認すること<br>
　ユーザー管理番号以外の入力欄にもplaceholderを指定する（新規アカウント作成画面 練習問題4-1-10-1）<br>
　登録完了後はApp側のsignup処理を経由してログイン画面へ遷移する<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/SignupPage.jsx<br>
　mobileorder-react/src/App.jsx<br>

### 新規アカウント作成API
　入力内容とユーザー管理番号を確認して一般ユーザーを登録する<br>

- POST /api/signupを呼び出した場合<br>
  Java側<br>
　`AccountController`<br>
　　SignupRequestを受け取る<br>
　　AccountServiceへ処理を渡す<br>
　`AccountService`<br>
　　パスワードと確認用パスワードが一致するか確認する<br>
　　同じユーザー名が既に使われていないか確認する<br>
　　入力されたユーザー管理番号が存在するか確認する<br>
　　USER-CODEから始まる一般ユーザー用の管理番号か確認する<br>
　　ユーザー管理番号が未使用か確認する<br>
　　パスワードをBCryptで暗号化する<br>
　　ROLE_USERのAppUserを保存する<br>
　　ユーザー管理番号を使用済みにする<br>

- ここで確認すること<br>
　新規アカウント作成で使えるのはUSER-CODEから始まる未使用の管理番号だけ<br>
　ユーザー名は重複登録できない<br>

- 参照ファイル<br>
  Java側<br>
　controller/AccountController.java<br>
　service/AccountService.java<br>
　dto/SignupRequest.java<br>
　entity/AppUser.java<br>
　entity/UserManagementCode.java<br>

### ユーザー管理番号の役割
　ユーザー登録に使う一意の管理番号である<br>

- 一般ユーザー登録で使う場合<br>
  Java側<br>
　`UserManagementCode`<br>
　　codeに「USER-CODE」または「ADMIN-CODE」から始まる管理番号を保持する<br>
　　usernameに使用したユーザー名を保持する<br>
　　usedに使用済みかどうかを保持する<br>
　　createdAtに発行日時を保持する<br>
　　usedAtに使用日時を保持する<br>

- ここで確認すること<br>
　一般ユーザーの新規登録では「USER-CODE」を使用する<br>
　管理者ユーザー登録では「ADMIN-CODE」を使用する<br>

- 参照ファイル<br>
  Java側<br>
　entity/UserManagementCode.java<br>
　repository/UserManagementCodeRepository.java<br>

### パスワード再設定画面
　ユーザー管理番号とユーザー名を使って新しいパスワードを設定する画面<br>

- /password-resetにアクセスした場合<br>
  React側<br>
　`PasswordResetPageコンポーネント`<br>
　　ユーザー管理番号を入力する<br>
　　ユーザー名を入力する<br>
　　新しいパスワードを入力する<br>
　　新しいパスワード確認用を入力する<br>
　　入力値をformとしてstateで管理する<br>
　　再設定ボタン押下時にonPasswordResetを呼び出す<br>
　　再設定成功時はログイン画面へ戻る<br>
　　再設定失敗時はerrorにメッセージを表示する<br>

- ここで確認すること<br>
　ユーザー管理番号以外の入力欄にもplaceholderを指定する（パスワード再設定画面 練習問題4-1-14-1）<br>
　ユーザー管理番号とユーザー名が一致する場合だけパスワードを変更できる<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/PasswordResetPage.jsx<br>
　mobileorder-react/src/App.jsx<br>

### パスワード再設定API
　使用済み管理番号とユーザー名を確認してパスワードを更新する画面<br>

- POST /api/password-resetを呼び出した場合<br>
  Java側<br>
　`AccountController`<br>
　　PasswordResetRequestを受け取る<br>
　　AccountServiceへ処理を渡す<br>
　`AccountService`<br>
　　新しいパスワードと確認用パスワードが一致するか確認する<br>
　　入力されたユーザー管理番号が存在するか確認する<br>
　　ユーザー管理番号が使用済みか確認する<br>
　　ユーザー管理番号に紐づくユーザー名と入力されたユーザー名が一致するか確認する<br>
　　対象ユーザーを検索する<br>
　　新しいパスワードをBCryptで暗号化して保存する<br>

- ここで確認すること<br>
　未使用の管理番号ではパスワード再設定できない<br>
　管理番号とユーザー名の組み合わせが一致する必要がある<br>

- 参照ファイル<br>
  Java側<br>
　controller/AccountController.java<br>
　service/AccountService.java<br>
　dto/PasswordResetRequest.java<br>

### ログアウト処理
　確認モーダルを表示してからログイン状態を解除する<br>

- ログアウトボタンを押した場合<br>
  React側<br>
　`Headerコンポーネント`<br>
　　ログアウトボタンを表示する<br>
　`Appコンポーネント`<br>
　　logoutを実行する<br>
　　ConfirmModalを表示する<br>
　　確定時にPOST /api/logoutを送信する<br>
　　authをnullにする<br>
　　cartを空にする<br>
　　/loginへ遷移する<br>

- ここで確認すること<br>
　ログアウト前に共通の確認モーダルを使っている<br>
　ログアウト後はカート情報もリセットしている<br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/components/Header.jsx<br>
　mobileorder-react/src/components/ConfirmModal.jsx<br>
