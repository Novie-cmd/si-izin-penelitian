'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', data.user.role);

      toast.success('Login berhasil!');

      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'PIMPINAN') {
        router.push('/pimpinan/dashboard');
      } else {
        router.push('/tracking');
      }
    } catch (err: any) {
      setError(err.message || 'Username/password salah');
      toast.error(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setFormData({
      email: 'admin@bakesbang.ntbprov.go.id',
      password: 'admin123',
    });
    setError('');
  };

  const fillPimpinan = () => {
    setFormData({
      email: 'pimpinan@bakesbang.ntbprov.go.id',
      password: 'pimpinan123',
    });
    setError('');
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

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Login Sistem</CardTitle>
              <CardDescription>
                Masuk ke Sistem Informasi Pelayanan Izin Penelitian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@bakesbang.ntbprov.go.id"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Memproses...' : 'Masuk'}
                </Button>

                <div className="space-y-2 pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center mb-2">
                    Isi otomatis untuk testing:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fillAdmin}
                    >
                      Admin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fillPimpinan}
                    >
                      Pimpinan
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-4">
            <Link href="/">
              <Button variant="link" size="sm">
                Kembali ke Halaman Utama
              </Button>
            </Link>
          </div>
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
