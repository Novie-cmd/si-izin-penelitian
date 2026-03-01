import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { catatan, status } = await request.json();

    if (!status || (status !== 'DISETUJUI' && status !== 'DITOLAK')) {
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

    const updateData: any = {
      status,
      catatanPimpinan: catatan || null,
    };

    if (status === 'DISETUJUI') {
      const tahun = new Date().getFullYear();
      const nomorUrut = Math.floor(Math.random() * 900) + 100;
      updateData.nomorSuratIzin = `005/${tahun}/BAKESBANG`;
      updateData.tanggalPersetujuan = new Date();
    }

    const updatedPermohonan = await db.permohonan.update({
      where: { id },
      data: updateData,
    });

    await db.logAktivitas.create({
      data: {
        aksi: status === 'DISETUJUI' ? 'PERSETUJUAN_BERHASIL' : 'PERSETUJUAN_DITOLAK',
        detail: `Permohonan ${permohonan.nomorRegistrasi} ${status === 'DISETUJUI' ? 'disetujui oleh pimpinan' : 'ditolak oleh pimpinan'}. Catatan: ${catatan || 'Tidak ada'}`,
        userId: 'pimpinan',
        permohonanId: permohonan.id,
      },
    });

    return NextResponse.json({
      message: 'Permohonan berhasil diperbarui',
      permohonan: updatedPermohonan,
    });
  } catch (error) {
    console.error('Persetujuan permohonan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses persetujuan' },
      { status: 500 }
    );
  }
}
