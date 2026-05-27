import { useEffect, useState } from 'react'

const statusOptions = [
  { value: 'PENDING', label: '未対応' },
  { value: 'COOKING', label: '調理中' },
  { value: 'READY', label: '完成' },
  { value: 'SERVED', label: '提供済み' },
  { value: 'CANCELED', label: 'キャンセル' },
]

const filterOptions = [
  { value: 'ALL', label: 'すべて' },
  ...statusOptions,
]

const statusLabel = (status) => statusOptions.find((option) => option.value === status)?.label || ''

const parseOrderDate = (value) => {
  if (!value) {
    return null
  }

  const [date, time] = value.split(' ')
  const [year, month, day] = date.split('/').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

const shouldShowPickupWarning = (order) => {
  if (order.status !== 'PENDING') {
    return false
  }

  const pickupAt = parseOrderDate(order.pickupAt)
  if (!pickupAt) {
    return false
  }

  const minutesUntilPickup = (pickupAt.getTime() - Date.now()) / 1000 / 60
  return minutesUntilPickup <= 20 && minutesUntilPickup >= 0
}

const getEmptyMessage = (activeFilter) => {
  if (activeFilter === 'ALL') {
    return '現在、注文されている商品はありません。'
  }

  return `現在、「${statusLabel(activeFilter)}」のステータスの商品はありません。`
}

const isFormChanged = (order, form) => {
  if (!form) {
    return false
  }

  if (form.status !== order.status) {
    return true
  }

  if (form.status === 'CANCELED') {
    return (form.cancelReason || '') !== (order.cancelReason || '')
  }

  return false
}

export default function AdminOrdersPage({ orders, onUpdateStatus, onConfirm }) {
  const [forms, setForms] = useState({})
  const [activeFilter, setActiveFilter] = useState('ALL')
  const filteredOrders = activeFilter === 'ALL' ? orders : orders.filter((order) => order.status === activeFilter)

  useEffect(() => {
    const next = {}
    orders.forEach((order) => {
      next[order.id] = { status: order.status, cancelReason: order.cancelReason || '' }
    })
    setForms(next)
  }, [orders])

  const updateForm = (orderId, field, value) => {
    setForms((current) => ({
      ...current,
      [orderId]: {
        status: current[orderId]?.status || 'PENDING',
        cancelReason: current[orderId]?.cancelReason || '',
        [field]: value,
      },
    }))
  }

  const confirmUpdate = (order) => {
    const form = forms[order.id] || { status: order.status, cancelReason: '' }

    if (!isFormChanged(order, form)) {
      return
    }

    if (form.status === 'CANCELED' && !form.cancelReason.trim()) {
      onConfirm({
        title: 'キャンセル理由を入力してください',
        message: 'キャンセルに切り替える場合は、注文したお客様に表示する理由の入力が必要です。',
        confirmText: 'OK',
      })
      return
    }

    onConfirm({
      title: '注文状況を更新しますか？',
      message: '注文したお客様にステータスが反映されますがよろしいですか？',
      confirmText: '更新する',
      onConfirm: () => onUpdateStatus(order.id, form),
    })
  }

  return (
    <main className="container admin-layout">
      <section className="page-head">
        <p className="eyebrow">Admin</p>
        <h1>注文状況</h1>
        <p>お客様の注文状況を確認し、準備状況を更新できます。</p>
      </section>

      <div className="category-tabs">
        {filterOptions.map((option) => (
          <button
            className={activeFilter === option.value ? 'active' : ''}
            type="button"
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="empty">{getEmptyMessage(activeFilter)}</p>
      ) : (
        <section className="admin-order-list">
          {filteredOrders.map((order) => {
            const form = forms[order.id] || { status: order.status, cancelReason: order.cancelReason || '' }
            const changed = isFormChanged(order, form)
            return (
              <article className="admin-order-card" key={order.id}>
                <div className="order-status-head">
                  <div>
                    <h2>注文番号: {order.id}</h2>
                    <div className="order-meta-list">
                      <span>注文日時: {order.createdAt}</span>
                      <span>受取日時: {order.pickupAt}</span>
                      <span>お客様のユーザー名: {order.username}</span>
                    </div>
                  </div>
                  <span className={`order-badge ${order.status.toLowerCase()}`}>{order.statusLabel}</span>
                </div>

                {shouldShowPickupWarning(order) && (
                  <p className="pickup-warning">受け取り日時がもうすぐです。商品の準備を始めましょう。</p>
                )}

                <section className="ordered-products">
                  <h3>注文された商品</h3>
                  <ul className="order-items">
                    {order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}
                  </ul>
                </section>

                <div className="total-row admin-total-row">
                  <span>合計</span>
                  <strong>¥{order.total.toLocaleString()}</strong>
                </div>

                <section className="order-status-editor">
                  <h3>ステータス</h3>
                  <div className="status-control">
                    {statusOptions.map((option) => (
                      <label className="status-option" key={option.value}>
                        <input
                          type="radio"
                          name={`status-${order.id}`}
                          value={option.value}
                          checked={form.status === option.value}
                          onChange={(event) => updateForm(order.id, 'status', event.target.value)}
                        />
                        <span className={`order-badge ${option.value.toLowerCase()}`}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {form.status === 'CANCELED' && (
                  <label>
                    キャンセルの理由
                    <textarea
                      value={form.cancelReason}
                      onChange={(event) => updateForm(order.id, 'cancelReason', event.target.value)}
                      placeholder="お客様に表示するキャンセル理由を入力してください"
                    />
                  </label>
                )}

                <div className="actions">
                  <button type="button" disabled={!changed} onClick={() => confirmUpdate(order)}>ステータスを更新</button>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
