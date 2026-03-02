import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const permohonan = await db.permohonan.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    const stats = {
      total: permohonan.length,
      disetujui: permohonan.filter(p => p.status === 'DISETUJUI').length,
      ditolak: permohonan.filter(p => p.status === 'DITOLAK').length,
      menunggu: permohonan.filter(p => p.status === 'MENUNGGU_VERIFIKASI').length,
      menungguPersetujuan: permohonan.filter(p => p.status === 'MENUNGGU_PERSETUJUAN').length,
    }

    return NextResponse.json({
      permohonan,
      stats,
    })
  } catch (error) {
    console.error('Get admin permohonan error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data', details: String(error) },
      { status: 500 }
    )
  }
}
