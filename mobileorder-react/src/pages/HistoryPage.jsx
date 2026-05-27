import { useState } from 'react'

function OrderDetailModal({ order, onClose }) {
  if (!order) {
    return null
  }

  return (
    <div className="modal-backdrop">
      <section className="order-detail-modal" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
        <div className="order-status-head">
          <div>
            <p className="eyebrow">Order Detail</p>
            <h2 id="order-detail-title">注文番号: {order.id}</h2>
          </div>
          <span className={`order-badge ${order.status.toLowerCase()}`}>{order.statusLabel}</span>
        </div>

        <dl className="order-detail-list">
          <div>
            <dt>注文日時</dt>
            <dd>{order.createdAt}</dd>
          </div>
          <div>
            <dt>受け取り日時</dt>
            <dd>{order.pickupAt}</dd>
          </div>
          <div>
            <dt>合計</dt>
            <dd>¥{order.total.toLocaleString()}</dd>
          </div>
          <div>
            <dt>ステータス</dt>
            <dd>{order.statusLabel}</dd>
          </div>
        </dl>

        <section>
          <h3>商品一覧</h3>
          <ul className="order-items">
            {order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}
          </ul>
        </section>

        {order.status === 'CANCELED' && (
          <section className="store-message">
            <h3>店舗からの連絡</h3>
            <p>管理者ユーザー名: {order.cancellationAdminUsername}</p>
            <p>キャンセルの理由: {order.cancelReason}</p>
          </section>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>閉じる</button>
        </div>
      </section>
    </div>
  )
}

export default function HistoryPage({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null)

  return (
    <main className="container">
      <section className="page-head">
        <p className="eyebrow">History</p>
        <h1>注文履歴</h1>
        <p>これまでの注文内容を確認できます。</p>
      </section>

      {orders.length === 0 ? (
        <p className="empty">注文履歴はまだありません。</p>
      ) : (
        <section className="history-list">
          {orders.map((order) => (
            <article
              className="history-item order-history-item clickable-history-item"
              key={order.id}
              role="button"
              tabIndex="0"
              onClick={() => setSelectedOrder(order)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setSelectedOrder(order)
                }
              }}
            >
              <div>
                <h2>注文番号: {order.id}</h2>
                <div className="order-meta-list">
                  <span>注文日時: {order.createdAt}</span>
                  <span>受け取り日時: {order.pickupAt}</span>
                </div>
                <span className={`order-badge ${order.status.toLowerCase()}`}>{order.statusLabel}</span>
              </div>
              <ul>
                {order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}
              </ul>
              <strong>¥{order.total.toLocaleString()}</strong>

              {order.status === 'CANCELED' && (
                <section className="store-message">
                  <h3>店舗からの連絡</h3>
                  <p>管理者ユーザー名: {order.cancellationAdminUsername}</p>
                  <p>キャンセルの理由: {order.cancelReason}</p>
                </section>
              )}
            </article>
          ))}
        </section>
      )}

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </main>
  )
}
