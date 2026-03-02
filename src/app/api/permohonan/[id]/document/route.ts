import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

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

    // Path ke file upload (sesuaikan dengan struktur folder Anda)
    const filePath = path.join(process.cwd(), 'public', 'upload', permohonan.fileProposal)
    
    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath)
      return NextResponse.json(
        { error: 'File tidak ditemukan di server' },
        { status: 404 }
      )
    }

    // Baca file
    const fileBuffer = fs.readFileSync(filePath)
    
    // Ambil ekstensi file
    const ext = path.extname(permohonan.fileProposal).toLowerCase()
    const contentType = ext === '.pdf' ? 'application/pdf' : 'application/octet-stream'

    // Kembalikan file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${permohonan.fileProposal}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil dokumen', details: String(error) },
      { status: 500 }
    )
  }
}
