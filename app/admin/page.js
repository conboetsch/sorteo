'use client'
import { useState } from 'react'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState('idle')
  const [error, setError] = useState('')

  const exportar = async () => {
    if (!password) { setError('Ingresa la clave'); return }
    setEstado('loading')
    setError('')
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Error al exportar')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `participantes_sorteo_${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setEstado('ok')
    } catch (e) {
      setError(e.message)
      setEstado('idle')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="text-white font-black text-xl mb-2">Exportar Participantes</h2>
        <p className="text-white/40 text-sm mb-6">Sorteo Monte Tabor 2026</p>
        <div className="mb-4">
          <label>Clave de acceso</label>
          <input type="password" placeholder="••••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && exportar()} />
        </div>
        {error && <p className="text-red-400 text-sm mb-4">⚠️ {error}</p>}
        {estado === 'ok' && <p className="text-green-400 text-sm mb-4">✅ ¡Archivo descargado!</p>}
        <button className="btn-gold" onClick={exportar} disabled={estado === 'loading'}>
          {estado === 'loading' ? '⏳ Exportando...' : '📥 Descargar CSV'}
        </button>
        <p className="text-white/20 text-xs mt-4">Solo para uso interno · Hoteles Tasco</p>
      </div>
    </main>
  )
}
