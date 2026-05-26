import { useEffect, useMemo, useState } from 'react'

const pad = (value) => String(value).padStart(2, '0')

const formatDateValue = (date) => {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  return `${year}-${month}-${day}`
}

const formatDateLabel = (date) => {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  return `${year}/${month}/${day}`
}

const formatTimeValue = (date) => {
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${hours}:${minutes}`
}

const roundUpToNextTenMinutes = (date) => {
  const rounded = new Date(date)
  rounded.setSeconds(0, 0)
  const remainder = rounded.getMinutes() % 10
  const minutesToAdd = remainder === 0 ? 10 : 10 - remainder
  rounded.setMinutes(rounded.getMinutes() + minutesToAdd)

  return rounded
}

const buildPickupOptions = () => {
  const now = new Date()
  const start = roundUpToNextTenMinutes(now)
  const end = new Date(now.getTime() + 4 * 60 * 60 * 1000)
  end.setSeconds(0, 0)

  const slots = []
  const current = new Date(start)

  while (current <= end) {
    const dateValue = formatDateValue(current)
    slots.push({
      value: `${dateValue}T${formatTimeValue(current)}`,
      dateValue,
      dateLabel: formatDateLabel(current),
      timeValue: formatTimeValue(current),
    })
    current.setMinutes(current.getMinutes() + 10)
  }

  const dateOptions = [...new Map(slots.map((slot) => [slot.dateValue, { value: slot.dateValue, label: slot.dateLabel }])).values()]

  return { dateOptions, slots }
}

export default function OrderConfirmPage({ cart, onChangeQuantity, onRemove, onSubmitOrder, onNavigate }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const { dateOptions, slots } = useMemo(() => buildPickupOptions(), [])
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.value || '')
  const [selectedTime, setSelectedTime] = useState(slots[0]?.timeValue || '')
  const timeOptions = useMemo(
    () => slots.filter((slot) => slot.dateValue === selectedDate),
    [selectedDate, slots],
  )
  const pickupAt = selectedDate && selectedTime ? `${selectedDate}T${selectedTime}` : ''

  useEffect(() => {
    if (!timeOptions.some((slot) => slot.timeValue === selectedTime)) {
      setSelectedTime(timeOptions[0]?.timeValue || '')
    }
  }, [selectedDate, selectedTime, timeOptions])

  if (cart.length === 0) {
    return (
      <main className="container narrow">
        <p className="empty">注文する商品が選択されていません。</p>
        <button type="button" onClick={() => onNavigate('/menu')}>商品選択へ戻る</button>
      </main>
    )
  }

  return (
    <main className="container narrow">
      <section className="page-head">
        <p className="eyebrow">Confirm</p>
        <h1>注文確認</h1>
        <p>内容と受け取り日時を確認して、注文を確定してください。</p>
      </section>

      <section className="order-summary">
        {cart.map((item) => (
          <article className="summary-row" key={item.id}>
            <div>
              <h2>{item.name}</h2>
              <p>¥{item.price.toLocaleString()} / {item.quantity}点</p>
            </div>
            <div className="quantity-row compact">
              <button type="button" onClick={() => onChangeQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => onChangeQuantity(item.id, item.quantity + 1)}>+</button>
              <button className="danger-button" type="button" onClick={() => onRemove(item.id)}>削除</button>
            </div>
          </article>
        ))}

        <div className="pickup-selects">
          <label>
            受け取り日
            <select
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              disabled={dateOptions.length <= 1}
              required
            >
              {dateOptions.map((date) => (
                <option value={date.value} key={date.value}>{date.label}</option>
              ))}
            </select>
          </label>

          <label>
            受け取り時刻
            <select value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} required>
              {timeOptions.map((slot) => (
                <option value={slot.timeValue} key={slot.value}>{slot.timeValue}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="form-note">現在時刻より現在から4時間後までの日時を選択できます。</p>

        <div className="total-row">
          <span>合計</span>
          <strong>¥{total.toLocaleString()}</strong>
        </div>
      </section>

      <div className="actions">
        <button className="ghost-button" type="button" onClick={() => onNavigate('/menu')}>商品選択へ戻る</button>
        <button type="button" disabled={!pickupAt} onClick={() => onSubmitOrder(pickupAt)}>注文を確定する</button>
      </div>
    </main>
  )
}
