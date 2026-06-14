'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', mail: '', telefono: '',
    hijos: '', sigue_playablanca: '', sigue_magma: '', consentimiento: false
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
    const soloNumeros = form.telefono.replace(/\D/g, '')
    if (soloNumeros.length < 9) {
      setError('El teléfono debe tener al menos 9 dígitos.')
      return
    }
    if (!form.consentimiento) {
      setError('Debes aceptar la Política de Privacidad para participar.')
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
      setEstado('idle')
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
        <p className="text-white/50 text-sm mt-2 font-light">🏖️ La aventura de estar juntos · 🌋 Vuelve a lo esencial</p>
      </div>

      {/* PREMIO */}
      <div className="glass p-5 w-full max-w-md mb-6 text-center">
        <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2">El Premio</p>
        <p className="text-white font-bold text-lg">2 noches / 3 días · hasta 6 personas</p>
        <p className="text-white/50 text-xs mt-1">🏖️ Playa Blanca Resort, Tongoy — "La aventura de estar juntos"</p>
        <p className="text-white/50 text-xs mt-0.5">🌋 Magma Lodge, Pucón — "Entre lago y bosque, vuelve a lo esencial"</p>
      </div>

      {/* FORMULARIO */}
      <div className="glass p-6 w-full max-w-md">
        <p className="text-white/60 text-xs mb-5 leading-relaxed">
          Inscríbete para participar. <strong className="text-white/80">El correo es necesario para enviarte el certificado si ganas</strong> — asegúrate de ingresar uno válido 😉
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

        {/* BLOQUE TICKETS */}
        <div className="mb-5 p-4 rounded-2xl" style={{background:'rgba(212,168,67,0.08)',border:'1px solid rgba(212,168,67,0.25)'}}>
          <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">🏆 Más oportunidades de ganar</p>
          <div className="flex flex-col gap-1">
            <p className="text-white/60 text-xs">• Inscripción = <strong className="text-white/90">1 ticket</strong></p>
            <p className="text-white/60 text-xs">• Sigues @playablanca_resort = <strong className="text-white/90">+1 ticket</strong></p>
            <p className="text-white/60 text-xs">• Sigues @magma.lodge = <strong className="text-white/90">+1 ticket</strong></p>
          </div>
          <p className="text-white/40 text-xs mt-2">Máximo: 3 tickets por participante.</p>
        </div>

                <div className="mb-4">
          <label>¿Sigues a @playablanca_resort en Instagram? *</label>
          <a href="https://www.instagram.com/playablanca_resort/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs mt-1 mb-2 px-3 py-1.5 rounded-full font-semibold"
            style={{background:'transparent',color:'rgba(212,168,67,0.55)',border:'none'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> Ver perfil @playablanca_resort
          </a>
          <select value={form.sigue_playablanca} onChange={e => setForm({...form, sigue_playablanca: e.target.value})}>
            <option value="">— Selecciona —</option>
            <option value="si">✅ Sí, sigo la cuenta (+1 ticket)</option>
            <option value="no">❌ No sigo la cuenta (+0 tickets)</option>
          </select>
        </div>

        <div className="mb-6">
          <label>¿Sigues a @magma.lodge en Instagram? *</label>
          <a href="https://www.instagram.com/magma.lodge/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs mt-1 mb-2 px-3 py-1.5 rounded-full font-semibold"
            style={{background:'transparent',color:'rgba(212,168,67,0.55)',border:'none'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> Ver perfil @magma.lodge
          </a>
          <select value={form.sigue_magma} onChange={e => setForm({...form, sigue_magma: e.target.value})}>
            <option value="">— Selecciona —</option>
            <option value="si">✅ Sí, sigo la cuenta (+1 ticket)</option>
            <option value="no">❌ No sigo la cuenta (+0 tickets)</option>
          </select>
        </div>


        {/* CHECKBOX CONSENTIMIENTO */}
        <div className="flex items-start gap-3 mt-4 mb-4">
          <input
            type="checkbox"
            id="consentimiento"
            checked={form.consentimiento}
            onChange={e => setForm({...form, consentimiento: e.target.checked})}
            className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0"
            style={{accentColor:'#D4A843'}}
          />
          <label htmlFor="consentimiento" className="text-xs leading-relaxed" style={{color:'rgba(255,255,255,0.45)'}}>
            Acepto que mis datos personales (nombre, correo y teléfono) sean almacenados por Playa Blanca Resort y Magma Lodge para la realización de este sorteo y para el envío de comunicaciones y promociones de ambas propiedades, conforme a la{" "}
            <a href="#politica-privacidad" style={{color:'rgba(212,168,67,0.7)'}} className="underline">
              Ley 19.628
            </a>
            {" "}sobre Protección de la Vida Privada.
          </label>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'rgba(231,76,60,0.15)', border:'1px solid rgba(231,76,60,0.4)', color:'#FCA5A5'}}>
            ⚠️ {error}
          </div>
        )}

        <button className="btn-gold" onClick={handleSubmit} disabled={estado === 'loading'}>
          {estado === 'loading' ? '⏳ Inscribiendo...' : '🎯 ¡Inscribirme al Sorteo!'}
        </button>

        <p className="text-white/30 text-xs text-center mt-4">
          Solo participan personas presentes en el evento · Solo una inscripción por persona
        </p>
      </div>

      {/* POLÍTICA DE PRIVACIDAD */}
      <section id="politica-privacidad" className="mt-10 text-xs max-w-xl mx-auto px-4 pb-10 leading-relaxed" style={{color:'rgba(255,255,255,0.45)'}}>
        <h3 className="font-semibold mb-2 text-sm" style={{color:'rgba(255,255,255,0.65)'}}>Política de Privacidad · Sorteo Gran Final Monte Tabor 2026</h3>
        <p><strong>Responsable:</strong> Playa Blanca Resort (en conjunto con Magma Lodge · Pucón).</p>
        <p className="mt-2"><strong>Datos recopilados:</strong> nombre, apellido, correo electrónico y teléfono WhatsApp.</p>
        <p className="mt-2"><strong>Finalidad:</strong> gestionar la participación en el sorteo, verificar los requisitos de participación y contactar al ganador o ganadora para la entrega del premio.</p>
        <p className="mt-2"><strong>Tus derechos:</strong> puedes solicitar el acceso, rectificación o eliminación de tus datos escribiendo a{" "}
          <a href="mailto:contacto@playablancaresort.cl" className="underline" style={{color:'rgba(255,255,255,0.55)'}}>contacto@playablancaresort.cl</a>.
        </p>
        <p className="mt-2">El tratamiento de datos se realiza conforme a la <strong>Ley 19.628</strong> sobre Protección de la Vida Privada (Chile).</p>
      </section>
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
          <p className="text-white/80 text-sm font-semibold">🏆 Premio: 2 noches / 3 días · hasta 6 personas</p>
          <p className="text-white/50 text-xs mt-1">🏖️ Playa Blanca Resort, Tongoy o 🌋 Magma Lodge, Pucón</p>
          <p className="text-white/40 text-xs mt-1">Válido hasta junio 2027</p>
        </div>
        <p className="text-white/40 text-xs">Si ganas, recibirás el certificado en tu correo 📧</p>
      </div>
    </main>
  )
}
