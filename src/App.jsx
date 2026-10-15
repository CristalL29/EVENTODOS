import { useState } from 'react'
import './App.css'

const initialEvents = [
  { id: 1, name: 'Festival Brisa', category: 'MÚSICA · FESTIVAL', date: '2026-10-24', time: '16:00', venue: 'Parque Bicentenario', city: 'Santiago', price: 18900, sold: 842, tone: 'coral', mark: 'BRISA' },
  { id: 2, name: 'Noche de jazz', category: 'MÚSICA · EN VIVO', date: '2026-10-18', time: '20:30', venue: 'Club Subterráneo', city: 'Providencia', price: 12500, sold: 514, tone: 'plum', mark: 'JAZZ' },
  { id: 3, name: 'Mercado creativo', category: 'FERIA · DISEÑO', date: '2026-10-20', time: '11:00', venue: 'Centro Cultural La Moneda', city: 'Santiago', price: 5000, sold: 367, tone: 'yellow', mark: 'CREA' },
  { id: 4, name: 'Comedia sin filtro', category: 'TEATRO · STAND UP', date: '2026-10-29', time: '21:00', venue: 'Teatro Mori', city: 'Reñaca', price: 9900, sold: 298, tone: 'blue', mark: 'RÍE' },
]

const initialRaffles = [
  { id: 1, name: 'Rifa solidaria: bici urbana', organizer: 'Pedal por la ciudad', sold: 628, total: 800, price: 2000, status: 'Pública', date: '2026-10-19' },
  { id: 2, name: 'Una escapada al sur', organizer: 'Fundación Bosque Vivo', sold: 412, total: 600, price: 3500, status: 'Pública', date: '2026-10-22' },
  { id: 3, name: 'Kit de ilustración', organizer: 'Taller Nube', sold: 286, total: 500, price: 1500, status: 'Pública', date: '2026-10-26' },
]

const initialNotices = [
  { id: 1, title: 'Cambio de horario', detail: 'Noche de jazz comienza 30 minutos más tarde.', time: 'Hace 2 h', type: 'update', unread: true },
  { id: 2, title: 'Tu entrada está lista', detail: 'Festival Brisa · 2 entradas confirmadas.', time: 'Ayer', type: 'ticket', unread: true },
  { id: 3, title: 'Nueva información del evento', detail: 'El acceso a Mercado creativo abre desde las 10:30.', time: '12 oct', type: 'info', unread: false },
]

const tabs = ['Inicio', 'Eventos', 'Rifas', 'Avisos', 'Perfil']
const formatPrice = (amount) => `$${amount.toLocaleString('es-CL')}`
const formatDate = (value) => new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`))

function App() {
  const [activeTab, setActiveTab] = useState('Inicio')
  const [role, setRole] = useState('Comprador')
  const [sortOrder, setSortOrder] = useState('asc')
  const [events] = useState(initialEvents)
  const [raffles, setRaffles] = useState(initialRaffles)
  const [notices, setNotices] = useState(initialNotices)
  const [showRaffleForm, setShowRaffleForm] = useState(false)
  const [toast, setToast] = useState('')
  const [raffleName, setRaffleName] = useState('')
  const [rafflePrice, setRafflePrice] = useState('')

  const sortedEvents = [...events].sort((a, b) => (sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)))
  const popularRaffles = [...raffles].filter((raffle) => raffle.status === 'Pública').sort((a, b) => b.sold - a.sold)
  const unreadCount = notices.filter((notice) => notice.unread).length

  function showMessage(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  function createRaffle(status) {
    if (!raffleName.trim() || !rafflePrice) {
      showMessage('Completa el nombre y el valor del boleto.')
      return
    }
    setRaffles((current) => [{ id: Date.now(), name: raffleName.trim(), organizer: 'Tu organización', sold: 0, total: 100, price: Number(rafflePrice), status, date: '2026-11-15' }, ...current])
    setRaffleName('')
    setRafflePrice('')
    setShowRaffleForm(false)
    showMessage(status === 'Pública' ? 'Rifa publicada correctamente.' : 'Borrador guardado.')
  }

  function buyTicket(name) {
    showMessage(`¡Listo! Agregaste ${name} a tus entradas.`)
  }

  function markNoticesRead() {
    setNotices((current) => current.map((notice) => ({ ...notice, unread: false })))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" onClick={() => setActiveTab('Inicio')} aria-label="EVENTODOS, inicio">
          <img className="brand-mark" src="/favicon.svg" alt="" />
          <span>EVENTODOS</span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          {tabs.map((tab) => (
            <button key={tab} type="button" className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}{tab === 'Avisos' && unreadCount > 0 && <span className="nav-count">{unreadCount}</span>}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <div className="role-switch" aria-label="Cambiar tipo de perfil">
            <button type="button" className={role === 'Comprador' ? 'selected' : ''} onClick={() => setRole('Comprador')}>Comprador</button>
            <button type="button" className={role === 'Organizador' ? 'selected' : ''} onClick={() => setRole('Organizador')}>Organizador</button>
          </div>
          <button className="avatar" type="button" aria-label="Abrir perfil" onClick={() => setActiveTab('Perfil')}>CM</button>
        </div>
      </header>

      <main className="page-content">
        {activeTab === 'Inicio' && (
          <>
            <section className="welcome-row">
              <div><p className="eyebrow">JUEVES, 15 DE OCTUBRE DE 2026</p><h1>La próxima gran historia<br className="desktop-break" /> empieza <em>en vivo.</em></h1><p className="intro">Encuentra ese plan que estabas buscando.</p></div>
              <div className="hero-art" aria-label="Ilustración de escenario de música" role="img"><span className="sun-disc"/><span className="stage-light light-one"/><span className="stage-light light-two"/><span className="stage-floor"/><span className="hero-caption">VIVE<br />EL MOMENTO</span><span className="hero-index">01 — 04</span></div>
            </section>
            <section className="quick-search" aria-label="Buscar eventos">
              <label><span>¿Qué te gustaría vivir?</span><input aria-label="Buscar por evento, artista o lugar" placeholder="Evento, artista o lugar" onKeyDown={(event) => event.key === 'Enter' && setActiveTab('Eventos')} /></label>
              <label className="date-field"><span>¿Cuándo?</span><select aria-label="Filtrar por fecha"><option>Cualquier fecha</option><option>Este fin de semana</option><option>Este mes</option></select></label>
              <button className="button button-dark" type="button" onClick={() => setActiveTab('Eventos')}>Explorar eventos <span aria-hidden="true">↗</span></button>
            </section>
            <section className="section-block">
              <div className="section-heading"><div><p className="eyebrow">NO TE LO PIERDAS</p><h2>Populares <span>&</span> próximos</h2></div><button className="text-action" onClick={() => setActiveTab('Eventos')} type="button">Ver todos <span aria-hidden="true">↗</span></button></div>
              <div className="event-grid">{sortedEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} onBuy={buyTicket} />)}</div>
            </section>
            <section className="raffle-strip">
              <div className="raffle-copy"><p className="eyebrow">SUERTE CON PROPÓSITO</p><h2>Una oportunidad,<br /><em>muchas posibilidades.</em></h2><p>Participa en rifas creadas por comunidades que hacen cosas increíbles.</p><button className="button button-light" type="button" onClick={() => setActiveTab('Rifas')}>Explorar rifas <span aria-hidden="true">↗</span></button></div>
              <div className="raffle-spotlight"><span className="spotlight-tag">MÁS POPULAR</span><div className="raffle-object" aria-hidden="true">✳</div><h3>{popularRaffles[0]?.name}</h3><div className="raffle-meta"><span>{popularRaffles[0]?.sold} boletos vendidos</span><strong>{formatPrice(popularRaffles[0]?.price ?? 0)}</strong></div></div>
            </section>
            <section className="section-block notice-preview"><div className="section-heading"><div><p className="eyebrow">AL DÍA</p><h2>Avisos para ti</h2></div><button className="text-action" onClick={() => setActiveTab('Avisos')} type="button">Ver avisos <span aria-hidden="true">↗</span></button></div><NoticeItem notice={notices[0]} /></section>
          </>
        )}

        {activeTab === 'Eventos' && <section className="module-page"><div className="module-heading"><div><p className="eyebrow">ENCUENTRA TU PRÓXIMO PLAN</p><h1>Todos los eventos</h1><p>Experiencias para recordar, cerca de ti.</p></div><label className="sort-control">Ordenar por fecha<select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Ordenar eventos por fecha"><option value="asc">Más próximos primero</option><option value="desc">Más lejanos primero</option></select></label></div><div className="filter-row"><button type="button" className="filter-chip active">Todos</button><button type="button" className="filter-chip" onClick={() => showMessage('Filtro Música seleccionado.')}>Música</button><button type="button" className="filter-chip" onClick={() => showMessage('Filtro Ferias seleccionado.')}>Ferias</button><button type="button" className="filter-chip" onClick={() => showMessage('Filtro Teatro seleccionado.')}>Teatro</button><span className="result-count">{sortedEvents.length} eventos</span></div><div className="event-grid events-list">{sortedEvents.map((event) => <EventCard key={event.id} event={event} onBuy={buyTicket} />)}</div></section>}

        {activeTab === 'Rifas' && <section className="module-page"><div className="module-heading"><div><p className="eyebrow">PARTICIPA, COMPARTE, GANA</p><h1>Rifas con propósito</h1><p>Oportunidades que impulsan grandes causas.</p></div>{role === 'Organizador' && <button className="button button-dark" type="button" onClick={() => setShowRaffleForm(true)}>＋ Crear rifa</button>}</div><div className="raffle-callout"><span className="callout-symbol">✳</span><div><strong>Tu participación hace la diferencia.</strong><p>Cada boleto apoya a una comunidad o proyecto local.</p></div><span className="callout-count">{popularRaffles.length} activas</span></div><div className="raffle-list">{raffles.filter((raffle) => role === 'Organizador' || raffle.status === 'Pública').sort((a, b) => b.sold - a.sold).map((raffle) => <RaffleRow key={raffle.id} raffle={raffle} onJoin={() => buyTicket(raffle.name)} isOrganizer={role === 'Organizador'} />)}</div></section>}

        {activeTab === 'Avisos' && <section className="module-page"><div className="module-heading"><div><p className="eyebrow">NOVEDADES DE TUS PLANES</p><h1>Avisos</h1><p>Cambios e información de tus entradas y eventos.</p></div>{unreadCount > 0 && <button className="text-action" type="button" onClick={markNoticesRead}>Marcar todo como leído</button>}</div><div className="notice-list">{notices.map((notice) => <NoticeItem key={notice.id} notice={notice} />)}</div></section>}

        {activeTab === 'Perfil' && <section className="module-page"><div className="module-heading"><div><p className="eyebrow">TU ESPACIO EN EVENTODOS</p><h1>{role === 'Comprador' ? 'Hola, Camila.' : 'Panel de organización'}</h1><p>{role === 'Comprador' ? 'Aquí comienza tu próxima historia.' : 'Administra tus eventos y conecta con tu comunidad.'}</p></div><div className="role-switch profile-role"><button className={role === 'Comprador' ? 'selected' : ''} onClick={() => setRole('Comprador')} type="button">Comprador</button><button className={role === 'Organizador' ? 'selected' : ''} onClick={() => setRole('Organizador')} type="button">Organizador</button></div></div>{role === 'Comprador' ? <div className="profile-layout"><div className="profile-stat"><span>ENTRADAS ACTIVAS</span><strong>2</strong><button type="button" className="text-action" onClick={() => showMessage('Tus entradas están al día.')}>Ver mis entradas ↗</button></div><div className="profile-stat"><span>RIFAS EN LAS QUE PARTICIPAS</span><strong>1</strong><button type="button" className="text-action" onClick={() => setActiveTab('Rifas')}>Explorar rifas ↗</button></div><div className="profile-detail"><p className="eyebrow">DATOS DE LA CUENTA</p><h2>Camila Morales</h2><p>camila.morales@email.com</p><button className="button button-outline" type="button" onClick={() => showMessage('Pronto podrás editar tus datos.')}>Editar perfil</button></div></div> : <><div className="organizer-stats"><div><span>RIFAS PUBLICADAS</span><strong>{raffles.filter((raffle) => raffle.status === 'Pública').length}</strong></div><div><span>BOLETOS VENDIDOS</span><strong>{raffles.reduce((total, raffle) => total + raffle.sold, 0).toLocaleString('es-CL')}</strong></div><div><span>BORRADORES</span><strong>{raffles.filter((raffle) => raffle.status === 'Borrador').length}</strong></div><button className="button button-dark" type="button" onClick={() => setShowRaffleForm(true)}>＋ Crear rifa</button></div><div className="organizer-table"><div className="table-heading"><div><p className="eyebrow">TU ACTIVIDAD</p><h2>Rifas y publicaciones</h2></div><button className="text-action" type="button" onClick={() => setActiveTab('Rifas')}>Ver todas ↗</button></div>{raffles.map((raffle) => <RaffleRow key={raffle.id} raffle={raffle} onJoin={() => {}} isOrganizer />)}</div></>}</section>}
      </main>

      <footer className="footer"><a className="brand" href="#inicio" onClick={() => setActiveTab('Inicio')}><img className="brand-mark" src="/favicon.svg" alt="" /><span>EVENTODOS</span></a><p>Momentos que nos encuentran.</p><span>© 2026 EVENTODOS</span></footer>

      {showRaffleForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowRaffleForm(false)}><section className="raffle-modal" role="dialog" aria-modal="true" aria-labelledby="raffle-modal-title"><div className="modal-heading"><div><p className="eyebrow">NUEVA PUBLICACIÓN</p><h2 id="raffle-modal-title">Crea tu rifa</h2></div><button className="close-button" type="button" aria-label="Cerrar" onClick={() => setShowRaffleForm(false)}>×</button></div><label className="form-field">Nombre de la rifa<input value={raffleName} onChange={(event) => setRaffleName(event.target.value)} placeholder="Ej. Una bici para tu próximo viaje" /></label><label className="form-field">Valor del boleto<input type="number" min="1" value={rafflePrice} onChange={(event) => setRafflePrice(event.target.value)} placeholder="$ 2.000" /></label><div className="status-explainer"><span className="status-dot public"/><div><strong>Pública</strong><p>Visible para todas las personas y disponible para participar.</p></div><span className="status-dot draft"/><div><strong>Borrador</strong><p>Guárdala y termínala cuando quieras.</p></div></div><div className="modal-actions"><button className="button button-outline" type="button" onClick={() => createRaffle('Borrador')}>Guardar borrador</button><button className="button button-dark" type="button" onClick={() => createRaffle('Pública')}>Publicar rifa <span aria-hidden="true">↗</span></button></div></section></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

function EventCard({ event, onBuy }) {
  return <article className="event-card"><div className={`event-art ${event.tone}`}><span className="art-orbit"/><span className="art-mark">{event.mark}</span><span className="event-date"><strong>{formatDate(event.date).split(' ')[0]}</strong><small>{formatDate(event.date).split(' ')[1]}</small></span><span className="art-lines"/></div><div className="event-card-body"><p className="eyebrow">{event.category}</p><h3>{event.name}</h3><p className="event-venue">{event.venue} · {event.city}</p><div className="event-card-foot"><div><span>{event.time} h</span><strong>Desde {formatPrice(event.price)}</strong></div><button className="round-action" type="button" aria-label={`Comprar entradas para ${event.name}`} onClick={() => onBuy(event.name)}>↗</button></div></div></article>
}

function RaffleRow({ raffle, onJoin, isOrganizer }) {
  const progress = Math.min((raffle.sold / raffle.total) * 100, 100)
  return <article className="raffle-row"><div className="raffle-icon">✳</div><div className="raffle-row-main"><div className="raffle-title-line"><h3>{raffle.name}</h3><span className={`status-label ${raffle.status === 'Pública' ? 'is-public' : 'is-draft'}`}>{raffle.status}</span></div><p>{raffle.organizer} · Cierra el {formatDate(raffle.date)}</p><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><small>{raffle.sold} de {raffle.total} boletos</small></div><div className="raffle-row-end"><strong>{formatPrice(raffle.price)}</strong>{isOrganizer ? <span className="row-note">por boleto</span> : <button className="button button-outline" type="button" onClick={onJoin}>Participar</button>}</div></article>
}

function NoticeItem({ notice }) {
  if (!notice) return null
  return <article className={`notice-item ${notice.unread ? 'unread' : ''}`}><span className={`notice-symbol ${notice.type}`}>{notice.type === 'ticket' ? '✓' : notice.type === 'update' ? '↻' : 'i'}</span><div><h3>{notice.title}{notice.unread && <span className="unread-dot" />}</h3><p>{notice.detail}</p></div><time>{notice.time}</time></article>
}

export default App
