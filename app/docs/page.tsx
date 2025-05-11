"use client"

import Link from 'next/link';
import { Terminal, Server, Gauge, Shield, Code, Settings, ArrowRight, Clock, Bookmark, Search, Github, Database, Bell, Wifi, Coffee, HelpCircle, Cpu, Activity, HardDrive, ExternalLink, Zap, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Docs() {
  const [activeId, setActiveId] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0); 

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let closestSection: string | null = null;
      let minDistance = Infinity;
  
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
  
        if (top <= 100 && Math.abs(top) < minDistance) {
          minDistance = Math.abs(top);
          closestSection = section.id;
        }
      });
  
      if (closestSection) {
        setActiveId(closestSection);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // panggil langsung untuk inisialisasi awal
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);  

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#161616] text-[#d8dee9]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-[#d8dee9] mb-4">Dokumentasi SysPulse</h1>
          <p className="text-[#a8aebb] text-lg mb-8">
            Pelajari cara memantau dan mengelola sistem Anda dengan fitur dan alat komprehensif SysPulse.
          </p>

          {/* Search box */}
          <div className="relative mb-10">
            <div className="flex items-center border border-[#3fdaa4]/30 bg-[#161616] rounded-lg overflow-hidden">
              <div className="pl-4">
                <Search className="h-5 w-5 text-[#6be5fd]" />
              </div>
              <input
                type="text"
                placeholder="Cari dokumentasi..."
                className="w-full py-3 px-4 bg-transparent text-[#d8dee9] placeholder-[#a8aebb] outline-none"
              />
              <button className="px-5 py-3 bg-[#3fdaa4]/10 text-[#3fdaa4] font-medium hover:bg-[#3fdaa4]/20 transition-colors">
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Memulai</h3>
                <ul className="space-y-2">
                  <li>
                  <Link 
                    href="#pengenalan" 
                    className={`block px-3 py-1.5 rounded-md transition-colors ${
                      activeId === 'pengenalan' 
                        ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                        : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                    }`}
                  >
                    Pengenalan
                  </Link>

                  </li>
                  <li>
                    <Link 
                      href="#instalasi" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'instalasi' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Memulai dengan Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#panduan-cepat" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'panduan-cepat' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Panduan Cepat
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Fitur Utama</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="#dashboard" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'dashboard' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#terminal" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'terminal' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Terminal
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#pemantauan" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'pemantauan' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                      >
                      Pemantauan
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#pemberitahuan" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'pemberitahuan' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Pemberitahuan & Notifikasi
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Koneksi</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="#koneksi-ssh" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'koneksi-ssh' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Koneksi SSH
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#ngrok" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'ngrok' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Penggunaan Ngrok
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#vm-cloud" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'vm-cloud' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      VM Cloud
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#6be5fd] font-medium mb-2">Lanjutan</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="#integrasiApi" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'api' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Integrasi API
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#keamanan" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'keamanan' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Keamanan
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#pemecahanMasalah" 
                      className={`block px-3 py-1.5 rounded-md transition-colors ${
                        activeId === 'pemecahan-masalah' 
                          ? 'bg-[#1e1e1e] text-[#d8dee9]' 
                          : 'text-[#a8aebb] hover:text-[#d8dee9] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      Pemecahan Masalah
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-12">
            {/* Pengenalan Section */}
            <section id="pengenalan" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Pengenalan</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse adalah platform pemantauan dan pengelolaan sistem komprehensif yang dirancang untuk
                  administrator sistem, insinyur DevOps, dan profesional TI. Platform ini memberikan
                  wawasan real-time tentang kinerja server Anda, akses terminal yang aman, dan alat otomatisasi yang canggih.
                </p>
                
                <h3 className="font-bolder text-[#6be5fd] mt-4">Fitur Utama</h3>
                <ul>
                  <li>- Pemantauan sistem real-time dengan dasbor yang dapat disesuaikan</li>
                  <li>- Akses terminal berbasis web yang aman ke server Anda</li>
                  <li>- Sistem peringatan dan notifikasi untuk peristiwa penting</li>
                  <li>- Analitik dan pelaporan data historis</li>
                  <li>- Kontrol akses berbasis peran untuk kolaborasi tim</li>
                  <li>- Integrasi API untuk otomatisasi alur kerja</li>
                </ul>
              </div>
            </section>
            
            {/* Instalasi Section */}
            <section id="instalasi" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center">
                  <Server className="h-5 w-5 text-[#3fdaa4]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Memulai dengan Dashboard</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse adalah platform pemantauan sistem berbasis web yang tidak memerlukan instalasi khusus.
                  Cukup akses melalui browser dan mulai pantau server Anda dengan mengikuti langkah-langkah berikut.
                </p>
                
                <h3>Persiapan Awal</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-3">
                    <li>
                      <strong className="text-[#d8dee9]">Buat Akun</strong>
                      <p className="mt-1">Daftar untuk akun SysPulse baru atau masuk dengan akun yang sudah ada melalui halaman utama</p>
                    </li>
                    <li>
                      <strong className="text-[#d8dee9]">Akses Dashboard</strong>
                      <p className="mt-1">Setelah login, Anda akan diarahkan ke dashboard utama yang menampilkan ikhtisar sistem</p>
                    </li>
                    <li>
                      <strong className="text-[#d8dee9]">Tambahkan Koneksi SSH</strong>
                      <p className="mt-1">Untuk memantau server, Anda perlu menambahkan koneksi SSH melalui form yang disediakan</p>
                    </li>
                  </ol>
                </div>
                
                <h3 className=" font-bold text-[#d8dee9] text-[#6be5fd]">Form Koneksi SSH</h3>
                <p>
                  Untuk menghubungkan server Anda ke SysPulse, isi form SSH dengan informasi berikut:
                </p>
                
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6 text-[green]">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Informasi Koneksi</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Host:</strong>
                          <p className="mt-1">Alamat IP atau hostname server Anda</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Username:</strong>
                          <p className="mt-1">Nama pengguna untuk login SSH</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Port:</strong>
                          <p className="mt-1">Port SSH (default: 22)</p>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Autentikasi</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Private Key:</strong>
                          <p className="mt-1">Tempel private key SSH Anda atau upload dari file</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Passphrase (opsional):</strong>
                          <p className="mt-1">Jika private key dilindungi dengan passphrase</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-[#282a36] p-4 rounded-md">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="h-5 w-5 text-[#ff79c6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#ff79c6] font-medium">Catatan Keamanan</span>
                    </div>
                    <p className="text-[#a8aebb]">Private key Anda hanya digunakan untuk koneksi dan tidak pernah disimpan di server SysPulse. Selalu gunakan kunci dengan izin terbatas dan aktifkan passphrase untuk keamanan ekstra.</p>
                  </div>
                </div>
                
                <h3 className="font-bold text-[#6be5fd]">Langkah-Langkah Koneksi</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-4">
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">1</div>
                        <span className="text-[#d8dee9] font-medium">Buka Halaman SSH</span>
                      </div>
                      <p className="mt-1 ml-8">Navigasi ke menu "Koneksi" di panel navigasi utama dan pilih "Tambah Server"</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">2</div>
                        <span className="text-[#d8dee9] font-medium">Isi Form Koneksi</span>
                      </div>
                      <p className="mt-1 ml-8">Masukkan detail koneksi server Anda (host, username, port, dan private key)</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">3</div>
                        <span className="text-[#d8dee9] font-medium">Hubungkan</span>
                      </div>
                      <p className="mt-1 ml-8">Klik tombol "Hubungkan" dan tunggu hingga koneksi berhasil dibuat</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#3fdaa4]/20 flex items-center justify-center text-[#3fdaa4] font-medium">4</div>
                        <span className="text-[#d8dee9] font-medium">Akses Dashboard</span>
                      </div>
                      <p className="mt-1 ml-8">Setelah terhubung, Anda akan melihat dashboard pemantauan server</p>
                    </li>
                  </ol>
                </div>
              </div>
            </section>
            
            {/* Panduan Cepat Section */}
            <section id="panduan-cepat" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#c792ea]/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[#c792ea]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Panduan Cepat</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Setelah berhasil terhubung, Anda dapat langsung menggunakan fitur-fitur SysPulse. Panduan cepat ini akan membantu Anda 
                  memahami cara menggunakan dasbor pemantauan dan mengakses fitur utama.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Navigasi Dashboard</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Panel Navigasi Utama</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Dashboard</strong>
                          <p className="mt-1">Ikhtisar semua metrik server dalam tampilan terpadu</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Terminal</strong>
                          <p className="mt-1">Akses terminal berbasis web untuk mengelola server</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Pemantauan</strong>
                          <p className="mt-1">Tampilan detail metrik sistem (CPU, memori, disk, jaringan)</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Pemberitahuan</strong>
                          <p className="mt-1">Kelola dan konfigurasi peringatan sistem</p>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Pengaturan Server</h4>
                      <ul className="list-disc pl-5 text-[#a8aebb] space-y-3">
                        <li>
                          <strong className="text-[#d8dee9]">Koneksi</strong>
                          <p className="mt-1">Kelola koneksi SSH server</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Keamanan</strong>
                          <p className="mt-1">Pengaturan keamanan dan akses server</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Log</strong>
                          <p className="mt-1">Lihat dan analisis log sistem server</p>
                        </li>
                        <li>
                          <strong className="text-[#d8dee9]">Preferensi</strong>
                          <p className="mt-1">Sesuaikan tampilan dan pengaturan dashboard</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Penggunaan Dashboard</h3>
                <p>
                  Dashboard SysPulse dirancang untuk memberikan gambaran lengkap tentang kesehatan server anda, yaitu meliputi:
                </p>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-4">
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">Melihat Metrik Utama</span>
                      </div>
                      <p className="mt-1">Dashboard menampilkan widget dengan metrik penting seperti penggunaan CPU, memori, dan ruang disk</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">Menyesuaikan Tampilan</span>
                      </div>
                      <p className="mt-1">Drag-and-drop widget untuk menyusun ulang, serta ubah ukuran dengan menarik sudut widget</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">Menambahkan Widget</span>
                      </div>
                      <p className="mt-1">Klik tombol "+" di sudut kanan atas untuk menambahkan widget baru ke dashboard</p>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#d8dee9] font-medium">Detail Mendalam</span>
                      </div>
                      <p className="mt-1">Klik widget untuk melihat detail dan grafik historis dari metrik tersebut</p>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd]">Terminal Web</h3>
                <p>
                  Akses terminal berbasis web untuk mengelola server tanpa perlu SSH client terpisah:
                </p>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-4 mb-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Cara Mengakses</h4>
                      <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                        <li>Klik menu "Terminal" di panel navigasi</li>
                        <li>Atau klik tombol "Terminal" di halaman detail server</li>
                        <li>Terminal akan terbuka di jendela baru</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-[#d8dee9] font-semibold mb-3">Perintah Umum</h4>
                      <div className="bg-[#121212] p-3 rounded-md text-[#d8dee9] font-mono text-sm overflow-x-auto">
                        <div className="grid grid-cols-[1fr,auto] gap-x-4 gap-y-2">
                          <span>clear</span>
                          <span className="text-[#6272a4]"># Bersihkan layar</span>
                          <span>exit</span>
                          <span className="text-[#6272a4]"># Keluar dari terminal</span>
                          <span>htop</span>
                          <span className="text-[#6272a4]"># Monitor proses interaktif</span>
                          <span>df -h</span>
                          <span className="text-[#6272a4]"># Cek ruang disk</span>
                          <span>free -m</span>
                          <span className="text-[#6272a4]"># Cek penggunaan memori</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="dashboard" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <Gauge className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Dashboard</h2>
              </div>
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Dashboard adalah pusat kendali visual dalam SysPulse yang memberikan gambaran langsung terhadap kondisi server secara real-time. Di sini, pengguna dapat memantau metrik performa inti seperti CPU, RAM, disk, dan jaringan secara interaktif.
                </p>
                <ul>
                  <li>- Menyediakan grafik dan visualisasi pemakaian sumber daya sistem</li>
                  <li>- Memperlihatkan status koneksi SSH dan identitas server yang sedang aktif</li>
                  <li>- Akses cepat ke fungsi monitoring lainnya seperti Terminal dan Proses</li>
                  <li>- Menampilkan notifikasi langsung jika ada anomali atau peringatan sistem</li>
                </ul>
                <p>
                  Dashboard ini dirancang agar adaptif dan responsif, memastikan pengalaman pemantauan yang intuitif baik untuk pengguna teknis maupun non-teknis.
                </p>
             </div>
            </section>
            
            {/* Terminal Section */}
            <section id="terminal" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#ff79c6]/10 flex items-center justify-center">
                  <Terminal className="h-5 w-5 text-[#ff79c6]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Terminal</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Terminal SysPulse memberikan akses aman berbasis web ke server Anda dari mana saja.
                  Fitur ini memungkinkan Anda mengelola sistem jarak jauh melalui antarmuka terminal yang familier.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Fitur Utama Terminal</h3>
                <ul>
                  <li><strong>- Akses Terminal Berbasis Web</strong>: Akses server dari browser apa pun tanpa perlu SSH client terpisah</li>
                  <li><strong>- Sesi Persisten</strong>: Sesi terminal tetap aktif bahkan jika Anda menutup browser dan kembali nanti</li>
                  <li><strong>- Histori Perintah</strong>: Akses histori perintah lengkap untuk referensi cepat</li>
                  <li><strong>- Transfer File</strong>: Unggah dan unduh file langsung dari terminal</li>
                  <li><strong>- Berbagi Sesi</strong>: Bagikan sesi terminal dengan pengguna lain untuk kolaborasi</li>
                </ul>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Penggunaan Terminal</h3>
                <p>
                  Setelah terhubung ke server, anda dapat mengkses terminal dengan cara berikut:
                </p>
                <ol>
                  <li>- Buka halaman Server dari navigasi utama</li>
                  <li>- Pilih server yang ingin diakses</li>
                  <li>- Klik tombol "Terminal" di panel kontrol server</li>
                  <li>- Terminal interaktif akan terbuka di jendela baru</li>
                </ol>
                
                <div className="not-prose bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-3">Peringatan Keamanan</h4>
                  <p className="text-[#a8aebb] mb-4">
                    Saat menggunakan terminal web, pastikan untuk selalu keluar dari sesi Anda saat selesai untuk mencegah akses tidak sah.
                    SysPulse secara otomatis mengakhiri sesi yang tidak aktif setelah 30 menit, tetapi praktik terbaik adalah keluar secara manual.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Perintah Berguna</h3>
                <p>Berikut ini adalah perintah khusus pada sistem SysPulse yang tersedia di terminal:</p>
                <pre className="bg-[#121212] p-4 rounded-md text-[#d8dee9] overflow-x-auto">
                  <code>
                    clear           # Bersihkan layar terminal<br/>
                    exit            # Keluar dari sesi terminal<br/>
                    upload &lt;file&gt;   # Unggah file ke server<br/>
                    download &lt;file&gt; # Unduh file dari server<br/>
                    help            # Tampilkan bantuan untuk perintah yang tersedia
                  </code>
                </pre>
              </div>
            </section>

             {/* Pemantauan Section */}
            <section id="pemantauan" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-[#3fdaa4]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Pemantauan Sistem</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Fitur pemantauan sistem SysPulse memberikan visibilitas real-time ke dalam kinerja server Anda.
                  Anda dapat memantau berbagai metrik, menyiapkan dasbor kustom, dan menerima peringatan saat terjadi masalah.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Metrik yang Dipantau</h3>
                <p>
                  SysPulse mengumpulkan dan menampilkan berbagai metrik sistem, termasuk:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-4">
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#c792ea]/10 flex items-center justify-center">
                        <Cpu className="h-4 w-4 text-[#c792ea]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">CPU</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>Penggunaan CPU (total dan per core)</li>
                      <li>Beban rata-rata (1, 5, dan 15 menit)</li>
                      <li>Waktu CPU (user, system, idle, iowait)</li>
                      <li>Proses yang menggunakan CPU tertinggi</li>
                      <li>Suhu CPU (jika didukung oleh hardware)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                        <Server className="h-4 w-4 text-[#6be5fd]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">Memori</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>Penggunaan memori fisik (total, terpakai, bebas)</li>
                      <li>Penggunaan swap</li>
                      <li>Buffer dan cache</li>
                      <li>Proses yang menggunakan memori tertinggi</li>
                      <li>Pengelompokan penggunaan memori berdasarkan aplikasi</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ff79c6]/10 flex items-center justify-center">
                        <HardDrive className="h-4 w-4 text-[#ff79c6]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">Disk</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>Penggunaan ruang disk (total, terpakai, bebas)</li>
                      <li>IOPS (operasi I/O per detik)</li>
                      <li>Throughput disk (baca/tulis)</li>
                      <li>Waktu respons disk</li>
                      <li>Penggunaan inode</li>
                      <li>Status SMART untuk pemantauan kesehatan disk</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#3fdaa4]/10 flex items-center justify-center">
                        <Wifi className="h-4 w-4 text-[#3fdaa4]" />
                      </div>
                      <h4 className="text-[#d8dee9] font-semibold text-lg">Jaringan</h4>
                    </div>
                    <ul className="list-disc pl-5 text-[#a8aebb] space-y-1.5">
                      <li>Bandwidth jaringan (masuk/keluar)</li>
                      <li>Paket jaringan (dikirim/diterima)</li>
                      <li>Koneksi aktif</li>
                      <li>Status port jaringan</li>
                      <li>Statistik TCP/UDP</li>
                      <li>Latensi jaringan</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Dasbor Kustom</h3>
                <p>
                  SysPulse memungkinkan anda membuat dasbor kustom untuk memantau metrik yang paling penting bagi anda, dengan langkah-langkah berikut ini:
                </p>
                <ol>
                  <li>- Navigasi ke bagian "Dasbor" di menu utama</li>
                  <li>- Klik tombol "Buat Dasbor Baru"</li>
                  <li>- Beri nama dasbor anda dan pilih tata letak</li>
                  <li>- Tambahkan widget dengan mengklik tombol "+" di area dasbor</li>
                  <li>- Untuk setiap widget, pilih:
                    <ul>
                      <li className="ml-6">1. Jenis metrik (CPU, memori, disk, dsb.)</li>
                      <li className="ml-6">2. Server yang ingin dipantau</li>
                      <li className="ml-6">3. Interval waktu (waktu nyata, 1 jam terakhir, 1 hari, dsb.)</li>
                      <li className="ml-6">4. Jenis visualisasi (grafik, gauge, tabel, dsb.)</li>
                    </ul>
                  </li>
                  <li>- Atur tata letak dengan cara drag-and-drop widget</li>
                  <li>- Klik "Simpan" untuk menyimpan dasbor anda</li>
                </ol>
                
                <div className="bg-[#282a36] p-5 rounded-lg border border-zinc-800/50 mt-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Contoh Dasbor</h4>
                  <div className="flex justify-center bg-[#161616] p-4 rounded-md">
                    <div className="w-full h-64 flex items-center justify-center text-[#a8aebb]">
                      [Gambar dasbor pemantauan sistem]
                    </div>
                  </div>
                  <p className="text-[#a8aebb] mt-4">
                    Contoh dasbor pemantauan server dengan widget untuk CPU, memori, disk, dan metrik jaringan.
                    Dasbor dapat dikonfigurasi sepenuhnya untuk menampilkan metrik yang paling relevan untuk kasus penggunaan anda.
                  </p>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Melihat Histori dan Tren</h3>
                <p>
                  SysPulse menyimpan data historis untuk semua metrik yang dikumpulkan, sehingga memungkinkan anda untuk:
                </p>
                <ul>
                  <li>- Melihat tren kinerja dalam jangka panjang</li>
                  <li>- Mengidentifikasi masalah yang terjadi berulang</li>
                  <li>- Merencanakan kapasitas berdasarkan data historis</li>
                  <li>- Membandingkan kinerja saat ini dengan periode sebelumnya</li>
                </ul>
                
                <p>
                  Untuk melihat data historis, buka widget dasbor apa pun dan sesuaikan rentang waktu menggunakan pemilih rentang di pojok kanan atas.
                  Anda dapat memilih interval waktu preset atau menentukan rentang tanggal/waktu kustom.
                </p>
                
                <h3 className="mt-8 text-[#6be5fd]">Pengaturan Agen Pemantauan</h3>
                <p>
                  Agen pemantauan SysPulse berjalan di server anda untuk mengumpulkan metrik kinerja, mencakup:
                </p>
                <ul>
                  <li>
                    <strong>- Interval Pengumpulan</strong>: Sesuaikan seberapa sering metrik dikumpulkan (default: setiap 10 detik)
                  </li>
                  <li>
                    <strong>- Retensi Data</strong>: Konfigurasikan berapa lama data historis disimpan
                  </li>
                  <li>
                    <strong>- Filter Metrik</strong>: Pilih metrik spesifik yang ingin Anda kumpulkan
                  </li>
                  <li>
                    <strong>- Skrip Kustom</strong>: Tambahkan skrip pemantauan kustom untuk metrik aplikasi spesifik
                  </li>
                </ul>
                
                <p>
                  Untuk mengakses pengaturan agen, navigasi ke Pengaturan → Pemantauan → Agen dan pilih server yang ingin dikonfigurasi.
                </p>
                
                <div className="bg-[#3fdaa4]/10 p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#3fdaa4] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Tips Pengoptimalan
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      Sesuaikan interval pengumpulan berdasarkan kebutuhan anda - interval yang lebih pendek memberikan pemantauan yang lebih terperinci tetapi memerlukan lebih banyak sumber daya
                    </li>
                    <li>
                      Untuk server dengan sumber daya terbatas, pertimbangkan untuk mengumpulkan hanya metrik penting
                    </li>
                    <li>
                      Gunakan tampilan agregat untuk memantau banyak server sekaligus
                    </li>
                    <li>
                      Buat dasbor terpisah untuk kasus penggunaan berbeda (pemantauan produksi vs. pengembangan)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Pemberitahuan Section */}
            <section id="pemberitahuan" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#ff79c6]/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-[#ff79c6]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Pemberitahuan & Notifikasi</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Sistem pemberitahuan SysPulse memungkinkan anda menerima peringatan tentang masalah potensial 
                  sebelum berdampak pada sistem anda. Anda dapat mengonfigurasi peringatan untuk berbagai kondisi 
                  dan menerimanya melalui berbagai saluran.
                </p>
                
                <h3 className=" mt-4 text-[#6be5fd]">Jenis Peringatan</h3>
                <p>
                  SysPulse mendukung berbagai jenis peringatan berdasarkan metrik yang dikumpulkan, meliputi:
                </p>
                
                <ul>
                  <li>
                    <strong>- Peringatan Ambang Batas</strong>: Aktifkan saat metrik melebihi nilai tertentu
                    <ul>
                      <li>Contoh: CPU &gt; 90% selama 5 menit</li>
                      <li>Contoh: Ruang disk bebas &lt; 10%</li>
                    </ul>
                  </li>
                  <li>
                    <strong>- Peringatan Perubahan</strong>: Aktifkan ketika metrik berubah dengan jumlah tertentu dalam interval waktu
                    <ul>
                      <li>Contoh: Penggunaan memori meningkat &gt; 30% dalam 10 menit</li>
                      <li>Contoh: Lalu lintas jaringan turun &gt; 90% (kemungkinan masalah konektivitas)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>- Peringatan Status</strong>: Aktifkan ketika status layanan berubah
                    <ul>
                      <li>Contoh: Layanan web berhenti</li>
                      <li>Contoh: Server menjadi tidak dapat dijangkau</li>
                    </ul>
                  </li>
                  <li>
                    <strong>- Peringatan Anomali</strong>: Aktifkan ketika metrik berperilaku tidak seperti biasanya
                    <ul>
                      <li>Contoh: Pola penggunaan CPU yang tidak biasa dibandingkan dengan baseline historis</li>
                      <li>Contoh: Lonjakan tiba-tiba dalam koneksi jaringan</li>
                    </ul>
                  </li>
                </ul>
                
                <h3 className="mt-6 text-[#6be5fd]">Metode Notifikasi</h3>
                <p>
                  SysPulse dapat mengirimkan notifikasi melalui berbagai saluran, seperti:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Email</h4>
                    <p className="text-[#a8aebb]">
                      Notifikasi terperinci dikirim ke alamat email yang ditentukan, dengan grafik dan informasi diagnostik.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">SMS</h4>
                    <p className="text-[#a8aebb]">
                      Pesan teks singkat untuk peringatan kritis yang memerlukan tindakan segera.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Webhook</h4>
                    <p className="text-[#a8aebb]">
                      Kirim data peringatan ke URL webhook untuk integrasi dengan sistem pihak ketiga.
                    </p>
                  </div>
                  
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-[#d8dee9] font-semibold mb-2">Aplikasi Pesan</h4>
                    <p className="text-[#a8aebb]">
                      Integrasi dengan Slack, Microsoft Teams, Telegram, dan platform komunikasi lainnya.
                    </p>
                  </div>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Mengonfigurasi Peringatan</h3>
                <p>
                  Untuk mengonfigurasi peringatan baru, anda dapat mengikuti langkah-langkah berikut ini:
                </p>
                
                <ol>
                  <li>- Buka bagian "Pemberitahuan" dari menu utama</li>
                  <li>- Klik tombol "Tambah Peringatan Baru"</li>
                  <li>- Pilih jenis peringatan yang ingin anda buat</li>
                  <li>- Konfigurasi kriteria peringatan:
                    <ul>
                      <li className="ml-6">1. Pilih server yang akan dipantau</li>
                      <li className="ml-6">2. Pilih metrik untuk memicu peringatan</li>
                      <li className="ml-6">3. Tetapkan kondisi dan ambang batas</li>
                      <li className="ml-6">4. Tentukan durasi (berapa lama kondisi harus bertahan)</li>
                    </ul>
                  </li>
                  <li>- Konfigurasikan saluran pemberitahuan (email, SMS, webhook, dll.)</li>
                  <li>- Tetapkan tingkat keparahan (informasi, peringatan, kritis)</li>
                  <li>- Tambahkan instruksi penyelesaian masalah opsional</li>
                  <li>- Klik "Simpan" untuk mengaktifkan peringatan</li>
                </ol>
                
                <div className="not-prose bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-2">Praktik Terbaik Peringatan</h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      <strong>Hindari kelelahan peringatan</strong> - Jangan mengatur terlalu banyak peringatan atau ambang batas yang terlalu rendah
                    </li>
                    <li>
                      <strong>Tetapkan peringatan yang dapat ditindaklanjuti</strong> - Setiap peringatan harus memerlukan tindakan tertentu 
                    </li>
                    <li>
                      <strong>Gunakan tingkat keparahan dengan tepat</strong> - Simpan notifikasi "kritis" untuk masalah yang benar-benar memerlukan perhatian segera
                    </li>
                    <li>
                      <strong>Sertakan konteks</strong> - Tambahkan informasi yang cukup untuk memahami mengapa peringatan dipicu
                    </li>
                    <li>
                      <strong>Tinjau secara berkala</strong> - Evaluasi ulang peringatan secara teratur untuk menghilangkan false positive
                    </li>
                  </ul>
                </div>
                
                <h3 className="mt-8 text-[#6be5fd]">Riwayat Peringatan</h3>
                <p>
                  SysPulse menyimpan riwayat lengkap semua peringatan yang dipicu, sehingga memungkinkan anda untuk:
                </p>
                <ul>
                  <li>- Melihat pola dalam masalah yang terjadi berulang</li>
                  <li>- Menganalisis metrik pada saat peringatan dipicu</li>
                  <li>- Melacak resolusi dan waktu respons</li>
                  <li>- Mengidentifikasi area untuk perbaikan</li>
                </ul>
                <p>
                  Untuk mengakses riwayat peringatan, buka bagian "Pemberitahuan" dan klik tab "Riwayat".
                  Anda dapat memfilter berdasarkan server, jenis peringatan, tingkat keparahan, dan rentang tanggal.
                </p>
              </div>
            </section>
            
            {/* Koneksi SSH Section */}
            <section id="koneksi-ssh" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Koneksi SSH</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse menggunakan protokol SSH (Secure Shell) untuk terhubung ke server jarak jauh secara aman.
                  Bagian ini membahas cara melakukan koneksi SSH dan pemecahan masalah umum.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Informasi yang Diperlukan</h3>
                <p>Untuk melakukan koneksi SSH ke server, Anda memerlukan informasi berikut:</p>
                <ul>
                  <li><strong>- Host</strong>: Alamat IP atau nama domain server target</li>
                  <li><strong>- Port</strong>: Port SSH (default: 22)</li>
                  <li><strong>- Username</strong>: Nama pengguna untuk login ke server</li>
                  <li><strong>- Private Key</strong>: Kunci pribadi untuk autentikasi (atau password jika autentikasi password diaktifkan)</li>
                </ul>
                
                <h3 className='font-bold text-[#6be5fd] mt-4'>Langkah-langkah Koneksi</h3>
                <ol>
                  <li>- Navigasi ke halaman "Koneksi" di menu utama</li>
                  <li>- Klik tombol "Tambah Koneksi" atau "Hubungkan"</li>
                  <li>- Masukkan detail koneksi dalam formulir:
                    <ul>
                      <li className="ml-4">1. Host: alamat IP atau hostname server</li>
                      <li className="ml-4">2. Port: biasanya 22 (default)</li>
                      <li className="ml-4">3. Username: nama pengguna SSH Anda</li>
                      <li className="ml-4">4. Private Key: tempel kunci pribadi anda atau unggah file kunci</li>
                      <li className="ml-4">Jika menggunakan passphrase, aktifkan opsi dan masukkan passphrase</li>
                    </ul>
                  </li>
                  <li>- Klik "Hubungkan" untuk memulai koneksi</li>
                  <li>- Setelah terhubung, anda akan dibawa ke dashboard atau halaman terminal</li>
                </ol>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Mendapatkan Private Key</h3>
                <p>
                  Jika Anda belum memiliki private key, berikut cara mendapatkannya:
                </p>
                <ul>
                  <li>
                    <strong>- Pada Linux/macOS</strong>: Kunci privat biasanya tersimpan di <code>~/.ssh/id_rsa</code>
                  </li>
                  <li>
                    <strong>- Pada Windows</strong>: Jika menggunakan PuTTY, kunci tersimpan sebagai file .ppk, 
                    perlu dikonversi ke format OpenSSH
                  </li>
                  <li>
                    <strong>- Untuk VM cloud</strong>: Kunci biasanya diunduh saat pertama kali membuat instance
                  </li>
                  <li>
                    <strong>- Membuat kunci baru</strong>: Gunakan perintah: <code>ssh-keygen -t rsa -b 4096</code>
                  </li>
                </ul>
                
                <div className="not-prose bg-[#1e1e1e] p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Tips Format Kunci</h4>
                  <p className="text-[#a8aebb] mb-4">
                    SysPulse mendukung format kunci OpenSSH dan PEM. Jika Anda menggunakan kunci dalam format lain,
                    Anda mungkin perlu mengonversinya terlebih dahulu. Kunci privat harus dimulai dengan
                    <code className="bg-[#282a36] px-2 py-0.5 mx-1 rounded text-[#ff79c6]">-----BEGIN RSA PRIVATE KEY-----</code>
                    atau format serupa lainnya.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Pemecahan Masalah Koneksi</h3>
                <p>
                  Berikut ini adalah masalah koneksi SSH yang umum terjadi beserta solusinya:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                    <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Connection Refused</p>
                    <ul className="list-disc pl-5 mt-1 space-y-2 text-[#a8aebb]">
                      <li>Pastikan server SSH berjalan di server target</li>
                      <li>Verifikasi port yang benar (biasanya 22)</li>
                      <li>Periksa firewall atau aturan grup keamanan</li>
                      <li>Pastikan alamat IP server benar</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#282a36]/70 p-4 rounded-lg border border-zinc-800/50">
                    <p className="font-medium text-[#ff79c6] pb-2 border-b border-zinc-700/50 mb-3">Permission Denied</p>
                    <ul className="list-disc pl-5 mt-1 space-y-2 text-[#a8aebb]">
                      <li>Verifikasi username yang benar</li>
                      <li>Pastikan private key yang benar digunakan</li>
                      <li>Verifikasi passphrase jika digunakan</li>
                      <li>Periksa bahwa kunci publik terdaftar di server</li>
                    </ul>
                  </div>
                </div>
                
                <p className="mt-6">
                  Untuk bantuan lebih lanjut dengan koneksi SSH, klik ikon bantuan pada halaman koneksi
                  untuk melihat panduan mendetail.
                </p>
              </div>
            </section>
            
            {/* Ngrok Section */}
            <section id="ngrok" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#c792ea]/10 flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-[#c792ea]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Penggunaan Ngrok</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  Ngrok adalah layanan yang memungkinkan Anda mengekspos server lokal ke internet melalui tunnel aman.
                  Ini sangat berguna jika Anda ingin mengakses server yang berada di balik NAT atau firewall.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Mengapa Menggunakan Ngrok dengan SysPulse?</h3>
                <p>
                  Saat menjalankan server di lingkungan lokal atau jaringan privat, anda mungkin tidak memiliki IP publik tetap.
                  Oleh karena itu Ngrok membantu mengatasi masalah ini dengan membuat tunnel aman sehingga SysPulse dapat terhubung ke server anda.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Langkah-langkah Pengaturan Ngrok</h3>
                <ol>
                  <li>
                    <strong>- Instal Ngrok</strong>
                    <p>Kunjungi <a href="https://ngrok.com" target="_blank" rel="noopener noreferrer">ngrok.com</a> untuk mengunduh dan instal Ngrok</p>
                  </li>
                  <li>
                    <strong>- Daftar Akun Ngrok</strong>
                    <p>Buat akun dan dapatkan token autentikasi Anda</p>
                  </li>
                  <li>
                    <strong>- Autentikasi Ngrok</strong>
                    <p>Jalankan perintah: <code>ngrok authtoken YOUR_AUTH_TOKEN</code></p>
                  </li>
                  <li>
                    <strong>- Buat Tunnel SSH</strong>
                    <p>Untuk membuat tunnel SSH, jalankan: <code>ngrok tcp 22</code></p>
                  </li>
                </ol>
                
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-6">
                  <h4 className="text-[#6be5fd] font-semibold text-lg mb-3">Contoh Output Ngrok</h4>
                  <div className="bg-[#121212] p-4 rounded-md text-[#d8dee9] overflow-x-auto">
                    <pre><code>ngrok by @inconshreveable                                                (Ctrl+C to quit)
                                                                                              
Session Status                online                                                           
Account                       your-email@example.com (Plan: Free)                              
Version                       3.4.0                                                            
Region                        Asia Pacific (ap)                                                
Latency                       21ms                                                             
Web Interface                 http://127.0.0.1:4040                                           
Forwarding                    tcp://8.tcp.ngrok.io:12345 {'>'}  localhost:22                      
                                                                                              
Connections                   ttl     opn     rt1     rt5     p50     p90                     
                              0       0       0.00    0.00    0.00    0.00</code></pre>
                  </div>
                  <p className="text-[#a8aebb] mt-4">
                    Dalam contoh ini, gunakan <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">8.tcp.ngrok.io</code> sebagai host dan{' '}
                    <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">12345</code> sebagai port dalam formulir koneksi SSH SysPulse.
                  </p>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Penggunaan Ngrok pada SysPulse</h3>
                <p>
                  Setelah tunnel Ngrok berjalan, anda dapat mengikuti langkah-langkah berikut untuk terhubung menggunakan SysPulse:
                </p>
                <ol>
                  <li>- Buka halaman koneksi SSH di SysPulse</li>
                  <li>- Di kolom host, masukkan URL Ngrok yang diberikan (mis., <code>8.tcp.ngrok.io</code>)</li>
                  <li>- Di kolom port, masukkan port yang diberikan Ngrok (mis., <code>12345</code>)</li>
                  <li>- Masukkan username dan private key Anda seperti biasa</li>
                  <li>- Klik "Hubungkan" untuk memulai koneksi</li>
                </ol>
                
                <div className="bg-[#ff79c6]/10 p-5 rounded-lg border border-[#ff79c6]/20 mt-6">
                  <h4 className="text-[#ff79c6] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Catatan Penting
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      Alamat tunnel Ngrok <strong>berubah setiap kali Anda memulai ulang</strong> Ngrok dengan akun gratis
                    </li>
                    <li>
                      Untuk alamat tetap, pertimbangkan untuk berlangganan paket berbayar Ngrok
                    </li>
                    <li>
                      Sesi Ngrok akan kedaluwarsa setelah beberapa jam dalam paket gratis
                    </li>
                    <li>
                      Pastikan server SSH Anda berjalan di port yang Anda tentukan (default: 22)
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* VM Cloud Section */}
            <section id="vm-cloud" className="scroll-mt-24">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-[#6be5fd]" />
                </div>
                <h2 className="text-2xl font-bold text-[#d8dee9]">Koneksi ke VM Cloud</h2>
              </div>
              
              <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">
                <p>
                  SysPulse dapat dengan mudah terhubung ke Virtual Machine (VM) yang dihosting di penyedia cloud populer.
                  Bagian ini menjelaskan cara terhubung ke VM dari berbagai penyedia cloud.
                </p>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Amazon Web Services (AWS) EC2</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di AWS Console, pastikan anda berjalan di instance EC2</li>
                    <li>Catat Public DNS atau Public IP Address instance</li>
                    <li>Pastikan grup keamanan mengizinkan lalu lintas SSH (port 22)</li>
                    <li>Gunakan file .pem yang diunduh saat membuat instance sebagai private key</li>
                    <li>
                      Username default tergantung pada AMI yang digunakan:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Amazon Linux/RHEL: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ec2-user</code></li>
                        <li>Ubuntu: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ubuntu</code></li>
                        <li>Debian: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">admin</code> atau <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">debian</code></li>
                        <li>SUSE: <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">ec2-user</code> atau <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">root</code></li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Google Cloud Platform (GCP)</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di konsol GCP, navigasi ke Compute Engine {'>'}  Instances VM</li>
                    <li>Catat alamat IP eksternal dari instance VM Anda</li>
                    <li>Pastikan aturan firewall mengizinkan lalu lintas SSH (port 22)</li>
                    <li>
                      Untuk autentikasi, Anda memiliki dua opsi:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Gunakan kunci SSH yang ditambahkan melalui metadata project atau instance</li>
                        <li>Gunakan OS Login jika diaktifkan di project anda</li>
                      </ul>
                    </li>
                    <li>Username biasanya adalah nama akun Google Anda atau nama yang dikonfigurasi saat membuat instance</li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Microsoft Azure</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di portal Azure, navigasi ke Virtual Machines</li>
                    <li>Pilih VM Linux Anda dan catat alamat IP publik</li>
                    <li>Pastikan Network Security Group (NSG) mengizinkan lalu lintas SSH (port 22)</li>
                    <li>Gunakan username yang Anda konfigurasikan saat membuat VM</li>
                    <li>
                      Untuk autentikasi, Anda dapat menggunakan:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Kunci SSH yang Anda konfigurasi saat pembuatan VM</li>
                        <li>Autentikasi kata sandi jika dikonfigurasi</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <h3 className="font-bold text-[#6be5fd] mt-4">Digital Ocean</h3>
                <div className="bg-[#1e1e1e] p-5 rounded-lg border border-zinc-800/50 mt-2 mb-6">
                  <h4 className="text-[#d8dee9] font-semibold text-lg mb-3">Langkah-langkah Koneksi</h4>
                  <ol className="list-decimal pl-5 text-[#a8aebb] space-y-2">
                    <li>Di panel kontrol Digital Ocean, navigasi ke Droplets</li>
                    <li>Pilih Droplet Anda dan catat alamat IP</li>
                    <li>Username default biasanya adalah <code className="bg-[#282a36] px-2 py-0.5 rounded text-[#ff79c6]">root</code></li>
                    <li>Gunakan kunci SSH yang dikonfigurasi saat membuat Droplet</li>
                    <li>Jika Anda memilih autentikasi kata sandi, cek email untuk detail login</li>
                  </ol>
                </div>
                
                <div className="bg-[#3fdaa4]/10 p-5 rounded-lg border border-[#3fdaa4]/20 mt-6">
                  <h4 className="text-[#3fdaa4] font-semibold text-lg mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Tips Keamanan
                  </h4>
                  <ul className="list-disc pl-5 text-[#a8aebb] space-y-2">
                    <li>
                      Selalu gunakan autentikasi berbasis kunci, hindari autentikasi berbasis kata sandi jika memungkinkan
                    </li>
                    <li>
                      Batasi akses SSH hanya dari alamat IP yang diketahui melalui grup keamanan atau aturan firewall
                    </li>
                    <li>
                      Pertimbangkan untuk mengubah port SSH default (22) ke port non-standar untuk mengurangi serangan otomatis
                    </li>
                    <li>
                      Aktifkan multi-factor authentication (MFA) di akun cloud Anda untuk lapisan keamanan tambahan
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            
            {/* Lanjutan Section */}
            <section id="lanjutan" className="scroll-mt-24">
             <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#6be5fd]/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-[#6be5fd]" />
              </div>
              <h2 className="text-2xl font-bold text-[#d8dee9]">Lanjutan</h2>
            </div>
            <div className="prose prose-invert max-w-none prose-p:text-[#a8aebb] prose-li:text-[#a8aebb] prose-headings:text-[#d8dee9] prose-a:text-[#6be5fd] prose-a:no-underline hover:prose-a:text-[#8ff4ff]">

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <Code className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="integrasiApi" className="text-xl font-semibold text-[#6be5fd]">Integrasi API</h3>
              </div>
              <p>
                SysPulse menyediakan API internal untuk mengambil dan mengelola data server secara efisien.
                API ini digunakan oleh antarmuka pengguna untuk menampilkan informasi proses, sistem, dan eksekusi perintah langsung melalui koneksi SSH yang aman.
              </p>
              <ul>
                <li className="ml-6"><code>GET /process</code> - Mengambil daftar proses aktif dari server yang terhubung.</li>
                <li className="ml-6"><code>POST /kill</code> - Menghentikan proses berdasarkan PID yang diberikan.</li>
                <li className="ml-6"><code>GET /system</code> - Menyediakan statistik penggunaan CPU, memori, dan disk secara real-time.</li>
              </ul>
              <p>
                API tidak terbuka untuk publik dan hanya dapat diakses selama sesi pengguna aktif berlangsung, menjaga keamanan dari penyalahgunaan eksternal.
              </p>

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <Shield className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="keamanan" className="text-xl font-semibold text-[#6be5fd]">Keamanan</h3>
              </div>
              <p>
                Keamanan adalah prioritas utama dalam SysPulse. Sistem ini dibangun untuk memastikan bahwa semua data koneksi bersifat temporer dan aman.
              </p>
              <ul>
                <li>Private key tidak pernah disimpan di server — hanya digunakan saat sesi berlangsung.</li>
                <li>Autentikasi menggunakan SSH Key, bukan password, untuk meminimalkan risiko serangan brute-force.</li>
                <li>Session akan otomatis ditutup setelah periode tidak aktif untuk mencegah akses tidak sah.</li>
                <li>Input dari pengguna tidak disimpan ke database atau log tanpa izin eksplisit.</li>
              </ul>
              <p>
                Kami sangat menyarankan pengguna untuk menggunakan key dengan passphrase aktif dan selalu menjaga hak akses server dengan benar.
              </p>

              <div className="flex items-center space-x-2 mt-10 mb-2">
                <HelpCircle className="h-5 w-5 text-[#6be5fd]" />
                <h3 id="pemecahanMasalah" className="text-xl font-semibold text-[#6be5fd]">Pemecahan Masalah</h3>
              </div>
              <p>
                Jika anda mengalami kendala teknis saat menggunakan SysPulse, berikut beberapa solusi cepat yang bisa dicoba:
              </p>
              <ul>
                <li><strong>- Koneksi SSH gagal:</strong> Verifikasi host, port, username, dan kunci privat Anda.</li>
                <li><strong>- Tidak muncul data di dashboard:</strong> Pastikan server merespons perintah seperti <code>ps</code> dan <code>top</code>.</li>
                <li><strong>- Kunci tidak cocok:</strong> Gunakan format OpenSSH dan hindari karakter aneh hasil copy-paste.</li>
                <li><strong>- Proses tidak bisa dihentikan:</strong> Mungkin memerlukan hak sudo. Coba gunakan user dengan izin lebih tinggi.</li>
                <li><strong>- Sistem tidak responsif:</strong> Refresh halaman, atau coba putuskan koneksi dan sambung ulang.</li>
              </ul>
              <p>
                Jika permasalahan belum terselesaikan, silakan hubungi tim pengembang melalui halaman bantuan atau kirimkan log dari halaman browser Anda.
              </p>

             </div>
            </section>
            
            {/* Documentation Navigation */}
            <div className="pt-8 mt-8 border-t border-[#3fdaa4]/10 flex justify-between">
              <Link 
                href="#pengenalan" 
                className="px-4 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#a8aebb] hover:text-[#d8dee9] hover:border-[#3fdaa4]/40 flex items-center transition-colors"
              >
                <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
                <span>Sebelumnya: Pengenalan</span>
              </Link>
              <Link 
                href="#pemantauan" 
                className="px-4 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#a8aebb] hover:text-[#d8dee9] hover:border-[#3fdaa4]/40 flex items-center transition-colors"
              >
                <span>Selanjutnya: Pemantauan</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-4 mb-4">
              <div className="text-sm text-[#a8aebb]">
                <span className="hover:text-[#d8dee9] cursor-pointer">Beranda</span>
                <span className="mx-2">/</span>
                <span className="text-[#6be5fd] font-medium">Dokumentasi</span>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Was this page helpful */}
      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-5xl mx-auto border-t border-[#3fdaa4]/10 pt-8">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-[#d8dee9] mb-4">Apakah dokumentasi ini membantu?</h3>

            <div className="flex space-x-4">
            <button
              onClick={() => alert('Terima kasih atas apresiasinya! Kami senang dokumentasi ini bermanfaat untuk Anda.')}
              className="px-6 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#3fdaa4]/40 transition-colors"
            >
              Ya, sangat membantu
            </button>

            <button
              onClick={() => {
                if (confirm('Kami mohon maaf. Ingin memberi saran atau masukan langsung ke developer?')) {
                  window.location.href = '/feedback';
                }
            }}
            className="px-6 py-2 bg-[#161616] border border-[#3fdaa4]/20 rounded-md text-[#d8dee9] hover:bg-[#1e1e1e] hover:border-[#3fdaa4]/40 transition-colors"
          >
            Tidak, saya butuh info lebih
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
}