const chartWidth = 640
const chartHeight = 220
const chartPadding = 28

const toLinePoints = (dailySales) => {
  if (!dailySales || dailySales.length === 0) {
    return ''
  }

  const maxSales = Math.max(...dailySales.map((item) => item.sales), 1)
  return dailySales.map((item, index) => {
    const x = chartPadding + (index * (chartWidth - chartPadding * 2)) / Math.max(dailySales.length - 1, 1)
    const y = chartHeight - chartPadding - (item.sales / maxSales) * (chartHeight - chartPadding * 2)
    return `${x},${y}`
  }).join(' ')
}

const pentagonMetrics = [
  { key: 'salesPower', label: '売上力' },
  { key: 'orderVolume', label: '注文数' },
  { key: 'onTimeRate', label: '提供時間' },
  { key: 'customerRating', label: 'お客様評価' },
  { key: 'repeatPotential', label: 'リピート期待' },
]

const pentagonVertex = (index, radius = 58) => {
  const center = 90
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / pentagonMetrics.length
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  }
}

const pentagonPoints = (score) => {
  return pentagonMetrics.map((metric, index) => {
    const currentRadius = 62 * (score[metric.key] / 100)
    const point = pentagonVertex(index, currentRadius)
    return `${point.x},${point.y}`
  }).join(' ')
}

export default function AnalyticsPage({ analytics }) {
  if (!analytics) {
    return (
      <main className="container admin-layout">
        <p className="empty">注文分析データを読み込み中です。</p>
      </main>
    )
  }

  return (
    <main className="container admin-layout">
      <section className="page-head">
        <p className="eyebrow">Admin</p>
        <h1>注文分析</h1>
        <p>売上、注文数、評価、カテゴリ別の傾向を確認できます。</p>
      </section>

      <section className="analytics-summary">
        <article>
          <span>売上合計</span>
          <strong>¥{analytics.totalSales.toLocaleString()}</strong>
        </article>
        <article>
          <span>注文数</span>
          <strong>{analytics.orderCount}件</strong>
        </article>
        <article>
          <span>平均評価</span>
          <strong>{analytics.averageRating.toFixed(1)}</strong>
        </article>
      </section>

      <section className="analytics-panel">
        <h2>日付別の売上推移</h2>
        <svg className="sales-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="日付別の売上推移グラフ">
          <polyline points={toLinePoints(analytics.dailySales)} fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {analytics.dailySales.map((item, index) => {
            const maxSales = Math.max(...analytics.dailySales.map((current) => current.sales), 1)
            const x = chartPadding + (index * (chartWidth - chartPadding * 2)) / Math.max(analytics.dailySales.length - 1, 1)
            const y = chartHeight - chartPadding - (item.sales / maxSales) * (chartHeight - chartPadding * 2)
            return (
              <g key={item.date}>
                <circle cx={x} cy={y} r="5" fill="#7c3aed" />
                <text x={x} y={chartHeight - 6} textAnchor="middle">{item.date}</text>
              </g>
            )
          })}
        </svg>
      </section>

      <section className="analytics-panel">
        <h2>カテゴリ別バランス</h2>
        <div className="pentagon-grid">
          {analytics.categoryScores.map((score) => (
            <article className="pentagon-card" key={score.category}>
              <h3>{score.category}</h3>
              <svg viewBox="0 0 180 180" role="img" aria-label={`${score.category}の分析`}>
                <polygon points="90,24 153,70 129,145 51,145 27,70" fill="#f4ddff" stroke="#d8b4fe" />
                <polygon points={pentagonPoints(score)} fill="rgba(219, 39, 119, 0.32)" stroke="#db2777" strokeWidth="3" />
                {pentagonMetrics.map((metric, index) => {
                  const point = pentagonVertex(index, 80)
                  return (
                    <text className="pentagon-label" x={point.x} y={point.y} textAnchor="middle" dominantBaseline="middle" key={metric.key}>
                      {metric.label}
                    </text>
                  )
                })}
              </svg>
              <ul>
                <li>売上力 {score.salesPower}</li>
                <li>注文数 {score.orderVolume}</li>
                <li>提供時間 {score.onTimeRate}</li>
                <li>お客様評価 {score.customerRating}</li>
                <li>リピート期待 {score.repeatPotential}</li>
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
