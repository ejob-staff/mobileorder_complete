export default function ConfirmModal({ modal, onCancel, onConfirm }) {
  if (!modal) {
    return null
  }

  return (
    <div className="modal-backdrop">
      <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <h2 id="confirm-modal-title">{modal.title}</h2>
        <p>{modal.message}</p>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onCancel}>
            {modal.cancelText || 'キャンセル'}
          </button>
          <button className={modal.confirmVariant === 'danger' ? 'danger-button' : ''} type="button" onClick={onConfirm}>
            {modal.confirmText || 'OK'}
          </button>
        </div>
      </section>
    </div>
  )
}
