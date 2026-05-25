import { useEffect, useState } from 'react'

const emptyForm = {
  password: '',
  passwordConfirm: '',
}

export default function AccountPage({ account, onUpdateAccount, onConfirm }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (account) {
      setForm(emptyForm)
    }
  }, [account])

  if (!account) {
    return (
      <main className="container narrow">
        <p className="empty">アカウント情報を読み込み中です。</p>
      </main>
    )
  }

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const startEditing = () => {
    setError('')
    setForm(emptyForm)
    setEditing(true)
  }

  const submit = (event) => {
    event.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      setError('パスワードとパスワード確認用が一致しません。')
      return
    }

    onConfirm({
      title: 'パスワードを変更しますか？',
      message: 'お客様のパスワードが変更されますが、よろしいですか？',
      confirmText: '変更する',
      onConfirm: async () => {
        await onUpdateAccount(form)
        setEditing(false)
      },
    })
  }

  const cancelEditing = () => {
    onConfirm({
      title: '編集をキャンセルしますか？',
      message: '編集した内容はクリアされますが、よろしいですか？',
      confirmText: 'キャンセルする',
      onConfirm: () => {
        setError('')
        setForm(emptyForm)
        setEditing(false)
      },
    })
  }

  return (
    <main className="container narrow">
      <section className="page-head">
        <p className="eyebrow">Account</p>
        <h1>アカウント</h1>
        <p>ログイン中のアカウント情報を確認できます。</p>
      </section>

      <section className="account-panel">
        {editing ? (
          <form className="account-edit-form" onSubmit={submit}>
            {error && <p className="alert">{error}</p>}
            <label>
              ユーザー管理番号
              <input value={account.managementCode} disabled />
            </label>
            <label>
              ユーザー名
              <input value={account.username} disabled />
            </label>
            <label>
              パスワード
              <input name="password" type="password" value={form.password} onChange={updateForm} required />
            </label>
            <label>
              パスワード確認用
              <input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={updateForm} required />
            </label>
            <div className="form-actions">
              <button type="submit">変更する</button>
              <button className="ghost-button" type="button" onClick={cancelEditing}>キャンセル</button>
            </div>
          </form>
        ) : (
          <>
            <dl>
              <div>
                <dt>ユーザー管理番号</dt>
                <dd>{account.managementCode}</dd>
              </div>
              <div>
                <dt>ユーザー名</dt>
                <dd>{account.username}</dd>
              </div>
              <div>
                <dt>パスワード</dt>
                <dd>{account.passwordMask}</dd>
              </div>
            </dl>
            <button type="button" onClick={startEditing}>パスワードを変更する</button>
          </>
        )}
      </section>
    </main>
  )
}
