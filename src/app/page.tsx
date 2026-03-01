'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, Shield, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Sistem Informasi Pelayanan Izin Penelitian
              </h1>
              <p className="text-sm text-gray-600">BAKESBANGPOLDAGRI NTB</p>
            </div>
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Layanan Perizinan Penelitian Online
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Ajukan permohonan izin penelitian secara online dengan mudah, cepat, dan transparan
          </p>
          <Link href="/pengajuan">
            <Button size="lg" className="text-base">
              <FileText className="mr-2 h-5 w-5" />
              Ajukan Permohonan
            </Button>
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Pengajuan Izin</CardTitle>
              <CardDescription>
                Ajukan permohonan izin penelitian dengan mengisi formulir online
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-400 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Tracking Status</CardTitle>
              <CardDescription>
                Pantau status permohonan izin penelitian Anda secara real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-400 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Verifikasi & Persetujuan</CardTitle>
              <CardDescription>
                Proses verifikasi dan persetujuan oleh Admin dan Pimpinan
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Akses Cepat
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/pengajuan">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <h4 className="font-semibold">Formulir Pengajuan</h4>
                      <p className="text-sm text-gray-600">Isi formulir permohonan izin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tracking">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Search className="h-6 w-6 text-green-600 mr-4" />
                    <div>
                      <h4 className="font-semibold">Tracking Permohonan</h4>
                      <p className="text-sm text-gray-600">Cek status permohonan Anda</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/login">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-purple-600 mr-4" />
                    <div>
                      <h4 className="font-semibold">Login</h4>
                      <p className="text-sm text-gray-600">Akses untuk Admin & Pimpinan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="font-semibold text-lg mb-2">
              BAKESBANGPOLDAGRI PROVINSI NTB
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Badan Kesatuan Bangsa dan Politik Perlindungan Masyarakat
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Sistem Informasi Pelayanan Izin Penelitian
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
