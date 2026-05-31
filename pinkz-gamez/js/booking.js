/* ============================================================
   PINKZ GAMEZ — booking.js
   Form logic, price calculation, WhatsApp redirect
   ============================================================ */

const PRICES = { ps4: 15000, ps5: 20000 };
const WA_NUMBER = '6285117288975';

// ── DOM refs ──────────────────────────────────────────────
const form      = document.getElementById('booking-form');
const inpNama   = document.getElementById('inp-nama');
const inpWa     = document.getElementById('inp-wa');
const inpTgl    = document.getElementById('inp-tgl');
const selUnit   = document.getElementById('sel-unit');
const selJam    = document.getElementById('sel-jam');
const selDurasi = document.getElementById('sel-durasi');

// Summary elements
const sumNama   = document.getElementById('sum-nama');
const sumUnit   = document.getElementById('sum-unit');
const sumTgl    = document.getElementById('sum-tgl');
const sumJam    = document.getElementById('sum-jam');
const sumDurasi = document.getElementById('sum-durasi');
const sumTotal  = document.getElementById('sum-total');

// ── Pre-fill unit from URL param ──────────────────────────
(function () {
  const params = new URLSearchParams(window.location.search);
  const unit = params.get('unit');
  if (unit && selUnit) {
    const opt = selUnit.querySelector(`option[value="${unit}"]`);
    if (opt) selUnit.value = unit;
  }
})();

// ── Set min date to today ─────────────────────────────────
if (inpTgl) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  inpTgl.min = `${yyyy}-${mm}-${dd}`;
  inpTgl.value = `${yyyy}-${mm}-${dd}`;
}

// ── Format rupiah ─────────────────────────────────────────
function toRupiah(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// ── Format date Indonesia ─────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ── Calculate end time ────────────────────────────────────
function hitungSelesai(jamMulai, durasi) {
  if (!jamMulai || !durasi) return '—';
  const [h, m] = jamMulai.split(':').map(Number);
  const totalMenit = h * 60 + m + durasi * 60;
  const jam  = Math.floor(totalMenit / 60) % 24;
  const mnt  = totalMenit % 60;
  return `${String(jam).padStart(2,'0')}:${String(mnt).padStart(2,'0')}`;
}

// ── Update summary ────────────────────────────────────────
function updateSummary() {
  const nama   = inpNama?.value.trim() || '—';
  const unit   = selUnit?.value  || '';
  const tgl    = inpTgl?.value   || '';
  const jam    = selJam?.value   || '';
  const durasi = parseInt(selDurasi?.value || '0');
  const harga  = PRICES[unit] || 0;
  const total  = harga * durasi;

  if (sumNama)   sumNama.textContent   = nama || '—';
  if (sumUnit)   sumUnit.textContent   = unit ? unit.toUpperCase() : '—';
  if (sumTgl)    sumTgl.textContent    = formatDate(tgl);
  if (sumDurasi) sumDurasi.textContent = durasi ? `${durasi} jam (selesai ~${hitungSelesai(jam, durasi)})` : '—';
  if (sumJam)    sumJam.textContent    = jam || '—';
  if (sumTotal)  sumTotal.textContent  = total > 0 ? toRupiah(total) : '—';
}

// ── Attach listeners ──────────────────────────────────────
[inpNama, inpWa, inpTgl, selUnit, selJam, selDurasi].forEach(el => {
  el?.addEventListener('input', updateSummary);
  el?.addEventListener('change', updateSummary);
});
updateSummary();

// ── Validate ──────────────────────────────────────────────
function validate() {
  const errors = [];
  if (!inpNama?.value.trim())  errors.push('Nama lengkap harus diisi.');
  if (!inpWa?.value.trim())    errors.push('Nomor WhatsApp harus diisi.');
  if (!inpTgl?.value)          errors.push('Tanggal booking harus diisi.');
  if (!selUnit?.value)         errors.push('Pilih unit (PS4 atau PS5).');
  if (!selJam?.value)          errors.push('Jam mulai harus dipilih.');
  if (!selDurasi?.value || selDurasi.value === '0') errors.push('Durasi harus dipilih.');
  return errors;
}

// ── Show error ────────────────────────────────────────────
function showError(msg) {
  let el = document.getElementById('booking-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'booking-error';
    el.style.cssText = `
      background: rgba(255,61,127,0.1);
      border: 1px solid var(--pink);
      border-radius: var(--radius);
      padding: 14px 18px;
      font-size: 14px;
      color: var(--text);
      margin-bottom: 24px;
    `;
    form.prepend(el);
  }
  el.innerHTML = msg.map(m => `• ${m}`).join('<br>');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function clearError() {
  const el = document.getElementById('booking-error');
  if (el) el.remove();
}

// ── Submit → WhatsApp ─────────────────────────────────────
form?.addEventListener('submit', e => {
  e.preventDefault();
  clearError();

  const errors = validate();
  if (errors.length) { showError(errors); return; }

  const nama   = inpNama.value.trim();
  const wa     = inpWa.value.trim();
  const tgl    = formatDate(inpTgl.value);
  const unit   = selUnit.value.toUpperCase();
  const jam    = selJam.value;
  const durasi = parseInt(selDurasi.value);
  const harga  = PRICES[selUnit.value] || 0;
  const total  = toRupiah(harga * durasi);
  const selesai = hitungSelesai(selJam.value, durasi);

  const pesan = [
    `Halo admin Pinkz Gamez! 👾`,
    ``,
    `Saya mau booking unit berikut:`,
    ``,
    `📋 *Detail Booking*`,
    `• Nama      : ${nama}`,
    `• No. WA    : ${wa}`,
    `• Tanggal   : ${tgl}`,
    `• Unit      : ${unit}`,
    `• Jam Mulai : ${jam} WIB`,
    `• Durasi    : ${durasi} jam`,
    `• Selesai   : ~${selesai} WIB`,
    `• Total Est.: ${total}`,
    ``,
    `Mohon konfirmasi ketersediaan unitnya ya, terima kasih! 🙏`,
  ].join('\n');

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;
  window.open(url, '_blank');
});
