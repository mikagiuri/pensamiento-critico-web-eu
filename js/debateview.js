"use strict";
/* ===== Juego «El Ágora» (debate) ===== depende de: juego_debate.js, store.js =====
   Cada debate: eliges tesis → por rondas, el rival argumenta → detectas si hay
   falacia → construyes tu réplica evitando falacias. Un jurado (0-100) se mueve
   según tus aciertos. Se guarda tu mejor marca por tesis en este navegador. */
const DEB_KEY = "aula-debate-best";
const DEB_TXT = {
  subtitulo: "Convence al jurado sin usar falacias… y detecta las del rival.",
  elige: "Elige tu debate",
  rondas: "rondas",
  jurado: "Jurado a tu favor",
  tieneFalacia: "🔍 Contiene una falacia",
  esValido: "✅ Es un argumento válido",
  acertaste: "¡Acertaste!",
  fallaste: "No era así.",
  eraValido: "Era un argumento válido.",
  teniaFalacia: "Contenía una falacia:",
  tuReplica: "Ahora tu réplica: elige un argumento.",
  replicaLimpia: "Argumento limpio: el jurado te da la razón.",
  replicaFalaz: "Has caído en una falacia y el jurado lo nota:",
  siguiente: "Siguiente ronda →",
  verResultado: "Ver el resultado →",
  convences: "Convences al jurado",
  debateAjustado: "Debate ajustado",
  rivalConvence: "El rival convence al jurado",
  detectadas: "falacias detectadas",
  cometidas: "falacias propias",
  mejor: "tu mejor marca",
  otraVez: "Repetir este debate",
  otroTema: "Elegir otro debate",
  jugarDeNuevo: "Volver a jugar"
};

const DEB = { deck: null, round: 0, jurado: 50, detectadas: 0, cometidas: 0, phase: 0, ended: false };
function debBox(){ return document.getElementById("debbox"); }
function debEsc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function debClamp(n){ return Math.max(0, Math.min(100, n)); }

/* ---------- portada: elegir debate ---------- */
function renderDebStart(){
  const box = debBox(); if (!box) return;
  const best = store.get(DEB_KEY, {});
  const cards = DEBATE_DECKS.map(d =>
    '<button class="deb-card" data-deck="' + d.id + '">' +
      '<span class="deb-emoji" aria-hidden="true">' + d.emoji + '</span>' +
      '<span class="deb-card-t">' + debEsc(d.nombre) + '</span>' +
      '<span class="deb-card-tesis">' + debEsc(d.tesis) + '</span>' +
      '<span class="deb-badge">' + d.rondas.length + ' ' + DEB_TXT.rondas + (best[d.id] != null ? ' · ' + DEB_TXT.mejor + ' ' + best[d.id] + ' %' : '') + '</span>' +
    '</button>').join("");
  box.innerHTML = '<div class="deb-wrap">' +
    '<p class="deb-sub">' + DEB_TXT.subtitulo + '</p>' +
    '<h2 class="deb-h2">' + DEB_TXT.elige + '</h2>' +
    '<div class="deb-grid">' + cards + '</div></div>';
  box.querySelectorAll("[data-deck]").forEach(b => b.addEventListener("click", () => debStart(b.dataset.deck)));
}

/* ---------- partida ---------- */
function debStart(id){
  const d = DEBATE_DECKS.find(x => x.id === id); if (!d) return;
  DEB.deck = d; DEB.round = 0; DEB.jurado = 50; DEB.detectadas = 0; DEB.cometidas = 0; DEB.phase = 0; DEB.ended = false;
  debRenderRonda();
}

function debHud(){
  const pct = DEB.jurado, tone = pct >= 65 ? "good" : (pct <= 35 ? "bad" : "");
  return '<div class="deb-hud">' +
    '<div class="deb-hud-top"><span class="deb-tema">' + DEB.deck.emoji + ' ' + debEsc(DEB.deck.nombre) + '</span>' +
      '<span class="deb-num">' + DEB_TXT.rondas + ' ' + (DEB.round + 1) + '/' + DEB.deck.rondas.length + '</span></div>' +
    '<div class="deb-meter"><span class="deb-meter-label">' + DEB_TXT.jurado + ': <b>' + DEB.jurado + ' %</b></span>' +
      '<span class="deb-bar"><span class="deb-fill ' + tone + '" style="width:' + pct + '%"></span></span></div>' +
    '<div class="deb-stats"><span>🔍 ' + DEB.detectadas + ' ' + DEB_TXT.detectadas + '</span><span>⚠️ ' + DEB.cometidas + ' ' + DEB_TXT.cometidas + '</span></div>' +
  '</div>';
}

function debRenderRonda(){
  const d = DEB.deck, r = d.rondas[DEB.round]; DEB.phase = 0;
  debBox().innerHTML = '<div class="deb-wrap">' + debHud() +
    '<div class="deb-tesis">Tesis: <b>' + debEsc(d.tesis) + '</b> <span class="deb-postura">' + debEsc(d.postura) + '</span></div>' +
    '<div class="deb-rival"><h3 class="deb-eyebrow">El rival argumenta</h3><p class="deb-rival-t">«' + debEsc(r.rival) + '»</p></div>' +
    '<p class="deb-ask">¿Contiene una falacia?</p>' +
    '<div class="deb-detect"><button class="deb-dbtn falaz" id="debDet1">' + DEB_TXT.tieneFalacia + '</button>' +
      '<button class="deb-dbtn valido" id="debDet0">' + DEB_TXT.esValido + '</button></div>' +
    '<div class="deb-res" id="debRes"></div>' +
  '</div>';
  document.getElementById("debDet1").addEventListener("click", () => debDetect(true));
  document.getElementById("debDet0").addEventListener("click", () => debDetect(false));
}

function debDetect(hasFalacia){
  if (DEB.phase !== 0) return; DEB.phase = 1;
  const r = DEB.deck.rondas[DEB.round], correct = r.falacia !== null;
  let html = "";
  if (hasFalacia === correct){
    DEB.jurado = debClamp(DEB.jurado + 20); if (hasFalacia) DEB.detectadas++;
    html += '<div class="deb-line ok"><b>' + DEB_TXT.acertaste + '</b></div>';
  } else {
    DEB.jurado = debClamp(DEB.jurado - 15);
    html += '<div class="deb-line ko"><b>' + DEB_TXT.fallaste + '</b></div>';
  }
  html += '<div class="deb-reveal">' +
    (correct
      ? '<span class="deb-tag falaz">' + DEB_TXT.teniaFalacia + ' ' + debEsc(r.falacia_nombre) + '</span>' +
        '<p class="deb-porque">' + debEsc(r.por_que) + '</p>'
      : '<span class="deb-tag valido">' + DEB_TXT.eraValido + '</span>' +
        '<p class="deb-porque">' + debEsc(r.por_que) + '</p>') +
  '</div>';
  // fase 2: réplica
  html += '<p class="deb-ask">' + DEB_TXT.tuReplica + '</p>' +
    '<div class="deb-opts">' + r.opciones.map((o, i) =>
      '<button class="deb-opt" data-i="' + i + '"><span class="k">' + "ABCD"[i] + '</span><span>' + debEsc(o.t) + '</span></button>').join("") + '</div>';
  const res = document.getElementById("debRes"); res.innerHTML = html; res.classList.add("show");
  res.querySelectorAll(".deb-opt").forEach(b => b.addEventListener("click", () => debReply(+b.dataset.i)));
  debRefreshHud();
}

function debReply(i){
  if (DEB.phase !== 1) return; DEB.phase = 2;
  const r = DEB.deck.rondas[DEB.round], o = r.opciones[i];
  const opts = [...document.querySelectorAll(".deb-opt")];
  opts.forEach((b, j) => { b.disabled = true; if (j !== i) b.classList.add("dim"); });
  opts[i].classList.add("chosen");
  let html = "";
  if (o.valida){
    DEB.jurado = debClamp(DEB.jurado + 15);
    html += '<div class="deb-line ok"><b>' + DEB_TXT.replicaLimpia + '</b></div>';
  } else {
    DEB.jurado = debClamp(DEB.jurado - 15); DEB.cometidas++;
    const nom = (o.falacia && DEBATE_FALACIAS[o.falacia]) ? DEBATE_FALACIAS[o.falacia] : "";
    html += '<div class="deb-line ko"><b>' + DEB_TXT.replicaFalaz + '</b> <span class="deb-porque">' + debEsc(nom) + '</span></div>';
  }
  const last = DEB.round >= DEB.deck.rondas.length - 1;
  html += '<div class="deb-foot"><button class="deb-next" id="debNext">' + (last ? DEB_TXT.verResultado : DEB_TXT.siguiente) + '</button></div>';
  const res = document.getElementById("debRes"); res.insertAdjacentHTML("beforeend", html);
  document.getElementById("debNext").addEventListener("click", debNext);
  debRefreshHud();
}

function debNext(){
  if (DEB.round >= DEB.deck.rondas.length - 1){ debResult(); return; }
  DEB.round++; debRenderRonda();
}

function debRefreshHud(){
  const el = document.querySelector(".deb-meter b"); if (el) el.textContent = DEB.jurado + " %";
  const fill = document.querySelector(".deb-fill"); if (fill) fill.style.width = DEB.jurado + "%";
  const ds = document.querySelector(".deb-stats"); if (ds) ds.innerHTML = '<span>🔍 ' + DEB.detectadas + ' ' + DEB_TXT.detectadas + '</span><span>⚠️ ' + DEB.cometidas + ' ' + DEB_TXT.cometidas + '</span>';
}

/* ---------- resultado ---------- */
function debResult(){
  const d = DEB.deck, j = DEB.jurado;
  const band = j >= 70 ? { emoji: "🏛️", label: DEB_TXT.convences } : (j < 40 ? { emoji: "💥", label: DEB_TXT.rivalConvence } : { emoji: "⚖️", label: DEB_TXT.debateAjustado });
  const key = DEB_KEY, best = store.get(key, {}), prev = best[d.id] || 0;
  const record = j > prev; if (record){ best[d.id] = j; store.set(key, best); }
  debBox().innerHTML = '<div class="deb-wrap"><div class="deb-result">' +
    '<div class="deb-badge big">' + band.emoji + '</div>' +
    '<div class="deb-rank">' + band.label + '</div>' +
    '<div class="deb-final">' + j + ' <span>% del jurado</span></div>' +
    '<p class="deb-stats2">' + d.emoji + ' ' + debEsc(d.nombre) + ' · 🔍 ' + DEB.detectadas + ' ' + DEB_TXT.detectadas + ' · ⚠️ ' + DEB.cometidas + ' ' + DEB_TXT.cometidas +
      (record ? ' · ¡' + DEB_TXT.mejor + '! 🎉' : ' · ' + DEB_TXT.mejor + ': ' + Math.max(prev, j) + ' %') + '</p>' +
    '<div class="deb-actions"><button class="btn2 primary" id="debAgain">' + DEB_TXT.otraVez + '</button>' +
      '<button class="btn2" id="debHome">' + DEB_TXT.otroTema + '</button></div>' +
  '</div></div>';
  document.getElementById("debAgain").addEventListener("click", () => debStart(d.id));
  document.getElementById("debHome").addEventListener("click", renderDebStart);
}

/* ---------- init ---------- */
if (debBox() && typeof DEBATE_DECKS !== "undefined") renderDebStart();
(function(){ const nav = document.getElementById("tabs"); if (nav) nav.addEventListener("click", e => { const b = e.target.closest("button"); if (b && b.dataset.view === "debate") renderDebStart(); }); })();
