// Format angka dan tanggal ke gaya Indonesia (id-ID, Rupiah).

export function rupiah(amount) {
  const n = Math.round(Number(amount) || 0);
  return 'Rp' + n.toLocaleString('id-ID');
}

export function rupiahShort(amount) {
  const n = Math.round(Number(amount) || 0);
  if (Math.abs(n) >= 1000000) {
    const jt = n / 1000000;
    return 'Rp' + (Number.isInteger(jt) ? jt : jt.toFixed(1).replace('.', ',')) + ' jt';
  }
  if (Math.abs(n) >= 1000) return 'Rp' + Math.round(n / 1000) + ' rb';
  return 'Rp' + n;
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function tanggalId(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
}

export function tanggalSingkat(iso) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_ID[m - 1].slice(0, 3)}`;
}

export function sisaHari(jatuhTempoIso, hariIniIso) {
  const due = new Date(jatuhTempoIso + 'T00:00:00');
  const now = new Date(hariIniIso + 'T00:00:00');
  return Math.round((due - now) / 86400000);
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
