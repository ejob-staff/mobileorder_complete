import { useState } from 'react'

export default function PasswordResetPage({ onPasswordReset, onNavigate }) {
  const [form, setForm] = useState({
    code: '',
    username: '',
    password: '',
    passwordConfirm: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetPassword = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await onPasswordReset(form)
      onNavigate('/login')
    } catch (currentError) {
      setError(currentError.message)
    }
  }

  return (
    <main className="login-layout">
      <section className="login-content">
        <p className="eyebrow">Sweet Mobile Order</p>

        <form className="login-form" onSubmit={resetPassword}>
          <h2>パスワード再設定</h2>
          {message && <p className="notice">{message}</p>}
          {error && <p className="alert">{error}</p>}

          <label>
            ユーザー管理番号
            <input name="code" value={form.code} onChange={updateForm} placeholder="ユーザー管理番号を入力してください" required />
          </label>

          <label>
            ユーザー名
            <input name="username" value={form.username} onChange={updateForm} autoComplete="username" required />
          </label>

          <label>
            新しいパスワード
            <input name="password" type="password" value={form.password} onChange={updateForm} autoComplete="new-password" required />
          </label>

          <label>
            新しいパスワード確認用
            <input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={updateForm} autoComplete="new-password" required />
          </label>

          <div className="form-actions">
            <button type="submit">再設定する</button>
            <button className="ghost-button" type="button" onClick={() => onNavigate('/login')}>ログインに戻る</button>
          </div>
        </form>
      </section>
    </main>
  )
}
