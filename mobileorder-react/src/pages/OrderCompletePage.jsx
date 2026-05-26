export default function OrderCompletePage({ latestOrder, onNavigate }) {
  return (
    <main className="container narrow completion">
      <p className="eyebrow">Complete</p>
      <h1>注文完了</h1>

      {latestOrder ? (
        <section className="complete-summary">
          <p>ご注文を受け付けました。受け取り準備ができるまで少しお待ちください。</p>
          <div className="complete-order-number">
            <span>注文番号</span>
            <strong>{latestOrder.id}</strong>
          </div>
          <dl className="complete-details">
            <div>
              <dt>受け取り日時</dt>
              <dd>{latestOrder.pickupAt}</dd>
            </div>
            <div>
              <dt>合計金額</dt>
              <dd>¥{latestOrder.total.toLocaleString()}</dd>
            </div>
          </dl>
        </section>
      ) : (
        <p>ご注文ありがとうございます。</p>
      )}

      <div className="actions">
        <button type="button" onClick={() => onNavigate('/menu')}>続けて注文する</button>
        <button className="ghost-button" type="button" onClick={() => onNavigate('/history')}>注文履歴を見る</button>
      </div>
    </main>
  )
}
