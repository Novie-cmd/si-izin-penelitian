import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const permohonan = await db.permohonan.findUnique({
      where: { id },
    })

    if (!permohonan) {
      return NextResponse.json(
        { error: 'Permohonan tidak ditemukan' },
        { status: 404 }
      )
    }

    if (!permohonan.fileProposal) {
      return NextResponse.json(
        { error: 'Dokumen tidak tersedia' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      fileName: permohonan.fileProposal,
      message: 'File tersedia di server lokal'
    })
  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan', details: String(error) },
      { status: 500 }
    )
  }
}
