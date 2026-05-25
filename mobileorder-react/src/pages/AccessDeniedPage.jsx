export default function AccessDeniedPage({ onNavigate }) {
  return (
    <main className="container narrow">
      <section className="page-head">
        <p className="alert">この画面を利用する権限がありません。</p>
        <p>ログインユーザーの権限に合った画面へ移動してください。</p>
      </section>
      <button type="button" onClick={() => onNavigate('/menu')}>商品選択へ戻る</button>
    </main>
  )

}
