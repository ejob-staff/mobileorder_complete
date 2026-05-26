import { useEffect, useState } from 'react'
import ProductVisual from '../../components/ProductVisual.jsx'

const emptyProduct = {
  name: '',
  description: '',
  category: '季節限定',
  price: '',
  stock: '',
  published: true,
  accent: 'berry',
}

export default function ProductFormPage({ mode, product, onSubmit, onNavigate }) {
  const [form, setForm] = useState(() => {
    if (!product) {
      return emptyProduct
    }

    return {
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      published: product.published,
      accent: product.accent,
    }
  })

  useEffect(() => {
    if (!product) {
      setForm(emptyProduct)
      return
    }

    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      published: product.published,
      accent: product.accent,
    })
  }, [product])

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submitProduct = async (event) => {
    event.preventDefault()
    await onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    })
  }

  const isEdit = mode === 'edit'

  return (
    <main className="container narrow admin-layout">
      <section className="page-head">
        <p className="eyebrow">Admin</p>
        <h1>{isEdit ? '商品編集' : '商品登録'}</h1>
        <p>{isEdit ? '登録されている商品の内容を編集できます。' : '新しく商品を登録できます。'}</p>
      </section>

      <form className="tool-panel product-form" onSubmit={submitProduct}>
        <label>
          商品名
          <input name="name" value={form.name} onChange={updateForm} placeholder="商品名を入力してください" required />
        </label>

        <label>
          説明文
          <textarea name="description" value={form.description} onChange={updateForm} placeholder="商品の説明を入力してください" required />
        </label>

        <div className="form-row">
          <label>
            カテゴリ
            <select name="category" value={form.category} onChange={updateForm}>
              <option>季節限定</option>
              <option>ケーキ</option>
              <option>焼き菓子</option>
              <option>タピオカ</option>
              <option>ドリンク</option>
              <option>プレミアム</option>
            </select>
          </label>

          <label>
            見た目
            <select name="accent" value={form.accent} onChange={updateForm}>
              <option value="berry">ベリー</option>
              <option value="honey">ハニー</option>
              <option value="mint">ミント</option>
              <option value="cocoa">ココア</option>
              <option value="matcha">抹茶</option>
              <option value="caramel">キャラメル</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            価格
            <input name="price" type="number" min="1" value={form.price} onChange={updateForm} required />
          </label>

          <label>
            在庫数
            <input name="stock" type="number" min="0" value={form.stock} onChange={updateForm} required />
          </label>
        </div>

        <label className="check">
          <input name="published" type="checkbox" checked={form.published} onChange={updateForm} />
          公開する
        </label>

        <div className="form-actions">
          <button type="submit">{isEdit ? '編集を反映する' : '登録する'}</button>
          <button className="ghost-button" type="button" onClick={() => onNavigate('/admin/products')}>商品管理へ戻る</button>
        </div>
      </form>
    </main>
  )
}
