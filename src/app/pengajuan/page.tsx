'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Upload, FileText, Calendar, MapPin } from 'lucide-react';

export default function PengajuanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaPeneliti: '',
    email: '',
    telepon: '',
    institusi: '',
    judulPenelitian: '',
    tujuanPenelitian: '',
    lokasiPenelitian: '',
    tanggalMulai: '',
    tanggalSelesai: '',
  });
  const [fileProposal, setFileProposal] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Hanya file PDF yang diperbolehkan');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setFileProposal(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (fileProposal) {
        formDataToSend.append('fileProposal', fileProposal);
      }

      const response = await fetch('/api/permohonan', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Pengajuan gagal');
      }

      toast.success('Permohonan berhasil dikirim!');

      localStorage.setItem('lastSubmission', JSON.stringify({
        nomorRegistrasi: data.permohonan.nomorRegistrasi,
        ...formData
      }));

      router.push(`/tracking?nomor=${data.permohonan.nomorRegistrasi}`);
    } catch (err: any) {
      toast.error(err.message || 'Pengajuan gagal');
    } finally {
      setLoading(false);
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
              Formulir Pengajuan Izin Penelitian
            </h1>
            <p className="text-gray-600">
              Lengkapi formulir di bawah ini untuk mengajukan izin penelitian
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Data Peneliti
              </CardTitle>
              <CardDescription>
                Informasi diri dan kontak peneliti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaPeneliti">Nama Lengkap *</Label>
                    <Input
                      id="namaPeneliti"
                      value={formData.namaPeneliti}
                      onChange={(e) => setFormData({ ...formData, namaPeneliti: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telepon">Nomor Telepon *</Label>
                    <Input
                      id="telepon"
                      type="tel"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institusi">Institusi/Lembaga *</Label>
                    <Input
                      id="institusi"
                      value={formData.institusi}
                      onChange={(e) => setFormData({ ...formData, institusi: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="judulPenelitian">Judul Penelitian *</Label>
                  <Input
                    id="judulPenelitian"
                    value={formData.judulPenelitian}
                    onChange={(e) => setFormData({ ...formData, judulPenelitian: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tujuanPenelitian">Tujuan Penelitian *</Label>
                  <Textarea
                    id="tujuanPenelitian"
                    value={formData.tujuanPenelitian}
                    onChange={(e) => setFormData({ ...formData, tujuanPenelitian: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lokasiPenelitian">Lokasi Penelitian *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lokasiPenelitian"
                      value={formData.lokasiPenelitian}
                      onChange={(e) => setFormData({ ...formData, lokasiPenelitian: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggalMulai">Tanggal Mulai *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="tanggalMulai"
                        type="date"
                        value={formData.tanggalMulai}
                        onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tanggalSelesai">Tanggal Selesai *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="tanggalSelesai"
                        type="date"
                        value={formData.tanggalSelesai}
                        onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileProposal">File Proposal (PDF, maks 5MB) *</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="fileProposal" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Klik untuk upload</span>
                        </p>
                        {fileProposal && (
                          <p className="text-xs text-gray-500 mt-2">
                            {fileProposal.name}
                          </p>
                        )}
                      </div>
                      <Input
                        id="fileProposal"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Mengirim...' : 'Kirim Permohonan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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
