"use strict";
/* ===== Vista Esquemas ===== depende de: esquemas.js + mermaid (CDN) =====
   Renderiza los grafos conceptuales del libro (bloques [RELACIONA]) como
   diagramas mermaid. mermaid se carga por CDN (funciona en el artefacto y
   standalone). Se re-dibuja al cambiar de tema claro/oscuro. */

let esqKey = Object.keys(ESQUEMAS)[0];
let esqBlock = ["A", "B", "C"].find(function (b){ return Object.keys(ESQUEMAS).some(function (k){ return ESQUEMAS[k].block === b; }); }) || "all";  /* bloque concreto por defecto, nunca «Todos» */
let _mid = 0, _esqTheme = null;
const ESQ_BLOCKS = { A: "Antzinakoa", B: "Erdi Arokoa-Modernoa", C: "Garaikidea", F1: "Filosofia 1." };
/* Suma los esquemas de Filosofía 1.º (grupo «F1», datos en esquemas_fil.js) al objeto ESQUEMAS. */
if (typeof ESQUEMAS !== "undefined" && typeof ESQUEMAS_FIL !== "undefined") Object.assign(ESQUEMAS, ESQUEMAS_FIL);

const ESQ_CSS = `
#esquemas .mapstage{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:14px 16px;overflow:auto}
#esquemas #esqsvg{min-height:120px;display:flex;justify-content:center}
#esquemas #esqsvg svg{max-width:100%;height:auto}
#esquemas .esq-wait{color:var(--muted);padding:26px 4px;text-align:center}
`;
let _esqCssDone = false;
function esqInjectCss(){ if (_esqCssDone) return; const s = document.createElement("style"); s.textContent = ESQ_CSS; document.head.appendChild(s); _esqCssDone = true; }

function esqThemeName(){
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "dark") return "dark";
  if (t === "light") return "default";
  return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "default";
}

function esqInit(){
  if (typeof mermaid === "undefined") return false;
  const th = esqThemeName();
  mermaid.initialize({
    startOnLoad: false, securityLevel: "loose", theme: th,
    flowchart: { htmlLabels: true, curve: "basis", padding: 14, nodeSpacing: 45, rankSpacing: 55 },
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
  });
  _esqTheme = th;
  return true;
}

function renderEsqFilter(){
  const box = document.getElementById("esqfilter");
  if (!box) return;
  box.innerHTML = '<div class="fgroup"><span class="flabel">Blokea</span>' +
    ["all", "A", "B", "C"].concat(Object.keys(ESQUEMAS).some(function (k){ return ESQUEMAS[k].block === "F1"; }) ? ["F1"] : []).map(function (b){
      return '<button class="fbtn" data-eb="' + b + '" aria-pressed="' + (b === esqBlock) + '">' +
        (b === "all" ? "Guztiak" : ESQ_BLOCKS[b]) + '</button>'; }).join("") + '</div>';
  box.querySelectorAll("[data-eb]").forEach(function (b){ b.addEventListener("click", function (){
    esqBlock = b.dataset.eb; renderEsqFilter(); renderEsqChips(); }); });
}

function renderEsqChips(){
  const box = document.getElementById("esqchips");
  if (!box) return;
  const entries = Object.entries(ESQUEMAS).filter(function (e){ return esqBlock === "all" || e[1].block === esqBlock; });
  box.innerHTML = entries.map(function (e){
    return '<button class="chip" data-eq="' + e[0] + '" aria-pressed="' + (e[0] === esqKey) + '">' + e[1].title + '</button>'; }).join("");
  box.querySelectorAll("[data-eq]").forEach(function (b){ b.addEventListener("click", function (){ loadEsq(b.dataset.eq); }); });
}

function drawEsq(){
  const st = document.getElementById("esqsvg");
  const head = document.getElementById("esqhead");
  const e = ESQUEMAS[esqKey];
  if (!e || !st) return;
  esqInjectCss();
  if (head) head.innerHTML = '<span class="kick" style="color:var(--hf)">' + e.tema + '</span><h2>' + e.title + '</h2>';
  if (typeof mermaid === "undefined"){ st.innerHTML = '<p class="esq-wait">Diagrama-motorra kargatzen…</p>'; setTimeout(drawEsq, 350); return; }
  if (_esqTheme === null || _esqTheme !== esqThemeName()) esqInit();
  mermaid.render("esqm" + (++_mid), e.mermaid).then(function (res){
    st.innerHTML = res.svg;
  }).catch(function (){
    st.innerHTML = '<p class="esq-wait">Ezin izan da eskema hau marraztu.</p>';
  });
}

function loadEsq(k){
  if (!(k in ESQUEMAS)) return;
  esqKey = k;
  renderEsqChips();
  drawEsq();
}

renderEsqFilter();
renderEsqChips();
/* El dibujo inicial se dispara al abrir la vista Esquemas (js/lazy_libs.js inyecta
   mermaid entonces). Aquí solo se dibuja ya si mermaid estuviera presente, para no
   arrancar el bucle de reintento cuando la carga es perezosa. */
if (typeof mermaid !== "undefined") drawEsq();

/* Re-dibujar al cambiar el tema (el botón #theme o el sistema); solo si mermaid ya
   está cargado (si no, el redibujo se hará al abrir Esquemas). */
(function(){
  const redraw = function (){ if (typeof mermaid !== "undefined"){ esqInit(); drawEsq(); } };
  const btn = document.getElementById("theme");
  if (btn) btn.addEventListener("click", function (){ setTimeout(redraw, 60); });
  if (window.matchMedia){
    try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw); } catch (e) {}
  }
})();
