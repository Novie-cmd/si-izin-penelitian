import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, catatan } = await request.json();

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action tidak valid' },
        { status: 400 }
      );
    }

    const permohonan = await db.permohonan.findUnique({
      where: { id: params.id },
    });

    if (!permohonan) {
      return NextResponse.json(
        { error: 'Permohonan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (permohonan.status !== 'MENUNGGU_VERIFIKASI') {
      return NextResponse.json(
        { error: 'Status permohonan tidak memungkinkan verifikasi' },
        { status: 400 }
      );
    }

    // Update status berdasarkan action
    const updateData: any = {
      catatanAdmin: catatan || null,
    };

    if (action === 'approve') {
      updateData.status = 'MENUNGGU_PERSETUJUAN';
    } else {
      updateData.status = 'DITOLAK';
    }

    const updatedPermohonan = await db.permohonan.update({
      where: { id: params.id },
      data: updateData,
    });

    // Log aktivitas - HAPUS bagian ini sementara
    // await db.logAktivitas.create({
    //   data: {
    //     userId: permohonan.userId,
    //     permohonanId: permohonan.id,
    //     aktivitas: action === 'approve' ? 'VERIFIKASI_APPROVE' : 'VERIFIKASI_REJECT',
    //     detail: `Admin ${action === 'approve' ? 'mengverifikasi dan mengirim ke pimpinan' : 'menolak'} permohonan ${permohonan.nomorRegistrasi}`,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: `Permohonan berhasil ${action === 'approve' ? 'diverifikasi' : 'ditolak'}`,
      permohonan: updatedPermohonan,
    });
  } catch (error) {
    console.error('Verifikasi error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server', details: String(error) },
      { status: 500 }
    );
  }
}
