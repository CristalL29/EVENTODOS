import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const formatPrice = (amount) => `$${(amount ?? 0).toLocaleString('es-CL')}`
const formatDate = (value) => value
  ? new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
  : 'Fecha por confirmar'
const formatPurchaseDate = (value) => value
  ? new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  : 'Fecha por confirmar'
function getTicketStatus(value) {
  if (!value) return 'Próximamente'
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  if (value < today) return 'Finalizado'
  if (value > today) return 'Próximamente'
  return 'En curso'
}

function DigitalTicket({ ticket, onClose, autoGeneratePdf }) {
  const [qrImage, setQrImage] = useState('')
  const [qrError, setQrError] = useState('')
  const autoPrintTriggered = useRef(false)

  useEffect(() => {
    let isCurrent = true
    autoPrintTriggered.current = false
    setQrImage('')
    setQrError('')
    QRCode.toDataURL(ticket.qrPayload, { width: 220, margin: 1, errorCorrectionLevel: 'M' })
      .then((dataUrl) => {
        if (isCurrent) setQrImage(dataUrl)
      })
      .catch(() => {
        if (isCurrent) setQrError('No pudimos generar el código QR. Cierra el boleto e inténtalo de nuevo.')
      })
    return () => {
      isCurrent = false
    }
  }, [ticket])

  useEffect(() => {
    if (!autoGeneratePdf || !qrImage || autoPrintTriggered.current) return undefined
    autoPrintTriggered.current = true
    const printTimeout = window.setTimeout(() => window.print(), 300)
    return () => window.clearTimeout(printTimeout)
  }, [autoGeneratePdf, qrImage])

  return (
    <div className="ticket-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="digital-ticket" role="dialog" aria-modal="true" aria-labelledby="digital-ticket-title">
        <div className="ticket-modal-actions">
          <span className="ticket-demo-tag">BOLETO DE DEMOSTRACIÓN</span>
          <button className="close-button" type="button" aria-label="Cerrar boleto" onClick={onClose}>×</button>
        </div>
        <div className="ticket-print-view">
          <div className="digital-ticket-brand"><img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" /><span>EVENTODOS</span></div>
          <p className="eyebrow">{ticket.type} · {ticket.ticketType}</p>
          <h2 id="digital-ticket-title">{ticket.title}</h2>
          <p className="digital-ticket-date">{formatDate(ticket.date)}{ticket.venue ? ` · ${ticket.venue}` : ''}</p>
          <div className="digital-ticket-code">
            {qrImage
              ? <img className="ticket-qr-image" src={qrImage} alt={`Código QR para el boleto ${ticket.ticketNumber}`} />
              : qrError
                ? <p className="ticket-qr-error" role="alert">{qrError}</p>
                : <p className="ticket-qr-loading" aria-live="polite">Generando código QR…</p>}
            <div><span>NÚMERO DE BOLETO</span><strong>{ticket.ticketNumber}</strong></div>
          </div>
          <dl className="digital-ticket-details">
            <div><dt>Folio de transacción</dt><dd>{ticket.transactionId}</dd></div>
            <div><dt>Fecha de compra</dt><dd>{formatPurchaseDate(ticket.purchaseDate)}</dd></div>
            <div><dt>Total de la compra</dt><dd>{formatPrice(ticket.total)} <small>ficticios</small></dd></div>
            {ticket.organizer && <div><dt>Organiza</dt><dd>{ticket.organizer}</dd></div>}
          </dl>
          <p className="ticket-demo-disclaimer">Este boleto es solo una demostración. No acredita una compra real ni permite el acceso a un evento o sorteo.</p>
        </div>
        <div className="ticket-modal-footer">
          <button className="button button-outline" type="button" onClick={onClose}>Cerrar</button>
          <button className="button button-dark" type="button" onClick={() => window.print()} disabled={!qrImage}>Generar PDF ficticio</button>
        </div>
        <p className="ticket-print-hint">En el diálogo de impresión, selecciona «Guardar como PDF» para conservar el boleto digital.</p>
      </section>
    </div>
  )
}

export default function PurchaseActivity({ purchases, onNavigate, onClearHistory }) {
  const [filter, setFilter] = useState('Activos')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [pdfTicketId, setPdfTicketId] = useState(null)
  const orderedPurchases = [...purchases].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
  const filteredPurchases = orderedPurchases.filter((purchase) => (
    filter === 'Activos' ? getTicketStatus(purchase.date) !== 'Finalizado' : getTicketStatus(purchase.date) === 'Finalizado'
  ))

  function openTicket(ticket, generatePdf = false) {
    setSelectedTicket(ticket)
    setPdfTicketId(generatePdf ? ticket.id : null)
  }

  function closeTicket() {
    setSelectedTicket(null)
    setPdfTicketId(null)
  }

  return (
    <section className="module-page purchase-page">
      <div className="module-heading">
        <div><p className="eyebrow">TUS ENTRADAS Y TRANSACCIONES</p><h1>Compras y Actividad</h1><p>Consulta tus boletos y revisa los detalles de cada compra.</p></div>
        <button className="button button-outline button-danger" type="button" disabled={!purchases.length} onClick={onClearHistory}>Borrar historial</button>
      </div>
      <p className="purchase-demo-notice" role="note">Modo demostración: los registros, importes y boletos son ficticios. Los códigos QR no validan accesos reales.</p>
      {purchases.length === 0
        ? <div className="purchase-empty">
          <span className="purchase-empty-icon" aria-hidden="true">⌑</span>
          <p className="eyebrow">TU HISTORIAL ESTÁ LISTO</p>
          <h2>Aún no tienes compras</h2>
          <p>Cuando participes en un evento o una rifa, tus boletos y comprobantes aparecerán aquí.</p>
          <div className="purchase-empty-actions">
            <button className="button button-dark" type="button" onClick={() => onNavigate('Eventos')}>Explorar eventos <span aria-hidden="true">↗</span></button>
            <button className="button button-outline" type="button" onClick={() => onNavigate('Rifas')}>Ver rifas <span aria-hidden="true">↗</span></button>
          </div>
        </div>
        : <>
          <div className="filter-row purchase-filters" aria-label="Filtrar boletos por estado">
            {['Activos', 'Pasados'].map((status) => (
              <button key={status} type="button" className={`filter-chip ${filter === status ? 'active' : ''}`} onClick={() => setFilter(status)} aria-pressed={filter === status}>
                {status}
              </button>
            ))}
            <span className="result-count" aria-live="polite">{filteredPurchases.length} {filteredPurchases.length === 1 ? 'boleto' : 'boletos'}</span>
          </div>
          {filteredPurchases.length
            ? <div className="purchase-list">
              {filteredPurchases.map((purchase) => {
                const ticketStatus = getTicketStatus(purchase.date)
                const ticketStatusClass = ticketStatus === 'En curso' ? 'ongoing' : ticketStatus === 'Finalizado' ? 'finished' : 'upcoming'
                return (
                  <article className="purchase-card" key={purchase.id}>
                    <div className={`purchase-card-mark ${purchase.type === 'Rifa' ? 'raffle' : ''}`} aria-hidden="true">{purchase.type === 'Rifa' ? '✳' : 'EV'}</div>
                    <div className="purchase-card-main">
                      <div className="purchase-title-row"><span className="purchase-type">{purchase.type} · {purchase.ticketType}</span><span className={`purchase-status ${ticketStatusClass}`}>{ticketStatus}</span></div>
                      <h2>{purchase.title}</h2>
                      <div className="purchase-facts">
                        <p><span>Fecha del evento/rifa</span><strong>{formatDate(purchase.date)}</strong></p>
                        <p><span>Fecha de compra</span><strong>{formatPurchaseDate(purchase.purchaseDate)}</strong></p>
                        <p><span>Total de la compra</span><strong>{formatPrice(purchase.total)} <small>ficticios</small></strong></p>
                        <p><span>Folio de transacción</span><strong>{purchase.transactionId}</strong></p>
                        <p><span>Número de boleto</span><strong>{purchase.ticketNumber}</strong></p>
                      </div>
                    </div>
                    <div className="purchase-card-actions">
                      <button className="button button-outline purchase-view-button" type="button" onClick={() => openTicket(purchase)}>Ver boleto</button>
                      <button className="button button-dark purchase-view-button" type="button" onClick={() => openTicket(purchase, true)}>Generar PDF</button>
                    </div>
                  </article>
                )
              })}
            </div>
            : <div className="purchase-filter-empty"><h2>No hay boletos {filter.toLowerCase()}</h2><p>Prueba con el otro filtro para consultar el resto de tu actividad.</p></div>}
        </>}
      {selectedTicket && <DigitalTicket key={selectedTicket.id} ticket={selectedTicket} onClose={closeTicket} autoGeneratePdf={pdfTicketId === selectedTicket.id} />}
    </section>
  )
}
