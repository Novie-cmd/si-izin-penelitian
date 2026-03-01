import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const namaPeneliti = formData.get('namaPeneliti') as string;
    const email = formData.get('email') as string;
    const telepon = formData.get('telepon') as string;
    const institusi = formData.get('institusi') as string;
    const judulPenelitian = formData.get('judulPenelitian') as string;
    const tujuanPenelitian = formData.get('tujuanPenelitian') as string;
    const lokasiPenelitian = formData.get('lokasiPenelitian') as string;
    const tanggalMulai = formData.get('tanggalMulai') as string;
    const tanggalSelesai = formData.get('tanggalSelesai') as string;
    const fileProposal = formData.get('fileProposal') as File;

    if (!namaPeneliti || !email || !telepon || !institusi || !judulPenelitian ||
        !tujuanPenelitian || !lokasiPenelitian || !tanggalMulai || !tanggalSelesai || !fileProposal) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    if (fileProposal.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File proposal harus berupa PDF' },
        { status: 400 }
      );
    }

    if (fileProposal.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 5MB' },
        { status: 400 }
      );
    }

    const nomorRegistrasi = `REG-${Date.now()}`;

    const permohonan = await db.permohonan.create({
      data: {
        nomorRegistrasi,
        namaPeneliti,
        email,
        telepon,
        institusi,
        judulPenelitian,
        tujuanPenelitian,
        lokasiPenelitian,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        status: 'MENUNGGU_VERIFIKASI',
        userId: 'default-user',
      },
    });

    await db.logAktivitas.create({
      data: {
        aksi: 'BUAT_PERMOHONAN',
        detail: `Permohonan baru dengan nomor ${nomorRegistrasi} dari ${namaPeneliti}`,
        userId: 'default-user',
        permohonanId: permohonan.id,
      },
    });

    return NextResponse.json({
      message: 'Permohonan berhasil dibuat',
      permohonan,
    });
  } catch (error) {
    console.error('Create permohonan error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat permohonan' },
      { status: 500 }
    );
  }
}
