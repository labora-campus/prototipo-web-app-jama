'use client'

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  Bolt,
  Check,
  ChevronRight,
  Coffee,
  Copy,
  Download,
  ExternalLink,
  Filter,
  MapPin,
  Menu,
  MoreHorizontal,
  Navigation,
  Plus,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Volume2,
  Wifi,
  X,
  Zap,
} from 'lucide-react'

const places = [
  { id: 1, name: 'Café Crespín', zone: 'Villa Crespo', distance: '350 m', type: 'Cafetería', wifi: 'Rápido', plugs: 'Abundantes', noise: 'Tranquilo', price: '$$', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85', x: '38%', y: '37%', accent: 'orange' },
  { id: 2, name: 'Huerta Cowork', zone: 'Palermo Soho', distance: '800 m', type: 'Coworking', wifi: 'Rápido', plugs: 'Varios', noise: 'Moderado', price: '$$$', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85', x: '67%', y: '29%', accent: 'teal' },
  { id: 3, name: 'Café Urbano', zone: 'Almagro', distance: '1.2 km', type: 'Cafetería', wifi: 'Estable', plugs: 'Pocos', noise: 'Tranquilo', price: '$', image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=85', x: '54%', y: '64%', accent: 'yellow' },
]

const adminPlaces = [
  ['Café Crespín', 'Cafetería', 'Activo', '128'],
  ['Huerta Cowork', 'Coworking', 'Activo', '94'],
  ['Café Urbano', 'Cafetería', 'Inactivo', '57'],
  ['La Farmacia', 'Coworking', 'Activo', '41'],
]

function Logo() {
  return <div className="logo"><span className="logo-mark"><Coffee size={17} strokeWidth={2.5} /></span><span>JAMA</span></div>
}

function Stat({ icon: Icon, label, value }: { icon: typeof Wifi; label: string; value: string }) {
  return <div className="stat"><span className="stat-icon"><Icon size={16} /></span><div><span className="stat-label">{label}</span><strong>{value}</strong></div></div>
}

function PlaceCard({ place, onOpen }: { place: typeof places[number]; onOpen: () => void }) {
  return <button className="place-card" onClick={onOpen}>
    <img src={place.image} alt={place.name} />
    <div className="place-card-body"><div className="place-card-title"><div><h3>{place.name}</h3><p>{place.zone} · {place.distance}</p></div><span className="heart">♡</span></div><div className="mini-stats"><span><Wifi size={13} /> {place.wifi}</span><span><Zap size={13} /> {place.plugs}</span><span><Volume2 size={13} /> {place.noise}</span><span className="price">{place.price}</span></div></div>
  </button>
}

export default function JamaApp() {
  const [screen, setScreen] = useState<'explore' | 'detail' | 'checkin' | 'admin' | 'notification'>('explore')
  const [selected, setSelected] = useState(places[0])
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adminTab, setAdminTab] = useState<'locales' | 'checkins' | 'nuevo'>('locales')

  const filteredPlaces = useMemo(() => places.filter((p) => `${p.name} ${p.zone}`.toLowerCase().includes(query.toLowerCase()) && (!filters.includes('wifi') || p.wifi === 'Rápido') && (!filters.includes('noise') || p.noise === 'Tranquilo')), [query, filters])
  const openDetail = (place: typeof places[number]) => { setSelected(place); setScreen('detail'); setMenuOpen(false) }
  const toggleFilter = (filter: string) => setFilters((f) => f.includes(filter) ? f.filter((x) => x !== filter) : [...f, filter])

  if (screen === 'detail') return <DetailScreen place={selected} onBack={() => setScreen('explore')} onCheckin={() => setScreen('checkin')} saved={saved} onSave={() => setSaved(!saved)} />
  if (screen === 'checkin') return <CheckinScreen place={selected} onBack={() => setScreen('explore')} />
  if (screen === 'notification') return <NotificationScreen onBack={() => setScreen('explore')} place={selected} />
  if (screen === 'admin') return <AdminScreen onExit={() => setScreen('explore')} tab={adminTab} setTab={setAdminTab} />

  return <div className="app-shell">
    <header className="topbar"><Logo /><div className="header-actions"><button className="icon-button notification-button" aria-label="Notificaciones" onClick={() => setScreen('notification')}><Bell size={19} /><span /></button><button className="avatar" onClick={() => setMenuOpen(!menuOpen)}>LM</button></div>{menuOpen && <div className="profile-menu"><strong>Lucía Martínez</strong><span>Exploradora frecuente</span><button onClick={() => setScreen('admin')}><Settings size={15} /> Panel administrador</button></div>}</header>
    <main className="explore-layout"><section className="hero-copy"><p className="eyebrow"><MapPin size={14} /> Buenos Aires, CABA</p><h1>Encontrá tu próximo<br /><em>lugar para crear.</em></h1><p className="hero-subtitle">Cafeterías y coworkings curados para trabajar mejor, cerca tuyo.</p></section>
      <div className="search-row"><div className="search-box"><Search size={18} /><input aria-label="Buscar por nombre o zona" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o zona" /><kbd>⌘ K</kbd></div><button className="filter-toggle"><SlidersHorizontal size={17} /> <span>Filtros</span></button></div>
      <div className="filter-row">{[['wifi', 'Buen wifi', Wifi], ['plugs', 'Enchufes', Zap], ['noise', 'Poco ruido', Volume2], ['price', 'Precio', Coffee]].map(([key, label, Icon]) => <button key={key as string} className={`filter-chip ${filters.includes(key as string) ? 'active' : ''}`} onClick={() => toggleFilter(key as string)}>{Icon && <Icon size={15} />} {label}</button>)}</div>
      <section className="map-card"><div className="map-top"><span className="map-label"><span className="live-dot" /> Cerca de vos</span><button className="recenter"><Navigation size={14} /> Mi ubicación</button></div><div className="mock-map"><div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" /><div className="map-road road-d" /><span className="neighborhood n1">PALERMO</span><span className="neighborhood n2">VILLA CRESPO</span><span className="neighborhood n3">ALMAGRO</span>{places.map((p, i) => <button key={p.id} className={`map-pin pin-${p.accent}`} style={{ left: p.x, top: p.y }} onClick={() => openDetail(p)} aria-label={`Ver ${p.name}`}><span>{i === 0 ? '★' : '$'}</span></button>)}<div className="you-are-here"><span /></div></div><div className="map-bottom"><span><span className="map-legend orange" /> Cafetería</span><span><span className="map-legend teal" /> Coworking</span><span className="map-count">{filteredPlaces.length} lugares cerca</span></div></section>
      <div className="section-heading"><div><p className="eyebrow">SELECCIÓN JAMA</p><h2>Lugares cerca tuyo</h2></div><button className="text-button">Ver todos <ChevronRight size={16} /></button></div>
      <div className="places-list">{filteredPlaces.map((place) => <PlaceCard key={place.id} place={place} onOpen={() => openDetail(place)} />)}</div>
    </main><nav className="bottom-nav"><button className="nav-item active"><MapPin size={19} /><span>Explorar</span></button><button className="nav-item" onClick={() => setScreen('notification')}><Bell size={19} /><span>Alertas</span></button><button className="nav-item" onClick={() => setScreen('admin')}><MoreHorizontal size={19} /><span>Más</span></button></nav>
  </div>
}

function DetailScreen({ place, onBack, onCheckin, saved, onSave }: { place: typeof places[number]; onBack: () => void; onCheckin: () => void; saved: boolean; onSave: () => void }) {
  return <div className="detail-page"><header className="detail-header"><button className="back-button" onClick={onBack}><ArrowLeft size={19} /> Volver</button><button className={`save-button ${saved ? 'saved' : ''}`} onClick={onSave}>{saved ? 'Guardado' : '♡ Guardar'}</button></header><div className="detail-gallery"><img src={place.image} alt={place.name} /><div className="gallery-side"><img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80" alt="Interior del lugar" /><img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" alt="Café servido" /></div><span className="photo-count">1 / 6 <Copy size={13} /></span></div><main className="detail-content"><div className="detail-heading"><div><span className="type-pill"><Coffee size={12} /> {place.type}</span><h1>{place.name}</h1><p><MapPin size={15} /> {place.zone} · {place.distance} desde vos</p></div><div className="rating"><strong>4.8</strong><span>★★★★★</span><small>124 reseñas</small></div></div><div className="detail-stats"><Stat icon={Wifi} label="Wifi" value={place.wifi} /><Stat icon={Zap} label="Enchufes" value={place.plugs} /><Stat icon={Volume2} label="Ruido" value={place.noise} /><Stat icon={Coffee} label="Precio" value={place.price} /></div><div className="detail-section"><h2>Sobre este lugar</h2><p>Un espacio luminoso y cómodo, pensado para quedarse a trabajar. Mesas amplias, café de especialidad y un ambiente que invita a concentrarse.</p></div><div className="hours-row"><div><span className="section-kicker">HORARIOS</span><strong>Hoy · 08:00 – 20:00</strong></div><span className="open-now"><span /> Abierto ahora</span></div><div className="detail-actions"><button className="primary-action" onClick={() => window.open('https://maps.google.com/?q=Buenos+Aires', '_blank')}><Navigation size={17} /> Cómo llegar</button><button className="secondary-action" onClick={onCheckin}><QrCode size={17} /> Hacer check-in</button></div></main></div>
}

function CheckinScreen({ place, onBack }: { place: typeof places[number]; onBack: () => void }) { return <div className="checkin-page"><button className="close-flow" onClick={onBack}><X size={20} /></button><div className="checkin-mark"><Check size={32} strokeWidth={3} /></div><span className="eyebrow centered">CHECK-IN REGISTRADO</span><h1>¡Listo, ya estás<br /><em>en {place.name}!</em></h1><p>Disfrutá tu sesión de trabajo.<br />Tu check-in suma beneficios en JAMA.</p><img className="checkin-photo" src={place.image} alt={place.name} /><div className="checkin-place"><MapPin size={16} /><span>{place.zone} · Ahora</span></div><button className="primary-action wide" onClick={onBack}>Volver a explorar</button><button className="link-button" onClick={onBack}>Ver mis check-ins</button></div> }

function NotificationScreen({ onBack, place }: { onBack: () => void; place: typeof places[number] }) { return <div className="notification-page"><header className="detail-header"><button className="back-button" onClick={onBack}><ArrowLeft size={19} /> Volver</button><span className="page-label">ALERTAS</span><span /></header><main className="notification-content"><div className="notification-intro"><span className="sparkle-icon"><Sparkles size={19} /></span><p className="eyebrow">JAMA TE AVISA</p><h1>Tu próxima pausa<br /><em>está cerca.</em></h1><p>Recibí recomendaciones inteligentes cuando estés buscando un lugar para trabajar.</p></div><div className="phone-mock"><div className="phone-status"><span>9:41</span><span>● ● ▰</span></div><div className="push-notification"><div className="push-icon"><Coffee size={17} /></div><div className="push-copy"><div><strong>JAMA</strong><span>ahora</span></div><p>A 300 m tenés <b>{place.name}</b>, con enchufes libres y poco ruido.</p></div><span className="push-thumb" /></div><div className="phone-map"><div className="phone-map-line" /><div className="phone-map-pin"><MapPin size={18} /></div><span>PALERMO</span></div><div className="phone-home" /></div><button className="primary-action wide" onClick={() => setTimeout(onBack, 0)}>Activar alertas</button><p className="fine-print">Podés cambiar tus preferencias cuando quieras.</p></main></div> }

function AdminScreen({ onExit, tab, setTab }: { onExit: () => void; tab: 'locales' | 'checkins' | 'nuevo'; setTab: (t: 'locales' | 'checkins' | 'nuevo') => void }) { const [saved, setSaved] = useState(false); return <div className="admin-shell"><aside className="admin-sidebar"><Logo /><div className="admin-user"><div className="avatar">JA</div><div><strong>Jama Admin</strong><span>Panel interno</span></div></div><nav><button className={tab === 'locales' ? 'selected' : ''} onClick={() => setTab('locales')}><Coffee size={17} /> Locales</button><button className={tab === 'checkins' ? 'selected' : ''} onClick={() => setTab('checkins')}><Check size={17} /> Check-ins</button><button className={tab === 'nuevo' ? 'selected' : ''} onClick={() => setTab('nuevo')}><Plus size={17} /> Alta de local</button></nav><button className="exit-admin" onClick={onExit}><ArrowLeft size={16} /> Volver a JAMA</button></aside><main className="admin-main"><header className="admin-top"><div><p className="eyebrow">PANEL ADMINISTRADOR</p><h1>{tab === 'locales' ? 'Locales cargados' : tab === 'checkins' ? 'Check-ins y comisiones' : 'Alta de nuevo local'}</h1></div><div className="admin-top-actions"><button className="icon-button"><Bell size={18} /></button><div className="avatar">JA</div></div></header>{tab === 'locales' && <><div className="admin-stats"><div><span>Locales activos</span><strong>12</strong><small>+2 este mes</small></div><div><span>Check-ins del mes</span><strong>1.284</strong><small>+18.4%</small></div><div><span>Comisiones pendientes</span><strong>$184.500</strong><small>8 locales</small></div></div><div className="table-card"><div className="table-toolbar"><div className="admin-search"><Search size={16} /><input placeholder="Buscar local..." /></div><button className="outline-button" onClick={() => setTab('nuevo')}><Plus size={16} /> Nuevo local</button></div><table><thead><tr><th>LOCAL</th><th>TIPO</th><th>ESTADO</th><th>CHECK-INS</th><th /></tr></thead><tbody>{adminPlaces.map((row) => <tr key={row[0]}><td><div className="table-name"><span className="table-avatar"><Coffee size={15} /></span><strong>{row[0]}</strong></div></td><td>{row[1]}</td><td><span className={`status ${row[2] === 'Activo' ? 'active' : 'inactive'}`}><span />{row[2]}</span></td><td>{row[3]}</td><td><button className="more-button"><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div></>}{tab === 'checkins' && <div className="table-card"><div className="table-toolbar"><div><h2>Resumen de septiembre</h2><p>Liquidación mensual por local</p></div><button className="outline-button"><Download size={16} /> Exportar</button></div><table><thead><tr><th>LOCAL</th><th>CHECK-INS DEL MES</th><th>COMISIÓN</th><th>ESTADO</th><th /></tr></thead><tbody>{adminPlaces.map((row, i) => <tr key={row[0]}><td><div className="table-name"><span className="table-avatar"><Coffee size={15} /></span><strong>{row[0]}</strong></div></td><td><strong>{row[3]}</strong></td><td>${[19200, 14100, 8550, 6150][i].toLocaleString('es-AR')}</td><td>{i < 2 && !saved ? <button className="pay-button" onClick={() => setSaved(true)}>Marcar como pagada</button> : <span className="status active"><span /> Pagada</span>}</td><td /></tr>)}</tbody></table></div>}{tab === 'nuevo' && <div className="new-place-grid"><div className="form-card"><h2>Información del local</h2><p>Completá los datos para que aparezca en JAMA.</p><div className="form-grid"><label>Nombre del local<input placeholder="Ej. Café Crespín" /></label><label>Dirección<input placeholder="Ej. Vera 699, CABA" /></label><label>Tipo<select defaultValue=""><option value="" disabled>Seleccioná un tipo</option><option>Cafetería</option><option>Coworking</option></select></label><label>Precio<select defaultValue=""><option value="" disabled>Rango de precio</option><option>$</option><option>$$</option><option>$$$</option></select></label><label>Wifi<select defaultValue=""><option>Rápido</option><option>Estable</option><option>No disponible</option></select></label><label>Enchufes<select defaultValue=""><option>Abundantes</option><option>Varios</option><option>Pocos</option></select></label><label>Nivel de ruido<select defaultValue=""><option>Tranquilo</option><option>Moderado</option><option>Ruidoso</option></select></label><label>Horario<input placeholder="08:00 – 20:00" /></label></div><label className="full-label">Fotos del local<div className="upload-box"><Download size={20} /><span>Arrastrá fotos o <u>explorá tus archivos</u></span><small>JPG, PNG · hasta 10 MB</small></div></label><button className="primary-action" onClick={() => setSaved(true)}><QrCode size={17} /> {saved ? 'QR generado' : 'Guardar y generar QR'}</button></div><div className="qr-card"><span className="section-kicker">VISTA PREVIA</span><h2>QR del local</h2>{saved ? <><div className="qr-code"><QrCode size={108} strokeWidth={1.2} /></div><strong>Café nuevo en JAMA</strong><p>Escaneá este código para hacer check-in.</p><button className="outline-button"><Download size={15} /> Descargar QR</button></> : <div className="qr-empty"><QrCode size={34} /><p>El QR se genera<br />al guardar el local</p></div>}</div></div>}</main></div> }
