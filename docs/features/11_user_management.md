## 11章.ユーザー管理機能
### ユーザー管理機能とは
　管理者ユーザーがユーザー一覧、ユーザー管理番号、管理者ユーザー登録を扱うことができる機能<br>
　一般ユーザーの利用停止 / 利用再開、ユーザー削除も扱う<br>

### 目次
- [この章について](#この章について)
- [ユーザー管理機能について](#ユーザー管理機能について)
- [ユーザー管理画面](#ユーザー管理画面)
- [ユーザー一覧の取得](#ユーザー一覧の取得)
- [ユーザー一覧タブと絞り込み](#ユーザー一覧タブと絞り込み)
- [一般ユーザー用管理番号の発行](#一般ユーザー用管理番号の発行)
- [管理者ユーザー登録](#管理者ユーザー登録)
- [ユーザー利用状態の切り替え](#ユーザー利用状態の切り替え)
- [ユーザー削除](#ユーザー削除)
- [ユーザー管理で使う主なデータ](#ユーザー管理で使う主なデータ)
- [ユーザー管理機能のエラー表示](#ユーザー管理機能のエラー表示)
- [ユーザー管理機能のまとめ](#ユーザー管理機能のまとめ)

### ユーザー管理画面
　ユーザーと管理番号をタブで切り替えて表示する<br>

- /admin/usersにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadUsersを実行する<br>
　　loadManagementCodesを実行する<br>
　　UserManagementPageへusersとcodesを渡す<br>
　`UserManagementPageコンポーネント`<br>
　　ユーザー一覧タブを表示する<br>
　　一般ユーザー用管理番号一覧タブを表示する<br>
　　管理者ユーザー用管理番号一覧タブを表示する<br><br>

- ここで確認すること<br>
　ユーザー管理画面は管理者ユーザーだけが表示できる<br>
　タブ状態はAppコンポーネントでも保持している<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/UserManagementPage.jsx<br>

### ユーザー一覧の取得
　登録済みユーザーと管理番号を取得する<br>

- GET /api/admin/usersを呼び出した場合<br>
  Java側<br>
　`AdminUserController`<br>
　　ユーザー一覧リクエストを受け取る<br>
　　AdminUserServiceへ処理を渡す<br>
　`AdminUserService`<br>
　　全ユーザーを新しい順で取得する<br>
　　AdminUserResponseへ変換して返す<br>

- GET /api/admin/user-management-codesを呼び出した場合<br>
  Java側<br>
　`AdminUserService`<br>
　　全ユーザー管理番号を新しい順で取得する<br>
　　UserManagementCodeResponseへ変換して返す<br><br>

- ここで確認すること<br>
　ユーザー情報と管理番号は別APIで取得する<br>
　ユーザー一覧では管理者ユーザーを上に表示するようReact側で並び替えている<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/AdminUserController.java<br>
　service/AdminUserService.java<br>
　dto/AdminUserResponse.java<br>
　dto/UserManagementCodeResponse.java<br>

### ユーザー一覧タブと絞り込み
　表示するユーザー種別を切り替える<br>

- ユーザー一覧タブを表示した場合<br>
  React側<br>
　`UserManagementPageコンポーネント`<br>
　　すべて、一般ユーザー、管理者ユーザーで絞り込む<br>
　　管理者ユーザーはadmin-userの見た目で表示する<br>
　　一般ユーザーはgeneral-userの見た目で表示する<br>
　　ユーザー名、権限、ステータスを表示する<br><br>

- ここで確認すること<br>
　ユーザー種別の絞り込みはReact側で行っている<br>
　ログイン中の自分自身は削除できないようにする<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/UserManagementPage.jsx<br>

### 一般ユーザー用管理番号の発行
　USER-CODEから始まる管理番号を作成する<br>

- 発行ボタンを押した場合<br>
  React側<br>
　`UserManagementPageコンポーネント`<br>
　　ユーザー管理番号発行の確認モーダルを表示する<br>
　　確定時にonIssueUserCodeを実行する<br>
　`Appコンポーネント`<br>
　　POST /api/admin/user-management-codes/userでリクエスト送信<br>
　　発行された管理番号をmanagementCodesへ追加する<br>
  <br>
  Java側<br>
　`AdminUserService`<br>
　　USER-CODE-から始まる英数字12桁の管理番号を生成する<br>
　　重複しない管理番号として保存する<br><br>

- ここで確認すること<br>
　発行された管理番号は新規アカウント作成で一般ユーザーが使用する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/UserManagementPage.jsx<br>
  <br>
  Java側<br>
　controller/AdminUserController.java<br>
　service/AdminUserService.java<br>

### 管理者ユーザー登録
　ADMIN-CODEから始まる管理番号を使って管理者ユーザーを作成する<br>

- 新しく管理者ユーザーを登録するボタンを押した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　POST /api/admin/user-management-codes/adminで管理者用管理番号を発行する<br>
　　/admin/users/admin/newへ遷移する<br>
　`AdminUserRegistrationPageコンポーネント`<br>
　　管理者用のユーザー管理番号をreadOnlyで表示する<br>
　　ユーザー名、パスワード、パスワード確認用を入力する<br>
　　登録ボタンでonSubmitを実行する<br>
  <br>
  Java側<br>
　`AdminUserService`<br>
　　ADMIN-CODEから始まる未使用の管理番号か確認する<br>
　　ユーザー名重複を確認する<br>
　　パスワードをBCryptで暗号化する<br>
　　ROLE_ADMINのAppUserとして保存する<br>
　　管理番号を使用済みにする<br><br>

- ここで確認すること<br>
　登録を中断した場合は未使用の管理者用管理番号を削除する<br>
　管理者ユーザー登録は管理者ユーザーだけが実行できる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AdminUserRegistrationPage.jsx<br>
  <br>
  Java側<br>
　controller/AdminUserController.java<br>
　service/AdminUserService.java<br>

### ユーザー利用状態の切り替え
　一般ユーザーの利用可 / 利用不可を変更する<br>

- 利用停止または利用再開ボタンを押した場合<br>
  React側<br>
　`UserManagementPageコンポーネント`<br>
　　ユーザー利用状態変更の確認モーダルを表示する<br>
　　確定時にonToggleUserStatusへユーザーIDを渡す<br>
　`Appコンポーネント`<br>
　　POST /api/admin/users/{id}/toggle-enabledでリクエスト送信<br>
　　更新後のユーザー情報をusersへ反映する<br>
  <br>
  Java側<br>
　`AdminUserService`<br>
　　ユーザーIDでユーザーを検索する<br>
　　管理者ユーザーの場合はエラーにする<br>
　　enabledを切り替える<br><br>

- ここで確認すること<br>
　管理者ユーザーの利用状態は変更できない<br>
　利用停止中のユーザーはログインできない<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/UserManagementPage.jsx<br>
  <br>
  Java側<br>
　service/AdminUserService.java<br>
　service/AppUserDetailsService.java<br>

### ユーザー削除
　確認モーダルを表示してからユーザーを削除する<br>

- 削除ボタンを押した場合<br>
  React側<br>
　`UserManagementPageコンポーネント`<br>
　　ユーザー削除の確認モーダルを表示する<br>
　　確定時にonDeleteUserへユーザーIDを渡す<br>
　`Appコンポーネント`<br>
　　DELETE /api/admin/users/{id}でリクエスト送信<br>
　　usersから対象ユーザーを削除する<br>
  <br>
  Java側<br>
　`AdminUserService`<br>
　　ユーザーIDでユーザーを検索する<br>
　　対象ユーザーを削除する<br><br>

- ここで確認すること<br>
　ログイン中の自分自身は画面上で削除ボタンを非活性にする<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/UserManagementPage.jsx<br>
  <br>
  Java側<br>
　controller/AdminUserController.java<br>
　service/AdminUserService.java<br>
