## 11-1.注文分析機能
### 注文分析機能
　この章では、注文データと評価データを使って店舗の状況を確認する機能<br>
　売上、注文数、平均評価、総合インサイト、カテゴリ別バランスを扱う<br>

- [注文分析画面](#注文分析画面)
- [分析データの取得](#分析データの取得)
- [総合インサイト](#総合インサイト)
- [日付別の売上推移](#日付別の売上推移)
- [カテゴリ別バランス](#カテゴリ別バランス)
- [注文分析で使う主なデータ](#注文分析で使う主なデータ)
- [注文分析機能のまとめ](#注文分析機能のまとめ)

### 注文分析画面
注文分析画面では、管理者ユーザーが店舗全体の傾向を確認する<br>

- /admin/analyticsにアクセスした場合<br>
  React側<br>
　`Appコンポーネント`<br>
　　loadAnalyticsを実行する<br>
　　GET /api/admin/analyticsでリクエスト送信<br>
　　取得したanalyticsをAnalyticsPageへ渡す<br>
　`AnalyticsPageコンポーネント`<br>
　　売上合計を表示する<br>
　　注文数を表示する<br>
　　平均評価を表示する<br>
　　総合インサイトを表示する<br>
　　日付別の売上推移を表示する<br>
　　カテゴリ別バランスを表示する<br><br>

- ここで確認すること<br>
　注文分析画面は管理者ユーザーだけが表示できる<br>
　データ読み込み中は読み込み中メッセージを表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/App.jsx<br>
　mobileorder-react/src/pages/admin/AnalyticsPage.jsx<br>
  <br>
  Java側<br>
　controller/AnalyticsController.java<br>
　service/AnalyticsService.java<br>

### 分析データの取得
分析データの取得では、注文と評価を集計してAnalyticsResponseを返す<br>

- GET /api/admin/analyticsを呼び出した場合<br>
  Java側<br>
　`AnalyticsController`<br>
　　分析データ取得リクエストを受け取る<br>
　　AnalyticsServiceへ処理を渡す<br>
　`AnalyticsService`<br>
　　全注文を取得する<br>
　　全評価を取得する<br>
　　売上合計を計算する<br>
　　注文数を計算する<br>
　　平均評価を計算する<br>
　　日付別売上を作成する<br>
　　カテゴリ別スコアを作成する<br>
　　AnalyticsResponseとして返す<br><br>

- ここで確認すること<br>
　注文データはMobileOrderRepositoryから取得する<br>
　評価データはProductReviewRepositoryから取得する<br><br>

- 参照ファイル<br>
  Java側<br>
　controller/AnalyticsController.java<br>
　service/AnalyticsService.java<br>
　dto/AnalyticsResponse.java<br>

### 総合インサイト
総合インサイトでは、売上推移やカテゴリ別スコアから店舗状態を表示する<br>

- 分析データを受け取った場合<br>
  React側<br>
　`AnalyticsPageコンポーネント`<br>
　　売上推移から傾向を判定する<br>
　　カテゴリ別スコアから強みカテゴリと改善候補カテゴリを判定する<br>
　　全体スコアを計算する<br>
　　店舗コンディションを表示する<br>
　　分析コメント、全体評価、カテゴリ別評価を表示する<br><br>

- ここで確認すること<br>
　総合インサイトの表示用評価はReact側で計算している<br>
　画面上では100点満点のスコアとして表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AnalyticsPage.jsx<br>

### 日付別の売上推移
日付別の売上推移では、直近7日分の売上を折れ線グラフで表示する<br>

- 日付別売上を作成する場合<br>
  Java側<br>
　`AnalyticsService`<br>
　　注文日時の日付ごとに売上を合計する<br>
　　今日を含む直近7日分のデータを作成する<br>
　　日付はMM/dd形式で返す<br>
  <br>
  React側<br>
　`AnalyticsPageコンポーネント`<br>
　　dailySalesからSVGのpolyline用座標を作成する<br>
　　日付別の売上推移グラフを表示する<br><br>

- ここで確認すること<br>
　売上がない日も0として表示する<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AnalyticsPage.jsx<br>
  <br>
  Java側<br>
　service/AnalyticsService.java<br>

### カテゴリ別バランス
カテゴリ別バランスでは、カテゴリごとの指標をペンタゴンで表示する<br>

- カテゴリ別スコアを作成する場合<br>
  Java側<br>
　`AnalyticsService`<br>
　　注文商品名からカテゴリを推定する<br>
　　カテゴリごとの注文数を集計する<br>
　　売上力、注文数、提供時間、お客様評価、リピート期待を計算する<br>
  <br>
  React側<br>
　`AnalyticsPageコンポーネント`<br>
　　カテゴリごとにペンタゴンを表示する<br>
　　各指標を一覧表示する<br><br>

- ここで確認すること<br>
　カテゴリ判定は商品名から推定している<br>
　表示する指標は5種類である<br><br>

- 参照ファイル<br>
  React側<br>
　mobileorder-react/src/pages/admin/AnalyticsPage.jsx<br>
  <br>
  Java側<br>
　service/AnalyticsService.java<br>

### 注文分析で使う主なデータ
- `AnalyticsResponse`<br>
　注文分析APIからReact側へ返すDTO<br>
　売上合計、注文数、平均評価、日付別売上、カテゴリ別スコアを持つ<br>
  <br>
- `MobileOrder`<br>
　売上合計、注文数、日付別売上、カテゴリ別スコアの集計元になる<br>
  <br>
- `ProductReview`<br>
　平均評価の計算元になる<br>

### 注文分析機能のまとめ
管理者ユーザーは店舗全体の売上、注文数、平均評価を確認できる<br>
日付別の売上推移をグラフで確認できる<br>
カテゴリ別バランスをペンタゴンで確認できる<br>
総合インサイトでは店舗コンディションと全体スコアを表示する<br>
分析データは注文データと評価データから作成する<br>
