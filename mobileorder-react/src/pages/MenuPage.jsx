import { useEffect, useState } from 'react'
import ProductVisual from '../components/ProductVisual.jsx'
import RatingStars from '../components/RatingStars.jsx'

export default function MenuPage({ products, cart, onAddToCart, onNavigate }) {
  const [category, setCategory] = useState('すべて')
  const [searchText, setSearchText] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const categoryOrder = ['季節限定', 'ケーキ', '焼き菓子', 'タピオカ', 'ドリンク', 'プレミアム']
  const categories = ['すべて', ...categoryOrder]
  const normalizedSearchText = searchText.trim().toLowerCase()
  const visibleProducts = products.filter((product) => {
    const matchesCategory = category === 'すべて' || product.category === category
    const matchesSearch = normalizedSearchText === ''
      || product.name.toLowerCase().includes(normalizedSearchText)
      || product.category.toLowerCase().includes(normalizedSearchText)
      || product.description.toLowerCase().includes(normalizedSearchText)

    return matchesCategory && matchesSearch
  })
  const emptyMessage = normalizedSearchText
    ? '条件に一致する商品はありません。'
    : `「${category}」の商品はまだありません。`
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const addToCart = (product, quantity) => {
    onAddToCart(product, quantity)
    setSelectedProduct(null)
  }

  return (
    <main className="container">
      <section className="order-hero">
        <div>
          <p className="eyebrow">Order</p>
          <h1>今日の気分に合うスイーツを選びましょう。</h1>
          <p>商品を選択すると、詳細と注文数を確認できます。</p>
        </div>
      </section>

      <label className="search-field">
        商品検索
        <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="商品名・カテゴリ・説明文で検索" />
      </label>

      <div className="category-tabs">
        {categories.map((currentCategory) => (
          <button className={category === currentCategory ? 'active' : ''} type="button" key={currentCategory} onClick={() => setCategory(currentCategory)}>
            {currentCategory}
          </button>
        ))}
      </div>

      {visibleProducts.length === 0 ? (
        <p className="empty">{emptyMessage}</p>
      ) : (
        <section className="menu-grid">
          {visibleProducts.map((product) => <MenuCard product={product} onSelect={setSelectedProduct} key={product.id} />)}
        </section>
      )}

      {cartCount > 0 && (
        <aside className="cart-bar">
          <span>{cartCount}点の商品</span>
          <strong>¥{cartTotal.toLocaleString()}</strong>
          <button type="button" onClick={() => onNavigate('/order-confirm')}>注文確認へ</button>
        </aside>
      )}

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
    </main>
  )
}

function MenuCard({ product, onSelect }) {
  return (
    <button className="menu-card menu-card-button" type="button" onClick={() => onSelect(product)}>
      <ProductVisual accent={product.accent} />
      <div className="menu-card-body compact">
        <span className="category-label">{product.category}</span>
        <h2>{product.name}</h2>
        <RatingStars rating={product.averageRating} count={product.reviewCount} />
        <strong>¥{product.price.toLocaleString()}</strong>
      </div>
    </button>
  )
}

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setQuantity(1)
  }, [product])

  if (!product) {
    return null
  }

  return (
    <div className="modal-backdrop">
      <section className="product-detail-modal" role="dialog" aria-modal="true" aria-labelledby="product-detail-title">
        <ProductVisual accent={product.accent} />
        <div className="product-detail-body">
          <span className="category-label">{product.category}</span>
          <h2 id="product-detail-title">{product.name}</h2>
          <RatingStars rating={product.averageRating} count={product.reviewCount} />
          <p>{product.description}</p>
          <div className="card-bottom">
            <strong>¥{product.price.toLocaleString()}</strong>
            <span>在庫 {product.stock}</span>
          </div>
          <div className="quantity-row">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
          </div>
          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>閉じる</button>
            <button type="button" disabled={product.stock === 0} onClick={() => onAddToCart(product, quantity)}>カートに追加する</button>
          </div>
        </div>
      </section>
    </div>
  )

}
