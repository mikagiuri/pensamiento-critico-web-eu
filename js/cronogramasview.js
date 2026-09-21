"use strict";
/* ===== Cronogramas ===== depende de: data cronogramas.js (CRONOGRAMAS) =====
   Renderiza cada cronograma del libro (LTFH, euskera) como línea de tiempo SVG:
   carriles con rango de años (vidas/periodos) sobre un eje temporal, o secuencia de épocas. */

let cronoBlock = null;      // A / B / C / "otros"
let cronoId = null;
/* Título descriptivo: usa el override de cronogramas_titulos.js si existe, si no el del dato. */
function cronoTitle(c){ return (typeof CRONO_TITULOS !== "undefined" && CRONO_TITULOS[c.id]) || c.title; }

function cronoOf(code){ const ch = (code || "").trim().charAt(0).toUpperCase(); return "ABC".includes(ch) ? ch : "·"; }
function cronoBlocksPresent(){ return [...new Set(CRONOGRAMAS.map(c => cronoOf(c.code)))]; }
function cronoList(block){ return CRONOGRAMAS.filter(c => cronoOf(c.code) === block); }

const CRONO_BLOCK_NAME = { A: "Bloque A · Antigua y medieval", B: "Bloque B · Moderna", C: "C blokea · Garaikidea", "·": "Otros" };

/* ---------- año → texto (a.C. = antes de Cristo) ---------- */
function cronoYear(y){ if (y == null) return ""; return y < 0 ? (-y) + " a.C." : "" + y; }
function cronoRange(s, e){ if (s == null || e == null) return "";
  if (s < 0 && e < 0) return (-s) + "–" + (-e) + " a.C.";
  if (s < 0 && e >= 0) return (-s) + " a.C.–" + e;
  return s + "–" + e; }
function niceStep(span){ const steps = [10, 20, 25, 50, 100, 200, 250, 500, 1000];
  for (const s of steps) if (span / s <= 9) return s; return 1000; }

/* ---------- filtros ---------- */
function renderCronoFilter(){
  const box = document.getElementById("cronofilter"); if (!box) return;
  const present = cronoBlocksPresent();
  if (!present.includes(cronoBlock)) cronoBlock = present[0];
  box.innerHTML = '<span class="flabel">Blokea</span>' + present.map(b =>
    '<button class="cbtn" data-cblock="' + b + '" aria-pressed="' + (b === cronoBlock) + '">' + CRONO_BLOCK_NAME[b] + '</button>').join("");
  box.querySelectorAll("[data-cblock]").forEach(b => b.addEventListener("click", () => {
    cronoBlock = b.dataset.cblock; cronoId = null; renderCronoFilter(); renderCronoChips(); drawCrono();
  }));
}

function renderCronoChips(){
  const box = document.getElementById("cronochips"); if (!box) return;
  const list = cronoList(cronoBlock);
  if (!list.some(c => c.id === cronoId)) cronoId = list.length ? list[0].id : null;
  box.innerHTML = list.map(c =>
    '<button class="chip" data-crono="' + c.id + '" aria-pressed="' + (c.id === cronoId) + '">' + cronoTitle(c) + '</button>').join("");
  box.querySelectorAll("[data-crono]").forEach(b => b.addEventListener("click", () => { cronoId = b.dataset.crono; renderCronoChips(); drawCrono(); }));
}

/* ---------- dibujo ---------- */
function drawCrono(){
  const box = document.getElementById("cronobox"); if (!box) return;
  const c = CRONOGRAMAS.find(x => x.id === cronoId);
  if (!c){ box.innerHTML = '<p class="lead">Elige un cronograma.</p>'; return; }
  const span = (c.type === "timeline" && c.start != null && c.end != null) ? (cronoYear(c.start) + " – " + cronoYear(c.end)) : "";
  box.innerHTML = '<div class="crono-card"><div class="crono-h"><h2 class="crono-title">' + cronoTitle(c) + '</h2>' +
    (span ? '<span class="crono-span">' + span + '</span>' : '') + '</div>' +
    (c.type === "timeline" ? cronoSvg(c) : cronoEpochs(c)) + '</div>';
}

function cronoSvg(c){
  let axes = (c.axes || []).filter(a => a.name);
  let start = c.start, end = c.end;
  // encuadrar por si la escala no cubre todos los carriles
  axes.forEach(a => { if (a.start != null) start = Math.min(start, a.start); if (a.end != null) end = Math.max(end, a.end); });
  if (start == null || end == null || end <= start){ return '<p class="lead">—</p>'; }
  // orden cronológico (por año de inicio, luego de fin): la línea se lee de arriba a abajo en el tiempo
  const key = v => (v == null ? 1e9 : v);
  axes = axes.slice().sort((a, b) => key(a.start) - key(b.start) || key(a.end) - key(b.end));

  const W = 960, gutter = 186, padR = 26, padTop = 40, rowH = 30, barH = 18;
  const H = padTop + axes.length * rowH + 16;
  const x0 = gutter, x1 = W - padR;
  const xOf = y => x0 + (y - start) / (end - start) * (x1 - x0);

  let svg = '<svg class="crono-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + cronoTitle(c).replace(/"/g, "") + '">';
  // bandas alternas por periodo + rejilla + años (orientación temporal)
  const step = niceStep(end - start);
  const first = Math.ceil(start / step) * step;
  let band = 0;
  for (let y = first; y <= end; y += step){
    const x = xOf(y), xPrev = Math.max(x0, xOf(y - step));
    if (band % 2 === 0 && x - xPrev > 0)
      svg += '<rect class="band" x="' + xPrev.toFixed(1) + '" y="' + (padTop - 8) + '" width="' + (x - xPrev).toFixed(1) + '" height="' + (H - padTop) + '"/>';
    band++;
    svg += '<line class="grid" x1="' + x.toFixed(1) + '" y1="' + (padTop - 8) + '" x2="' + x.toFixed(1) + '" y2="' + (H - 8) + '"/>';
    svg += '<text class="tick-lbl" x="' + x.toFixed(1) + '" y="' + (padTop - 12) + '" text-anchor="middle">' + cronoYear(y) + '</text>';
  }
  // línea del año 0 si el rango la cruza
  if (start < 0 && end > 0){ const xz = xOf(0); svg += '<line class="zero" x1="' + xz.toFixed(1) + '" y1="' + (padTop - 8) + '" x2="' + xz.toFixed(1) + '" y2="' + (H - 8) + '"/>'; }

  const colors = ["var(--accent)", "var(--accent-2)", "var(--fil)", "var(--hf)", "var(--ipc)"];
  axes.forEach((a, i) => {
    const y = padTop + i * rowH;
    svg += '<rect class="lane-bg" x="0" y="' + (y + (rowH - barH) / 2 - 2) + '" width="' + W + '" height="' + (barH + 4) + '" rx="4" opacity="' + (i % 2 ? ".5" : ".22") + '"/>';
    const nm = a.name.length > 26 ? a.name.slice(0, 25) + "…" : a.name;
    svg += '<text class="lane-lbl" x="8" y="' + (y + rowH / 2 + 4) + '">' + escapeCrono(nm) + '</text>';
    if (a.start != null && a.end != null && a.end >= a.start){
      const bx = xOf(a.start), bw = Math.max(4, xOf(a.end) - xOf(a.start));
      svg += '<rect class="bar" x="' + bx.toFixed(1) + '" y="' + (y + (rowH - barH) / 2) + '" width="' + bw.toFixed(1) + '" height="' + barH + '" rx="6" fill="' + colors[i % colors.length] + '"/>';
      // años SIEMPRE visibles: a la derecha de la barra, o a la izquierda si no cabe (nunca recortados)
      const lbl = cronoYear(a.start) + '–' + cronoYear(a.end), lblW = lbl.length * 6;
      const yr = y + rowH / 2 + 4, rx = xOf(a.end) + 6;
      if (rx + lblW <= W - 2)
        svg += '<text class="bar-yr" x="' + rx.toFixed(1) + '" y="' + yr + '" text-anchor="start">' + lbl + '</text>';
      else
        svg += '<text class="bar-yr" x="' + (bx - 6).toFixed(1) + '" y="' + yr + '" text-anchor="end">' + lbl + '</text>';
    } else if (a.start != null){
      svg += '<circle cx="' + xOf(a.start).toFixed(1) + '" cy="' + (y + rowH / 2) + '" r="5" fill="' + colors[i % colors.length] + '"/>';
      svg += '<text class="bar-yr" x="' + (xOf(a.start) + 9).toFixed(1) + '" y="' + (y + rowH / 2 + 4) + '" text-anchor="start">' + cronoYear(a.start) + '</text>';
    }
  });
  svg += '</svg>';
  return svg;
}

function cronoEpochs(c){
  return '<div class="crono-epochs">' + (c.stages || []).map(s =>
    '<div class="epoch"><div class="ep-label">' + escapeCrono(s.label) + '</div><div class="ep-text">' + escapeCrono(s.text) + '</div></div>').join("") + '</div>';
}

function escapeCrono(s){ return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* ---------- init ---------- */
function initCrono(){ if (typeof CRONOGRAMAS === "undefined") return; renderCronoFilter(); renderCronoChips(); drawCrono(); }
document.addEventListener("DOMContentLoaded", initCrono);
(function(){ const nav = document.getElementById("tabs"); if (nav) nav.addEventListener("click", e => {
  const b = e.target.closest("button"); if (b && b.dataset.view === "cronogramas") initCrono();
}); })();
