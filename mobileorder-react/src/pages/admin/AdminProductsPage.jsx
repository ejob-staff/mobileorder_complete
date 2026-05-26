import { useState } from 'react'
import ProductVisual from '../../components/ProductVisual.jsx'

export default function AdminProductsPage({ products, onDelete, onTogglePublished, onNavigate, onEdit, onConfirm }) {
  const [category, setCategory] = useState('すべて')
  const categoryOrder = ['季節限定', 'ケーキ', '焼き菓子', 'タピオカ', 'ドリンク', 'プレミアム']
  const categories = ['すべて', ...categoryOrder]
  const visibleProducts = products.filter((product) => category === 'すべて' || product.category === category)

  const deleteProduct = (product) => {
    onConfirm({
      title: '商品削除の確認',
      message: '商品情報テーブルに登録されている商品ですが、本当に削除しますか？',
      confirmText: '削除する',
      confirmVariant: 'danger',
      onConfirm: () => onDelete(product.id),
    })
  }

  return (
    <main className="container admin-layout">
      <section className="page-head admin-page-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>商品管理</h1>
          <p>商品の編集、削除、公開状態、在庫数を管理できます。</p>
        </div>
        <button type="button" onClick={() => onNavigate('/admin/products/new')}>商品を登録する</button>
      </section>

      <div className="category-tabs">
        {categories.map((currentCategory) => (
          <button className={category === currentCategory ? 'active' : ''} type="button" key={currentCategory} onClick={() => setCategory(currentCategory)}>
            {currentCategory}
          </button>
        ))}
      </div>

      {visibleProducts.length === 0 ? (
        <p className="empty">「{category}」カテゴリの商品はまだ登録されていません。</p>
      ) : (
        <section className="admin-list">
          {visibleProducts.map((product) => (
            <article className="admin-product" key={product.id}>
              <ProductVisual accent={product.accent} />
              <div>
                <div className="item-title-row">
                  <h3>{product.name}</h3>
                  <span className={product.published ? 'status open' : 'status closed'}>{product.published ? '公開' : '非公開'}</span>
                </div>
                <p>{product.description}</p>
                <div className="meta-row">
                  <span>{product.category}</span>
                  <span>¥{product.price.toLocaleString()}</span>
                  <span>在庫 {product.stock}</span>
                </div>
                <div className="item-actions">
                  <button className="ghost-button" type="button" onClick={() => onTogglePublished(product.id)}>
                    {product.published ? '非公開にする' : '公開する'}
                  </button>
                  <button type="button" onClick={() => onEdit(product.id)}>編集</button>
                  <button className="danger-button" type="button" onClick={() => deleteProduct(product)}>削除</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
