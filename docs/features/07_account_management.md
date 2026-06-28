## 7-1.アカウント管理機能
### アカウント管理機能とは
　ログイン中ユーザー本人のアカウント情報を確認・更新する<br>

### 目次
- [アカウント管理とは](#アカウント管理機能とは)
- [アカウント情報画面](#アカウント情報画面)
- [アカウント情報の取得](#アカウント情報の取得)
- [アカウント情報取得API](#アカウント情報取得API)
- [表示モードと編集モード](#表示モードと編集モード)
- [パスワード変更フォーム](#パスワード変更フォーム)
- [パスワードの入力チェック](#パスワードの入力チェック)
- [パスワード変更確認モーダル](#パスワード変更確認モーダル)
- [編集キャンセル確認モーダル](#編集キャンセル確認モーダル)
- [パスワード変更処理](#パスワード変更処理)
- [アカウント更新API](#アカウント更新API)
- [アカウント管理で使う主なデータ](#アカウント管理で使う主なデータ)
- [アカウント管理機能のエラー表示](#アカウント管理機能のエラー表示)
- [アカウント管理機能のまとめ](#アカウント管理機能のまとめ)

### アカウント情報画面
　ログイン中ユーザーの情報表示とパスワード変更を行う<br>

- /accountにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadAccountを実行する<br>
　　GET /api/accountでリクエスト送信<br>
　　取得したaccountをAccountPageへ渡す<br>
　`AccountPageコンポーネント`<br>
　　ユーザー管理番号を表示する<br>
　　ユーザー名を表示する<br>
　　パスワードを伏せ字で表示する<br>
　　パスワード変更フォームを表示する<br>
　　変更前に確認モーダルを表示する<br>
　　編集キャンセル時にも確認モーダルを表示する<br><br>

- ここで確認すること<br>
　アカウント管理画面は一般ユーザーだけが表示できる<br>
　管理者ユーザーがアクセスした場合は権限エラー画面を表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/AccountPage.jsx<br>

### アカウント情報の取得
アカウント情報の取得では、ログイン中ユーザー本人の情報をAPIから取得する<br>

- /accountを表示した場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　routeが/accountの場合にloadAccountを実行する<br>
　　GET /api/accountでリクエスト送信<br>
　　取得したアカウント情報をaccountとしてstateで管理する<br>
　　AccountPageへaccountをpropsとして渡す<br>
  <br>
  Java側<br>
　`AccountProfileController`<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　AccountProfileServiceでログイン中ユーザーの情報を取得する<br>
　　AccountResponseに変換してReact側へ返す<br><br>

- ここで確認すること<br>
　アカウント情報はログイン中ユーザー名をもとに取得する<br>
　ユーザー管理番号はUserManagementCodeRepositoryから取得する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
  <br>
  Java側<br>
　controller/AccountProfileController.java<br>
　service/AccountProfileService.java<br>

### アカウント情報取得API
アカウント情報取得APIでは、ログイン中ユーザーのアカウント情報を返す<br>

- GET /api/accountを呼び出した場合<br>
  Java側<br>
　`AccountProfileController`<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　AccountProfileServiceへアカウント情報取得処理を依頼する<br>
　　取得した情報をAccountResponseとして返す<br>
　`AccountProfileService`<br>
　　AppUserRepositoryでユーザーを検索する<br>
　　UserManagementCodeRepositoryでユーザー管理番号を検索する<br>
　　権限を画面表示用の文言に変換する<br>
　　パスワードは伏せ字として返す<br><br>

- ここで確認すること<br>
　/api/accountは一般ユーザーだけが利用できる<br>
　APIの権限制御はSecurityConfig.javaで設定している<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/AccountProfileController.java<br>
　service/AccountProfileService.java<br>
　dto/AccountResponse.java<br>
　config/SecurityConfig.java<br>

### 表示モードと編集モード
表示モードと編集モードでは、パスワード変更フォームの表示状態を切り替える<br>

- 表示モードの場合<br>
  React側<br>
　`AccountPageコンポーネント`<br>
　　ユーザー管理番号を表示する<br>
　　ユーザー名を表示する<br>
　　伏せ字のパスワードを表示する<br>
　　パスワードを変更するボタンを表示する<br>

- 編集モードの場合<br>
  React側<br>
　`AccountPageコンポーネント`<br>
　　ユーザー管理番号とユーザー名を入力不可の状態で表示する<br>
　　新しいパスワード入力欄を表示する<br>
　　パスワード確認用の入力欄を表示する<br>
　　変更ボタンとキャンセルボタンを表示する<br><br>

- ここで確認すること<br>
　editingをstateとして管理して、表示モードと編集モードを切り替える<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/AccountPage.jsx<br>

### パスワード変更フォーム
パスワード変更フォームでは、新しいパスワードと確認用パスワードを入力する<br>

- フォームを表示した場合<br>
  React側<br>
　`AccountPageコンポーネント`<br>
　　passwordをformとして管理する<br>
　　passwordConfirmをformとして管理する<br>
　　入力欄が変更されたときはupdateFormでformの値を更新する<br>
　　パスワード入力欄にはplaceholderを指定する（パスワード変更フォーム 練習問題7-1-8-1）<br><br>

- ここで確認すること<br>
　パスワード変更フォームはeditingがtrueの場合だけ表示する<br>
　ユーザー管理番号とユーザー名は編集できない<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/AccountPage.jsx<br>

### パスワードの入力チェック
パスワードの入力チェックでは、React側でパスワードと確認用パスワードの一致を確認する<br>

- 変更ボタンを押した場合<br>
  React側<br>
　`AccountPageコンポーネント`<br>
　　パスワードと確認用パスワードが一致しているか確認する<br>
　　一致していない場合はerrorにメッセージを保存する<br>
　　エラーがある場合はAPIを呼び出さない<br>
　　一致している場合は、すぐ更新せず確認モーダルを表示する<br><br>

- ここで確認すること<br>
　React側で検出できる入力エラーは画面上に表示する<br>
　Java側でもパスワード一致確認を行う<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/AccountPage.jsx<br>
  <br>
  Java側<br>
　service/AccountProfileService.java<br>

### パスワード変更確認モーダル
パスワード変更確認モーダルでは、パスワード変更前にユーザーへ確認する<br>

- パスワード変更を実行する場合<br>
  React側<br>
　`AccountPageコンポーネント`<br>
　　パスワード変更前に確認モーダルを表示する<br>
　　モーダルのタイトルは「パスワード変更確認」<br>
　　ユーザーが確定した場合だけ更新処理を実行する<br>
　　確認用のモーダルの文言等を修正する（パスワード変更確認 練習問題7-1-10-1）<br>
　`ConfirmModalコンポーネント`<br>
　　共通モーダルとして確認内容を表示する<br><br>

- ここで確認すること<br>
　更新が完了したら編集モードを終了する<br>
　確認モーダルの確定時にonUpdateAccountを実行する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/AccountPage.jsx<br>
　mobileorder-react/src/components/ConfirmModal.jsx<br>

### 編集キャンセル確認モーダル
編集キャンセル確認モーダルでは、入力中の内容を破棄する前にユーザーへ確認する<br>

- キャンセルボタンを押した場合<br>
  React側<br>
　`AccountPageコンポーネント`<br>
　　編集キャンセル確認モーダルを表示する<br>
　　入力内容がクリアされることを伝える<br>
　　ユーザーが確定した場合だけ入力内容をクリアする<br>
　　エラーメッセージをクリアする<br>
　　編集モードを終了する<br>
　　確認用のモーダルの文言等を修正する（編集キャンセル確認 練習問題7-1-14-1）<br><br>

- ここで確認すること<br>
　誤って入力内容を消してしまわないように、キャンセル時にも確認を入れる<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/AccountPage.jsx<br>
　mobileorder-react/src/components/ConfirmModal.jsx<br>

### パスワード変更処理
パスワード変更処理では、確認モーダルで確定されたあとにアカウント更新APIを呼び出す<br>

- 確認モーダルで確定した場合<br>
  React側<br>
　`AccountPageコンポーネント`<br>
　　onUpdateAccountへformを渡す<br>
　`Appコンポーネント`<br>
　　updateAccountを実行する<br>
　　PUT /api/accountでリクエスト送信<br>
　　更新後のアカウント情報をaccountに保存する<br><br>

- ここで確認すること<br>
　AccountPageはonUpdateAccountをpropsとして受け取る<br>
　更新後はレスポンスのAccountResponseで画面表示を更新する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/AccountPage.jsx<br>

### アカウント更新API
アカウント更新APIでは、ログイン中ユーザー本人のパスワードを変更する<br>

- PUT /api/accountを呼び出した場合<br>
  Java側<br>
　`AccountProfileController`<br>
　　AccountUpdateRequestを受け取る<br>
　　Principalからログイン中ユーザー名を取得する<br>
　　AccountProfileServiceへパスワード変更処理を依頼する<br>
　　更新後のアカウント情報をAccountResponseとして返す<br>
　`AccountProfileService`<br>
　　パスワードとパスワード確認用が一致しているか確認する<br>
　　ログイン中ユーザー名をもとにユーザーを検索する<br>
　　新しいパスワードをBCryptで暗号化する<br>
　　ユーザーのパスワードを更新する<br><br>

- ここで確認すること<br>
　更新対象はログイン中ユーザー自身のアカウントになる<br>
　Java側でもパスワードの一致確認を行う<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/AccountProfileController.java<br>
　service/AccountProfileService.java<br>
　dto/AccountUpdateRequest.java<br>
　dto/AccountResponse.java<br>

### アカウント管理で使う主なデータ
- `AccountResponse`<br>
　アカウント情報取得APIからReact側へ返すDTO<br>
　managementCode、username、displayName、role、passwordMaskを持つ<br>
  <br>
- `AccountUpdateRequest`<br>
　アカウント更新APIへ送る入力値を表すDTO<br>
　password、passwordConfirmを持つ<br>
  <br>
- `AppUser`<br>
　app_userテーブルに対応するユーザーEntity<br>
　パスワード変更時に更新対象となる<br>
  <br>
- `UserManagementCode`<br>
　user_management_codeテーブルに対応する管理番号Entity<br>
　アカウント情報画面に表示する管理番号を取得する<br>

### アカウント管理機能のエラー表示
- 主なエラー例<br>
　パスワードと確認用パスワードが一致していない<br>
　パスワードが未入力になっている<br>
　対象ユーザーが見つからない<br><br>

- ここで確認すること<br>
　React側で検出できるエラーはAccountPageで表示する<br>
　Java側で返したmessageはapiRequestを通して画面に表示する<br>

### アカウント管理機能のまとめ
ログイン中ユーザーのアカウント情報を表示できる<br>
ユーザー管理番号とユーザー名を確認できる<br>
パスワードは伏せ字で表示される<br>
パスワード変更フォームを表示できる<br>
パスワード変更前に確認モーダルを表示する<br>
編集キャンセル時にも確認モーダルを表示する<br>
React側とJava側の両方でパスワード一致確認をしている<br>
新しいパスワードはBCryptで暗号化して保存する<br>
