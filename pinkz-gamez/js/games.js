/* ── Pinkz Gamez · games.js
   Data dari Google Sheets, gambar dari Google Drive
   ─────────────────────────────────────────────────
   CARA SETUP:
   1. Buat Google Sheet, isi kolom: title | genre | platform | img
   2. Share Sheet → "Anyone with link" → Viewer
   3. Copy Sheet ID dari URL: docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   4. Paste di bawah sebagai SHEET_ID
   5. Untuk gambar: upload ke Google Drive folder publik
      → klik kanan file → "Get link" → copy File ID dari link
      → format URL: https://drive.google.com/thumbnail?id=[FILE_ID]&sz=w400
      → paste URL itu ke kolom "img" di Sheet kamu
*/

// URL publish CSV dari Google Sheets kamu
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwFlZAs_6Ryy0htWcv11ZcpepNGVCBnfcLu64YTQc5UnRt__By3ZkEKmMHEIY8CR8zM2wOdAFomYCZ/pub?gid=0&single=true&output=csv';

// Fallback ke data lokal kalau Sheet belum diisi
const FALLBACK_GAMES = [];

let allGames = [];
let filtered  = [];

async function loadGames() {
  showLoading();
  try {
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    // Parse CSV
    const lines = text.trim().split('\n').slice(1); // skip header row
    allGames = lines
      .filter(line => line.trim())
      .map(line => {
        // Handle CSV with possible commas in quoted fields
        const cols = [];
        let current = '';
        let inQuotes = false;
        for (const char of line) {
          if (char === '"') { inQuotes = !inQuotes; }
          else if (char === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
          else { current += char; }
        }
        cols.push(current.trim());
        return {
          title:    cols[0]?.replace(/^"|"$/g, '') || '',
          genre:    cols[1]?.replace(/^"|"$/g, '') || 'Other',
          platform: cols[2]?.replace(/^"|"$/g, '') || 'PS4/PS5',
          img:      cols[3]?.replace(/^"|"$/g, '') || ''
        };
      })
      .filter(g => g.title);
    if (!allGames.length) throw new Error('Sheet kosong');
  } catch(e) {
    // Fallback ke data lokal
    allGames = FALLBACK_GAMES;
  }
  buildGenreFilters();
  applyFilter('Semua');
}

function buildGenreFilters() {
  const genres = ['Semua', ...new Set(allGames.map(g => g.genre).sort())];
  const wrap = document.getElementById('genre-filters');
  if (!wrap) return;
  wrap.innerHTML = genres.map(g =>
    `<button class="genre-btn${g==='Semua'?' active':''}" data-genre="${g}">${g}</button>`
  ).join('');
  wrap.querySelectorAll('.genre-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.genre);
    });
  });
}

function applyFilter(genre) {
  const q = (document.getElementById('games-search')?.value || '').toLowerCase();
  const sort = document.getElementById('games-sort')?.value || 'newest';
  filtered = allGames.filter(g =>
    (genre === 'Semua' || g.genre === genre) &&
    g.title.toLowerCase().includes(q)
  );
  if (sort === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
  else if (sort === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));
  renderGames();
}

function renderGames() {
  const grid = document.getElementById('games-grid');
  const count = document.getElementById('games-count');
  if (count) count.textContent = `${filtered.length} game`;
  if (!filtered.length) {
    grid.innerHTML = `
      <div class="games-empty" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
        <p>Game tidak ditemukan</p>
      </div>`;
    return;
  }
  grid.innerHTML = filtered.map(g => {
    // Deteksi apakah img adalah URL atau path lokal
    const imgSrc = g.img
      ? (g.img.startsWith('http') ? g.img : g.img)
      : null;
    const platformClass = g.platform.includes('PS5') && g.platform.includes('PS4')
      ? 'both' : g.platform.includes('PS5') ? 'ps5' : 'ps4';
    return `
    <div class="game-card">
      <div class="game-cover">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${g.title}" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\\'game-cover-placeholder\\'><svg viewBox=\\'0 0 24 24\\'><path d=\\'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 10 18.5 10s1.5.67 1.5 1.5S19.33 12 18.5 12z\\'/></svg><span>${g.title}</span></div>'">`
          : `<div class="game-cover-placeholder">
               <svg viewBox="0 0 24 24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 10 18.5 10s1.5.67 1.5 1.5S19.33 12 18.5 12z"/></svg>
               <span>${g.title}</span>
             </div>`
        }
        <div class="game-platform-badge ${platformClass}">${g.platform}</div>
      </div>
      <div class="game-info">
        <div class="game-title">${g.title}</div>
        <div class="game-genre">${g.genre}</div>
      </div>
    </div>`;
  }).join('');
}

function showLoading() {
  document.getElementById('games-grid').innerHTML =
    '<div class="games-loading" style="grid-column:1/-1"><div class="spinner"></div></div>';
}

document.addEventListener('DOMContentLoaded', () => {
  loadGames();
  document.getElementById('games-search')?.addEventListener('input', () => {
    const activeGenre = document.querySelector('.genre-btn.active')?.dataset.genre || 'Semua';
    applyFilter(activeGenre);
  });
  document.getElementById('games-sort')?.addEventListener('change', () => {
    const activeGenre = document.querySelector('.genre-btn.active')?.dataset.genre || 'Semua';
    applyFilter(activeGenre);
  });
});
