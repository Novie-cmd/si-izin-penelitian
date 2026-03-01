import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { nomorRegistrasi: string } }
) {
  try {
    const { nomorRegistrasi } = params;

    const permohonan = await db.permohonan.findUnique({
      where: { nomorRegistrasi },
    });

    if (!permohonan) {
      return NextResponse.json(
        { error: 'Permohonan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      permohonan,
    });
  } catch (error) {
    console.error('Get permohonan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data permohonan' },
      { status: 500 }
    );
  }
}
