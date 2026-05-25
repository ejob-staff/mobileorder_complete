import { useState } from 'react'

export default function SignupPage({ onSignup, onNavigate }) {
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

  const signup = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await onSignup(form)
      onNavigate('/login')
    } catch (currentError) {
      setError(currentError.message)
    }
  }

  return (
    <main className="login-layout">
      <section className="login-content">
        <p className="eyebrow">Sweet Mobile Order</p>

        <form className="login-form" onSubmit={signup}>
          <h2>新規アカウント作成</h2>
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
            パスワード
            <input name="password" type="password" value={form.password} onChange={updateForm} autoComplete="new-password" required />
          </label>

          <label>
            パスワード確認用
            <input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={updateForm} autoComplete="new-password" required />
          </label>

          <div className="form-actions">
            <button type="submit">新規アカウント作成</button>
            <button className="ghost-button" type="button" onClick={() => onNavigate('/login')}>ログインに戻る</button>
          </div>
        </form>
      </section>
    </main>
  )
}
