import { useState } from 'react'
import RatingStars from '../components/RatingStars.jsx'

const formKey = (orderNumber, productId) => `${orderNumber}-${productId}`

function RatingInput({ value, onChange }) {
  return (
    <div className="rating-input" aria-label="評価">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          className={rating <= value ? 'active' : ''}
          type="button"
          key={rating}
          onClick={() => onChange(rating)}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewPage({ orders, reviews, onSubmitReview, onConfirm }) {
  const [forms, setForms] = useState({})
  const receivedOrders = orders.filter((order) => order.status === 'RECEIVED')

  const updateForm = (key, field, value) => {
    setForms((current) => ({
      ...current,
      [key]: { rating: current[key]?.rating || 5, comment: current[key]?.comment || '', [field]: value },
    }))
  }

  const alreadyReviewed = (orderNumber, productId) => reviews.some((review) => review.orderNumber === orderNumber && review.productId === productId)

  const submit = async (order, item) => {
    const key = formKey(order.id, item.productId)
    const form = forms[key] || { rating: 5, comment: '' }
    onConfirm({
      title: '評価を登録しますか？',
      message: '登録した評価と感想は店舗の管理者が確認します。内容を確認してから登録してください。',
      confirmText: '登録する',
      onConfirm: async () => {
        await onSubmitReview({ orderNumber: order.id, productId: item.productId, rating: form.rating, comment: form.comment })
      },
    })
  }

  return (
    <main className="container">
      <section className="page-head">
        <p className="eyebrow">Review</p>
        <h1>注文評価</h1>
        <p>受取完了した商品に評価と感想を登録できます。</p>
      </section>

      {receivedOrders.length === 0 ? (
        <p className="empty">評価できる注文はまだありません。</p>
      ) : (
        <section className="review-list">
          {receivedOrders.map((order) => (
            <article className="review-order-card" key={order.id}>
              <div className="order-status-head">
                <div>
                  <h2>注文番号: {order.id}</h2>
                  <p>受取日時: {order.pickupAt}</p>
                </div>
                <span className={`order-badge ${order.status.toLowerCase()}`}>{order.statusLabel}</span>
              </div>

              {order.items.map((item) => {
                const key = formKey(order.id, item.productId)
                const form = forms[key] || { rating: 5, comment: '' }
                const reviewed = alreadyReviewed(order.id, item.productId)

                return (
                  <section className="review-product" key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.quantity}点 / ¥{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    {reviewed ? (
                      <p className="notice">評価済みです。</p>
                    ) : (
                      <div className="review-form">
                        <RatingInput value={form.rating} onChange={(rating) => updateForm(key, 'rating', rating)} />
                        <textarea
                          value={form.comment}
                          onChange={(event) => updateForm(key, 'comment', event.target.value)}
                          placeholder="商品に対する感想を入力してみましょう"
                        />
                        <button type="button" onClick={() => submit(order, item)}>評価を登録する</button>
                      </div>
                    )}
                  </section>
                )
              })}
            </article>
          ))}
        </section>
      )}

      {reviews.length > 0 && (
        <section className="review-list my-review-list">
          <h2>登録済みの評価</h2>
          {reviews.map((review) => (
            <article className="review-row" key={review.id}>
              <div>
                <h3>{review.productName}</h3>
                <p>{review.comment || 'コメントはありません。'}</p>
              </div>
              <RatingStars rating={review.rating} />
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
