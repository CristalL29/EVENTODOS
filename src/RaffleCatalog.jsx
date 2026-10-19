import { useState } from 'react'

const formatPrice = (amount) => `$${amount.toLocaleString('es-CL')}`
const formatDate = (value) => new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

export default function RaffleCatalog({ raffles, isOrganizer, onParticipate, onCreate }) {
  const [search, setSearch] = useState('')
  const [selectedRaffleId, setSelectedRaffleId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [step, setStep] = useState('details')

  const visibleRaffles = raffles
    .filter((raffle) => (isOrganizer || raffle.status === 'Pública')
      && raffle.name.toLocaleLowerCase('es-CL').includes(search.trim().toLocaleLowerCase('es-CL')))
    .sort((first, second) => second.sold - first.sold)
  const selectedRaffle = raffles.find((raffle) => raffle.id === selectedRaffleId)
  const availableTickets = selectedRaffle ? Math.max(selectedRaffle.total - selectedRaffle.sold, 0) : 0

  function openRaffle(raffle) {
    setSelectedRaffleId(raffle.id)
    setQuantity(1)
    setStep('details')
  }

  function returnToCatalog() {
    setSelectedRaffleId(null)
    setStep('details')
  }

  function confirmParticipation() {
    if (onParticipate(selectedRaffle, quantity)) setStep('confirmed')
  }

  return (
    <section className="module-page raffle-page">
      <div className="module-heading">
        <div>
          <p className="eyebrow">PARTICIPA, COMPARTE, GANA</p>
          <h1>Rifas con propósito</h1>
          <p>Explora premios ficticios y conoce las causas que apoya cada rifa.</p>
        </div>
        {isOrganizer && <button className="button button-dark" type="button" onClick={onCreate}>＋ Crear rifa</button>}
      </div>

      <p className="raffle-demo-notice" role="note">Modo demostración: todas las rifas, premios, precios y participaciones son ficticios. No se realizan pagos ni transacciones reales.</p>

      {selectedRaffle
        ? <div className="raffle-detail">
          <button className="text-action raffle-back" type="button" onClick={returnToCatalog}>← Volver al catálogo</button>
          <div className="raffle-detail-layout">
            <div className="raffle-detail-image-wrap">
              <img className="raffle-detail-image" src={selectedRaffle.image} alt={selectedRaffle.imageAlt || selectedRaffle.prize} />
              <span className="raffle-detail-demo">PREMIO FICTICIO</span>
            </div>
            <div className="raffle-detail-copy">
              <p className="eyebrow">{selectedRaffle.organizer} · RIFA DE DEMOSTRACIÓN</p>
              <h2>{selectedRaffle.name}</h2>
              <p className="raffle-cause"><span>CAUSA</span>{selectedRaffle.cause}</p>
              <p className="raffle-description">{selectedRaffle.description}</p>
              <div className="raffle-prize-info">
                <h3>Premio: {selectedRaffle.prize}</h3>
                <ul>{selectedRaffle.prizeFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              </div>
              <div className="raffle-detail-facts">
                <p><span>Valor por boleto</span><strong>{formatPrice(selectedRaffle.price)} <small>ficticios</small></strong></p>
                <p><span>Boletos disponibles</span><strong>{availableTickets} de {selectedRaffle.total}</strong></p>
                <p><span>Fecha de cierre</span><strong>{formatDate(selectedRaffle.date)}</strong></p>
              </div>
              {!isOrganizer && selectedRaffle.status === 'Pública' && (
                <div className="raffle-participation">
                  <label htmlFor="raffle-quantity">Selecciona tus boletos</label>
                  <div className="raffle-quantity-row">
                    <input
                      id="raffle-quantity"
                      type="number"
                      min="1"
                      max={availableTickets}
                      value={quantity}
                      disabled={availableTickets === 0}
                      onChange={(event) => setQuantity(Math.min(Math.max(Number(event.target.value) || 1, 1), availableTickets || 1))}
                    />
                    <span>{availableTickets} disponibles</span>
                  </div>
                  <div className="raffle-total"><span>Total ficticio</span><strong>{formatPrice(quantity * selectedRaffle.price)}</strong></div>
                  <button className="button button-dark" type="button" disabled={availableTickets === 0} onClick={() => setStep('summary')}>Continuar <span aria-hidden="true">↗</span></button>
                  {availableTickets === 0 && <p className="raffle-sold-out" role="status">Esta rifa ya no tiene boletos disponibles.</p>}
                </div>
              )}
              {isOrganizer && <p className="raffle-organizer-note">Vista de organización: las participaciones solo están disponibles para compradores.</p>}
              {selectedRaffle.status === 'Borrador' && <p className="raffle-organizer-note">Esta rifa es un borrador y todavía no está disponible para participar.</p>}
            </div>
          </div>
          {step === 'summary' && (
            <div className="raffle-flow-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setStep('details')}>
              <section className="raffle-flow-card" role="dialog" aria-modal="true" aria-labelledby="raffle-summary-title">
                <p className="eyebrow">RESUMEN DE PARTICIPACIÓN FICTICIA</p>
                <h2 id="raffle-summary-title">Revisa tus boletos</h2>
                <dl>
                  <div><dt>Rifa</dt><dd>{selectedRaffle.name}</dd></div>
                  <div><dt>Cantidad de boletos</dt><dd>{quantity}</dd></div>
                  <div><dt>Precio por boleto</dt><dd>{formatPrice(selectedRaffle.price)} ficticios</dd></div>
                  <div><dt>Total</dt><dd>{formatPrice(quantity * selectedRaffle.price)} ficticios</dd></div>
                </dl>
                <p className="raffle-summary-disclaimer">Al confirmar, solo guardaremos una participación de demostración en tu actividad. No se realizará ningún cobro.</p>
                <div className="raffle-flow-actions">
                  <button className="button button-outline" type="button" onClick={() => setStep('details')}>Volver</button>
                  <button className="button button-dark" type="button" onClick={confirmParticipation}>Confirmar participación</button>
                </div>
              </section>
            </div>
          )}
          {step === 'confirmed' && (
            <div className="raffle-flow-overlay" role="presentation">
              <section className="raffle-flow-card raffle-confirmation" role="dialog" aria-modal="true" aria-labelledby="raffle-confirmation-title">
                <span className="raffle-confirmation-mark" aria-hidden="true">✓</span>
                <p className="eyebrow">CONFIRMACIÓN DE DEMOSTRACIÓN</p>
                <h2 id="raffle-confirmation-title">¡Tu participación está lista!</h2>
                <p>Registramos {quantity} {quantity === 1 ? 'boleto ficticio' : 'boletos ficticios'} para <strong>{selectedRaffle.name}</strong>.</p>
                <p className="raffle-summary-disclaimer">No se realizó ningún pago. Puedes consultar el registro en Compras y Actividad.</p>
                <button className="button button-dark" type="button" onClick={returnToCatalog}>Volver al catálogo</button>
              </section>
            </div>
          )}
        </div>
        : <>
          <div className="raffle-callout">
            <span className="callout-symbol" aria-hidden="true">✳</span>
            <div><strong>Tu participación hace la diferencia.</strong><p>Cada boleto ficticio apoya una causa comunitaria.</p></div>
            <span className="callout-count">{raffles.filter((raffle) => raffle.status === 'Pública').length} activas</span>
          </div>
          <div className="raffle-search-row">
            <label htmlFor="raffle-search">Buscar rifa por nombre</label>
            <input id="raffle-search" type="search" placeholder="Ej. Kit de ilustración" value={search} onChange={(event) => setSearch(event.target.value)} />
            <span className="raffle-search-count" aria-live="polite">{visibleRaffles.length} {visibleRaffles.length === 1 ? 'rifa' : 'rifas'}</span>
          </div>
          {visibleRaffles.length
            ? <div className="raffle-card-grid">
              {visibleRaffles.map((raffle) => {
                const available = Math.max(raffle.total - raffle.sold, 0)
                return (
                  <article className="raffle-card" key={raffle.id}>
                    <button className="raffle-card-open" type="button" onClick={() => openRaffle(raffle)} aria-label={`Ver detalles de ${raffle.name}`}>
                      <span className="raffle-card-image-wrap">
                        <img className="raffle-card-image" src={raffle.image} alt={raffle.imageAlt || raffle.prize} />
                        <span className="raffle-card-prize">{raffle.prize}</span>
                        {raffle.status === 'Borrador' && <span className="raffle-card-status">Borrador</span>}
                      </span>
                      <span className="raffle-card-content">
                        <span className="eyebrow">{raffle.organizer}</span>
                        <strong className="raffle-card-title">{raffle.name}</strong>
                        <span className="raffle-card-cause"><b>Causa</b>{raffle.cause}</span>
                        <span className="raffle-card-facts"><span>{available} de {raffle.total} boletos disponibles</span><strong>{formatPrice(raffle.price)} <small>/ boleto</small></strong></span>
                        <span className="raffle-card-link">Conocer la rifa <span aria-hidden="true">↗</span></span>
                      </span>
                    </button>
                  </article>
                )
              })}
            </div>
            : <div className="raffle-empty"><h2>No encontramos rifas</h2><p>Prueba con otro nombre para explorar las rifas disponibles.</p></div>}
        </>}
    </section>
  )
}
