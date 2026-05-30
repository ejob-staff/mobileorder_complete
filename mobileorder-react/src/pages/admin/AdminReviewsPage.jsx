import { useEffect, useState } from 'react'
import RatingStars from '../../components/RatingStars.jsx'

const periodOptions = [
  { value: 'all', label: 'すべて' },
  { value: 'week', label: '直近1週間' },
  { value: 'month', label: '直近1ヶ月' },
]

export default function AdminReviewsPage({ reviews, onLoadReviews }) {
  const [period, setPeriod] = useState('all')

  useEffect(() => {
    onLoadReviews(period)
  }, [period])

  return (
    <main className="container admin-layout">
      <section className="page-head">
        <p className="eyebrow">Admin</p>
        <h1>注文評価</h1>
        <p>お客様が評価した商品の一覧を確認できます。</p>
      </section>

      <div className="category-tabs">
        {periodOptions.map((option) => (
          <button className={period === option.value ? 'active' : ''} type="button" key={option.value} onClick={() => setPeriod(option.value)}>
            {option.label}
          </button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <p className="empty">対象期間の注文評価はありません。</p>
      ) : (
        <section className="review-list">
          {reviews.map((review) => (
            <article className="review-row" key={review.id}>
              <div className="review-main">
                <h2>{review.productName}</h2>
                <div className="review-detail-list">
                  <span>注文番号: {review.orderNumber}</span>
                  <span>ユーザー名: {review.username}</span>
                  <span>評価: <RatingStars rating={review.rating} /></span>
                </div>
                <p className="review-comment">
                  <span>お客様の感想</span>
                  {review.comment || 'コメントはありません。'}
                </p>
              </div>
              <div className="review-meta">
                <span>{review.createdAt}</span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
