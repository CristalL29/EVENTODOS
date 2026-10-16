import { useEffect, useState } from 'react'
import './App.css'
import { EventCard, EventCatalog, EventDetails } from './EventViews.jsx'

const initialEvents = [
  {
    id: 1, name: 'Festival Brisa', category: 'MÚSICA · FESTIVAL', filterCategory: 'Música', date: '2026-10-24', time: '16:00', venue: 'Parque Bicentenario', city: 'Santiago', address: 'Acceso por avenida Bicentenario, entrada norte', organizer: 'Colectivo Brisa', price: 18900, sold: 842, tone: 'coral', mark: 'BRISA',
    description: 'Una tarde al aire libre para descubrir nuevas voces, bailar junto al lago y compartir música en comunidad. La programación reúne proyectos independientes y artistas invitados en dos escenarios.',
    organizerDescription: 'Colectivo local dedicado a producir encuentros musicales accesibles y apoyar a artistas emergentes.',
    contact: { email: 'hola@colectivobrisa.example', phone: '+56 9 0000 0001' },
    attendance: ['Apertura de puertas a las 15:00.', 'Menores de 16 años deben asistir con una persona adulta.', 'Recinto al aire libre; revisa el pronóstico antes de asistir.', 'No se permite ingresar con alimentos ni bebidas externas.'],
    images: [
      { src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=85', alt: 'Público frente a un escenario durante un concierto' },
      { src: 'https://images.unsplash.com/photo-1501386761578-eac5ce94b9b5?auto=format&fit=crop&w=900&q=80', alt: 'Asistentes disfrutando un festival al aire libre' },
      { src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80', alt: 'Luces de escenario en un festival musical' },
    ],
    tickets: [
      { id: 'general', name: 'General', price: 18900, description: 'Acceso a escenarios y zonas comunes.' },
      { id: 'preferente', name: 'Preferente', price: 32900, description: 'Acceso preferente y zona de descanso.' },
    ],
  },
  {
    id: 2, name: 'Noche de jazz', category: 'MÚSICA · EN VIVO', filterCategory: 'Música', date: '2026-10-18', time: '20:30', venue: 'Club Subterráneo', city: 'Providencia', address: 'Sala principal, acceso por calle Orrego Luco', organizer: 'Club Subterráneo', price: 12500, sold: 514, tone: 'plum', mark: 'JAZZ',
    description: 'Una sesión íntima de jazz en vivo con repertorio original, improvisación y una banda invitada. La noche abre con un set acústico y continúa con una presentación principal.',
    organizerDescription: 'Espacio cultural independiente que presenta música en vivo y artistas de la escena local.',
    contact: { email: 'programacion@subterraneo.example', phone: '+56 9 0000 0002' },
    attendance: ['Apertura de puertas a las 19:45.', 'Evento para mayores de 18 años.', 'El acceso al recinto tiene escaleras.', 'Asientos disponibles por orden de llegada.'],
    images: [
      { src: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1400&q=85', alt: 'Músicos tocando jazz en un escenario pequeño' },
      { src: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=900&q=80', alt: 'Instrumentos preparados para una sesión de jazz' },
      { src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', alt: 'Cantante en una presentación musical' },
    ],
    tickets: [
      { id: 'general', name: 'General', price: 12500, description: 'Acceso a la presentación.' },
      { id: 'mesa', name: 'Mesa compartida', price: 18500, description: 'Asiento en mesa compartida, sujeto a disponibilidad.' },
    ],
  },
  {
    id: 3, name: 'Mercado creativo', category: 'FERIA · DISEÑO', filterCategory: 'Ferias', date: '2026-10-20', time: '11:00', venue: 'Centro Cultural La Moneda', city: 'Santiago', address: 'Plaza de la Ciudadanía, nivel -3', organizer: 'Taller Nube', price: 5000, sold: 367, tone: 'yellow', mark: 'CREA',
    description: 'Un recorrido por proyectos independientes de ilustración, cerámica, objetos y diseño. Conversa con quienes crean cada pieza y participa en talleres breves durante la jornada.',
    organizerDescription: 'Taller Nube conecta a creadoras, oficios y comunidades en encuentros abiertos.',
    contact: { email: 'equipo@tallernube.example', phone: '+56 9 0000 0003' },
    attendance: ['Feria abierta entre 11:00 y 19:00.', 'La entrada permite un acceso durante el día.', 'Espacio accesible mediante ascensores del centro cultural.', 'Talleres con cupos limitados se inscriben en el recinto.'],
    images: [
      { src: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1400&q=85', alt: 'Mesa de trabajo en un taller de arte y diseño' },
      { src: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80', alt: 'Objetos de diseño y arte hechos a mano' },
      { src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', alt: 'Materiales y obras en un espacio creativo' },
    ],
    tickets: [
      { id: 'general', name: 'Entrada general', price: 5000, description: 'Acceso a la feria durante el día.' },
      { id: 'taller', name: 'Entrada + taller', price: 9500, description: 'Acceso a la feria y a un taller de 45 minutos.' },
    ],
  },
  {
    id: 4, name: 'Comedia sin filtro', category: 'TEATRO · STAND UP', filterCategory: 'Teatro', date: '2026-10-29', time: '21:00', venue: 'Teatro Mori', city: 'Reñaca', address: 'Sala principal, avenida Borgoño 14.500', organizer: 'Ríe Producciones', price: 9900, sold: 298, tone: 'blue', mark: 'RÍE',
    description: 'Una noche de stand up con rutinas nuevas, invitados sorpresa y humor cotidiano. Presentación en formato de sala con una pausa breve entre bloques.',
    organizerDescription: 'Ríe Producciones crea y presenta espectáculos de comedia en espacios independientes.',
    contact: { email: 'hola@rieproducciones.example', phone: '+56 9 0000 0004' },
    attendance: ['Apertura de puertas a las 20:15.', 'Espectáculo recomendado para mayores de 16 años.', 'No se permite grabar la presentación.', 'Llegar después del inicio puede implicar esperar una pausa para ingresar.'],
    images: [
      { src: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=85', alt: 'Escenario preparado para una presentación de comedia' },
      { src: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=80', alt: 'Público reunido en una presentación en vivo' },
      { src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80', alt: 'Luces encendidas en un escenario' },
    ],
    tickets: [
      { id: 'general', name: 'General', price: 9900, description: 'Asiento general en sala.' },
      { id: 'fila-preferente', name: 'Fila preferente', price: 14900, description: 'Asiento en las primeras filas.' },
    ],
  },
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
const todayDate = new Date().toISOString().slice(0, 10)
const emptyEventForm = { name: '', description: '', date: '', time: '', venue: '', image: '' }
const eventStorageKey = 'eventodos-events'

function App() {
  const [activeTab, setActiveTab] = useState('Inicio')
  const [role, setRole] = useState('Comprador')
  const [sortOrder, setSortOrder] = useState('asc')
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = JSON.parse(window.localStorage.getItem(eventStorageKey))
      return Array.isArray(savedEvents) ? savedEvents : initialEvents
    } catch {
      return initialEvents
    }
  })
  const [eventSearch, setEventSearch] = useState('')
  const [eventDateFilter, setEventDateFilter] = useState('all')
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all')
  const [eventLocationFilter, setEventLocationFilter] = useState('all')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [eventLoadStatus, setEventLoadStatus] = useState('ready')
  const [raffles, setRaffles] = useState(initialRaffles)
  const [notices, setNotices] = useState(initialNotices)
  const [showRaffleForm, setShowRaffleForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [eventForm, setEventForm] = useState(emptyEventForm)
  const [toast, setToast] = useState('')
  const [raffleName, setRaffleName] = useState('')
  const [rafflePrice, setRafflePrice] = useState('')

  const publicEvents = events.filter((event) => event.status !== 'Borrador')
  const organizerEvents = events.filter((event) => event.owner === 'current-organizer')
  const sortedEvents = [...publicEvents].sort((a, b) => (sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)))
  const filteredEvents = sortedEvents.filter((event) => {
    const searchText = `${event.name} ${event.description} ${event.venue} ${event.city}`.toLocaleLowerCase('es-CL')
    const matchesSearch = searchText.includes(eventSearch.trim().toLocaleLowerCase('es-CL'))
    const matchesCategory = eventCategoryFilter === 'all' || event.filterCategory === eventCategoryFilter
    const matchesLocation = eventLocationFilter === 'all' || event.city === eventLocationFilter
    const matchesDate = eventDateFilter === 'all'
      || (eventDateFilter === 'weekend' && event.date >= '2026-10-17' && event.date <= '2026-10-18')
      || (eventDateFilter === 'month' && event.date.startsWith('2026-10'))
    return matchesSearch && matchesCategory && matchesLocation && matchesDate
  })
  const selectedEvent = publicEvents.find((event) => event.id === selectedEventId)
  const eventLocations = [...new Set(publicEvents.map((event) => event.city))].sort((a, b) => a.localeCompare(b, 'es-CL'))
  const popularRaffles = [...raffles].filter((raffle) => raffle.status === 'Pública').sort((a, b) => b.sold - a.sold)
  const unreadCount = notices.filter((notice) => notice.unread).length

  useEffect(() => {
    window.localStorage.setItem(eventStorageKey, JSON.stringify(events))
  }, [events])

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

  function openEventForm(eventToEdit = null) {
    setEditingEventId(eventToEdit?.id ?? null)
    setEventForm(eventToEdit ? {
      name: eventToEdit.name,
      description: eventToEdit.description,
      date: eventToEdit.date,
      time: eventToEdit.time,
      venue: eventToEdit.venue,
      image: eventToEdit.images?.[0]?.src ?? '',
    } : emptyEventForm)
    setShowEventForm(true)
  }

  function saveEvent(status) {
    const { name, description, date, time, venue, image } = eventForm
    if (![name, description, date, time, venue].every((value) => value.trim())) {
      showMessage('Completa el nombre, la descripción, la fecha, la hora y el lugar.')
      return
    }

    const previousEvent = events.find((event) => event.id === editingEventId)
    const updatedEvent = {
      ...previousEvent,
      id: editingEventId ?? Date.now(),
      owner: 'current-organizer',
      name: name.trim(),
      description: description.trim(),
      date,
      time,
      venue: venue.trim(),
      city: venue.trim(),
      address: venue.trim(),
      organizer: 'Tu organización',
      category: 'EVENTO · COMUNIDAD',
      filterCategory: 'Otros',
      tone: 'coral',
      mark: name.trim().slice(0, 8).toUpperCase(),
      price: 0,
      sold: 0,
      status,
      images: image ? [{ src: image, alt: `Imagen de ${name.trim()}` }] : [],
      tickets: previousEvent?.tickets ?? [],
      attendance: previousEvent?.attendance ?? [],
    }

    setEvents((current) => editingEventId
      ? current.map((event) => event.id === editingEventId ? updatedEvent : event)
      : [updatedEvent, ...current])
    setShowEventForm(false)
    setEventForm(emptyEventForm)
    showMessage(status === 'Pública'
      ? (editingEventId ? 'Evento actualizado y publicado.' : 'Evento publicado correctamente.')
      : (editingEventId ? 'Borrador actualizado.' : 'Borrador guardado.'))
  }

  function selectEventImage(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showMessage('Selecciona un archivo de imagen válido.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      showMessage('La imagen debe pesar menos de 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setEventForm((current) => ({ ...current, image: reader.result }))
    reader.readAsDataURL(file)
  }

  function buyTicket(name) {
    showMessage(`¡Listo! Agregaste ${name} a tus entradas.`)
  }

  function openEventCatalog() {
    setSelectedEventId(null)
    setActiveTab('Eventos')
    setEventLoadStatus('loading')
    window.setTimeout(() => setEventLoadStatus(publicEvents.length ? 'ready' : 'error'), 240)
  }

  function openEventDetails(event) {
    setSelectedEventId(event.id)
    setActiveTab('Eventos')
  }

  function retryEventLoad() {
    setEventLoadStatus('loading')
    window.setTimeout(() => setEventLoadStatus(publicEvents.length ? 'ready' : 'error'), 240)
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
            <button key={tab} type="button" className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => tab === 'Eventos' ? openEventCatalog() : setActiveTab(tab)}>
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
              <label><span>¿Qué te gustaría vivir?</span><input aria-label="Buscar por evento, artista o lugar" placeholder="Evento, artista o lugar" value={eventSearch} onChange={(event) => setEventSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && openEventCatalog()} /></label>
              <label className="date-field"><span>¿Cuándo?</span><select aria-label="Filtrar por fecha" value={eventDateFilter} onChange={(event) => setEventDateFilter(event.target.value)}><option value="all">Cualquier fecha</option><option value="weekend">Este fin de semana</option><option value="month">Este mes</option></select></label>
              <button className="button button-dark" type="button" onClick={openEventCatalog}>Explorar eventos <span aria-hidden="true">↗</span></button>
            </section>
            <section className="section-block">
              <div className="section-heading"><div><p className="eyebrow">NO TE LO PIERDAS</p><h2>Populares <span>&</span> próximos</h2></div><button className="text-action" onClick={openEventCatalog} type="button">Ver todos <span aria-hidden="true">↗</span></button></div>
              <div className="event-grid">{sortedEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} onView={openEventDetails} />)}</div>
            </section>
            <section className="raffle-strip">
              <div className="raffle-copy"><p className="eyebrow">SUERTE CON PROPÓSITO</p><h2>Una oportunidad,<br /><em>muchas posibilidades.</em></h2><p>Participa en rifas creadas por comunidades que hacen cosas increíbles.</p><button className="button button-light" type="button" onClick={() => setActiveTab('Rifas')}>Explorar rifas <span aria-hidden="true">↗</span></button></div>
              <div className="raffle-spotlight"><span className="spotlight-tag">MÁS POPULAR</span><div className="raffle-object" aria-hidden="true">✳</div><h3>{popularRaffles[0]?.name}</h3><div className="raffle-meta"><span>{popularRaffles[0]?.sold} boletos vendidos</span><strong>{formatPrice(popularRaffles[0]?.price ?? 0)}</strong></div></div>
            </section>
            <section className="section-block notice-preview"><div className="section-heading"><div><p className="eyebrow">AL DÍA</p><h2>Avisos para ti</h2></div><button className="text-action" onClick={() => setActiveTab('Avisos')} type="button">Ver avisos <span aria-hidden="true">↗</span></button></div><NoticeItem notice={notices[0]} /></section>
          </>
        )}

        {activeTab === 'Eventos' && (selectedEvent
          ? <EventDetails key={selectedEvent.id} event={selectedEvent} onBack={openEventCatalog} />
          : <EventCatalog
            events={filteredEvents}
            locations={eventLocations}
            search={eventSearch}
            onSearchChange={setEventSearch}
            dateFilter={eventDateFilter}
            onDateFilterChange={setEventDateFilter}
            categoryFilter={eventCategoryFilter}
            onCategoryFilterChange={setEventCategoryFilter}
            locationFilter={eventLocationFilter}
            onLocationFilterChange={setEventLocationFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            status={eventLoadStatus}
            onRetry={retryEventLoad}
            onView={openEventDetails}
          />)}

        {activeTab === 'Rifas' && <section className="module-page"><div className="module-heading"><div><p className="eyebrow">PARTICIPA, COMPARTE, GANA</p><h1>Rifas con propósito</h1><p>Oportunidades que impulsan grandes causas.</p></div>{role === 'Organizador' && <button className="button button-dark" type="button" onClick={() => setShowRaffleForm(true)}>＋ Crear rifa</button>}</div><div className="raffle-callout"><span className="callout-symbol">✳</span><div><strong>Tu participación hace la diferencia.</strong><p>Cada boleto apoya a una comunidad o proyecto local.</p></div><span className="callout-count">{popularRaffles.length} activas</span></div><div className="raffle-list">{raffles.filter((raffle) => role === 'Organizador' || raffle.status === 'Pública').sort((a, b) => b.sold - a.sold).map((raffle) => <RaffleRow key={raffle.id} raffle={raffle} onJoin={() => buyTicket(raffle.name)} isOrganizer={role === 'Organizador'} />)}</div></section>}

        {activeTab === 'Avisos' && <section className="module-page"><div className="module-heading"><div><p className="eyebrow">NOVEDADES DE TUS PLANES</p><h1>Avisos</h1><p>Cambios e información de tus entradas y eventos.</p></div>{unreadCount > 0 && <button className="text-action" type="button" onClick={markNoticesRead}>Marcar todo como leído</button>}</div><div className="notice-list">{notices.map((notice) => <NoticeItem key={notice.id} notice={notice} />)}</div></section>}

        {activeTab === 'Perfil' && <section className="module-page"><div className="module-heading"><div><p className="eyebrow">TU ESPACIO EN EVENTODOS</p><h1>{role === 'Comprador' ? 'Hola, Camila.' : 'Panel de organización'}</h1><p>{role === 'Comprador' ? 'Aquí comienza tu próxima historia.' : 'Administra tus eventos y conecta con tu comunidad.'}</p></div><div className="role-switch profile-role"><button className={role === 'Comprador' ? 'selected' : ''} onClick={() => setRole('Comprador')} type="button">Comprador</button><button className={role === 'Organizador' ? 'selected' : ''} onClick={() => setRole('Organizador')} type="button">Organizador</button></div></div>{role === 'Comprador' ? <div className="profile-layout"><div className="profile-stat"><span>ENTRADAS ACTIVAS</span><strong>2</strong><button type="button" className="text-action" onClick={() => showMessage('Tus entradas están al día.')}>Ver mis entradas ↗</button></div><div className="profile-stat"><span>RIFAS EN LAS QUE PARTICIPAS</span><strong>1</strong><button type="button" className="text-action" onClick={() => setActiveTab('Rifas')}>Explorar rifas ↗</button></div><div className="profile-detail"><p className="eyebrow">DATOS DE LA CUENTA</p><h2>Camila Morales</h2><p>camila.morales@email.com</p><button className="button button-outline" type="button" onClick={() => showMessage('Pronto podrás editar tus datos.')}>Editar perfil</button></div></div> : <><div className="organizer-stats"><div><span>RIFAS PUBLICADAS</span><strong>{raffles.filter((raffle) => raffle.status === 'Pública').length}</strong></div><div><span>BOLETOS VENDIDOS</span><strong>{raffles.reduce((total, raffle) => total + raffle.sold, 0).toLocaleString('es-CL')}</strong></div><div><span>BORRADORES</span><strong>{raffles.filter((raffle) => raffle.status === 'Borrador').length}</strong></div><button className="button button-dark" type="button" onClick={() => setShowRaffleForm(true)}>＋ Crear rifa</button></div><div className="organizer-table"><div className="table-heading"><div><p className="eyebrow">TU ACTIVIDAD</p><h2>Rifas y publicaciones</h2></div><button className="text-action" type="button" onClick={() => setActiveTab('Rifas')}>Ver todas ↗</button></div>{raffles.map((raffle) => <RaffleRow key={raffle.id} raffle={raffle} onJoin={() => {}} isOrganizer />)}</div></>}</section>}

        {activeTab === 'Perfil' && role === 'Organizador' && <section className="organizer-events-section"><div className="table-heading"><div><p className="eyebrow">PUBLICACIONES DE EVENTOS</p><h2>Mis eventos</h2></div><button className="button button-dark" type="button" onClick={() => openEventForm()}>＋ Crear evento</button></div><div className="organizer-event-stats"><span>{organizerEvents.filter((event) => event.status === 'Pública').length} publicados</span><span>{organizerEvents.filter((event) => event.status === 'Borrador').length} borradores</span></div>{organizerEvents.length ? <div className="organizer-event-list">{organizerEvents.map((event) => <article className="organizer-event-row" key={event.id}>{event.images?.[0]?.src ? <img src={event.images[0].src} alt="" /> : <div className="organizer-event-placeholder" aria-hidden="true">{event.mark}</div>}<div className="organizer-event-copy"><div className="organizer-event-title"><h3>{event.name}</h3><span className={`status-label ${event.status === 'Pública' ? 'is-public' : 'is-draft'}`}>{event.status}</span></div><p>{formatDate(event.date)} · {event.time} · {event.venue}</p><p className="organizer-event-description">{event.description}</p></div><button className="button button-outline" type="button" onClick={() => openEventForm(event)}>Editar</button></article>)}</div> : <p className="organizer-events-empty">Aún no tienes eventos. Crea uno y guárdalo como borrador o publícalo para que aparezca en la agenda.</p>}</section>}
      </main>

      <footer className="footer"><a className="brand" href="#inicio" onClick={() => setActiveTab('Inicio')}><img className="brand-mark" src="/favicon.svg" alt="" /><span>EVENTODOS</span></a><p>Momentos que nos encuentran.</p><span>© 2026 EVENTODOS</span></footer>

      {showRaffleForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowRaffleForm(false)}><section className="raffle-modal" role="dialog" aria-modal="true" aria-labelledby="raffle-modal-title"><div className="modal-heading"><div><p className="eyebrow">NUEVA PUBLICACIÓN</p><h2 id="raffle-modal-title">Crea tu rifa</h2></div><button className="close-button" type="button" aria-label="Cerrar" onClick={() => setShowRaffleForm(false)}>×</button></div><label className="form-field">Nombre de la rifa<input value={raffleName} onChange={(event) => setRaffleName(event.target.value)} placeholder="Ej. Una bici para tu próximo viaje" /></label><label className="form-field">Valor del boleto<input type="number" min="1" value={rafflePrice} onChange={(event) => setRafflePrice(event.target.value)} placeholder="$ 2.000" /></label><div className="status-explainer"><span className="status-dot public"/><div><strong>Pública</strong><p>Visible para todas las personas y disponible para participar.</p></div><span className="status-dot draft"/><div><strong>Borrador</strong><p>Guárdala y termínala cuando quieras.</p></div></div><div className="modal-actions"><button className="button button-outline" type="button" onClick={() => createRaffle('Borrador')}>Guardar borrador</button><button className="button button-dark" type="button" onClick={() => createRaffle('Pública')}>Publicar rifa <span aria-hidden="true">↗</span></button></div></section></div>}
      {activeTab === 'Perfil' && role === 'Organizador' && showEventForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowEventForm(false)}><section className="raffle-modal event-form-modal" role="dialog" aria-modal="true" aria-labelledby="event-form-title"><div className="modal-heading"><div><p className="eyebrow">PUBLICACIÓN DE EVENTO</p><h2 id="event-form-title">{editingEventId ? 'Editar evento' : 'Crear evento'}</h2></div><button className="close-button" type="button" aria-label="Cerrar formulario" onClick={() => setShowEventForm(false)}>×</button></div><form onSubmit={(event) => { event.preventDefault(); saveEvent('Pública') }}><label className="form-field">Nombre<input required maxLength="100" value={eventForm.name} onChange={(event) => setEventForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ej. Festival de primavera" /></label><label className="form-field">Descripción<textarea required maxLength="1000" rows="3" value={eventForm.description} onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))} placeholder="Cuéntales qué podrán vivir en el evento" /></label><div className="event-form-datetime"><label className="form-field">Fecha<input required type="date" min={todayDate} value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} /></label><label className="form-field">Hora<input required type="time" value={eventForm.time} onChange={(event) => setEventForm((current) => ({ ...current, time: event.target.value }))} /></label></div><label className="form-field">Lugar<input required maxLength="160" value={eventForm.venue} onChange={(event) => setEventForm((current) => ({ ...current, venue: event.target.value }))} placeholder="Dirección o recinto" /></label><label className="form-field event-image-field">Imagen del evento<input type="file" accept="image/*" onChange={(event) => selectEventImage(event.target.files?.[0])} /><span>JPG, PNG o similar · máximo 2 MB</span></label>{eventForm.image && <img className="event-image-preview" src={eventForm.image} alt="Vista previa de la imagen del evento" />}<div className="status-explainer"><span className="status-dot public"/><div><strong>Pública</strong><p>El evento aparecerá en la agenda para todas las personas.</p></div><span className="status-dot draft"/><div><strong>Borrador</strong><p>Solo tú lo verás en tu perfil de organización.</p></div></div><div className="modal-actions"><button className="button button-outline" type="button" onClick={() => saveEvent('Borrador')}>Guardar como borrador</button><button className="button button-dark" type="submit">{editingEventId ? 'Guardar y publicar' : 'Publicar evento'} <span aria-hidden="true">↗</span></button></div></form></section></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
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
