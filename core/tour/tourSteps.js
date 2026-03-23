/**
 * User Dashboard Tour Steps
 * 
 * Onboarding guide for new user dashboard visitors
 * Covers main navigation and key features
 */

export const userDashboardTourSteps = [
  {
    selector: '[data-tour="user-welcome"]',
    title: 'Selamat Datang di EasyKos!',
    description: 'Platform untuk menemukan, mengatur, dan mengelola tempat tinggal kosmu. Mari kita jelajahi fitur-fitur penting.',
    padding: 12,
    borderRadius: '16px',
    tip: 'Dashboard ini dirancang untuk kemudahan pencarian dan manajemen kos',
  },
  {
    selector: '[data-tour="sidebar-home"]',
    title: 'Halaman Utama',
    description: 'Di sini Anda bisa explore berbagai pilihan kos dengan filter kategori, lihat detail kamar, harga, dan fasilitas yang tersedia.',
    padding: 0,
    borderRadius: '12px',
    tip: 'Gunakan filter untuk menemukan kos sesuai preferensi Anda',
  },
  {
    selector: '[data-tour="sidebar-mykos"]',
    title: 'Kos Saya',
    description: 'Lihat daftar kos yang sudah Anda pesan atau sedang menunggu persetujuan pemilik. Kelola data resident dan fasilitas yang Anda gunakan di sini.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Simpan informasi penting tentang kos Anda',
  },
  {
    selector: '[data-tour="sidebar-chat"]',
    title: 'Chat dengan Pemilik',
    description: 'Berkomunikasi langsung dengan pemilik kos untuk menanyakan detail kamar, fasilitas, atau proses booking. Respon cepat meningkatkan peluang booking!',
    padding: 8,
    borderRadius: '8px',
    tip: 'Tanyakan hal penting sebelum commit untuk booking',
  },
  {
    selector: '[data-tour="sidebar-mypet"]',
    title: 'Tupai Virtual Saya',
    description: 'Isi daftar hadir harian dan mainkan dengan Tupai virtual Anda. Setiap aktivitas memberikan poin yang bisa ditukar dengan rewards!',
    padding: 8,
    borderRadius: '8px',
    tip: 'Beri makan tupai setiap hari untuk poin maksimal',
  },
  {
    selector: '[data-tour="sidebar-profile"]',
    title: 'Profil Saya',
    description: 'Kelola profil pribadi, ubah password, lihat riwayat transaksi pembayaran, dan data kos Anda semua tersimpan di sini.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Pastikan data profil selalu akurat dan terkini',
  },
  {
    selector: '[data-tour="user-sidebar-logout"]',
    title: 'Tombol Logout',
    description: 'Keluar dari akun Anda dengan aman. Sidebar akan selalu terlihat saat Anda scroll untuk kemudahan navigasi.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Pastikan Anda logout saat menggunakan perangkat bersama',
  },
];

/**
 * Owner Dashboard Tour Steps
 * 
 * Onboarding guide for new owner dashboard visitors
 * Covers property management and key features
 */

export const ownerDashboardTourSteps = [
  {
    selector: '[data-tour="owner-welcome"]',
    title: 'Selamat Datang di Dashboard Pemilik!',
    description: 'Pusat kontrol untuk mengelola properti kos Anda. Monitor revenue, occupancy, dan pembayaran residents dari sini.',
    padding: 12,
    borderRadius: '16px',
    tip: 'Dashboard ini dirancang khusus untuk kemudahan manajemen property',
  },
  {
    selector: '[data-tour="sidebar-home"]',
    title: 'Ringkasan Bisnis',
    description: 'Lihat statistik penting: total revenue bulan ini, occupancy kamar vs total kamar, dan jumlah pembayaran yang tertunda yang perlu segera diikuti up.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Monitor occupancy dan revenue untuk strategi pricing yang lebih baik',
  },
  {
    selector: '[data-tour="sidebar-management"]',
    title: 'Manajemen Kos',
    description: 'Kelola semua aspek kos Anda: tambah kamar baru, kelola residents, update status pembayaran, dan lihat history booking lengkap.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Section ini punya sub-menu untuk berbagai fitur manajemen',
  },
  {
    selector: '[data-tour="sidebar-chat"]',
    title: 'Chat dengan Residents',
    description: 'Berkomunikasi langsung dengan calon penghuni dan residents untuk menjawab pertanyaan mereka tentang kamar dan fasilitas kos.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Respon cepat meningkatkan kepuasan dan conversion rate booking',
  },
  {
    selector: '[data-tour="sidebar-mypet"]',
    title: 'Tupai Virtual Anda',
    description: 'Isi daftar hadir harian dan mainkan dengan Tupai seperti residents Anda. Kumpulkan poin untuk rewards eksklusif.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Sama dengan residents, Anda juga bisa mendapatkan poin rewards',
  },
  {
    selector: '[data-tour="sidebar-profile"]',
    title: 'Profil & Pengaturan',
    description: 'Kelola profil bisnis Anda, tambahkan/ubah metode pembayaran untuk menerima transfer dari residents, dan update informasi kontak.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Wajib tambahkan minimal 1 metode pembayaran untuk terima transfer',
  },
  {
    selector: '[data-tour="owner-sidebar-logout"]',
    title: 'Tombol Logout',
    description: 'Keluar dari akun pemilik dan kembali ke halaman login. Sidebar akan tetap sticky untuk navigasi yang mudah.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Selalu logout saat selesai menggunakan untuk keamanan data',
  },
];

/**
 * Management Submenu Tour Steps
 * 
 * Additional tour for the Management submenu features
 */

export const managementTourSteps = [
  {
    selector: '[data-tour="management-add-room"]',
    title: 'Tambah Kamar Baru',
    description: 'Tambahkan kamar baru ke kos Anda dengan detail seperti nomor kamar, harga, fasilitas, dan aturan khusus.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Isi semua field dengan detail yang jelas untuk privat listing',
  },
  {
    selector: '[data-tour="management-update-status"]',
    title: 'Update Status',
    description: 'Ubah status kamar atau residents (tersedia, terisi, maintenance, dsb) dan kelola history perubahan status.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Update status dengan cepat saat ada perubahan',
  },
  {
    selector: '[data-tour="management-resident-history"]',
    title: 'Resident History',
    description: 'Lihat history lengkap semua residents yang pernah menginap di kos Anda, durasi tinggal, dan catatan penting.',
    padding: 8,
    borderRadius: '8px',
    tip: 'Gunakan data ini untuk referensi background check resident baru',
  },
];
