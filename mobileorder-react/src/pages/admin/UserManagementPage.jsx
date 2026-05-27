import { useEffect, useState } from 'react'

function UserVisual({ user }) {
  const isAdminUser = user.role === '管理者ユーザー'
  const initial = isAdminUser ? 'ADMIN' : 'USER'

  return (
    <div className={isAdminUser ? 'user-visual admin-user' : 'user-visual general-user'}>
      <span>{initial}</span>
    </div>
  )
}

function UserManagementCodeList({ codes }) {
  if (codes.length === 0) {
    return <p className="empty">発行済みのユーザー管理番号はありません。</p>
  }

  return (
    <section className="code-list">
      {codes.map((code) => (
        <article className="code-row" key={code.id}>
          <div>
            <h3>{code.code}</h3>
            <p>{code.username ? `利用ユーザー: ${code.username}` : 'まだユーザー登録には使用されていません。'}</p>
          </div>
          <div className="code-meta">
            <span className={code.status === '未使用' ? 'status open' : 'status closed'}>{code.status}</span>
            <span>{code.createdAt}</span>
          </div>
        </article>
      ))}
    </section>
  )
}

const usernameSortValue = (username) => {
  const match = username.match(/^([a-zA-Z]+)(\d*)$/)
  if (!match) {
    return { prefix: username, number: 0 }
  }

  return {
    prefix: match[1],
    number: match[2] ? Number(match[2]) : 1,
  }
}

const sortUsers = (users) => {
  return [...users].sort((a, b) => {
    const roleOrder = (b.role === '管理者ユーザー' ? 1 : 0) - (a.role === '管理者ユーザー' ? 1 : 0)
    if (roleOrder !== 0) {
      return roleOrder
    }

    const current = usernameSortValue(a.username)
    const next = usernameSortValue(b.username)
    const prefixOrder = current.prefix.localeCompare(next.prefix)
    if (prefixOrder !== 0) {
      return prefixOrder
    }

    return current.number - next.number
  })
}

export default function UserManagementPage({ users, codes, currentUsername, initialTab, onChangeTab, onIssueUserCode, onStartAdminRegistration, onToggleUserStatus, onDeleteUser, onConfirm }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [issuedCode, setIssuedCode] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const userCodes = codes.filter((code) => code.code.startsWith('USER-CODE-'))
  const adminCodes = codes.filter((code) => code.code.startsWith('ADMIN-CODE-'))
  const filteredUsers = sortUsers(users.filter((user) => {
    if (userFilter === 'general') {
      return user.role === '一般ユーザー'
    }

    if (userFilter === 'admin') {
      return user.role === '管理者ユーザー'
    }

    return true
  }))

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const changeTab = (nextTab) => {
    setActiveTab(nextTab)
    onChangeTab(nextTab)
  }

  const issueUserCode = () => {
    onConfirm({
      title: 'ユーザー管理番号発行の確認',
      message: '一般ユーザー用のユーザー管理番号を作成します。ユーザー管理番号をランダムな文字列で発行しますが、よろしいですか？',
      confirmText: '発行する',
      onConfirm: async () => {
        const code = await onIssueUserCode()
        setIssuedCode(code.code)
      },
    })
  }

  const deleteUser = (user) => {
    onConfirm({
      title: 'ユーザー削除の確認',
      message: '登録されているユーザーですが、本当に削除しますか？',
      confirmText: '削除する',
      confirmVariant: 'danger',
      onConfirm: () => onDeleteUser(user.id),
    })
  }

  return (
    <main className="container admin-layout">
      <section className="page-head">
        <p className="eyebrow">Admin</p>
        <h1>ユーザー管理</h1>
        <p>ユーザー管理番号の発行、ユーザーの利用状態、削除を管理できます。</p>
      </section>

      <div className="management-tabs">
        <button className={activeTab === 'users' ? 'active' : ''} type="button" onClick={() => changeTab('users')}>
          ユーザー一覧
        </button>
        <button className={activeTab === 'userCodes' ? 'active' : ''} type="button" onClick={() => changeTab('userCodes')}>
          一般ユーザー用管理番号一覧
        </button>
        <button className={activeTab === 'adminCodes' ? 'active' : ''} type="button" onClick={() => changeTab('adminCodes')}>
          管理者ユーザー用管理番号一覧
        </button>
      </div>

      {activeTab === 'users' && (
        <section className="management-section">
          <h2>ユーザー一覧</h2>
          <div className="category-tabs user-filter-tabs">
            <button className={userFilter === 'all' ? 'active' : ''} type="button" onClick={() => setUserFilter('all')}>
              すべて
            </button>
            <button className={userFilter === 'general' ? 'active' : ''} type="button" onClick={() => setUserFilter('general')}>
              一般ユーザー
            </button>
            <button className={userFilter === 'admin' ? 'active' : ''} type="button" onClick={() => setUserFilter('admin')}>
              管理者ユーザー
            </button>
          </div>
          <div className="admin-list">
            {filteredUsers.map((user) => {
              const isAdminUser = user.role === '管理者ユーザー'
              const isCurrentUser = user.username === currentUsername

              return (
                <article className="admin-product user-card" key={user.id}>
                  <UserVisual user={user} />
                  <div>
                    <div className="item-title-row">
                      <h3>{user.username}</h3>
                      <span className={user.enabled ? 'status open' : 'status closed'}>{user.status}</span>
                    </div>
                    <div className="meta-row">
                      <span>権限 {user.role}</span>
                      <span>ステータス {user.status}</span>
                    </div>
                    <div className="item-actions">
                      <button className="ghost-button" type="button" disabled={isAdminUser} onClick={() => onToggleUserStatus(user.id)}>
                        {user.enabled ? '利用停止' : '利用再開'}
                      </button>
                      <button className="danger-button" type="button" disabled={isCurrentUser} onClick={() => deleteUser(user)}>
                        削除
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {activeTab === 'userCodes' && (
        <section className="management-section">
          <div className="section-title-row">
            <h2>一般ユーザー用管理番号一覧</h2>
            <button type="button" onClick={issueUserCode}>ユーザー管理番号を発行する</button>
          </div>
          {issuedCode.startsWith('USER-CODE-') && <p className="code-notice">ユーザー管理番号「{issuedCode}」を発行しました。</p>}
          <UserManagementCodeList codes={userCodes} />
        </section>
      )}

      {activeTab === 'adminCodes' && (
        <section className="management-section">
          <div className="section-title-row">
            <h2>管理者用管理番号一覧</h2>
            <button type="button" onClick={onStartAdminRegistration}>新しく管理者ユーザーを登録する</button>
          </div>
          <UserManagementCodeList codes={adminCodes} />
        </section>
      )}
    </main>
  )
}
