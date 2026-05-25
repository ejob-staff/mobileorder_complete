export default function Header({ auth, route, onNavigate, onLogout }) {
  const isAdmin = auth?.role === 'admin'

  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => onNavigate(isAdmin ? '/admin/products' : '/menu')}>
        Sweet Mobile Order
      </button>

      <nav className="nav">
        {isAdmin ? (
          <>
            <button className={route.startsWith('/admin/products') ? 'active' : ''} type="button" onClick={() => onNavigate('/admin/products')}>
              商品管理
            </button>
            <button className={route === '/admin/orders' ? 'active' : ''} type="button" onClick={() => onNavigate('/admin/orders')}>
              注文状況
            </button>
            <button className={route === '/admin/reviews' ? 'active' : ''} type="button" onClick={() => onNavigate('/admin/reviews')}>
              注文評価
            </button>
            <button className={route === '/admin/analytics' ? 'active' : ''} type="button" onClick={() => onNavigate('/admin/analytics')}>
              注文分析
            </button>
            <button className={route.startsWith('/admin/users') ? 'active' : ''} type="button" onClick={() => onNavigate('/admin/users')}>
              ユーザー管理
            </button>
          </>
        ) : (
          <>
            <button className={route === '/menu' ? 'active' : ''} type="button" onClick={() => onNavigate('/menu')}>
              商品選択
            </button>
            <button className={route === '/order-status' ? 'active' : ''} type="button" onClick={() => onNavigate('/order-status')}>
              注文状況
            </button>
            <button className={route === '/history' ? 'active' : ''} type="button" onClick={() => onNavigate('/history')}>
              注文履歴
            </button>
            <button className={route === '/reviews' ? 'active' : ''} type="button" onClick={() => onNavigate('/reviews')}>
              注文評価
            </button>
            <button className={route === '/account' ? 'active' : ''} type="button" onClick={() => onNavigate('/account')}>
              アカウント
            </button>
          </>
        )}
        <button className="ghost-button" type="button" onClick={onLogout}>
          ログアウト
        </button>
        <span className="login-status"><strong>{auth.username}</strong> でログイン中</span>
      </nav>
    </header>
  )
}
