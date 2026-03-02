import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { action, catatan } = await request.json()

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action tidak valid' },
        { status: 400 }
      )
    }

    const permohonan = await db.permohonan.findUnique({
      where: { id },
    })

    if (!permohonan) {
      return NextResponse.json(
        { error: 'Permohonan tidak ditemukan' },
        { status: 404 }
      )
    }

    if (permohonan.status !== 'MENUNGGU_VERIFIKASI') {
      return NextResponse.json(
        { error: 'Status permohonan tidak memungkinkan verifikasi' },
        { status: 400 }
      )
    }

    const updateData: any = {
      catatanAdmin: catatan || null,
      status: action === 'approve' ? 'MENUNGGU_PERSETUJUAN' : 'DITOLAK'
    }

    const updatedPermohonan = await db.permohonan.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: `Permohonan berhasil ${action === 'approve' ? 'diverifikasi' : 'ditolak'}`,
      permohonan: updatedPermohonan,
    })
  } catch (error) {
    console.error('Verifikasi error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server', details: String(error) },
      { status: 500 }
    )
  }
}
