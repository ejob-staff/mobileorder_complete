import { useState } from 'react'

export default function LoginPage({ onLogin, onNavigate }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const login = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await onLogin(form)
    } catch (currentError) {
      setError(currentError.message)
    }
  }

  return (
    <main className="login-layout">
      <section className="login-content">
        <p className="eyebrow">Sweet Mobile Order</p>

        <form className="login-form" onSubmit={login}>
          <h2>ログイン</h2>
          {error && <p className="alert">{error}</p>}

          <label>
            ユーザー名
            <input name="username" value={form.username} onChange={updateForm} autoComplete="username" required />
          </label>

          <label>
            パスワード
            <div className="password-field">
              <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateForm} autoComplete="current-password" required />
              <button className="password-toggle" type="button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? '非表示' : '表示'}
              </button>
            </div>
          </label>

          <button type="submit">ログインする</button>

          <div className="login-links">
            <button className="login-link-button" type="button" onClick={() => onNavigate('/signup')}>
              新規アカウント作成はこちらから
            </button>
            <button className="login-link-button" type="button" onClick={() => onNavigate('/password-reset')}>
              パスワードの再設定はこちらから
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
