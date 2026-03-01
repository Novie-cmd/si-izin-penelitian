import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { catatan, status } = await request.json();

    if (!status || (status !== 'MENUNGGU_PERSETUJUAN' && status !== 'DITOLAK')) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }

    const permohonan = await db.permohonan.findUnique({
      where: { id },
    });

    if (!permohonan) {
      return NextResponse.json(
        { error: 'Permohonan tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedPermohonan = await db.permohonan.update({
      where: { id },
      data: {
        status,
        catatanVerifikasi: catatan || null,
      },
    });

    await db.logAktivitas.create({
      data: {
        aksi: status === 'MENUNGGU_PERSETUJUAN' ? 'VERIFIKASI_BERHASIL' : 'VERIFIKASI_DITOLAK',
        detail: `Permohonan ${permohonan.nomorRegistrasi} ${status === 'MENUNGGU_PERSETUJUAN' ? 'diverifikasi dan diteruskan ke pimpinan' : 'ditolak oleh admin'}. Catatan: ${catatan || 'Tidak ada'}`,
        userId: 'admin',
        permohonanId: permohonan.id,
      },
    });

    return NextResponse.json({
      message: 'Permohonan berhasil diperbarui',
      permohonan: updatedPermohonan,
    });
  } catch (error) {
    console.error('Verifikasi permohonan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memverifikasi permohonan' },
      { status: 500 }
    );
  }
}
