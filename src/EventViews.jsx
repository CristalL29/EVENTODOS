import { useState } from 'react'

const formatPrice = (amount) => `$${(amount ?? 0).toLocaleString('es-CL')}`
const formatLongDate = (value) => value
  ? new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
  : 'Fecha por confirmar'

export function EventCatalog({ events, locations, search, onSearchChange, dateFilter, onDateFilterChange, categoryFilter, onCategoryFilterChange, locationFilter, onLocationFilterChange, sortOrder, onSortChange, status, onRetry, onView }) {
  function resetFilters() {
    onSearchChange('')
    onDateFilterChange('all')
    onCategoryFilterChange('all')
    onLocationFilterChange('all')
  }

  return (
    <section className="module-page events-catalog">
      <div className="module-heading">
        <div><p className="eyebrow">AGENDA DE LA COMUNIDAD</p><h1>Eventos</h1><p>Explora encuentros y experiencias cerca de ti.</p></div>
        <label className="sort-control">Ordenar por fecha<select value={sortOrder} onChange={(event) => onSortChange(event.target.value)} aria-label="Ordenar eventos por fecha"><option value="asc">Más próximos primero</option><option value="desc">Más lejanos primero</option></select></label>
      </div>
      <p className="demo-notice" role="note">Modo demostración: los eventos, boletos, precios y operaciones son ficticios. No se realizan compras ni pagos reales</p>
      <div className="event-filters">
        <label className="event-filter-search"><span>Buscar por evento o lugar</span><input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Ej. jazz, Santiago" /></label>
        <label><span>Fecha</span><select value={dateFilter} onChange={(event) => onDateFilterChange(event.target.value)}><option value="all">Cualquier fecha</option><option value="weekend">Este fin de semana</option><option value="month">Este mes</option></select></label>
        <label><span>Categoría</span><select value={categoryFilter} onChange={(event) => onCategoryFilterChange(event.target.value)}><option value="all">Todas</option><option value="Música">Música</option><option value="Ferias">Ferias</option><option value="Teatro">Teatro</option><option value="Otros">Otros</option></select></label>
        <label><span>Ubicación</span><select value={locationFilter} onChange={(event) => onLocationFilterChange(event.target.value)}><option value="all">Todas</option>{locations.map((location) => <option key={location} value={location}>{location}</option>)}</select></label>
      </div>
      <div className="events-results-heading"><p aria-live="polite">{status === 'ready' ? `${events.length} ${events.length === 1 ? 'evento' : 'eventos'}` : 'Actualizando eventos'}</p></div>
      {status === 'loading' && <div className="event-grid events-list" aria-label="Cargando eventos" aria-busy="true">{[1, 2, 3].map((item) => <div key={item} className="event-skeleton"><span /><span /><span /></div>)}</div>}
      {status === 'error' && <div className="events-state" role="alert"><span className="events-state-mark">!</span><h2>No pudimos cargar los eventos</h2><p>Intenta nuevamente para consultar la agenda de demostración.</p><button type="button" className="button button-dark" onClick={onRetry}>Reintentar</button></div>}
      {status === 'ready' && events.length > 0 && <div className="event-grid events-list">{events.map((event) => <EventCard key={event.id} event={event} onView={onView} />)}</div>}
      {status === 'ready' && events.length === 0 && <div className="events-state"><span className="events-state-mark">⌕</span><h2>No encontramos eventos</h2><p>Prueba con otra búsqueda o cambia los filtros.</p><button type="button" className="button button-outline" onClick={resetFilters}>Limpiar filtros</button></div>}
    </section>
  )
}

export function EventDetails({ event, onBack, onPurchase }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantities, setQuantities] = useState({})
  const [showContact, setShowContact] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const images = event.images ?? []
  const tickets = event.tickets ?? []
  const selectedCount = Object.values(quantities).reduce((total, quantity) => total + quantity, 0)
  const selectedTickets = tickets.filter((ticket) => quantities[ticket.id] > 0)
  const total = selectedTickets.reduce((sum, ticket) => sum + ticket.price * quantities[ticket.id], 0)
  const activeImage = images[activeImageIndex]

  function confirmSelection() {
    onPurchase(event, selectedTickets.map((ticket) => ({ ...ticket, quantity: quantities[ticket.id] })))
    setShowConfirmation(true)
  }

  function changeQuantity(ticketId, change) {
    setQuantities((current) => {
      const currentTotal = Object.values(current).reduce((sum, quantity) => sum + quantity, 0)
      if (change > 0 && currentTotal >= 6) return current
      return { ...current, [ticketId]: Math.max(0, (current[ticketId] ?? 0) + change) }
    })
  }

  return (
    <section className="event-detail-page">
      <button className="back-link" type="button" onClick={onBack}><span aria-hidden="true">←</span> Volver a eventos</button>
      <p className="demo-notice" role="note">Modo demostración: los eventos, boletos, precios y operaciones son ficticios. No se realizan compras ni pagos reales</p>
      <div className="event-detail-heading"><div><p className="eyebrow">{event.category || 'EVENTO'}</p><h1>{event.name || 'Evento sin título'}</h1><p>{formatLongDate(event.date)} · {event.time || 'Horario por confirmar'}</p></div><span className="event-price-tag">Desde {formatPrice(event.price)} <small>precio ficticio</small></span></div>

      <div className="event-detail-layout">
        <div className="event-detail-main">
          <section className="event-gallery" aria-label={`Galería de ${event.name}`}>
            <div className={`event-gallery-main ${activeImage ? '' : 'gallery-empty'}`}>
              {activeImage ? <img src={activeImage.src} alt={activeImage.alt} onError={(imageEvent) => { imageEvent.currentTarget.hidden = true }} /> : <p>Imagen por confirmar</p>}
              <span className="image-reference-label">IMAGEN DE REFERENCIA</span>
            </div>
            {images.length > 1 && <div className="event-gallery-thumbs" aria-label="Imágenes del evento">{images.map((image, index) => <button key={image.src} className={index === activeImageIndex ? 'active' : ''} type="button" onClick={() => setActiveImageIndex(index)} aria-label={`Ver imagen ${index + 1}`} aria-pressed={index === activeImageIndex}><img src={image.src} alt="" /></button>)}</div>}
          </section>

          <section className="event-description-block"><p className="eyebrow">SOBRE EL EVENTO</p><h2>Una experiencia para compartir</h2><p>{event.description || 'La descripción de este evento está por confirmar.'}</p></section>
          <section className="event-facts" aria-label="Información del evento">
            <div><span>FECHA Y HORA</span><strong>{formatLongDate(event.date)}</strong><p>{event.time || 'Horario por confirmar'}</p></div>
            <div><span>UBICACIÓN</span><strong>{event.venue || 'Lugar por confirmar'}</strong><p>{event.address || event.city || 'Dirección por confirmar'}</p></div>
          </section>
          <section className="organizer-block"><div className="organizer-monogram" aria-hidden="true">{(event.organizer || 'EV').slice(0, 2).toUpperCase()}</div><div><p className="eyebrow">ORGANIZA</p><h2>{event.organizer || 'Organizador por confirmar'}</h2><p>{event.organizerDescription || 'Información del organizador por confirmar.'}</p></div><button type="button" className="button button-outline" onClick={() => setShowContact(true)}>Ver contacto</button></section>
          <section className="attendance-block"><p className="eyebrow">ANTES DE ASISTIR</p><h2>Condiciones de asistencia</h2>{event.attendance?.length ? <ul>{event.attendance.map((condition) => <li key={condition}>{condition}</li>)}</ul> : <p>Las condiciones de asistencia están por confirmar. Consulta esta página antes de asistir.</p>}</section>
        </div>

        <aside className="ticket-panel" aria-label="Boletos de demostración">
          <div className="ticket-panel-heading"><p className="eyebrow">SELECCIÓN DE PRUEBA</p><h2>Elige tus boletos</h2><p>Hasta 6 boletos por selección.</p></div>
          {tickets.length ? <div className="ticket-options">{tickets.map((ticket) => <article className="ticket-option" key={ticket.id}><div className="ticket-option-copy"><h3>{ticket.name || 'Boleto'}</h3><strong>{formatPrice(ticket.price)} <small>ficticios</small></strong><p>{ticket.description || 'Características por confirmar.'}</p></div><div className="quantity-control" aria-label={`Cantidad de ${ticket.name}`}><button type="button" aria-label={`Quitar un boleto ${ticket.name}`} disabled={!quantities[ticket.id]} onClick={() => changeQuantity(ticket.id, -1)}>−</button><output aria-live="polite">{quantities[ticket.id] ?? 0}</output><button type="button" aria-label={`Agregar un boleto ${ticket.name}`} disabled={selectedCount >= 6} onClick={() => changeQuantity(ticket.id, 1)}>+</button></div></article>)}</div> : <p className="ticket-unavailable">Los tipos de boletos están por confirmar.</p>}
          <div className="ticket-summary"><div><span>Boletos seleccionados</span><strong>{selectedCount}</strong></div><div className="ticket-summary-total"><span>Total ficticio</span><strong>{formatPrice(total)}</strong></div><button className="button button-dark" type="button" disabled={!selectedCount} onClick={confirmSelection}>Confirmar selección ficticia</button><p>No se solicitan datos de pago ni se realiza ningún cargo real.</p></div>
        </aside>
      </div>

      {showContact && <div className="event-modal-backdrop" role="presentation" onMouseDown={(eventClick) => eventClick.target === eventClick.currentTarget && setShowContact(false)}><section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title"><div className="event-modal-heading"><div><p className="eyebrow">CONTACTO FICTICIO</p><h2 id="contact-title">{event.organizer || 'Organizador'}</h2></div><button className="close-button" type="button" aria-label="Cerrar contacto" onClick={() => setShowContact(false)}>×</button></div><p className="contact-detail"><span>Correo</span><strong>{event.contact?.email || 'Correo por confirmar'}</strong></p><p className="contact-detail"><span>Teléfono</span><strong>{event.contact?.phone || 'Teléfono por confirmar'}</strong></p><p className="modal-disclaimer">Datos de muestra. No se enviará ningún mensaje ni se realizará ninguna llamada.</p><button type="button" className="button button-dark" onClick={() => setShowContact(false)}>Cerrar</button></section></div>}
      {showConfirmation && <div className="event-modal-backdrop" role="presentation" onMouseDown={(eventClick) => eventClick.target === eventClick.currentTarget && setShowConfirmation(false)}><section className="event-modal confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><div className="confirmation-mark" aria-hidden="true">✓</div><p className="eyebrow">CONFIRMACIÓN DE DEMOSTRACIÓN</p><h2 id="confirmation-title">Tus boletos están listos</h2><p className="confirmation-copy">Guardamos tus boletos de prueba en Compras y Actividad.</p><div className="confirmation-items">{selectedTickets.map((ticket) => <div key={ticket.id}><span>{quantities[ticket.id]} × {ticket.name}</span><strong>{formatPrice(ticket.price * quantities[ticket.id])}</strong></div>)}</div><div className="confirmation-total"><span>Total ficticio</span><strong>{formatPrice(total)}</strong></div><p className="modal-disclaimer">No se realizó ningún pago ni cargo. Estos boletos no son válidos para acceder al evento.</p><button type="button" className="button button-dark" onClick={() => setShowConfirmation(false)}>Volver al evento</button></section></div>}
    </section>
  )
}

export function EventCard({ event, onView }) {
  return (
    <article className="event-card">
      <button className="event-card-image" type="button" onClick={() => onView(event)} aria-label={`Ver detalles de ${event.name}`}>
        {event.images?.[0] && <img src={event.images[0].src} alt={event.images[0].alt} loading="lazy" />}
        <span className="event-image-shade" /><span className="event-image-category">{event.filterCategory || 'Evento'}</span>
        <span className="event-date"><strong>{new Intl.DateTimeFormat('es-CL', { day: '2-digit' }).format(new Date(`${event.date}T12:00:00`))}</strong><small>{new Intl.DateTimeFormat('es-CL', { month: 'short' }).format(new Date(`${event.date}T12:00:00`))}</small></span>
        <span className="event-image-mark">{event.mark}</span>
      </button>
      <div className="event-card-body"><p className="eyebrow">{event.category}</p><h3>{event.name}</h3><p className="event-card-description">{event.description || 'Descripción por confirmar.'}</p><div className="event-card-meta"><span>{formatLongDate(event.date)} · {event.time || 'Hora por confirmar'}</span><span>{event.venue || 'Lugar por confirmar'} · {event.city || 'Ubicación por confirmar'}</span><span>Organiza {event.organizer || 'por confirmar'}</span></div><div className="event-card-foot"><div><span>Desde</span><strong>{formatPrice(event.price)} <small>ficticios</small></strong></div><button className="button button-outline event-details-button" type="button" onClick={() => onView(event)}>Ver detalles <span aria-hidden="true">↗</span></button></div></div>
    </article>
  )
}