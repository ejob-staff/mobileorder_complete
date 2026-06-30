import { useState } from 'react'
import ProductVisual from '../../components/ProductVisual.jsx'

export default function AdminProductsPage({ products, onDelete, onTogglePublished, onNavigate, onEdit, onConfirm }) {
  const [category, setCategory] = useState('すべて')
  const [searchText, setSearchText] = useState('')
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
    : `「${category}」カテゴリの商品はまだ登録されていません。`

  const deleteProduct = (product) => {
    onConfirm({
      title: '商品削除の確認',
      message: '商品情報テーブルに登録されている商品ですが、本当に削除してもよろしいでしょうか。',
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
          <p>新商品の登録もできます。</p>
        </div>
      </section>

      <div className="product-action-section">
        <p>新商品の登録</p>
        <div className="item-actions">
          <button
            className="admin-action-link" type="button" onClick={() => onNavigate('/admin/products/new')}>商品を登録する</button>
        </div>
      </div>

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
        <section className="admin-list">
          {visibleProducts.map((product) => (
            <article className="admin-product" key={product.id}>
              <ProductVisual accent={product.accent} />
              <div>
                <div className="item-title-row">
                  <h3>{product.name}</h3>
                  <span className={product.published ? 'status open' : 'status closed'}>{product.published ? '公開' : '非公開'}</span>
                </div>
                <div className="order-meta-list">
                  <span>商品説明:</span>
                </div>
                <p className="product-management-items">{product.description}</p>
                <div className="order-meta-list">
                  <span>価格:</span>
                </div>
                <p className="product-management-items">¥{product.price.toLocaleString()}</p>
                <div className="order-meta-list">
                  <span>カテゴリ: {product.category}</span>
                  <span>在庫: {product.stock}</span>
                  <span>公開状態: {product.published ? '公開' : '非公開'}</span>
                </div>
                <div className="product-metrics" aria-label={`${product.name}の実績`}>
                  <span>
                    <small>評価</small>
                    <strong>{Number(product.averageRating || 0).toFixed(1)}</strong>
                  </span>
                  <span>
                    <small>レビュー</small>
                    <strong>{product.reviewCount || 0}件</strong>
                  </span>
                  <span>
                    <small>注文数</small>
                    <strong>{product.orderedQuantity || 0}件</strong>
                  </span>
                </div>
                <div className="product-action-section">
                  {/*公開設定の変更 練習問題8-1-11-1*/}
                  {/*ボタンの横の見出しの文言を変更する*/}
                  <p>公開設定の変更</p>
                  <div className="item-actions">
                    {/*公開設定の変更 練習問題8-1-11-1*/}
                    {/*確認用モーダルで「公開にする」ボタン押下時のみconfirmVariantに「danger」を指定する*/}
                    <button
                      className="admin-action-link"
                      type="button"
                      onClick={() => onConfirm({
                        title: '公開設定の変更',
                        message: product.published ?
                          '「非公開」に設定します。商品は公開されなくなりますが、よろしいでしょうか。' : '「公開」に設定します。商品が公開されますが、よろしいでしょうか。',
                        confirmText: product.published ? '非公開にする' : '公開にする',
                        confirmVariant: product.published ? '' : 'danger',
                        onConfirm: () => onTogglePublished(product.id),
                      })}>
                      {product.published ? '非公開にする' : '公開にする'}
                    </button>
                  </div>
                </div>
                <div className="product-action-section">
                  <div className="item-actions">
                    <p>商品情報の編集</p>
                    <button className="admin-action-link" type="button" onClick={() => onEdit(product.id)}>商品を編集する</button>
                  </div>
                </div>
                <div className="product-action-section">
                  <div className="item-actions">
                    <p>商品情報の削除</p>
                    <button className="admin-action-link danger" type="button" onClick={() => deleteProduct(product)}>商品を削除する</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
