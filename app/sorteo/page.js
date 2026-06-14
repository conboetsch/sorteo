'use client'
import { useState, useRef } from 'react'

const ESTADOS = { LOGIN: 'login', CARGANDO: 'cargando', LISTA: 'lista', SORTEANDO: 'sorteando', GANADOR: 'ganador', CONFIRMADO: 'confirmado' }

export default function AdminSorteo() {
  const [estado, setEstado] = useState(ESTADOS.LOGIN)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [participantes, setParticipantes] = useState([])
  const [stats, setStats] = useState({})
  const [nombreRuleta, setNombreRuleta] = useState('')
  const [ganador, setGanador] = useState(null)
  const [progreso, setProgreso] = useState(0)
  const intervalRef = useRef(null)

  const confetti = () => {
    const colors = ['#D4A843','#7DD3FC','#FCA5A5','#6EE7B7','#FDE047','#FFFFFF']
    for (let i = 0; i < 100; i++) {
      const el = document.createElement('div')
      el.className = 'confetti-piece'
      el.style.cssText = `left:${Math.random()*100}vw;top:-20px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*0.5}s;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;`
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 4000)
    }
  }

  const login = async () => {
    setEstado(ESTADOS.CARGANDO)
    setError('')
    try {
      const res = await fetch('/api/sorteo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setParticipantes(data.participantes)
      setStats({ total: data.total, totalTickets: data.totalTickets, conInstagram: data.conInstagram })
      setEstado(ESTADOS.LISTA)
    } catch (e) {
      setError(e.message)
      setEstado(ESTADOS.LOGIN)
    }
  }

  const actualizar = async () => {
    try {
      const res = await fetch('/api/sorteo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (res.ok) {
        setParticipantes(data.participantes)
        setStats({ total: data.total, totalTickets: data.totalTickets, conInstagram: data.conInstagram })
      }
    } catch (e) {}
  }

  const iniciarSorteo = () => {
    // Construir tómbola — excluir apellido Boetsch
    const tombola = []
    participantes
      .filter(p => !p.apellido.toLowerCase().includes('boetsch'))
      .forEach(p => {
        for (let i = 0; i < p.tickets; i++) tombola.push(p)
      })
    if (tombola.length === 0) return

    const ganadorFinal = tombola[Math.floor(Math.random() * tombola.length)]
    setEstado(ESTADOS.SORTEANDO)
    setProgreso(0)

    let elapsed = 0
    const duration = 4000
    intervalRef.current = setInterval(() => {
      elapsed += 80
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgreso(pct)
      const random = tombola[Math.floor(Math.random() * tombola.length)]
      setNombreRuleta(random.nombre + ' ' + random.apellido)
      if (elapsed >= duration) {
        clearInterval(intervalRef.current)
        setGanador(ganadorFinal)
        setEstado(ESTADOS.GANADOR)
        confetti()
      }
    }, 80)
  }

  const confirmarGanador = async () => {
    try {
      const res = await fetch('/api/ganador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, ganadorId: ganador.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEstado(ESTADOS.CONFIRMADO)
    } catch (e) {
      setError(e.message)
    }
  }

  const nuevoSorteo = () => {
    setParticipantes(prev => prev.filter(p => p.id !== ganador.id))
    setStats(prev => ({
      ...prev,
      total: prev.total - 1,
      totalTickets: prev.totalTickets - ganador.tickets
    }))
    setGanador(null)
    setProgreso(0)
    setEstado(ESTADOS.LISTA)
  }

  // LOGIN
  if (estado === ESTADOS.LOGIN) return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-white font-black text-xl mb-2">Panel del Sorteo</h2>
        <p className="text-white/40 text-sm mb-6">Gran Final · Monte Tabor 2026</p>
        <div className="mb-4">
          <label>Clave de acceso</label>
          <input type="password" placeholder="••••••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button className="btn-gold" onClick={login}>Entrar al panel</button>
      </div>
    </main>
  )

  // CARGANDO
  if (estado === ESTADOS.CARGANDO) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-white/60">Cargando participantes...</p>
      </div>
    </main>
  )

  // LISTA
  if (estado === ESTADOS.LISTA) return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-white font-black text-2xl">Sorteo · Monte Tabor 2026</h1>
        <p className="text-white/40 text-sm mt-1">Panel del anfitrión</p>
      </div>

      <div className="glass p-6 w-full max-w-md">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { num: stats.total, label: 'Inscritos' },
            { num: stats.totalTickets, label: 'Tickets' },
            { num: stats.conInstagram, label: 'Nos siguen' }
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-2xl" style={{background:'rgba(255,255,255,0.05)'}}>
              <p style={{color:'#D4A843'}} className="text-3xl font-black leading-none">{s.num}</p>
              <p className="text-white/40 text-xs mt-1 uppercase tracking-wide font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-4">
          <span className="text-xs px-2 py-1 rounded-full font-bold" style={{background:'#38BDF822',color:'#38BDF8',border:'1px solid #38BDF844'}}>🏖️ @playablanca_resort = +1 ticket</span>
          <span className="text-xs px-2 py-1 rounded-full font-bold" style={{background:'#D4A84322',color:'#D4A843',border:'1px solid #D4A84344'}}>🌋 @magma.lodge = +1 ticket</span>
        </div>

        <div className="rounded-xl overflow-hidden mb-4" style={{background:'rgba(0,0,0,0.2)',maxHeight:'200px',overflowY:'auto'}}>
          {participantes.map(p => (
            <div key={p.id} className="flex items-center justify-between px-3 py-2 border-b border-white/5 last:border-0">
              <span className="text-white text-sm font-semibold">{p.nombre} {p.apellido}</span>
              <div className="flex gap-1">
                {p.tickets === 3 && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:'#D4A84322',color:'#D4A843',border:'1px solid #D4A84344'}}>🏖️🌋</span>}
                {p.tickets === 2 && p.sigue_playablanca && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:'#38BDF822',color:'#38BDF8',border:'1px solid #38BDF844'}}>🏖️</span>}{p.tickets === 2 && p.sigue_magma && !p.sigue_playablanca && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:'#D4A84322',color:'#D4A843',border:'1px solid #D4A84344'}}>🌋</span>}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-gold mb-3" onClick={iniciarSorteo} disabled={participantes.length === 0}>
          🎯 Iniciar Sorteo
        </button>
        <button className="btn-secondary" onClick={actualizar}>🔄 Actualizar lista</button>
      </div>
    </main>
  )

  // SORTEANDO
  if (estado === ESTADOS.SORTEANDO) return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="glass p-8 w-full max-w-md text-center">
        <p className="text-white/40 text-sm uppercase tracking-widest mb-6 font-bold">¡Momento del Sorteo!</p>
        <div className="w-full h-1 rounded-full mb-8" style={{background:'rgba(255,255,255,0.1)'}}>
          <div className="h-full rounded-full transition-all" style={{width:`${progreso}%`,background:'#D4A843'}}></div>
        </div>
        <p className="font-black text-white/20 text-lg mb-2">Sorteando entre</p>
        <p className="font-black text-3xl md:text-4xl" style={{color:'#D4A843',minHeight:'60px',lineHeight:'1.2'}}>
          {nombreRuleta}
        </p>
      </div>
    </main>
  )

  // GANADOR
  if (estado === ESTADOS.GANADOR && ganador) return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="glass p-8 w-full max-w-md">
        <div className="text-center p-6 rounded-2xl mb-4" style={{background:'rgba(212,168,67,0.1)',border:'2px solid #D4A843'}}>
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Ganador</p>
          <p className="font-black text-2xl md:text-3xl" style={{color:'#D4A843'}}>{ganador.nombre} {ganador.apellido}</p>
          <p className="text-white/40 text-sm mt-1">{ganador.mail}</p>
        </div>

        {(ganador.sigue_playablanca || ganador.sigue_magma) ? (
          <div className="p-4 rounded-2xl mb-4" style={{background:'rgba(231,76,60,0.15)',border:'1px solid rgba(231,76,60,0.4)'}}>
            <p className="text-red-300 text-xs font-bold uppercase tracking-widest mb-1">
              {ganador.sigue_playablanca && ganador.sigue_magma ? '🌋🏖️ Triple chance — Verificar' : ganador.sigue_playablanca ? '🏖️ Doble chance — Verificar' : '🌋 Doble chance — Verificar'}
            </p>
            <p className="text-white/80 text-sm">
              Pídele que muestre el teléfono: debe seguir
              {ganador.sigue_playablanca && ' @playablanca_resort'}
              {ganador.sigue_playablanca && ganador.sigue_magma && ' y'}
              {ganador.sigue_magma && ' @magma.lodge'}.
              Si no puede, sortea de nuevo.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl mb-4" style={{background:'rgba(39,174,96,0.15)',border:'1px solid rgba(39,174,96,0.4)'}}>
            <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-1">✅ Sin verificación</p>
            <p className="text-white/80 text-sm">No marcó seguir ninguna cuenta. ¡Es el ganador directo!</p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button className="btn-success mb-3" onClick={confirmarGanador}>
          ✅ Confirmar ganador
        </button>
        <button className="btn-danger" onClick={nuevoSorteo}>
          ❌ No puede demostrar — Nuevo sorteo
        </button>
      </div>
    </main>
  )

  // CONFIRMADO
  if (estado === ESTADOS.CONFIRMADO) return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-white font-black text-2xl mb-2">¡Listo!</h2>
        <p className="text-white/60 text-sm mb-6">
          El sorteo terminó con éxito. Ganador confirmado:
        </p>
        <div className="p-4 rounded-2xl" style={{background:'rgba(212,168,67,0.1)',border:'1px solid rgba(212,168,67,0.3)'}}>
          <p className="text-white/60 text-xs">Ganador confirmado</p>
          <p className="text-white font-bold">{ganador?.nombre} {ganador?.apellido}</p>
          <p className="text-white/40 text-sm">{ganador?.mail}</p>
        </div>
      </div>
    </main>
  )
}
