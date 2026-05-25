export default function RatingStars({ rating = 0, count = 0 }) {
  const rounded = Math.round(Number(rating || 0))
  const stars = Array.from({ length: 5 }, (_, index) => (index < rounded ? '★' : '☆')).join('')

  return (
    <span className="rating-stars">
      <span>{stars}</span>
      <strong>{Number(rating || 0).toFixed(1)}</strong>
      {count > 0 && <small>({count})</small>}
    </span>
  )
}
