import { useEffect, useState } from 'react'

export default function AdminUserRegistrationPage({ managementCode, onSubmit, onCancel, onConfirm }) {
  const [form, setForm] = useState({
    code: managementCode,
    username: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    setForm((current) => ({ ...current, code: managementCode }))
  }, [managementCode])

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitAdminUser = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await onSubmit(form)
    } catch (currentError) {
      setError(currentError.message)
    }
  }

  const cancelRegistration = () => {
    onConfirm({
      title: 'ユーザー登録中断確認',
      message: '編集中の内容はクリアされ、発行済みの管理者ユーザー用管理番号は破棄されます。よろしいですか？',
      confirmText: '戻る',
      onConfirm: onCancel,
    })
  }

  return (
    <main className="container narrow admin-layout">
      <section className="page-head">
        <p className="eyebrow">Admin</p>
        <h1>新規管理者ユーザー登録</h1>
        <p>管理者用のユーザー管理番号を使用して、管理者ユーザーを登録できます。</p>
      </section>

      <form className="tool-panel product-form" onSubmit={submitAdminUser}>
        {error && <p className="alert">{error}</p>}

        <label>
          ユーザー管理番号
          <input name="code" value={form.code} readOnly />
        </label>

        <label>
          ユーザー名
          <input name="username" value={form.username} onChange={updateForm} required />
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
          <button type="submit">登録する</button>
          <button className="ghost-button" type="button" onClick={cancelRegistration}>戻る</button>
        </div>
      </form>
    </main>
  )

}
