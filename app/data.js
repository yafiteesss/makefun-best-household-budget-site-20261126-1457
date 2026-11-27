// Data contoh Keluarga Santoso — rumah tangga di Jakarta, November 2026.
// Semua angka dalam Rupiah. Data ini yang dipakai seluruh halaman situs;
// pengguna bisa mengubahnya lewat formulir, dan perubahannya tersimpan di
// peramban (localStorage) tanpa pernah dikirim ke server mana pun.

export const HOUSEHOLD = {
  name: 'Keluarga Santoso',
  city: 'Jakarta',
  members: 'Budi (ayah) · Sari (ibu) · Nadia (12 th) · Bimo (8 th)',
  month: 'November 2026',
  monthShort: 'Nov 2026',
  income: [
    { source: 'Gaji Budi — staf gudang', amount: 8500000 },
    { source: 'Gaji Sari — kasir toko', amount: 4000000 },
  ],
};

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', icon: '🛒', color: '#0e7a5f', budget: 2500000 },
  { id: 'makan', name: 'Makan di Luar & Jajan', icon: '🍜', color: '#c2703d', budget: 750000 },
  { id: 'transport', name: 'Transportasi & Bensin', icon: '🛵', color: '#2f6fb2', budget: 1200000 },
  { id: 'rumah', name: 'Listrik, Air & Internet', icon: '💡', color: '#7a5fc0', budget: 1500000 },
  { id: 'pendidikan', name: 'Pendidikan Anak', icon: '🎒', color: '#b23a6e', budget: 1800000 },
  { id: 'kesehatan', name: 'Kesehatan', icon: '💊', color: '#3d9b8f', budget: 500000 },
  { id: 'hiburan', name: 'Hiburan & Langganan', icon: '🎬', color: '#8a6d1b', budget: 400000 },
  { id: 'pakaian', name: 'Pakaian & Perawatan', icon: '👕', color: '#5b7a3a', budget: 400000 },
  { id: 'cicilan', name: 'Cicilan & Lainnya', icon: '📋', color: '#5c6470', budget: 1000000 },
];

export const TRANSACTIONS = [
  { id: 1, date: '2026-11-26', desc: 'Belanja pasar Minggu — sayur, ayam, telur', cat: 'belanja', amount: 185000 },
  { id: 2, date: '2026-11-26', desc: 'Bensin Pertalite motor Budi', cat: 'transport', amount: 50000 },
  { id: 3, date: '2026-11-25', desc: 'Makan malam warteg sekeluarga', cat: 'makan', amount: 87000 },
  { id: 4, date: '2026-11-25', desc: 'Token listrik 200 kWh', cat: 'rumah', amount: 200000 },
  { id: 5, date: '2026-11-24', desc: 'Buku latihan & alat tulis Nadia', cat: 'pendidikan', amount: 132000 },
  { id: 6, date: '2026-11-24', desc: 'Langganan streaming film (bulanan)', cat: 'hiburan', amount: 149000 },
  { id: 7, date: '2026-11-23', desc: 'Belanja Indomaret — susu, roti, sabun', cat: 'belanja', amount: 214500 },
  { id: 8, date: '2026-11-23', desc: 'Ongkos ojek online Sari ke toko', cat: 'transport', amount: 36000 },
  { id: 9, date: '2026-11-22', desc: 'Periksa gigi Bimo di puskesmas', cat: 'kesehatan', amount: 75000 },
  { id: 10, date: '2026-11-22', desc: 'Ayam geprek & es teh — jajan anak', cat: 'makan', amount: 54000 },
  { id: 11, date: '2026-11-21', desc: 'Bensin Pertalite motor Sari', cat: 'transport', amount: 50000 },
  { id: 12, date: '2026-11-21', desc: 'Belanja pasar — ikan, tempe, buah', cat: 'belanja', amount: 168000 },
  { id: 13, date: '2026-11-20', desc: 'SPP Nadia bulan November', cat: 'pendidikan', amount: 650000 },
  { id: 14, date: '2026-11-20', desc: 'Pulsa & paket data keluarga', cat: 'rumah', amount: 150000 },
  { id: 15, date: '2026-11-19', desc: 'Cicilan motor (angsuran ke-14)', cat: 'cicilan', amount: 850000 },
  { id: 16, date: '2026-11-18', desc: 'Seragam olahraga Bimo', cat: 'pakaian', amount: 120000 },
  { id: 17, date: '2026-11-17', desc: 'Belanja bulanan — beras 10 kg, minyak, gula', cat: 'belanja', amount: 486000 },
  { id: 18, date: '2026-11-16', desc: 'Makan siang keluarga di bakso langganan', cat: 'makan', amount: 112000 },
  { id: 19, date: '2026-11-15', desc: 'Obat flu & vitamin anak', cat: 'kesehatan', amount: 98000 },
  { id: 20, date: '2026-11-14', desc: 'Parkir & tol — antar Nadia les renang', cat: 'transport', amount: 64000 },
  { id: 21, date: '2026-11-12', desc: 'Les renang Nadia (bulanan)', cat: 'pendidikan', amount: 350000 },
  { id: 22, date: '2026-11-10', desc: 'Iuran kebersihan & keamanan RT', cat: 'cicilan', amount: 50000 },
  { id: 23, date: '2026-11-08', desc: 'Belanja pasar — daging, sayur, bumbu', cat: 'belanja', amount: 243000 },
  { id: 24, date: '2026-11-07', desc: 'Nonton bioskop keluarga (4 tiket)', cat: 'hiburan', amount: 180000 },
  { id: 25, date: '2026-11-05', desc: 'SPP Bimo bulan November', cat: 'pendidikan', amount: 550000 },
  { id: 26, date: '2026-11-03', desc: 'Belanja awal bulan — sembako', cat: 'belanja', amount: 612000 },
  { id: 27, date: '2026-11-02', desc: 'Cuci motor & ganti oli', cat: 'transport', amount: 95000 },
  { id: 28, date: '2026-11-01', desc: 'Sampo, pasta gigi & sabun mandi', cat: 'pakaian', amount: 90000 },
  { id: 29, date: '2026-11-20', desc: 'Listrik PLN — tagihan November', cat: 'rumah', amount: 486000 },
  { id: 30, date: '2026-11-15', desc: 'Air PDAM — pemakaian 18 m³', cat: 'rumah', amount: 142000 },
  { id: 31, date: '2026-11-10', desc: 'Internet IndiHome 50 Mbps', cat: 'rumah', amount: 385000 },
  { id: 32, date: '2026-11-10', desc: 'BPJS Kesehatan — iuran 3 anggota', cat: 'kesehatan', amount: 105000 },
  { id: 33, date: '2026-11-09', desc: 'Belanja pasar — sayur, tempe, telur', cat: 'belanja', amount: 287000 },
  { id: 34, date: '2026-11-16', desc: 'Belanja pasar — ayam, ikan, buah', cat: 'belanja', amount: 268000 },
  { id: 35, date: '2026-11-13', desc: 'Makan siang keluarga — soto & es campur', cat: 'makan', amount: 168000 },
  { id: 36, date: '2026-11-18', desc: 'Jajan anak — roti & susu kotak', cat: 'makan', amount: 64000 },
  { id: 37, date: '2026-11-13', desc: 'Bensin Pertalite dua motor', cat: 'transport', amount: 150000 },
  { id: 38, date: '2026-11-15', desc: 'Tol & parkir — antar Nadia les', cat: 'transport', amount: 72000 },
  { id: 39, date: '2026-11-06', desc: 'Gas LPG 3 kg & galon air isi ulang', cat: 'rumah', amount: 125000 },
  { id: 40, date: '2026-11-11', desc: 'Vitamin & masker anak', cat: 'kesehatan', amount: 89000 },
  { id: 41, date: '2026-11-19', desc: 'Buku cerita & komik Bimo', cat: 'pendidikan', amount: 118000 },
  { id: 42, date: '2026-11-08', desc: 'Langganan musik keluarga (bulanan)', cat: 'hiburan', amount: 49000 },
  { id: 43, date: '2026-11-14', desc: 'Kaos kaki & sandal Bimo', cat: 'pakaian', amount: 95000 },
  { id: 44, date: '2026-11-22', desc: 'Laundry kiloan — selimut & jaket', cat: 'pakaian', amount: 83000 },
];

export const BILLS = [
  { id: 1, name: 'Listrik PLN', due: '2026-11-20', amount: 486000, paid: true, note: 'Token + tagihan pascabayar' },
  { id: 2, name: 'Air PDAM', due: '2026-11-15', amount: 142000, paid: true, note: 'Pemakaian 18 m³' },
  { id: 3, name: 'Internet IndiHome', due: '2026-11-10', amount: 385000, paid: true, note: 'Paket 50 Mbps' },
  { id: 4, name: 'SPP Nadia', due: '2026-11-05', amount: 650000, paid: true, note: 'Sekolah dasar kelas 6' },
  { id: 5, name: 'SPP Bimo', due: '2026-11-05', amount: 550000, paid: true, note: 'Sekolah dasar kelas 2' },
  { id: 6, name: 'BPJS Kesehatan', due: '2026-11-10', amount: 105000, paid: true, note: 'Iuran 3 anggota keluarga' },
  { id: 7, name: 'Cicilan motor', due: '2026-11-27', amount: 850000, paid: false, note: 'Angsuran ke-14 dari 35' },
  { id: 8, name: 'Langganan streaming film', due: '2026-11-28', amount: 149000, paid: false, note: 'Paket keluarga, 4 layar' },
  { id: 9, name: 'Iuran RT & keamanan', due: '2026-12-01', amount: 50000, paid: false, note: 'Dibayar ke bendahara RT 04' },
];

export const SAVINGS_GOALS = [
  { id: 1, name: 'Dana darurat', icon: '🛟', target: 30000000, saved: 18750000, note: 'Target 3× pengeluaran bulanan. Idealnya 6×.' },
  { id: 2, name: 'Pendidikan anak', icon: '🎓', target: 50000000, saved: 12400000, note: 'Untuk biaya masuk SMP Nadia tahun depan.' },
  { id: 3, name: 'Liburan keluarga', icon: '🏖️', target: 6000000, saved: 3250000, note: 'Rencana ke Yogyakarta, libur sekolah Juni.' },
  { id: 4, name: 'DP rumah', icon: '🏠', target: 100000000, saved: 8000000, note: 'Tabungan jangka panjang, setor rutin tiap gajian.' },
];

// Pemasukan vs pengeluaran 6 bulan terakhir (rupiah) — dipakai halaman Laporan.
export const MONTHLY_HISTORY = [
  { month: 'Jun 2026', income: 12500000, spent: 10120000 },
  { month: 'Jul 2026', income: 12500000, spent: 10840000 },
  { month: 'Agu 2026', income: 12500000, spent: 9960000 },
  { month: 'Sep 2026', income: 12500000, spent: 10450000 },
  { month: 'Okt 2026', income: 12500000, spent: 10980000 },
  { month: 'Nov 2026', income: 12500000, spent: 8786500 },
];

export const TIPS = [
  {
    title: 'Belanja mingguan, bukan harian',
    body: 'Keluarga Santoso belanja pasar seminggu sekali dengan daftar belanja. Belanja harian tanpa daftar membuat pengeluaran Belanja Harian membengkak sampai Rp400.000/bulan untuk jajan impulsif di warung.',
    saving: 'Hemat ±Rp400.000/bulan',
  },
  {
    title: 'Masak bekal 4 hari seminggu',
    body: 'Satu porsi makan siang beli di luar Rp25.000–Rp35.000, sementara bekal masakan rumah sekitar Rp12.000. Membawa bekal 4 dari 5 hari kerja menghemat sekitar Rp260.000/bulan untuk dua orang dewasa.',
    saving: 'Hemat ±Rp260.000/bulan',
  },
  {
    title: 'Bayar tagihan sebelum jatuh tempo',
    body: 'Denda keterlambatan listrik dan cicilan bisa Rp25.000–Rp50.000 per tagihan. Menandai semua tagihan di halaman Tagihan dan membayar 3 hari sebelum jatuh tempo menghilangkan denda sama sekali.',
    saving: 'Hemat ±Rp75.000/bulan',
  },
  {
    title: 'Aturan 24 jam untuk belanja non-esensial',
    body: 'Barang di atas Rp200.000 yang bukan kebutuhan — gawai, pakaian, dekorasi — ditunda 24 jam sebelum dibeli. Separuh keinginan hilang sendiri setelah semalam, dan uangnya pindah ke Dana Darurat.',
    saving: 'Hemat ±Rp300.000/bulan',
  },
  {
    title: 'Pisahkan rekening tabungan',
    body: 'Begitu gajian masuk, Rp2.450.000 langsung dipindah ke rekening tabungan terpisah sebelum dipakai belanja. Uang yang tidak terlihat di rekening utama jauh lebih kecil kemungkinannya terpakai.',
    saving: 'Tabungan Rp2.450.000/bulan',
  },
  {
    title: 'Cek langganan tiap 3 bulan',
    body: 'Langganan streaming, aplikasi, dan paket data yang tidak dipakai tetap menagih. Audit langganan Keluarga Santoso bulan lalu menemukan satu aplikasi kebugaran Rp79.000/bulan yang sudah 5 bulan tidak dibuka.',
    saving: 'Hemat Rp79.000/bulan',
  },
];
