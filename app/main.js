// Router hash + wiring semua kontrol situs.
// Rute: #/ (beranda), #/anggaran, #/transaksi, #/tagihan, #/tabungan,
// #/laporan, #/kalkulator, #/panduan.

import { loadState, saveState, resetState, addTransaction, setBudget, toggleBillPaid, depositToGoal } from './store.js';
import { rupiah } from './format.js';
import {
  viewDashboard, viewAnggaran, viewTransaksi, viewTagihan,
  viewTabungan, viewLaporan, viewKalkulator, viewPanduan,
} from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('mainnav');
let state = loadState();
let txFilter = 'semua';

const ROUTES = {
  '': viewDashboard,
  anggaran: viewAnggaran,
  transaksi: (s) => viewTransaksi(s, txFilter),
  tagihan: viewTagihan,
  tabungan: viewTabungan,
  laporan: viewLaporan,
  kalkulator: viewKalkulator,
  panduan: viewPanduan,
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[hash] ? hash : '';
}

function render() {
  const route = currentRoute();
  const view = ROUTES[route];
  app.innerHTML = view(state);
  for (const a of nav.querySelectorAll('a')) {
    a.classList.toggle('active', a.dataset.route === route);
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
  wire(route);
}

function wire(route) {
  if (route === 'transaksi') {
    const form = document.getElementById('tx-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const amount = Number(data.get('amount'));
      const desc = String(data.get('desc') || '').trim();
      const date = String(data.get('date') || '2026-11-26');
      const cat = String(data.get('cat'));
      const note = document.getElementById('tx-note');
      if (!desc || !amount || amount < 1000) {
        note.textContent = 'Isi keterangan dan jumlah minimal Rp1.000.';
        return;
      }
      addTransaction(state, { date, desc, cat, amount });
      saveState(state);
      note.textContent = `Tersimpan: ${desc} — ${rupiah(amount)}.`;
      form.reset();
      form.querySelector('[name="date"]').value = '2026-11-26';
      render();
      document.getElementById('tx-note').textContent = `Tersimpan: ${desc} — ${rupiah(amount)}.`;
    });
    document.getElementById('tx-filter').addEventListener('change', (e) => {
      txFilter = e.target.value;
      render();
    });
  }

  if (route === 'anggaran') {
    for (const input of app.querySelectorAll('[data-budget-for]')) {
      input.addEventListener('change', () => {
        const value = Number(input.value);
        if (Number.isFinite(value) && value >= 0) {
          setBudget(state, input.dataset.budgetFor, value);
          saveState(state);
          render();
        }
      });
    }
  }

  if (route === 'tagihan') {
    for (const box of app.querySelectorAll('[data-bill]')) {
      box.addEventListener('change', () => {
        toggleBillPaid(state, Number(box.dataset.bill));
        saveState(state);
        render();
      });
    }
  }

  if (route === 'tabungan') {
    for (const form of app.querySelectorAll('.deposit-form')) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = Number(new FormData(form).get('amount'));
        const note = form.querySelector('.form-note');
        if (!amount || amount < 10000) {
          note.textContent = 'Minimal setor Rp10.000.';
          return;
        }
        const goalId = Number(form.dataset.goal);
        const goal = state.goals.find((g) => g.id === goalId);
        depositToGoal(state, goalId, amount);
        saveState(state);
        render();
        const again = document.querySelector(`.deposit-form[data-goal="${goalId}"] .form-note`);
        if (again && goal) again.textContent = `Setoran ${rupiah(amount)} masuk ke ${goal.name}. Total kini ${rupiah(goal.saved)}.`;
      });
    }
  }

  if (route === 'kalkulator') {
    const incomeInput = document.getElementById('calc-income');
    const spentInput = document.getElementById('calc-spent');
    const monthsSelect = document.getElementById('calc-months');
    const update = () => {
      const income = Math.max(0, Number(incomeInput.value) || 0);
      const spent = Math.max(0, Number(spentInput.value) || 0);
      const months = Number(monthsSelect.value) || 6;
      document.getElementById('calc-need').textContent = rupiah(income * 0.5);
      document.getElementById('calc-want').textContent = rupiah(income * 0.3);
      document.getElementById('calc-save').textContent = rupiah(income * 0.2);
      const ideal = spent * months;
      document.getElementById('calc-emergency').textContent = rupiah(ideal);
      document.getElementById('calc-gap').textContent = rupiah(Math.max(0, ideal - state.goals[0].saved));
    };
    incomeInput.addEventListener('input', update);
    spentInput.addEventListener('input', update);
    monthsSelect.addEventListener('change', update);
  }
}

document.getElementById('reset-data').addEventListener('click', () => {
  if (window.confirm('Kembalikan semua data ke contoh awal Keluarga Santoso? Perubahan Anda akan hilang.')) {
    state = resetState();
    render();
  }
});

window.addEventListener('hashchange', render);
render();
