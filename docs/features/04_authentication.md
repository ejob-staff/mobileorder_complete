## 4章.認証機能
### この章について
この章では、モバイルオーダーアプリケーションでのログイン、新規アカウント作成、<br>
パスワード再設定、ログアウトを確認していきます。ユーザー管理番号を使って<br>
アカウントを作成する流れや、SpringSecurityによるログイン処理も押さえていきましょう。

### 4-1-1.認証機能について
本章では、アプリを利用するために必要な認証まわりの処理を確認していきます。

認証機能で使用する主な処理<br>
ログイン画面でユーザー名とパスワードを入力する処理<br>
SpringSecurityでログインを判定する処理<br>
ログイン中のユーザー情報を取得する処理<br>
ユーザー管理番号を使って新規アカウントを作成する処理<br>
ユーザー管理番号とユーザー名を使ってパスワードを再設定する処理<br>
ログアウト時にログイン状態を解除する処理<br>
利用停止中ユーザーのログインを判定する処理

## 4-1-2.ログイン画面
mobileorder-react/src/pages/LoginPage.jsx<br>
ログイン画面を表示するReactコンポーネント<br>
ユーザー名、パスワード、エラーメッセージ、パスワード表示状態をstateで管理している

LoginPage.jsxの主な役割<br>
ユーザー名とパスワードの入力欄を表示する<br>
パスワードの表示と非表示を切り替える<br>
ログインボタン押下時にonLoginを呼び出す<br>
ログインに失敗した場合はエラーメッセージを表示する<br>
新規アカウント作成画面へ遷移する<br>
パスワード再設定画面へ遷移する

## 4-1-3.ログインフォームのstate管理
mobileorder-react/src/pages/LoginPage.jsx<br>
ログインフォームの入力値はformとしてstateで管理している

管理している主なstate<br>
- form・・・ユーザー名とパスワード<br>
- error・・・ログイン失敗時のエラーメッセージ<br>
- showPassword・・・パスワードを表示するかどうか

入力欄が変更されたときはupdateFormでformの値を更新する<br>
ログインボタンを押したときはlogin関数でonLoginを実行する

## 4-1-4.React側のログイン処理
mobileorder-react/src/App.jsx<br>
LoginPageから受け取ったユーザー名とパスワードを使って、SpringSecurityのログインAPIを呼び出す

ログイン処理の流れ<br>
LoginPageでユーザー名とパスワードを入力する<br>
onLogin経由でApp.jsxのlogin関数を実行する<br>
/api/loginへPOSTする<br>
ログイン成功時はloadAuthを呼び出してログイン状態を取得する<br>
ログイン失敗時はエラーメッセージを表示する

利用停止中ユーザーの場合<br>
/api/loginが失敗したあと、/api/auth/login-checkを呼び出す<br>
ユーザー名とパスワードが一致していて、利用停止中の場合は専用メッセージを表示する

## 4-1-5.SpringSecurityのログイン処理
config/SecurityConfig.java<br>
SpringSecurityのログイン処理を設定するファイル<br>
/api/loginにPOSTされたユーザー名とパスワードを使ってログインを判定する

SecurityConfigで定義している主な内容<br>
- /api/loginをログイン処理用URLにする<br>
- ログイン成功時はJSONを返す<br>
- ログイン失敗時は401を返す<br>
- /api/logoutでログアウトできるようにする<br>
- パスワードはBCryptで照合する<br>
- AppUserDetailsServiceを使ってユーザー情報を取得する<br>

## 4-1-6.ユーザー情報の読み込み
service/AppUserDetailsService.java<br>
SpringSecurityがログイン判定を行うときに、DBからユーザー情報を取得するService<br>

AppUserDetailsServiceの主な役割<br>
ユーザー名をもとにapp_userテーブルからユーザーを検索する<br>
ユーザーが存在しない場合はエラーにする<br>
パスワード、権限、利用状態をSpringSecurityへ渡す<br>
利用停止中ユーザーの場合はログインできない状態として扱う

## 4-1-7.ログイン状態確認API
controller/AuthController.java<br>
/api/auth/statusで現在のログイン状態を返すController<br>
React側はこのAPIを呼び出して、ログイン済みかどうかを確認する

ログイン済みの場合に返す情報<br>
authenticated - ログイン済みかどうか<br>
username - ユーザー名<br>
role - 画面切り替え用の権限<br>
displayName - 表示名

未ログイン状態の場合<br>
authenticatedをfalseとして返す<br>
ユーザー名や権限は空文字で返す

## 4-1-8.ログイン状態を表すDTO
dto/AuthStatusResponse.java<br>
ログイン状態確認APIのレスポンスを表すDTO

AuthStatusResponseで返す項目<br>
authenticated - ログイン済みかどうか<br>
username - ログイン中のユーザー名<br>
role - React側で使う権限<br>
displayName - 画面表示用の名前

Java側ではROLE_ADMINとROLE_USERを使う<br>
React側ではadminとuserとして扱いやすい形に変換している

## 4-1-9.利用停止中ユーザーの確認
controller/AuthController.java<br>
/api/auth/login-checkで、入力されたユーザー名とパスワードが一致するか、利用可能なユーザーかを確認する

SpringSecurityのログイン失敗だけでは、パスワード違いなのか利用停止中なのかを画面で判別しづらい<br>
そのため、ログイン失敗後にlogin-checkを呼び出して、利用停止中ユーザーには専用メッセージを表示する

dto/LoginCheckRequest.java<br>
ログイン確認用のリクエストDTO<br>
ユーザー名とパスワードを受け取る

## 4-1-10.新規アカウント作成画面
mobileorder-react/src/pages/SignupPage.jsx<br>
一般ユーザーが新規アカウントを作成する画面<br>
ユーザー管理番号、ユーザー名、パスワード、確認用パスワードを入力する

SignupPageコンポーネントの主な役割<br>
新規アカウント作成フォームを表示する<br>
入力値をformとしてstateで管理する<br>
登録ボタン押下時にonSignupを呼び出す

登録に成功した場合 - ログイン画面へ戻る<br>
登録に失敗した場合 - エラーメッセージを表示する

## 4-1-11.新規アカウント作成API
controller/AccountController.java<br>
/api/signupで新規アカウント作成を受け付けるController<br>
SignupRequestを受け取り、AccountServiceへ処理を渡す

service/AccountService.java<br>
新規アカウント作成の業務ロジックを担当するService

新規アカウント作成の流れ<br>
パスワードと確認用パスワードが一致するか確認する<br>
同じユーザー名が既に使われていないか確認する<br>
入力されたユーザー管理番号が存在するか確認する<br>
一般ユーザー用のUSER-CODEであることを確認する<br>
ユーザー管理番号が未使用であることを確認する<br>
パスワードをBCryptで暗号化する<br>
一般ユーザーとしてAppUserを登録する<br>
ユーザー管理番号を使用済みにする

## 4-1-12.ユーザー管理番号の役割
entity/UserManagementCode.java<br>
ユーザー登録に使う一意の管理番号を表すEntity

ユーザー管理番号の主な項目<br>
code - USER-CODEまたはADMIN-CODEから始まる管理番号<br>
username - 使用したユーザー名<br>
used - 使用済みかどうか<br>
createdAt - 発行日時<br>
usedAt - 使用日時

一般ユーザーの新規アカウント作成では、USER-CODEから始まる未使用の管理番号だけを使える<br>
管理者ユーザーの登録では、ADMIN-CODEから始まる管理番号を使う

## 4-1-13.新規アカウント作成リクエスト
dto/SignupRequest.java<br>
新規アカウント作成時にReact側からJava側へ送る入力値を表すDTO

SignupRequestで受け取る項目<br>
code - ユーザー管理番号<br>
username - ユーザー名<br>
password - パスワード<br>
passwordConfirm - 確認用パスワード

各項目には@NotBlankが付いている<br>
未入力の場合は入力エラーとして扱う

## 4-1-14.パスワード再設定画面
mobileorder-react/src/pages/PasswordResetPage.jsx<br>
ログインできなくなったユーザーがパスワードを再設定する画面<br>
ユーザー管理番号、ユーザー名、新しいパスワード、確認用パスワードを入力する

PasswordResetPage.jsxの主な役割<br>
パスワード再設定フォームを表示する<br>
入力値をformとしてstateで管理する<br>
再設定ボタン押下時にonPasswordResetを呼び出す<br>
再設定に成功したらログイン画面へ戻る<br>
再設定に失敗したらエラーメッセージを表示する

## 4-1-15.パスワード再設定API
controller/AccountController.java<br>
/api/password-resetでパスワード再設定を受け付けるController<br>
PasswordResetRequestを受け取り、AccountServiceへ処理を渡す

service/AccountService.java<br>
パスワード再設定の業務ロジックを担当するService

パスワード再設定の流れ<br>
新しいパスワードと確認用パスワードが一致するか確認する<br>
入力されたユーザー管理番号が存在するか確認する<br>
ユーザー管理番号が使用済みであることを確認する<br>
ユーザー管理番号に紐づくユーザー名と入力されたユーザー名が一致するか確認する<br>
対象ユーザーを検索する<br>
新しいパスワードをBCryptで暗号化して保存する

## 4-1-16.パスワード再設定リクエスト
dto/PasswordResetRequest.java<br>
パスワード再設定時にReact側からJava側へ送る入力値を表すDTO

PasswordResetRequestで受け取る項目<br>
code - ユーザー管理番号<br>
username - ユーザー名<br>
password - 新しいパスワード<br>
passwordConfirm - 新しいパスワード確認用

各項目には@NotBlankが付いている<br>
未入力の場合は入力エラーとして扱う

## 4-1-17.ログアウト処理
mobileorder-react/src/App.jsx<br>
ログアウトボタン押下時に確認モーダルを表示し、ユーザーが確定したら/api/logoutを呼び出す

mobileorder-react/src/components/Header.jsx<br>
画面上部のログアウトボタンを表示する

mobileorder-react/src/components/ConfirmModal.jsx<br>
ログアウト前の確認モーダルを表示する

ログアウト処理の流れ<br>
ヘッダーのログアウトボタンを押す<br>
ログアウト確認モーダルを表示する<br>
ログアウトを確定する<br>
/api/logoutへPOSTする<br>
authをnullに戻す<br>
カート情報を空にする<br>
ログイン画面へ遷移する

## 4-1-18.認証機能で使う主なEntity
entity/AppUser.java<br>
アプリに登録されているユーザーを表すEntity

AppUserの主な項目<br>
username - ログインに使うユーザー名<br>
password - 暗号化されたパスワード<br>
displayName - 表示名<br>
enabled - 利用可能かどうか<br>
role - 一般ユーザーか管理者ユーザーか

entity/Role.java<br>
ユーザー権限を表すenum<br>
ROLE_USERとROLE_ADMINを扱う

entity/UserManagementCode.java<br>
ユーザー管理番号を表すEntity<br>
新規アカウント作成や管理者登録で使用する

## 4-1-19.認証機能で使う主なRepository
repository/AppUserRepository.java<br>
ユーザー情報をDBから検索、登録するRepository

主に使う処理<br>
ユーザー名でユーザーを検索する<br>
同じユーザー名が存在するか確認する<br>
ユーザーを保存する

repository/UserManagementCodeRepository.java<br>
ユーザー管理番号をDBから検索、登録するRepository

主に使う処理<br>
管理番号でユーザー管理番号を検索する<br>
管理番号が使用済みか確認する<br>
ユーザー管理番号を保存する

## 4-1-20.認証機能のエラー表示
React側では、APIから返されたエラーをcatchで受け取り、画面上に表示する<br>

ログイン画面<br>
LoginPage.jsxのerrorにエラーメッセージを保存する

新規アカウント作成画面<br>
SignupPage.jsxのerrorにエラーメッセージを保存する

パスワード再設定画面<br>
PasswordResetPage.jsxのerrorにエラーメッセージを保存する

Java側ではIllegalArgumentExceptionや入力チェックエラーを<br>
ApiExceptionHandlerでmessageとして返す

## 4-1-21.認証機能のまとめ
ログイン画面でユーザー名とパスワードを入力してログインできる<br>
ログイン成功後にauthへユーザー情報が保存される<br>
SpringSecurityがログイン処理を担当している<br>
AppUserDetailsServiceがDBからユーザー情報を読み込んでいる<br>
ユーザー管理番号を使って一般ユーザーを新規登録できる<br>
使用済みのユーザー管理番号は再利用できない<br>
ユーザー管理番号とユーザー名を使ってパスワード再設定できる<br>
ログアウト時にauthとカート情報がリセットされる<br>
認証エラーや入力エラーが画面に表示される
