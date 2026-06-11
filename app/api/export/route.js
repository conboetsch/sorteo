import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { password } = await req.json()
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('participantes')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    // Construir CSV con BOM para que Excel lo abra bien con tildes
    const BOM = '\uFEFF'
    const headers = ['N°','Nombre','Apellido','Correo','Teléfono','Hijos','Sigue @playablancaresort','Sigue @magmalodge','Tickets','Ganador','Fecha inscripción']
    
    const rows = data.map((p, i) => [
      i + 1,
      p.nombre,
      p.apellido,
      p.mail,
      p.telefono,
      p.hijos || '',
      p.sigue_playablanca ? 'Sí' : 'No',
      p.sigue_magma ? 'Sí' : 'No',
      p.tickets,
      p.ganador ? 'GANADOR 🏆' : '',
      new Date(p.created_at).toLocaleString('es-CL', {timeZone:'America/Santiago'})
    ])

    const csv = BOM + [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
      .join('\r\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="participantes_sorteo_${new Date().toISOString().slice(0,10)}.csv"`
      }
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 })
  }
}
