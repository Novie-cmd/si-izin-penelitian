import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: { nomorRegistrasi: string } }
) {
  try {
    const { nomorRegistrasi } = params;

    const permohonan = await db.permohonan.findUnique({
      where: { nomorRegistrasi },
    });

    if (!permohonan || permohonan.status !== 'DISETUJUI') {
      return NextResponse.json(
        { error: 'Permohonan tidak ditemukan atau belum disetujui' },
        { status: 404 }
      );
    }

    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PEMERINTAH PROVINSI NUSA TENGGARA BARAT', 105, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('BADAN KESATUAN BANGSA DAN POLITIK', 105, 28, { align: 'center' });
    pdf.text('PERLINDUNGAN MASYARAKAT', 105, 34, { align: 'center' });

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(20, 40, 190, 40);

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SURAT IZIN PENELITIAN', 105, 55, { align: 'center' });
    pdf.text(`Nomor: ${permohonan.nomorSuratIzin || 'N/A'}`, 105, 63, { align: 'center' });

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Yang bertanda tangan di bawah ini Kepala Badan Kesatuan Bangsa dan Politik', 20, 75);
    pdf.text('Provinsi Nusa Tenggara Barat, menerangkan bahwa:', 20, 82);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Nama Peneliti:', 20, 95);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`: ${permohonan.namaPeneliti}`, 60, 95);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Institusi:', 20, 103);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`: ${permohonan.institusi}`, 60, 103);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Judul Penelitian:', 20, 111);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`: ${permohonan.judulPenelitian}`, 60, 111);

    pdf.text('telah diberikan izin untuk melakukan penelitian dengan ketentuan:', 20, 123);

    pdf.setFont('helvetica', 'normal');
    const ketentuan = [
      '1. Melaksanakan penelitian sesuai dengan proposal yang telah disetujui',
      '2. Mematuhi peraturan dan perundang-undangan yang berlaku',
      '3. Melaporkan hasil penelitian kepada instansi terkait',
      '4. Menghormati norma, adat istiadat, dan nilai-nilai lokal',
    ];

    let yPos = 131;
    ketentuan.forEach((ket) => {
      pdf.text(ket, 25, yPos);
      yPos += 8;
    });

    pdf.setFont('helvetica', 'bold');
    pdf.text('Lokasi Penelitian:', 20, yPos + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`: ${permohonan.lokasiPenelitian}`, 60, yPos + 5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Waktu Pelaksanaan:', 20, yPos + 13);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`: ${new Date(permohonan.tanggalMulai).toLocaleDateString('id-ID')} s.d. ${new Date(permohonan.tanggalSelesai).toLocaleDateString('id-ID')}`, 60, yPos + 13);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Nomor Registrasi:', 20, yPos + 21);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`: ${permohonan.nomorRegistrasi}`, 60, yPos + 21);

    try {
      const qrCodeData = JSON.stringify({
        nomorRegistrasi: permohonan.nomorRegistrasi,
        nomorSurat: permohonan.nomorSuratIzin,
        nama: permohonan.namaPeneliti,
        judul: permohonan.judulPenelitian,
        status: permohonan.status,
      });

      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, {
        width: 100,
        margin: 1,
      });

      pdf.addImage(qrCodeDataUrl, 'PNG', 150, yPos + 25, 40, 40);
      pdf.setFontSize(8);
      pdf.text('Scan QR Code untuk validasi', 170, yPos + 68, { align: 'center' });
    } catch (qrError) {
      console.error('QR Code generation error:', qrError);
    }

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Demikian surat izin ini dibuat untuk dipergunakan sebagaimana mestinya.', 20, 250);
    pdf.text(`Mataram, ${new Date(permohonan.tanggalPersetujuan || Date()).toLocaleDateString('id-ID')}`, 150, 250);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Kepala BAKESBANGPOLDAGRI', 150, 260);
    pdf.text('Provinsi NTB', 150, 266);

    pdf.setFontSize(9);
    pdf.text('( ................................. )', 150, 280);

    const pdfBytes = Buffer.from(pdf.output('arraybuffer'));

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Surat_Izin_${nomorRegistrasi}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download PDF error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat PDF' },
      { status: 500 }
    );
  }
}
