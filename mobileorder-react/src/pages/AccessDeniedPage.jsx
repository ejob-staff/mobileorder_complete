export default function AccessDeniedPage({ onNavigate, homePath, homeLabel }) {
  return (
    <main className="container narrow">
      <section className="page-head">
        <p className="alert">この画面を利用する権限がありません。</p><br/>
        <p>ログインユーザーの権限に合った画面へ移動してください。</p>
      </section>
      {/*権限エラー画面 練習問題3-1-7-1*/}
      <button type="button" onClick={() => onNavigate(homePath)}>{homeLabel}</button>
    </main>
  )

}
