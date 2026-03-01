'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Search, FileText, CheckCircle, XCircle, Clock, LogOut } from 'lucide-react';

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
  createdAt: string;
}

export default function PimpinanDashboard() {
  const router = useRouter();
  const [permohonan, setPermohonan] = useState<Permohonan[]>([]);
  const [filteredPermohonan, setFilteredPermohonan] = useState<Permohonan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
  const [persetujuanDialogOpen, setPersetujuanDialogOpen] = useState(false);
  const [persetujuanData, setPersetujuanData] = useState({
    catatan: '',
    action: 'approve' as 'approve' | 'reject'
  });

  useEffect(() => {
    checkAuth();
    fetchPermohonan();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = permohonan.filter(p =>
        p.nomorRegistrasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.namaPeneliti.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.institusi.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPermohonan(filtered);
    } else {
      setFilteredPermohonan(permohonan);
    }
  }, [searchTerm, permohonan]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'PIMPINAN') {
      router.push('/login');
    }
  };

  const fetchPermohonan = async () => {
    try {
      const response = await fetch('/api/pimpinan/permohonan');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data');
      }

      setPermohonan(data.permohonan || []);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

 const handlePersetujuan = async (action: 'approve' | 'reject') => {
  if (!selectedPermohonan) return

  setApproveLoading(true)
  try {
    const response = await fetch(`/api/pimpinan/permohonan/${selectedPermohonan.id}/persetujuan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        catatan: catatan,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Gagal memproses persetujuan')
    }

    const data = await response.json()

    setDialogOpen(false)
    setCatatan('')
    setSelectedPermohonan(null)
    fetchData()

    // Show success message
    alert(data.message || 'Persetujuan berhasil')
  } catch (error: any) {
    console.error('Error:', error)
    alert(`Terjadi kesalahan: ${error.message}`)
  } finally {
    setApproveLoading(false)
  }
}
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    router.push('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DISETUJUI':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'DITOLAK':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'MENUNGGU_VERIFIKASI':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'MENUNGGU_PERSETUJUAN':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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

  const stats = {
    total: permohonan.length,
    menungguPersetujuan: permohonan.filter(p => p.status === 'MENUNGGU_PERSETUJUAN').length,
    disetujui: permohonan.filter(p => p.status === 'DISETUJUI').length,
    ditolak: permohonan.filter(p => p.status === 'DITOLAK').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Beranda
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Pimpinan</h1>
                <p className="text-sm text-gray-600">BAKESBANGPOLDAGRI NTB</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats.total}</CardTitle>
                <CardDescription>Total</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-blue-600">{stats.menungguPersetujuan}</CardTitle>
                <CardDescription>Menunggu Persetujuan</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-green-600">{stats.disetujui}</CardTitle>
                <CardDescription>Disetujui</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-red-600">{stats.ditolak}</CardTitle>
                <CardDescription>Ditolak</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Daftar Permohonan
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
              ) : filteredPermohonan.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Tidak ada data</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">No. Registrasi</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nama</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Institusi</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Judul</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Lokasi</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tanggal</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPermohonan.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{p.nomorRegistrasi}</td>
                          <td className="py-3 px-4 text-sm">{p.namaPeneliti}</td>
                          <td className="py-3 px-4 text-sm">{p.institusi}</td>
                          <td className="py-3 px-4 text-sm max-w-xs truncate">{p.judulPenelitian}</td>
                          <td className="py-3 px-4 text-sm max-w-xs truncate">{p.lokasiPenelitian}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(p.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(p.status)}
                                <span className="text-xs">{p.status.replace(/_/g, ' ')}</span>
                              </div>
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{new Date(p.createdAt).toLocaleDateString('id-ID')}</td>
                          <td className="py-3 px-4">
                            {p.status === 'MENUNGGU_PERSETUJUAN' && (
                              <Dialog open={persetujuanDialogOpen} onOpenChange={setPersetujuanDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPermohonan(p);
                                      setPersetujuanData({ catatan: '', action: 'approve' });
                                    }}
                                  >
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Review Permohonan</DialogTitle>
                                    <DialogDescription>
                                      No. Registrasi: {selectedPermohonan?.nomorRegistrasi}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    {selectedPermohonan && (
                                      <>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                          <p className="text-sm"><strong>Nama:</strong> {selectedPermohonan.namaPeneliti}</p>
                                          <p className="text-sm"><strong>Institusi:</strong> {selectedPermohonan.institusi}</p>
                                          <p className="text-sm"><strong>Judul:</strong> {selectedPermohonan.judulPenelitian}</p>
                                          <p className="text-sm"><strong>Lokasi:</strong> {selectedPermohonan.lokasiPenelitian}</p>
                                          <p className="text-sm"><strong>Periode:</strong> {new Date(selectedPermohonan.tanggalMulai).toLocaleDateString('id-ID')} - {new Date(selectedPermohonan.tanggalSelesai).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        {selectedPermohonan.catatanVerifikasi && (
                                          <div className="bg-yellow-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-yellow-800">Catatan Admin:</p>
                                            <p className="text-sm text-yellow-700">{selectedPermohonan.catatanVerifikasi}</p>
                                          </div>
                                        )}
                                        <div>
                                          <Label>Pilih Aksi</Label>
                                          <div className="flex gap-2 mt-2">
                                            <Button
                                              type="button"
                                              variant={persetujuanData.action === 'approve' ? 'default' : 'outline'}
                                              onClick={() => setPersetujuanData({ ...persetujuanData, action: 'approve' })}
                                            >
                                              <CheckCircle className="mr-2 h-4 w-4" />
                                              Setujui
                                            </Button>
                                            <Button
                                              type="button"
                                              variant={persetujuanData.action === 'reject' ? 'destructive' : 'outline'}
                                              onClick={() => setPersetujuanData({ ...persetujuanData, action: 'reject' })}
                                            >
                                              <XCircle className="mr-2 h-4 w-4" />
                                              Tolak
                                            </Button>
                                          </div>
                                        </div>
                                        <div>
                                          <Label htmlFor="catatan">Catatan (Opsional)</Label>
                                          <Textarea
                                            id="catatan"
                                            value={persetujuanData.catatan}
                                            onChange={(e) => setPersetujuanData({ ...persetujuanData, catatan: e.target.value })}
                                            rows={3}
                                            placeholder="Tambahkan catatan jika diperlukan..."
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setPersetujuanDialogOpen(false)}>
                                      Batal
                                    </Button>
                                    <Button onClick={handlePersetujuan}>
                                      {persetujuanData.action === 'approve' ? 'Setujui' : 'Tolak'}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
