{/*注文提供済み 練習問題5-1-34-1*/}
{/*SERVEDの場合の文言を修正する*/}
const userMessages = {
  PENDING: 'まだ注文の準備は始まっておりません。',
  COOKING: 'ご注文の品を準備しております。',
  READY: 'ご注文の品の準備が完了しました。',
  SERVED: 'ご注文の品は提供済みです。',
  RECEIVED: '受け取りが完了しました。',
  CANCELED: '店舗側で注文がキャンセルされました。店舗からの連絡をご確認ください。',
}

{/*注文提供済み 練習問題5-1-34-2*/}
{/*onReloadのpropsの受け渡しは不要なので削除する*/}
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
                    {/*注文キャンセル 練習問題5-1-33-3*/}
                    {/*「注文商品:」の見出しを追加*/}
                    <span>注文商品:</span>
                  </div>
                </div>
                <span className={`order-badge ${order.status.toLowerCase()}`}>{order.statusLabel}</span>
              </div>

              <ul className="order-items">
                {order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}
              </ul>

              {/*注文キャンセル 練習問題5-1-33-4*/}
              {/*合計金額の表示部分のレイアウトを整える*/}
              <div className="order-meta-list">
                <span>合計:</span>
              </div>
              <strong　className="order-items">¥{order.total.toLocaleString()}</strong>

              {/*注文提供済み 練習問題5-1-34-2*/}
              {/*注文ステータス「提供済み」の場合で「受取完了」ボタン押下後に確認用のモーダルを表示する*/}
              {/*注文提供済み 練習問題5-1-34-1*/}
              {/*注文ステータスが「提供済み」の場合のレイアウトを調整する*/}
              {/*注文キャンセル 練習問題5-1-33-2*/}
              {/*合計金額の下にステータス文言と注文ステータス「キャンセル」時の文言を移動する*/}
              {order.status === 'SERVED' ? (
                  <div className={`status-message ${order.status.toLowerCase()}`}>
                    <p>{userMessages[order.status]}<br/>下の「受取完了」ボタンから受取完了の確認をお願いします。</p>
                    <div className="received-action">
                      <button type="button" onClick={() => onMarkReceived(order.id)}>受取完了</button>
                    </div>
                  </div>
              ) : (
                  <p className={`status-message ${order.status.toLowerCase()}`}>{userMessages[order.status]}</p>
              )}

              {order.status === 'CANCELED' && (
                  <section className="store-message">
                    <h3>店舗からの連絡</h3>
                    {/*注文キャンセル 練習問題5-1-33-1*/}
                    {/*「管理者ユーザー名:」→「店舗担当者:」*/}
                    <p>店舗担当者: {order.cancellationAdminUsername}</p>
                    <p>キャンセルの理由: {order.cancelReason}</p>
                  </section>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
