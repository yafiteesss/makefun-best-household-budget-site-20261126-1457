// Grafik SVG murni — tanpa pustaka, tanpa jaringan.
// donutChart: pembagian pengeluaran per kategori.
// barChart: perbandingan pemasukan vs pengeluaran per bulan.

import { rupiahShort } from './format.js';

export function donutChart(slices, size = 220) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 34;
  let angle = -Math.PI / 2;
  let paths = '';
  for (const s of slices) {
    if (s.value <= 0) continue;
    const frac = s.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${s.label}: ${rupiahShort(s.value)}</title></path>`;
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Diagram lingkaran pengeluaran per kategori">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center-top">Total keluar</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-center-num">${rupiahShort(total)}</text></svg>`;
}

export function barChart(rows, height = 240) {
  const width = 640;
  const padL = 46;
  const padB = 30;
  const padT = 14;
  const max = Math.max(...rows.flatMap((r) => [r.income, r.spent]), 1);
  const plotW = width - padL - 16;
  const plotH = height - padT - padB;
  const slot = plotW / rows.length;
  const barW = Math.min(30, slot / 3);
  let bars = '';
  let labels = '';
  rows.forEach((r, i) => {
    const x = padL + i * slot + slot / 2;
    const hIn = (r.income / max) * plotH;
    const hOut = (r.spent / max) * plotH;
    bars += `<rect x="${(x - barW - 3).toFixed(1)}" y="${(padT + plotH - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#0e7a5f"><title>${r.month} pemasukan ${rupiahShort(r.income)}</title></rect>`;
    bars += `<rect x="${(x + 3).toFixed(1)}" y="${(padT + plotH - hOut).toFixed(1)}" width="${barW}" height="${hOut.toFixed(1)}" rx="3" fill="#c2703d"><title>${r.month} pengeluaran ${rupiahShort(r.spent)}</title></rect>`;
    labels += `<text x="${x.toFixed(1)}" y="${height - 10}" text-anchor="middle" class="chart-label">${r.month}</text>`;
  });
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + plotH * (1 - f);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - 16}" y2="${y.toFixed(1)}" class="chart-grid"/><text x="${padL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="chart-label">${rupiahShort(max * f)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Grafik batang pemasukan dan pengeluaran enam bulan terakhir">${grid}${bars}${labels}</svg>`;
}

export function progressBar(percent, color, label) {
  const p = Math.max(0, Math.min(100, percent));
  const over = percent > 100;
  return `<div class="bar" role="progressbar" aria-valuenow="${Math.round(percent)}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}"><div class="bar-fill${over ? ' over' : ''}" style="width:${p}%;background:${color}"></div></div>`;
}
