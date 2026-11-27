// State situs: data contoh + perubahan pengguna, tersimpan lokal di peramban.
// Tidak ada data yang pernah dikirim ke jaringan.

import { CATEGORIES, TRANSACTIONS, BILLS, SAVINGS_GOALS, HOUSEHOLD } from './data.js';

const KEY = 'dompet-keluarga-v1';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function defaultState() {
  return {
    income: clone(HOUSEHOLD.income),
    categories: clone(CATEGORIES),
    transactions: clone(TRANSACTIONS),
    bills: clone(BILLS),
    goals: clone(SAVINGS_GOALS),
  };
}

let memoryState = null;

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.categories)) return parsed;
    }
  } catch {
    // localStorage tidak tersedia (mis. mode privat ketat): pakai memori saja.
  }
  if (!memoryState) memoryState = defaultState();
  return memoryState;
}

export function saveState(state) {
  memoryState = state;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Gagal menyimpan lokal bukan kesalahan fatal: data tetap di memori sesi ini.
  }
}

export function resetState() {
  const fresh = defaultState();
  saveState(fresh);
  return fresh;
}

// ---- Hitungan turunan: semua total dihitung dari data, bukan dihafal. ----

export function totalIncome(state) {
  return state.income.reduce((s, x) => s + x.amount, 0);
}

export function spentByCategory(state) {
  const map = {};
  for (const c of state.categories) map[c.id] = 0;
  for (const t of state.transactions) {
    if (map[t.cat] === undefined) map[t.cat] = 0;
    map[t.cat] += t.amount;
  }
  return map;
}

export function totalSpent(state) {
  return state.transactions.reduce((s, t) => s + t.amount, 0);
}

export function totalBudget(state) {
  return state.categories.reduce((s, c) => s + c.budget, 0);
}

export function unpaidBills(state) {
  return state.bills.filter((b) => !b.paid);
}

export function unpaidBillsTotal(state) {
  return unpaidBills(state).reduce((s, b) => s + b.amount, 0);
}

export function categoryById(state, id) {
  return state.categories.find((c) => c.id === id);
}

export function addTransaction(state, { date, desc, cat, amount }) {
  const nextId = state.transactions.reduce((m, t) => Math.max(m, t.id), 0) + 1;
  state.transactions.unshift({ id: nextId, date, desc, cat, amount });
  return state;
}

export function setBudget(state, catId, budget) {
  const cat = categoryById(state, catId);
  if (cat) cat.budget = Math.max(0, Math.round(budget));
  return state;
}

export function toggleBillPaid(state, billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (bill) bill.paid = !bill.paid;
  return state;
}

export function depositToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (goal && amount > 0) goal.saved = Math.min(goal.target, goal.saved + Math.round(amount));
  return state;
}
