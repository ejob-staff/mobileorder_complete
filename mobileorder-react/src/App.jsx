import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiRequest, jsonHeaders } from './api/client.js'
import Header from './components/Header.jsx'
import ConfirmModal from './components/ConfirmModal.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import PasswordResetPage from './pages/PasswordResetPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import ConfirmPage from './pages/OrderConfirmPage.jsx'
import CompletePage from './pages/OrderCompletePage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import OrderStatusPage from './pages/OrderStatusPage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import AccessDeniedPage from './pages/AccessDeniedPage.jsx'
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx'
import ProductFormPage from './pages/admin/ProductFormPage.jsx'
import UserManagementPage from './pages/admin/UserManagementPage.jsx'
import AdminUserRegistrationPage from './pages/admin/AdminUserRegistrationPage.jsx'
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx'
import AdminReviewsPage from './pages/admin/AdminReviewsPage.jsx'
import AnalyticsPage from './pages/admin/AnalyticsPage.jsx'
import './App.css'

function App() {
  const routerNavigate = useNavigate()
  const location = useLocation()
  const route = location.pathname === '/' ? '/login' : location.pathname
  const [auth, setAuth] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [account, setAccount] = useState(null)
  const [users, setUsers] = useState([])
  const [managementCodes, setManagementCodes] = useState([])
  const [adminRegistrationCode, setAdminRegistrationCode] = useState('')
  const [adminRegistrationCodeId, setAdminRegistrationCodeId] = useState(null)
  const [userManagementTab, setUserManagementTab] = useState('users')
  const [latestOrder, setLatestOrder] = useState(null)
  const [message, setMessage] = useState('')
  const [confirmModal, setConfirmModal] = useState(null)
  const isAdmin = auth?.role === 'admin'
  const isUser = auth?.role === 'user'
  /*権限エラー画面 練習問題3-1-7-1*/
  /*戻り先とボタン文言をログイン中のユーザーに応じて切り替える*/
  const accessDeniedHome = isAdmin
    ? { homePath: '/admin/products', homeLabel: '商品管理へ戻る' }
    : { homePath: '/menu', homeLabel: '商品選択へ戻る' }

  const loadAuth = async (redirect = true) => {
    const currentAuth = await apiRequest('/api/auth/status')
    if (currentAuth.authenticated) {
      setAuth(currentAuth)

      if (redirect && ['/login', '/signup', '/password-reset'].includes(route)) {
        routerNavigate(currentAuth.role === 'admin' ? '/admin/products' : '/menu', { replace: true })
      }

      return currentAuth
    }

    setAuth(null)
    return currentAuth
  }

  const loadProducts = async () => {
    const url = isAdmin ? '/api/admin/products' : '/api/products'
    setProducts(await apiRequest(url))
  }

  const loadOrders = async () => {
    setOrders(await apiRequest('/api/orders'))
  }

  const loadActiveOrders = async () => {
    setOrders(await apiRequest('/api/orders/active'))
  }

  const loadAdminOrders = async () => {
    setOrders(await apiRequest('/api/admin/orders'))
  }

  const loadReviews = async () => {
    setReviews(await apiRequest('/api/reviews'))
  }

  const loadAdminReviews = async (period = 'all') => {
    setReviews(await apiRequest(`/api/admin/reviews?period=${period}`))
  }

  const loadAnalytics = async () => {
    setAnalytics(await apiRequest('/api/admin/analytics'))
  }

  const loadAccount = async () => {
    setAccount(await apiRequest('/api/account'))
  }

  const loadUsers = async () => {
    setUsers(await apiRequest('/api/admin/users'))
  }

  const loadManagementCodes = async () => {
    setManagementCodes(await apiRequest('/api/admin/user-management-codes'))
  }

  {/*修正10: リロード時に認証確認が終わる前の一瞬ログイン画面が表示されてしまう問題を解消するため、authCheckedで確認完了を管理するようにした*/}
  useEffect(() => {
    loadAuth().catch(() => setAuth(null)).finally(() => setAuthChecked(true))
  }, [])

  useEffect(() => {
    if (!auth) {
      return
    }

    if (route.startsWith('/admin/products') || route === '/menu') {
      loadProducts().catch((error) => setMessage(error.message))
    }

    if (route === '/order-status') {
      loadActiveOrders().catch((error) => setMessage(error.message))
    }

    if (route === '/history' || route === '/reviews') {
      loadOrders().catch((error) => setMessage(error.message))
    }

    if (route === '/reviews') {
      loadReviews().catch((error) => setMessage(error.message))
    }

    if (route === '/account') {
      loadAccount().catch((error) => setMessage(error.message))
    }

    if (route === '/admin/orders') {
      loadAdminOrders().catch((error) => setMessage(error.message))
    }

    if (route === '/admin/reviews') {
      loadAdminReviews().catch((error) => setMessage(error.message))
    }

    if (route === '/admin/analytics') {
      loadAnalytics().catch((error) => setMessage(error.message))
    }

    if (route === '/admin/users') {
      loadUsers().catch((error) => setMessage(error.message))
      loadManagementCodes().catch((error) => setMessage(error.message))
    }
  }, [auth, route])

  const showConfirm = (modal) => {
    setConfirmModal(modal)
  }

  const closeConfirm = () => {
    setConfirmModal(null)
  }

  const runConfirm = async () => {
    const currentModal = confirmModal
    closeConfirm()

    if (currentModal?.onConfirm) {
      {/*追加実装9: 確認モーダル実行時のエラーが握りつぶされて画面が何も言わず閉じるのを防ぐ*/}
      try {
        await currentModal.onConfirm()
      } catch (error) {
        setMessage(error.message)
      }
    }
  }

  const navigate = (nextRoute, options = {}) => {
    setMessage('')
    routerNavigate(nextRoute, options)
  }
  useEffect(() => {
    if (!auth) {
      return
    }

    if (['/login', '/signup', '/password-reset'].includes(route)) {
      navigate(auth.role === 'admin' ? '/admin/products' : '/menu', { replace: true })
    }
  }, [auth, route])


  const login = async (form) => {
    const body = new URLSearchParams(form)
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
      body,
    })

    if (!response.ok) {
      {/*修正8: 未認証のPOST /api/auth/login-check呼び出しをやめ、ログイン失敗レスポンス自体のreasonでアカウント無効を判定するよう書き換えた*/}
      const result = await response.json().catch(() => ({}))
      if (result.reason === 'disabled') {
        throw new Error('入力されたユーザーは現在利用停止されています。')
      }

      throw new Error('ユーザー名またはパスワードが違います。')
    }

    await loadAuth()
  }

  const doLogout = async () => {
    {/*修正9: 生のfetch呼び出しを共通のapiRequestに変更した*/}
    await apiRequest('/api/logout', { method: 'POST' })
    setAuth(null)
    setCart([])
    navigate('/login')
  }

  const logout = async () => {
    showConfirm({
      title: 'ログアウト確認',
      message: 'ログイン状態ではなくなりますが、よろしいでしょうか。',
      confirmText: 'ログアウトする',
      onConfirm: doLogout,
    })
  }

  const signup = async (form) => {
    await apiRequest('/api/signup', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(form) })
  }

  const resetPassword = async (form) => {
    await apiRequest('/api/password-reset', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(form) })
  }

  const createProduct = async (product) => {
    const created = await apiRequest('/api/admin/products', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(product) })
    setProducts((current) => [created, ...current])
    navigate('/admin/products')
  }

  const updateProduct = async (id, product) => {
    const updated = await apiRequest(`/api/admin/products/${id}`, { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(product) })
    setProducts((current) => current.map((item) => (item.id === id ? updated : item)))
    navigate('/admin/products')
  }

  const deleteProduct = async (id) => {
    await apiRequest(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts((current) => current.filter((product) => product.id !== id))
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const togglePublished = async (id) => {
    const updated = await apiRequest('/api/admin/products/' + id + '/toggle-published', { method: 'POST' })
    setProducts((current) => current.map((product) => (product.id === id ? updated : product)))
  }

  const issueUserManagementCode = async () => {
    const created = await apiRequest('/api/admin/user-management-codes/user', { method: 'POST' })
    setManagementCodes((current) => [created, ...current])
    return created
  }

  const startAdminRegistration = async () => {
    const created = await apiRequest('/api/admin/user-management-codes/admin', { method: 'POST' })
    setManagementCodes((current) => [created, ...current])
    setAdminRegistrationCode(created.code)
    setAdminRegistrationCodeId(created.id)
    setUserManagementTab('adminCodes')
    navigate('/admin/users/admin/new')
  }

  const createAdminUser = async (form) => {
    const created = await apiRequest('/api/admin/users/admin', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(form) })
    setUsers((current) => [created, ...current])
    await loadManagementCodes()
    setAdminRegistrationCode('')
    setAdminRegistrationCodeId(null)
    setUserManagementTab('adminCodes')
    navigate('/admin/users')
  }

  const cancelAdminRegistration = async () => {
    if (adminRegistrationCodeId) {
      await apiRequest(`/api/admin/user-management-codes/${adminRegistrationCodeId}`, { method: 'DELETE' })
      setManagementCodes((current) => current.filter((code) => code.id !== adminRegistrationCodeId))
    }
    setAdminRegistrationCode('')
    setAdminRegistrationCodeId(null)
    setUserManagementTab('adminCodes')
    navigate('/admin/users')
  }

  const toggleUserStatus = async (id) => {
    const updated = await apiRequest('/api/admin/users/' + id + '/toggle-enabled', { method: 'POST' })
    setUsers((current) => current.map((user) => (user.id === id ? updated : user)))
  }

  const deleteUser = async (id) => {
    await apiRequest('/api/admin/users/' + id, { method: 'DELETE' })
    setUsers((current) => current.filter((user) => user.id !== id))
  }

  const addToCart = (product, quantity) => {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id)
      if (exists) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item))
      }
      return [...current, { ...product, quantity }]
    })
  }

  const changeQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== id))
      return
    }
    const product = products.find((item) => item.id === id)
    /*注文商品の数量変更 練習問題5-1-15-1*/
    /*数量を1以上に保持する*/
    setCart((current) => current.map((item) => (item.id === id ? { ...item, quantity: Math.min(product.stock, Math.max(1, quantity)) } : item)))
  }

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const submitOrder = async (pickupAt) => {
    const order = await apiRequest('/api/orders', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        pickupAt,
      }),
    })
    setLatestOrder(order)
    setCart([])
    navigate('/order-complete')
  }

  const updateOrderStatus = async (orderNumber, form) => {
    await apiRequest(`/api/admin/orders/${orderNumber}/status`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(form),
    })
    await loadAdminOrders()
  }

  const markOrderReceived = async (orderNumber) => {
    const updated = await apiRequest(`/api/orders/${orderNumber}/received`, { method: 'POST' })
    setOrders((current) => current.map((order) => (order.id === orderNumber ? updated : order)))
  }

  const submitReview = async (review) => {
    const created = await apiRequest('/api/reviews', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(review),
    })
    setReviews((current) => [created, ...current])
    await loadProducts()
  }

  const updateAccount = async (form) => {
    const updated = await apiRequest('/api/account', {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(form),
    })
    setAccount(updated)
  }

  if (!authChecked) {
    return (
      <main className="container narrow">
        <p className="empty">読み込み中です。</p>
      </main>
    )
  }

  if (!auth) {
    if (route === '/signup') {
      return <SignupPage onSignup={signup} onNavigate={navigate} />
    }

    if (route === '/password-reset') {
      return <PasswordResetPage onPasswordReset={resetPassword} onNavigate={navigate} />
    }

    return <LoginPage onLogin={login} onNavigate={navigate} />
  }

  {/*権限エラー画面 練習問題3-1-7-1*/}
  {/*propsとして戻り先とボタン文言*/}
  let page = null
  if (route === '/admin/products') {
    page = isAdmin ? (
      <AdminProductsPage
        products={products}
        onDelete={deleteProduct}
        onTogglePublished={togglePublished}
        onNavigate={navigate}
        onEdit={(id) => navigate('/admin/products/edit/' + id)}
        onConfirm={showConfirm}
      />
    ) : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/admin/orders') {
    page = isAdmin ? <AdminOrdersPage orders={orders} onUpdateStatus={updateOrderStatus} onConfirm={showConfirm} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/admin/reviews') {
    page = isAdmin ? <AdminReviewsPage reviews={reviews} onLoadReviews={loadAdminReviews} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/admin/analytics') {
    page = isAdmin ? <AnalyticsPage analytics={analytics} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/admin/users') {
    page = isAdmin ? (
      <UserManagementPage
        users={users}
        codes={managementCodes}
        currentUsername={auth.username}
        onIssueUserCode={issueUserManagementCode}
        initialTab={userManagementTab}
        onChangeTab={setUserManagementTab}
        onStartAdminRegistration={startAdminRegistration}
        onToggleUserStatus={toggleUserStatus}
        onDeleteUser={deleteUser}
        onConfirm={showConfirm}
      />
    ) : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/admin/users/admin/new') {
    page = isAdmin ? (
      <AdminUserRegistrationPage
        managementCode={adminRegistrationCode}
        onSubmit={createAdminUser}
        onCancel={cancelAdminRegistration}
        onConfirm={showConfirm}
      />
    ) : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/admin/products/new') {
    page = isAdmin ? <ProductFormPage mode="create" onSubmit={createProduct} onNavigate={navigate} onConfirm={showConfirm} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route.startsWith('/admin/products/edit/')) {
    const editingProductId = Number(route.replace('/admin/products/edit/', ''))
    const editingProduct = products.find((product) => product.id === editingProductId)
    page = isAdmin ? <ProductFormPage mode="edit" product={editingProduct} onSubmit={(product) => updateProduct(editingProductId, product)} onNavigate={navigate} onConfirm={showConfirm} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/menu') {
    page = isUser ? <MenuPage products={products} cart={cart} onAddToCart={addToCart} onNavigate={navigate} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/order-confirm') {
    {/*注文商品の削除 練習問題5-1-16-1*/}
    {/*注文商品の削除時に確認用のモーダルを表示する*/}
    page = isUser ? <ConfirmPage cart={cart} onChangeQuantity={changeQuantity} onRemove={removeFromCart} onSubmitOrder={submitOrder} onNavigate={navigate} onConfirm={showConfirm} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/order-complete') {
    page = isUser ? <CompletePage latestOrder={latestOrder} onNavigate={navigate} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/order-status') {
    {/*注文提供済み 練習問題5-1-34-2*/}
    {/*onReloadのpropsの受け渡しは不要なので削除する*/}
    {/*注文ステータス「提供済み」の場合で「受取完了」ボタン押下後に確認用のモーダルを表示する*/}
    page = isUser ? <OrderStatusPage orders={orders} onMarkReceived={markOrderReceived} onConfirm={showConfirm} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/history') {
    page = isUser ? <HistoryPage orders={orders} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/reviews') {
    page = isUser ? <ReviewPage orders={orders} reviews={reviews} onSubmitReview={submitReview} onConfirm={showConfirm} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else if (route === '/account') {
    {/*権限エラー画面 練習問題3-1-7-2*/}
    {/*管理者ユーザーがアカウント管理画面のURLにアクセスした際は権限エラー画面を表示するようにする*/}
    page = isUser ?　<AccountPage account={account} onUpdateAccount={updateAccount} onConfirm={showConfirm} /> : <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  } else {
    page = <AccessDeniedPage onNavigate={navigate} {...accessDeniedHome} />
  }

  return (
    <>
      <Header auth={auth} route={route} onNavigate={navigate} onLogout={logout} />
      {message && <p className="global-alert">{message}</p>}
      {page}
      <ConfirmModal modal={confirmModal} onCancel={closeConfirm} onConfirm={runConfirm} />
    </>
  )
}

export default App
