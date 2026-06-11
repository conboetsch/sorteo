'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', mail: '', telefono: '',
    hijos: '', sigue_playablanca: '', sigue_magma: ''
  })
  const [estado, setEstado] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido || !form.mail || !form.telefono || !form.sigue_playablanca || !form.sigue_magma) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.mail)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    setError('')
    setEstado('loading')
    try {
      const res = await fetch('/api/inscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al inscribirse')
      setEstado('success')
    } catch (e) {
      setError(e.message)
      setEstado('error')
    }
  }

  if (estado === 'success') return <Exito nombre={form.nombre} />

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-xs font-bold tracking-widest px-3 py-1 rounded-full border" style={{color:'#7DD3FC', borderColor:'#7DD3FC44', background:'#7DD3FC11'}}>🏖️ Playa Blanca Resort</span>
          <span className="text-xs font-bold tracking-widest px-3 py-1 rounded-full border" style={{color:'#FCA5A5', borderColor:'#FCA5A544', background:'#FCA5A511'}}>🌋 Magma Lodge · Pucón</span>
        </div>
        <h1 className="text-white font-black text-2xl md:text-3xl leading-tight">
          Sorteo · Gran Final<br/>Monte Tabor 2026
        </h1>
        <p className="text-white/50 text-sm mt-2 font-light">La aventura de estar juntos</p>
      </div>

      {/* PREMIO */}
      <div className="glass p-5 w-full max-w-md mb-6 text-center">
        <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2">El Premio</p>
        <p className="text-white font-bold text-lg">2 noches / 3 días · hasta 6 personas</p>
        <p className="text-white/50 text-xs mt-1">🏖️ Playa Blanca Resort, Tongoy — "La aventura de estar juntos" · 🌋 Magma Lodge, Pucón — "Entre lago y bosque"</p>
      </div>

      {/* FORMULARIO */}
      <div className="glass p-6 w-full max-w-md">
        <p className="text-white/60 text-xs mb-5 leading-relaxed">
          Inscríbete para participar. <strong className="text-white/80">El certificado del premio se enviará al correo que registres</strong> — asegúrate de ingresar uno válido 😉
        </p>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label>Nombre *</label>
            <input placeholder="Juan" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div className="flex-1">
            <label>Apellido *</label>
            <input placeholder="Pérez" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} />
          </div>
        </div>

        <div className="mb-4">
          <label>Correo electrónico *</label>
          <input type="email" placeholder="juan@gmail.com" value={form.mail} onChange={e => setForm({...form, mail: e.target.value})} />
        </div>

        <div className="mb-4">
          <label>Teléfono WhatsApp *</label>
          <input placeholder="+56 9 1234 5678" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
        </div>

        <div className="mb-4">
          <label>¿Cuántos hijos tienes? (opcional)</label>
          <input placeholder="Ej: 2" value={form.hijos} onChange={e => setForm({...form, hijos: e.target.value})} />
        </div>

        <div className="mb-4">
          <label>¿Sigues a @playablancaresort en Instagram? *</label>
          <select value={form.sigue_playablanca} onChange={e => setForm({...form, sigue_playablanca: e.target.value})}>
            <option value="">Selecciona una opción</option>
            <option value="si">✅ Sí, ¡quiero doble chance! 🏖️</option>
            <option value="no">Todavía no</option>
          </select>
        </div>

        <div className="mb-6">
          <label>¿También sigues a @magmalodge? *</label>
          <select value={form.sigue_magma} onChange={e => setForm({...form, sigue_magma: e.target.value})}>
            <option value="">Selecciona una opción</option>
            <option value="si">✅ Sí, ¡quiero triple chance! 🌋</option>
            <option value="no">Todavía no</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'rgba(231,76,60,0.15)', border:'1px solid rgba(231,76,60,0.4)', color:'#FCA5A5'}}>
            {error}
          </div>
        )}

        <button className="btn-gold" onClick={handleSubmit} disabled={estado === 'loading'}>
          {estado === 'loading' ? '⏳ Inscribiendo...' : '🎯 ¡Inscribirme al Sorteo!'}
        </button>

        <p className="text-white/30 text-xs text-center mt-4">
          Solo participan personas presentes en el evento · Mayores de 18 años
        </p>
      </div>
    </main>
  )
}

function Exito({ nombre }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="glass p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-white font-black text-2xl mb-2">¡Estás inscrito, {nombre}!</h2>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          Te anotamos en el sorteo. Recuerda estar presente durante el entretiempo — ¡ese es el momento del sorteo!
        </p>
        <div className="rounded-xl p-4 mb-4" style={{background:'rgba(212,168,67,0.1)', border:'1px solid rgba(212,168,67,0.3)'}}>
          <p className="text-white/80 text-sm font-semibold">🏖️ Premio: 2 noches / 3 días · hasta 6 personas</p>
          <p className="text-white/50 text-xs mt-1">Playa Blanca Resort o Magma Lodge · Válido hasta junio 2027</p>
        </div>
        <p className="text-white/40 text-xs">Si ganas, recibirás el certificado en tu correo 📧</p>
      </div>
    </main>
  )
}
