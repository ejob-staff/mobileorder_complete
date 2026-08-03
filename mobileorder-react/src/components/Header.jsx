import { useState } from 'react'

export default function Header({ auth, route, onNavigate, onLogout }) {
  const isAdmin = auth?.role === 'admin'
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (path) => {
    setMenuOpen(false)
    onNavigate(path)
  }

  const logout = () => {
    setMenuOpen(false)
    onLogout()
  }

  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => navigate(isAdmin ? '/admin/products' : '/menu')}>
        Sweet Mobile Order
      </button>

      {/* スマホ幅ではナビが画面の大半を占領しないよう、ハンバーガーメニューで開閉させる */}
      <button
        className="nav-toggle"
        type="button"
        aria-label="メニューを開閉する"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        ☰
      </button>

      {menuOpen && (
        <button className="nav-backdrop" type="button" aria-label="メニューを閉じる" onClick={() => setMenuOpen(false)} />
      )}

      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {isAdmin ? (
          <>
            <button className={route.startsWith('/admin/products') ? 'active' : ''} type="button" onClick={() => navigate('/admin/products')}>
              商品管理
            </button>
            <button className={route === '/admin/orders' ? 'active' : ''} type="button" onClick={() => navigate('/admin/orders')}>
              注文状況
            </button>
            <button className={route === '/admin/reviews' ? 'active' : ''} type="button" onClick={() => navigate('/admin/reviews')}>
              注文評価
            </button>
            <button className={route === '/admin/analytics' ? 'active' : ''} type="button" onClick={() => navigate('/admin/analytics')}>
              注文分析
            </button>
            <button className={route.startsWith('/admin/users') ? 'active' : ''} type="button" onClick={() => navigate('/admin/users')}>
              ユーザー管理
            </button>
          </>
        ) : (
          <>
            <button className={route === '/menu' ? 'active' : ''} type="button" onClick={() => navigate('/menu')}>
              商品選択
            </button>
            <button className={route === '/order-status' ? 'active' : ''} type="button" onClick={() => navigate('/order-status')}>
              注文状況
            </button>
            <button className={route === '/history' ? 'active' : ''} type="button" onClick={() => navigate('/history')}>
              注文履歴
            </button>
            <button className={route === '/reviews' ? 'active' : ''} type="button" onClick={() => navigate('/reviews')}>
              注文評価
            </button>
            <button className={route === '/account' ? 'active' : ''} type="button" onClick={() => navigate('/account')}>
              アカウント
            </button>
          </>
        )}
        <button className="ghost-button" type="button" onClick={logout}>
          ログアウト
        </button>
        {/*共通ヘッダー 練習問題3-1-9-1*/}
        <span className="login-status">
          <strong className={`login-user-name ${auth.role}`}>{auth.username}</strong>
          {' '}でログイン中
        </span>
      </nav>
    </header>
  )
}
