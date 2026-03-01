import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const permohonan = await db.permohonan.findUnique({
      where: { id },
    });

    if (!permohonan) {
      return NextResponse.json(
        { error: 'Permohonan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (!permohonan.fileProposal) {
      return NextResponse.json(
        { error: 'Dokumen tidak tersedia' },
        { status: 404 }
      );
    }

    const fileName = permohonan.fileProposal;
    const filePath = `/upload/${fileName}`;

    try {
      const fs = require('fs');
      const path = require('path');

      const fullPath = path.join(process.cwd(), 'public', 'upload', fileName);

      if (!fs.existsSync(fullPath)) {
        return NextResponse.json(
          { error: 'File tidak ditemukan di server' },
          { status: 404 }
        );
      }

      const fileBuffer = fs.readFileSync(fullPath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="Proposal_${permohonan.nomorRegistrasi}.pdf"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json(
        { error: 'Gagal membaca file dokumen' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil dokumen' },
      { status: 500 }
    );
  }
}
