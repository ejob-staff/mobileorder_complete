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

const average = (values) => {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

const categoryAverage = (score) => {
  return average(pentagonMetrics.map((metric) => score[metric.key] || 0))
}

const evaluateSalesTrend = (dailySales) => {
  if (!dailySales || dailySales.length === 0) {
    return {
      score: 50,
      label: 'データ待ち',
      description: '売上推移のデータが増えると、傾向を評価できます。',
    }
  }

  const sales = dailySales.map((item) => item.sales)
  const midpoint = Math.max(1, Math.floor(sales.length / 2))
  const firstAverage = average(sales.slice(0, midpoint))
  const recentAverage = average(sales.slice(midpoint).length > 0 ? sales.slice(midpoint) : sales)
  const baseline = Math.max(firstAverage, 1)
  const growthRate = (recentAverage - firstAverage) / baseline
  const maxSales = Math.max(...sales, 1)
  const volatility = (Math.max(...sales) - Math.min(...sales)) / maxSales
  const growthScore = Math.max(0, Math.min(100, 60 + growthRate * 120))
  const stabilityScore = Math.max(0, 100 - volatility * 45)
  const score = Math.round(growthScore * 0.7 + stabilityScore * 0.3)

  if (growthRate > 0.12) {
    return {
      score,
      label: '上向き',
      description: '直近の売上平均が前半より伸びていて、注文の勢いが出ています。',
    }
  }

  if (growthRate < -0.12) {
    return {
      score,
      label: '減少傾向',
      description: '直近の売上平均が前半より下がっています。おすすめ表示やカテゴリ訴求の見直し余地があります。',
    }
  }

  return {
    score,
    label: volatility > 0.55 ? '変動あり' : '安定',
    description: volatility > 0.55
      ? '売上の上下がやや大きく、日ごとの注文差が出ています。'
      : '売上は大きく崩れず、安定した推移です。',
  }
}

const buildOverallEvaluation = (analytics) => {
  const salesTrend = evaluateSalesTrend(analytics.dailySales)
  const categoryScores = analytics.categoryScores || []
  const rankedCategories = [...categoryScores].sort((a, b) => categoryAverage(b) - categoryAverage(a))
  const strongest = rankedCategories[0]
  const weakest = rankedCategories[rankedCategories.length - 1]
  const categoryScore = Math.round(average(categoryScores.map(categoryAverage)))
  const salesPowerScore = Math.round(average(categoryScores.map((score) => score.salesPower || 0)))
  const orderVolumeScore = Math.round(average(categoryScores.map((score) => score.orderVolume || 0)))
  const onTimeScore = Math.round(average(categoryScores.map((score) => score.onTimeRate || 0)))
  const repeatScore = Math.round(average(categoryScores.map((score) => score.repeatPotential || 0)))
  const ratingScore = Math.round(Math.min(100, (analytics.averageRating / 5) * 100))
  const totalScore = Math.round(salesTrend.score * 0.4 + categoryScore * 0.4 + repeatScore * 0.1 + ratingScore * 0.1)
  const status = totalScore >= 80 ? '好調キープ' : totalScore >= 65 ? '安定運用' : totalScore >= 50 ? '改善チャンス' : '重点改善'
  const statusClass = totalScore >= 80 ? 'excellent' : totalScore >= 65 ? 'stable' : totalScore >= 50 ? 'chance' : 'urgent'

  const strength = strongest
    ? `${strongest.category}はカテゴリ総合が高く、売上や注文の柱になっています。`
    : 'カテゴリ別データが増えると、強みカテゴリを評価できます。'
  const improvement = weakest
    ? `${weakest.category}は伸ばせる余地があります。評価と注文数の差を見ながら、商品構成や販売タイミングを見直す候補にできます。`
    : 'カテゴリ別の比較データがまだ不足しています。'

  return {
    totalScore,
    status,
    statusClass,
    salesTrend,
    categoryScore,
    salesPowerScore,
    orderVolumeScore,
    onTimeScore,
    repeatScore,
    ratingScore,
    strength,
    improvement,
  }
}

export default function AnalyticsPage({ analytics }) {
  if (!analytics) {
    return (
      <main className="container admin-layout">
        <p className="empty">注文分析データを読み込み中です。</p>
      </main>
    )
  }
  const evaluation = buildOverallEvaluation(analytics)

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

      <section className="analytics-panel evaluation-panel">
        <div className="evaluation-card-head">
          <div>
            <h2>総合インサイト</h2>
          </div>
        </div>
        <div className="evaluation-highlight-grid">
          <article className={`condition-card ${evaluation.statusClass}`}>
            <span>店舗コンディション</span>
            <strong>{evaluation.status}</strong>
          </article>
          <article>
            <span>全体スコア</span>
            <strong>{evaluation.totalScore}<small>/100</small></strong>
          </article>
        </div>
        <div className="evaluation-grid">
          <article>
            <span>売上力</span>
            <strong>{evaluation.salesPowerScore}<small>/100</small></strong>
          </article>
          <article>
            <span>注文数</span>
            <strong>{evaluation.orderVolumeScore}<small>/100</small></strong>
          </article>
          <article>
            <span>提供時間</span>
            <strong>{evaluation.onTimeScore}<small>/100</small></strong>
          </article>
          <article>
            <span>お客様評価</span>
            <strong>{evaluation.ratingScore}<small>/100</small></strong>
          </article>
          <article>
            <span>リピート期待</span>
            <strong>{evaluation.repeatScore}<small>/100</small></strong>
          </article>
        </div>
        <div className="evaluation-notes">
          <article>
            <h3>分析コメント</h3>
            <p>{evaluation.salesTrend.description}</p>
          </article>
          <article>
            <h3>全体評価</h3>
            <p>{evaluation.strength}</p>
          </article>
          <article>
            <h3>カテゴリ別評価</h3>
            <p>{evaluation.improvement}</p>
          </article>
        </div>
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
                      {metric.key === 'repeatPotential' ? (
                        <>
                          <tspan x={point.x} dy="-0.45em">リピート</tspan>
                          <tspan x={point.x} dy="1.1em">期待</tspan>
                        </>
                      ) : metric.label}
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
