import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const permohonan = await db.permohonan.findMany({
      where: {
        OR: [
          { status: 'MENUNGGU_PERSETUJUAN' },
          { status: 'DISETUJUI' },
          { status: 'DITOLAK' },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      permohonan,
    });
  } catch (error) {
    console.error('Get pimpinan permohonan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data permohonan' },
      { status: 500 }
    );
  }
}
