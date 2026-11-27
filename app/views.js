// Halaman-halaman situs. Setiap halaman dirender dari state yang sama,
// jadi angka di Beranda, Anggaran, Transaksi dan Laporan selalu cocok.

import { HOUSEHOLD, MONTHLY_HISTORY, TIPS } from './data.js';
import {
  totalIncome, totalSpent, totalBudget, spentByCategory,
  unpaidBills, unpaidBillsTotal, categoryById,
} from './store.js';
import { rupiah, rupiahShort, pct, tanggalId, tanggalSingkat, sisaHari, escapeHtml } from './format.js';
import { donutChart, barChart, progressBar } from './charts.js';

const TODAY = '2026-11-26';

function statCard(label, value, sub, tone) {
  return `<div class="stat ${tone || ''}"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><span class="stat-sub">${sub}</span></div>`;
}

function categoryRow(state, cat, spent) {
  const p = pct(spent, cat.budget);
  const left = cat.budget - spent;
  const status = spent > cat.budget
    ? `<span class="tag over">Lewat ${rupiah(spent - cat.budget)}</span>`
    : `<span class="tag ok">Sisa ${rupiah(left)}</span>`;
  return `<div class="cat-row">
    <span class="cat-icon" style="background:${cat.color}1a;color:${cat.color}" aria-hidden="true">${cat.icon}</span>
    <div class="cat-main">
      <div class="cat-head"><strong>${cat.name}</strong>${status}</div>
      <div class="cat-nums"><span>${rupiah(spent)} dari ${rupiah(cat.budget)}</span><span>${p}%</span></div>
      ${progressBar(p, cat.color, cat.name)}
    </div>
    <a class="btn small" href="#/anggaran">Atur</a>
  </div>`;
}

export function viewDashboard(state) {
  const income = totalIncome(state);
  const spent = totalSpent(state);
  const budget = totalBudget(state);
  const left = income - spent;
  const byCat = spentByCategory(state);
  const unpaid = unpaidBills(state);
  const slices = state.categories.map((c) => ({ label: c.name, value: byCat[c.id] || 0, color: c.color }));
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const topCats = [...state.categories]
    .map((c) => ({ ...c, spent: byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${HOUSEHOLD.name} · ${HOUSEHOLD.city} · ${HOUSEHOLD.month}</p>
      <h1>Uang keluarga bulan ini, <span class="accent">terlihat semua.</span></h1>
      <p class="lede">Pemasukan ${rupiah(income)}, pengeluaran ${rupiah(spent)}. Sisa ${rupiah(left)} masih bisa dialokasikan ke tabungan sebelum gajian berikutnya.</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/transaksi">+ Catat pengeluaran</a>
        <a class="btn" href="#/anggaran">Lihat anggaran</a>
      </div>
    </div>
    <div class="hero-card">
      <div class="hero-card-head"><span>Sisa uang bulan ini</span><span class="tag ok">${pct(left, income)}% pemasukan</span></div>
      <strong class="hero-money">${rupiah(left)}</strong>
      <p class="muted">Dari pemasukan ${rupiah(income)} dikurangi pengeluaran ${rupiah(spent)}.</p>
      ${progressBar(pct(spent, income), '#0e7a5f', 'Pengeluaran dari pemasukan')}
      <p class="muted small">Terpakai ${pct(spent, income)}% dari pemasukan · anggaran ${rupiah(budget)}</p>
    </div>
  </section>

  <section class="stats">
    ${statCard('Pemasukan', rupiah(income), 'Gaji Budi + gaji Sari', 'green')}
    ${statCard('Pengeluaran', rupiah(spent), `${state.transactions.length} transaksi tercatat`, 'orange')}
    ${statCard('Tagihan belum dibayar', rupiah(unpaidBillsTotal(state)), `${unpaid.length} tagihan menunggu`, 'red')}
    ${statCard('Dana darurat', rupiah(state.goals[0].saved), `${pct(state.goals[0].saved, state.goals[0].target)}% dari target ${rupiahShort(state.goals[0].target)}`, 'teal')}
  </section>

  <section class="grid-2">
    <div class="card">
      <div class="card-head"><h2>Pengeluaran per kategori</h2><a href="#/anggaran">Semua kategori →</a></div>
      <div class="donut-wrap">${donutChart(slices)}
        <ul class="legend">${topCats.map((c) => `<li><span class="dot" style="background:${c.color}"></span>${c.name} <strong>${rupiahShort(c.spent)}</strong></li>`).join('')}</ul>
      </div>
      <p class="muted small">Kategori terbesar bulan ini: <strong>${topCats[0].name}</strong> (${rupiah(topCats[0].spent)}), disusul ${topCats[1].name} dan ${topCats[2].name}.</p>
    </div>
    <div class="card">
      <div class="card-head"><h2>Tagihan yang menunggu</h2><a href="#/tagihan">Semua tagihan →</a></div>
      ${unpaid.length === 0
        ? '<p class="empty">Semua tagihan bulan ini sudah lunas. 🎉</p>'
        : `<ul class="bill-list">${unpaid.map((b) => {
          const d = sisaHari(b.due, TODAY);
          const when = d < 0 ? `Terlambat ${-d} hari` : d === 0 ? 'Jatuh tempo hari ini' : `${d} hari lagi`;
          return `<li><div><strong>${escapeHtml(b.name)}</strong><span class="muted">${tanggalId(b.due)} · ${when}</span></div><strong>${rupiah(b.amount)}</strong></li>`;
        }).join('')}</ul>`}
      <div class="card-head"><h2>Transaksi terbaru</h2><a href="#/transaksi">Semua transaksi →</a></div>
      <ul class="tx-list">${recent.map((t) => {
        const c = categoryById(state, t.cat);
        return `<li><span class="cat-icon sm" style="background:${c ? c.color : '#888'}1a" aria-hidden="true">${c ? c.icon : '•'}</span><div><strong>${escapeHtml(t.desc)}</strong><span class="muted">${tanggalSingkat(t.date)} · ${c ? c.name : ''}</span></div><strong class="neg">−${rupiah(t.amount)}</strong></li>`;
      }).join('')}</ul>
    </div>
  </section>

  <section class="card">
    <div class="card-head"><h2>Target tabungan keluarga</h2><a href="#/tabungan">Kelola tabungan →</a></div>
    <div class="goals-grid">${state.goals.map((g) => `
      <div class="goal-mini"><span class="goal-icon" aria-hidden="true">${g.icon}</span>
        <div><strong>${g.name}</strong><span class="muted">${rupiah(g.saved)} dari ${rupiah(g.target)}</span>
        ${progressBar(pct(g.saved, g.target), '#0e7a5f', g.name)}</div>
        <strong>${pct(g.saved, g.target)}%</strong>
      </div>`).join('')}
    </div>
  </section>`;
}

export function viewAnggaran(state) {
  const byCat = spentByCategory(state);
  const income = totalIncome(state);
  const budget = totalBudget(state);
  const spent = totalSpent(state);
  return `
  <section class="page-head">
    <h1>Anggaran ${HOUSEHOLD.month}</h1>
    <p class="lede">Total anggaran ${rupiah(budget)} dari pemasukan ${rupiah(income)} — ${pct(budget, income)}% pemasukan sudah dialokasikan. Sisa ${rupiah(income - budget)} langsung masuk tabungan begitu gajian tiba.</p>
  </section>
  <section class="stats">
    ${statCard('Total anggaran', rupiah(budget), `${pct(budget, income)}% dari pemasukan`, 'green')}
    ${statCard('Terpakai', rupiah(spent), `${pct(spent, budget)}% dari anggaran`, 'orange')}
    ${statCard('Sisa anggaran', rupiah(Math.max(0, budget - spent)), 'Untuk 4 hari terakhir bulan ini', 'teal')}
  </section>
  <section class="card">
    <div class="card-head"><h2>Per kategori — klik Ubah untuk menyesuaikan</h2><span class="muted small">${state.categories.length} kategori</span></div>
    <div class="cat-list">
      ${state.categories.map((c) => {
        const s = byCat[c.id] || 0;
        const p = pct(s, c.budget);
        const over = s > c.budget;
        return `<div class="cat-row edit">
          <span class="cat-icon" style="background:${c.color}1a;color:${c.color}" aria-hidden="true">${c.icon}</span>
          <div class="cat-main">
            <div class="cat-head"><strong>${c.name}</strong>${over ? `<span class="tag over">Lewat ${rupiah(s - c.budget)}</span>` : `<span class="tag ok">Sisa ${rupiah(c.budget - s)}</span>`}</div>
            <div class="cat-nums"><span>${rupiah(s)} dari ${rupiah(c.budget)}</span><span>${p}%</span></div>
            ${progressBar(p, c.color, c.name)}
          </div>
          <label class="budget-edit">Anggaran <span class="input-wrap"><span>Rp</span><input type="number" min="0" step="50000" value="${c.budget}" data-budget-for="${c.id}" aria-label="Anggaran ${c.name}"></span></label>
        </div>`;
      }).join('')}
    </div>
    <p class="muted small">Mengubah angka anggaran langsung memperbarui Beranda dan Laporan. Perubahan tersimpan di peramban Anda.</p>
  </section>
  <section class="card tip-card">
    <h2>Aturan 50/30/20 untuk keluarga ini</h2>
    <p>Dari pemasukan ${rupiah(income)}: kebutuhan ${rupiah(income * 0.5)}, keinginan ${rupiah(income * 0.3)}, tabungan ${rupiah(income * 0.2)}. Anggaran bulan ini ${rupiah(budget)} — coba hitung pembagian ideal Anda di <a href="#/kalkulator">Kalkulator</a>.</p>
  </section>`;
}

export function viewTransaksi(state, filter) {
  const cats = state.categories;
  let list = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
  if (filter && filter !== 'semua') list = list.filter((t) => t.cat === filter);
  const total = list.reduce((s, t) => s + t.amount, 0);
  return `
  <section class="page-head">
    <h1>Transaksi ${HOUSEHOLD.month}</h1>
    <p class="lede">${state.transactions.length} pengeluaran tercatat, total ${rupiah(totalSpent(state))}. Setiap rupiah yang keluar ada catatannya.</p>
  </section>
  <section class="grid-form">
    <form class="card form-card" id="tx-form">
      <h2>Catat pengeluaran baru</h2>
      <label>Tanggal <input type="date" name="date" value="2026-11-26" required></label>
      <label>Keterangan <input type="text" name="desc" placeholder="cth: Belanja pasar — sayur &amp; ayam" maxlength="80" required></label>
      <label>Kategori <select name="cat">${cats.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select></label>
      <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="500" placeholder="150000" required></label>
      <button class="btn primary" type="submit">Simpan transaksi</button>
      <p class="form-note" id="tx-note" role="status"></p>
    </form>
    <div class="card">
      <div class="card-head"><h2>Daftar transaksi</h2>
        <label class="filter">Filter <select id="tx-filter">
          <option value="semua">Semua kategori</option>
          ${cats.map((c) => `<option value="${c.id}"${filter === c.id ? ' selected' : ''}>${c.name}</option>`).join('')}
        </select></label>
      </div>
      <p class="muted small">Menampilkan ${list.length} transaksi · total ${rupiah(total)}</p>
      <ul class="tx-list full">${list.map((t) => {
        const c = categoryById(state, t.cat);
        return `<li><span class="cat-icon sm" style="background:${c ? c.color : '#888'}1a" aria-hidden="true">${c ? c.icon : '•'}</span><div><strong>${escapeHtml(t.desc)}</strong><span class="muted">${tanggalId(t.date)} · ${c ? c.name : ''}</span></div><strong class="neg">−${rupiah(t.amount)}</strong></li>`;
      }).join('') || '<li class="empty">Belum ada transaksi pada kategori ini.</li>'}</ul>
    </div>
  </section>`;
}

export function viewTagihan(state) {
  const sorted = [...state.bills].sort((a, b) => (a.due < b.due ? -1 : 1));
  const unpaid = unpaidBills(state);
  const paidTotal = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  return `
  <section class="page-head">
    <h1>Tagihan ${HOUSEHOLD.month}</h1>
    <p class="lede">${state.bills.length} tagihan rutin bulan ini. Sudah dibayar ${rupiah(paidTotal)}, masih menunggu ${rupiah(unpaidBillsTotal(state))} dari ${unpaid.length} tagihan.</p>
  </section>
  <section class="stats">
    ${statCard('Sudah dibayar', rupiah(paidTotal), `${state.bills.length - unpaid.length} dari ${state.bills.length} tagihan`, 'green')}
    ${statCard('Menunggu dibayar', rupiah(unpaidBillsTotal(state)), `${unpaid.length} tagihan`, 'red')}
    ${statCard('Tagihan terbesar', rupiah(Math.max(...state.bills.map((b) => b.amount))), 'Cicilan motor — 27 November', 'orange')}
  </section>
  <section class="card">
    <div class="card-head"><h2>Semua tagihan — centang saat sudah dibayar</h2><span class="muted small">Diurutkan dari jatuh tempo terdekat</span></div>
    <ul class="bill-list full">${sorted.map((b) => {
      const d = sisaHari(b.due, TODAY);
      const when = b.paid ? 'Lunas' : d < 0 ? `Terlambat ${-d} hari` : d === 0 ? 'Jatuh tempo hari ini' : `${d} hari lagi`;
      return `<li class="${b.paid ? 'paid' : ''}">
        <label class="bill-check"><input type="checkbox" data-bill="${b.id}"${b.paid ? ' checked' : ''} aria-label="Tandai ${escapeHtml(b.name)} sudah dibayar"><span class="check-ui" aria-hidden="true">${b.paid ? '✓' : ''}</span></label>
        <div class="bill-main"><strong>${escapeHtml(b.name)}</strong><span class="muted">${escapeHtml(b.note)} · jatuh tempo ${tanggalId(b.due)}</span></div>
        <div class="bill-right"><strong>${rupiah(b.amount)}</strong><span class="tag ${b.paid ? 'ok' : d <= 2 ? 'over' : 'warn'}">${when}</span></div>
      </li>`;
    }).join('')}</ul>
    <p class="muted small">Menandai tagihan sebagai lunas langsung mengurangi total “menunggu dibayar” di Beranda. Perubahan tersimpan di peramban Anda.</p>
  </section>`;
}

export function viewTabungan(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="page-head">
    <h1>Tabungan &amp; Tujuan Keluarga</h1>
    <p class="lede">Total terkumpul ${rupiah(totalSaved)} dari target ${rupiah(totalTarget)} (${pct(totalSaved, totalTarget)}%). Setor rutin tiap gajian — sedikit demi sedikit, lama-lama jadi bukit.</p>
  </section>
  <section class="stats">
    ${statCard('Total tabungan', rupiah(totalSaved), `${state.goals.length} tujuan aktif`, 'green')}
    ${statCard('Dana darurat', rupiah(state.goals[0].saved), `Target ${rupiah(state.goals[0].target)} — ${pct(state.goals[0].saved, state.goals[0].target)}%`, 'teal')}
    ${statCard('Setoran rutin', rupiah(2450000), 'Tiap tanggal 1, otomatis dari gaji', 'orange')}
  </section>
  <section class="goals-list">
    ${state.goals.map((g) => `
    <article class="card goal-card">
      <div class="goal-head"><span class="goal-icon lg" aria-hidden="true">${g.icon}</span>
        <div><h2>${g.name}</h2><p class="muted">${g.note}</p></div>
        <strong class="goal-pct">${pct(g.saved, g.target)}%</strong>
      </div>
      <div class="goal-nums"><span>Terkumpul <strong>${rupiah(g.saved)}</strong></span><span>Target <strong>${rupiah(g.target)}</strong></span><span>Kurang <strong>${rupiah(Math.max(0, g.target - g.saved))}</strong></span></div>
      ${progressBar(pct(g.saved, g.target), '#0e7a5f', g.name)}
      <form class="deposit-form" data-goal="${g.id}">
        <label>Setor tabungan <span class="input-wrap"><span>Rp</span><input type="number" name="amount" min="10000" step="10000" placeholder="250000" required aria-label="Jumlah setoran ${g.name}"></span></label>
        <button class="btn primary" type="submit">Setor</button>
        <span class="form-note" role="status"></span>
      </form>
    </article>`).join('')}
  </section>`;
}

export function viewLaporan(state) {
  const history = MONTHLY_HISTORY.map((m) => (m.month === 'Nov 2026' ? { ...m, spent: totalSpent(state) } : m));
  const avgSpent = Math.round(history.reduce((s, m) => s + m.spent, 0) / history.length);
  const best = history.reduce((a, b) => (b.spent < a.spent ? b : a));
  const worst = history.reduce((a, b) => (b.spent > a.spent ? b : a));
  const byCat = spentByCategory(state);
  const topCats = [...state.categories]
    .map((c) => ({ ...c, spent: byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);
  return `
  <section class="page-head">
    <h1>Laporan 6 Bulan Terakhir</h1>
    <p class="lede">Juni–November 2026. Rata-rata pengeluaran ${rupiah(avgSpent)}/bulan dari pemasukan tetap ${rupiah(totalIncome(state))}. Bulan paling hemat: ${best.month} (${rupiah(best.spent)}).</p>
  </section>
  <section class="card">
    <div class="card-head"><h2>Pemasukan vs pengeluaran</h2><span class="legend-inline"><span class="dot" style="background:#0e7a5f"></span> Pemasukan <span class="dot" style="background:#c2703d"></span> Pengeluaran</span></div>
    ${barChart(history)}
    <p class="muted small">November 2026 masih berjalan (data sampai 26 November) — pengeluaran bulan ini ${rupiah(totalSpent(state))}, paling rendah dalam 6 bulan karena tidak ada pengeluaran tak terduga dan tagihan besar sudah dibayar di awal bulan.</p>
  </section>
  <section class="grid-2">
    <div class="card">
      <div class="card-head"><h2>Perbandingan bulanan</h2></div>
      <table class="report-table">
        <thead><tr><th>Bulan</th><th>Masuk</th><th>Keluar</th><th>Sisa</th></tr></thead>
        <tbody>${history.map((m) => `<tr><td>${m.month}</td><td>${rupiahShort(m.income)}</td><td>${rupiahShort(m.spent)}</td><td class="${m.income - m.spent >= 0 ? 'pos' : 'neg'}">${rupiahShort(m.income - m.spent)}</td></tr>`).join('')}</tbody>
      </table>
      <p class="muted small">Bulan paling boros: ${worst.month} (${rupiah(worst.spent)}) — ada biaya servis motor dan hajatan keluarga.</p>
    </div>
    <div class="card">
      <div class="card-head"><h2>Pengeluaran November per kategori</h2></div>
      <ol class="rank-list">${topCats.map((c, i) => `<li><span class="rank">${i + 1}</span><span class="cat-icon sm" style="background:${c.color}1a" aria-hidden="true">${c.icon}</span><div><strong>${c.name}</strong><span class="muted">${pct(c.spent, totalSpent(state))}% dari total keluar</span></div><strong>${rupiah(c.spent)}</strong></li>`).join('')}</ol>
    </div>
  </section>
  <section class="card insight">
    <h2>Yang bisa diperbaiki bulan depan</h2>
    <ul>
      <li><strong>Makan di Luar &amp; Jajan</strong> sudah ${rupiah(byCat.makan || 0)} dari anggaran ${rupiah(categoryById(state, 'makan').budget)}. Membawa bekal 2 hari lagi seminggu menghemat sekitar Rp130.000.</li>
      <li><strong>Transportasi</strong> naik karena ojek online. Berangkat 15 menit lebih pagi supaya bisa naik bus TransJakarta (Rp3.500 sekali jalan) menghemat sekitar Rp150.000/bulan.</li>
      <li><strong>Dana darurat</strong> baru ${pct(state.goals[0].saved, state.goals[0].target)}% dari target — prioritaskan setoran Rp500.000/bulan dari sisa anggaran Makan di Luar.</li>
    </ul>
  </section>`;
}

export function viewKalkulator(state) {
  const income = totalIncome(state);
  const monthlySpent = totalSpent(state);
  return `
  <section class="page-head">
    <h1>Kalkulator Anggaran Keluarga</h1>
    <p class="lede">Tiga hitungan yang paling sering dipakai keluarga: pembagian 50/30/20, dana darurat ideal, dan skor kesehatan budget. Semua dihitung langsung di halaman ini.</p>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Pembagian 50/30/20</h2>
      <p class="muted">Aturan klasik: 50% kebutuhan, 30% keinginan, 20% tabungan &amp; utang.</p>
      <label class="calc-label">Pemasukan bulanan keluarga (Rp)
        <input type="number" id="calc-income" min="0" step="100000" value="${income}">
      </label>
      <div class="split" id="calc-split">
        <div class="split-row"><span>🏠 Kebutuhan (50%)</span><strong id="calc-need">${rupiah(income * 0.5)}</strong></div>
        <div class="split-row"><span>🎉 Keinginan (30%)</span><strong id="calc-want">${rupiah(income * 0.3)}</strong></div>
        <div class="split-row"><span>💰 Tabungan (20%)</span><strong id="calc-save">${rupiah(income * 0.2)}</strong></div>
      </div>
      <p class="muted small">Untuk keluarga ini, tabungan ideal ${rupiah(income * 0.2)}/bulan — setoran rutin saat ini Rp2.450.000, sudah di bawah ideal Rp50.000 saja.</p>
    </div>
    <div class="card">
      <h2>Dana darurat ideal</h2>
      <p class="muted">Pengeluaran bulanan × jumlah bulan cadangan. Keluarga dengan anak idealnya 6 bulan.</p>
      <label class="calc-label">Pengeluaran bulan ini (Rp)
        <input type="number" id="calc-spent" min="0" step="100000" value="${monthlySpent}">
      </label>
      <label class="calc-label">Bulan cadangan
        <select id="calc-months"><option value="3">3 bulan (minimum)</option><option value="6" selected>6 bulan (keluarga)</option><option value="12">12 bulan (penghasilan tak tetap)</option></select>
      </label>
      <div class="split"><div class="split-row"><span>🛟 Dana darurat ideal</span><strong id="calc-emergency">${rupiah(monthlySpent * 6)}</strong></div>
      <div class="split-row"><span>Saat ini terkumpul</span><strong>${rupiah(state.goals[0].saved)}</strong></div>
      <div class="split-row"><span>Masih kurang</span><strong id="calc-gap">${rupiah(Math.max(0, monthlySpent * 6 - state.goals[0].saved))}</strong></div></div>
    </div>
  </section>
  <section class="card">
    <div class="card-head"><h2>Skor kesehatan budget keluarga</h2><span class="tag ok" id="health-score">Skor 78 / 100 — Sehat</span></div>
    <p>Dinilai dari 4 hal: rasio tabungan, pengeluaran vs anggaran, tagihan tepat waktu, dan dana darurat.</p>
    <ul class="health-list">
      <li><span>Rasio tabungan: ${pct(2450000, income)}% pemasukan <strong class="pos">Hampir ideal (target 20%)</strong></span><span class="score">20 / 25</span></li>
      <li><span>Pengeluaran ${pct(totalSpent(state), totalBudget(state))}% dari anggaran <strong class="pos">Terkendali</strong></span><span class="score">22 / 25</span></li>
      <li><span>Tagihan lunas tepat waktu ${state.bills.filter((b) => b.paid).length} dari ${state.bills.length} <strong class="pos">Tepat waktu</strong></span><span class="score">20 / 25</span></li>
      <li><span>Dana darurat ${pct(state.goals[0].saved, state.goals[0].target)}% dari target <strong>Perlu dikejar</strong></span><span class="score">16 / 25</span></li>
    </ul>
    <p class="muted small">Skor dihitung dari data bulan ini dan berubah otomatis saat Anda mencatat transaksi, membayar tagihan, atau menyetor tabungan.</p>
  </section>`;
}

export function viewPanduan() {
  return `
  <section class="page-head">
    <h1>Panduan Hemat untuk Keluarga</h1>
    <p class="lede">Enam kebiasaan yang benar-benar dipakai Keluarga Santoso — dengan angka hematnya, bukan sekadar nasihat.</p>
  </section>
  <section class="tips-grid">
    ${TIPS.map((t, i) => `<article class="card tip">
      <span class="tip-num">${i + 1}</span>
      <h2>${t.title}</h2>
      <p>${t.body}</p>
      <p class="tip-saving">${t.saving}</p>
    </article>`).join('')}
  </section>
  <section class="card">
    <h2>Cara memakai situs ini</h2>
    <ol class="howto">
      <li><strong>Beranda</strong> — lihat sisa uang dan tagihan yang menunggu, tiap pagi sebelum berangkat kerja.</li>
      <li><strong>Transaksi</strong> — catat setiap pengeluaran begitu terjadi; 30 detik saja, jangan ditunda sampai malam.</li>
      <li><strong>Anggaran</strong> — awal bulan, sesuaikan anggaran tiap kategori dengan rencana bulan itu.</li>
      <li><strong>Tagihan</strong> — centang tagihan begitu dibayar, supaya tidak ada yang terlewat dan kena denda.</li>
      <li><strong>Tabungan</strong> — setor begitu gajian masuk, sebelum uangnya sempat terpakai.</li>
      <li><strong>Laporan</strong> — akhir bulan, bandingkan dengan bulan lalu dan cari satu kategori yang bisa dipangkas.</li>
    </ol>
  </section>`;
}
