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

    if (permohonan.status !== 'MENUNGGU_PERSETUJUAN') {
      return NextResponse.json(
        { error: 'Status permohonan tidak memungkinkan persetujuan' },
        { status: 400 }
      )
    }

    const updateData: any = {
      catatanPimpinan: catatan || null,
    }

    if (action === 'approve') {
      const date = new Date()
      const year = date.getFullYear()
      const nomorSurat = `050/${Math.floor(Math.random() * 900) + 100}/BAKESBANG/${year}`
      
      updateData.status = 'DISETUJUI'
      updateData.nomorSurat = nomorSurat
      updateData.tanggalApprove = date
    } else {
      updateData.status = 'DITOLAK'
    }

    const updatedPermohonan = await db.permohonan.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: `Permohonan berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
      permohonan: updatedPermohonan,
    })
  } catch (error) {
    console.error('Persetujuan error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server', details: String(error) },
      { status: 500 }
    )
  }
}
