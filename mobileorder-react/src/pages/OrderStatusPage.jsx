const userMessages = {
  PENDING: 'まだ注文の準備は始まっておりません。',
  COOKING: 'ご注文の品を準備しております。',
  READY: 'ご注文の品の準備が完了しました。',
  SERVED: '店舗側では提供済みです。受け取りが完了している場合は、受け取り完了の確認をお願いします。',
  RECEIVED: '受け取りが完了しました。',
  CANCELED: '店舗側で注文がキャンセルされました。店舗からの連絡をご確認ください。',
}

export default function OrderStatusPage({ orders, onMarkReceived, onReload }) {
  return (
    <main className="container">
      <section className="page-head admin-page-head">
        <div>
          <p className="eyebrow">Order Status</p>
          <h1>注文状況</h1>
          <p>現在注文している商品の準備状況を確認できます。</p>
        </div>
      </section>

      {orders.length === 0 ? (
        <p className="empty">現在、注文されている商品はありません。</p>
      ) : (
        <section className="history-list">
          {orders.map((order) => (
            <article className="order-status-card" key={order.id}>
              <div className="order-status-head">
                <div>
                  <h2>注文番号: {order.id}</h2>
                  <div className="order-meta-list">
                    <span>注文日時: {order.createdAt}</span>
                    <span>受取日時: {order.pickupAt}</span>
                  </div>
                </div>
                <span className={`order-badge ${order.status.toLowerCase()}`}>{order.statusLabel}</span>
              </div>

              <p className={`status-message ${order.status.toLowerCase()}`}>{userMessages[order.status]}</p>

              {order.status === 'CANCELED' && (
                <section className="store-message">
                  <h3>店舗からの連絡</h3>
                  <p>管理者ユーザー名: {order.cancellationAdminUsername}</p>
                  <p>キャンセルの理由: {order.cancelReason}</p>
                </section>
              )}

              <ul className="order-items">
                {order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}
              </ul>

              <div className="total-row">
                <span>合計</span>
                <strong>¥{order.total.toLocaleString()}</strong>
              </div>

              {order.status === 'SERVED' && (
                <div className="actions">
                  <button type="button" onClick={() => onMarkReceived(order.id)}>受取完了</button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
