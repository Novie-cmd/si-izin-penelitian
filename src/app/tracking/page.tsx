'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Search, FileText, Download, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface Permohonan {
  id: string;
  nomorRegistrasi: string;
  namaPeneliti: string;
  institusi: string;
  judulPenelitian: string;
  lokasiPenelitian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  catatanVerifikasi: string | null;
  catatanPimpinan: string | null;
  nomorSuratIzin: string | null;
  tanggalPersetujuan: string | null;
  createdAt: string;
}

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const [nomorRegistrasi, setNomorRegistrasi] = useState(searchParams.get('nomor') || '');
  const [permohonan, setPermohonan] = useState<Permohonan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('nomor')) {
      handleSearch();
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!nomorRegistrasi.trim()) {
      toast.error('Masukkan nomor registrasi');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/permohonan/${nomorRegistrasi}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Permohonan tidak ditemukan');
      }

      setPermohonan(data.permohonan);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mencari permohonan');
      setPermohonan(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DISETUJUI':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'DITOLAK':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'MENUNGGU_VERIFIKASI':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'MENUNGGU_PERSETUJUAN':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISETUJUI':
        return 'bg-green-100 text-green-800';
      case 'DITOLAK':
        return 'bg-red-100 text-red-800';
      case 'MENUNGGU_VERIFIKASI':
        return 'bg-yellow-100 text-yellow-800';
      case 'MENUNGGU_PERSETUJUAN':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'MENUNGGU_VERIFIKASI':
        return 'Menunggu Verifikasi Admin';
      case 'MENUNGGU_PERSETUJUAN':
        return 'Menunggu Persetujuan Pimpinan';
      case 'DISETUJUI':
        return 'Disetujui';
      case 'DITOLAK':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const handleDownload = async () => {
    if (!permohonan) return;

    try {
      const response = await fetch(`/api/permohonan/${permohonan.nomorRegistrasi}/download`);
      
      if (!response.ok) {
        throw new Error('Gagal mengunduh surat izin');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Surat_Izin_${permohonan.nomorRegistrasi}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Surat izin berhasil diunduh');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunduh surat izin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tracking Status Permohonan
            </h1>
            <p className="text-gray-600">
              Masukkan nomor registrasi untuk melihat status permohonan Anda
            </p>
          </div>

          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Cari Permohonan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="nomorRegistrasi" className="sr-only">
                    Nomor Registrasi
                  </Label>
                  <Input
                    id="nomorRegistrasi"
                    placeholder="Masukkan nomor registrasi"
                    value={nomorRegistrasi}
                    onChange={(e) => setNomorRegistrasi(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Mencari...' : 'Cari'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {permohonan && (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Detail Permohonan</CardTitle>
                    <CardDescription>
                      Nomor Registrasi: {permohonan.nomorRegistrasi}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(permohonan.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(permohonan.status)}
                      <span>{getStatusText(permohonan.status)}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nama Peneliti</p>
                    <p className="text-gray-900">{permohonan.namaPeneliti}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Institusi</p>
                    <p className="text-gray-900">{permohonan.institusi}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Judul Penelitian</p>
                    <p className="text-gray-900">{permohonan.judulPenelitian}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lokasi Penelitian</p>
                    <p className="text-gray-900">{permohonan.lokasiPenelitian}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tanggal Kegiatan</p>
                    <p className="text-gray-900">
                      {new Date(permohonan.tanggalMulai).toLocaleDateString('id-ID')} - {new Date(permohonan.tanggalSelesai).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {(permohonan.catatanVerifikasi || permohonan.status === 'DITOLAK') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-yellow-800 mb-1">
                      Catatan Verifikasi
                    </p>
                    <p className="text-sm text-yellow-700">
                      {permohonan.catatanVerifikasi || '-'}
                    </p>
                  </div>
                )}

                {permohonan.catatanPimpinan && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Catatan Pimpinan
                    </p>
                    <p className="text-sm text-blue-700">
                      {permohonan.catatanPimpinan}
                    </p>
                  </div>
                )}

                {permohonan.status === 'DISETUJUI' && permohonan.nomorSuratIzin && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800 mb-2">
                      Surat Izin Telah Terbit
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700">
                          Nomor: {permohonan.nomorSuratIzin}
                        </p>
                        <p className="text-xs text-green-600">
                          Tanggal: {new Date(permohonan.tanggalPersetujuan || '').toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <Button onClick={handleDownload} size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh Surat
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-4 border-t">
                  <p>Tanggal Pengajuan: {new Date(permohonan.createdAt).toLocaleString('id-ID')}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BAKESBANGPOLDAGRI NTB
        </div>
      </footer>
    </div>
  );
}
