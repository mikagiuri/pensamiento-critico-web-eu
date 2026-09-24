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
/* ---- esquema v2 (HTML propio): legible en el móvil, colores del tema ---- */
#esquemas #esqsvg.v2{display:block}
/* con esquema v2, la cabecera sigue el tema (la crema era para el fondo blanco del mermaid) */
#esquemas .mapstage.v2 .maphead{background:transparent;border-bottom:1px solid var(--line);padding:4px 0 12px;margin-bottom:12px}
#esquemas .mapstage.v2 .maphead h2{color:var(--ink);font-size:1.45rem}
.esq2{--c:var(--hf);font-family:var(--sans);color:var(--ink);font-size:16px;line-height:1.45}
.esq2[data-s="fil"]{--c:var(--fil)} .esq2[data-s="ipc"]{--c:var(--ipc)}
.esq2-q{font-family:var(--serif);font-size:1.15rem;font-style:italic;color:var(--muted);margin:2px 0 14px}
.esq2-root{display:inline-block;background:var(--c);color:var(--surface);font-weight:700;letter-spacing:.02em;border-radius:10px;padding:9px 16px;font-size:1.05rem}
.esq2-root-d{margin:8px 0 0;color:var(--muted);font-size:.95rem;max-width:62ch}
.esq2-ramas{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
.esq2-rama{border:1px solid var(--line);border-top:4px solid var(--c);border-radius:12px;background:var(--surface-2);padding:12px 14px 14px}
.esq2-rel{display:block;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--c);margin:0 0 3px}
.esq2-t{font-weight:700;font-size:1.02rem}
.esq2-k>.esq2-t{color:var(--c)}
.esq2-d{margin:3px 0 0;font-size:.95rem}
.esq2-a{margin:4px 0 0;font-size:.9rem;color:var(--muted);font-style:italic}
.esq2-hijos{list-style:none;margin:10px 0 0 4px;padding:0 0 0 14px;border-left:2px solid var(--line)}
.esq2-hijos>li{position:relative;margin:0 0 10px}
.esq2-hijos>li:last-child{margin-bottom:0}
.esq2-hijos>li::before{content:"";position:absolute;left:-14px;top:.8em;width:10px;border-top:2px solid var(--line)}
.esq2-hijos .esq2-rel{color:var(--muted)}
.esq2-cruces{margin:16px 0 0;padding:12px 14px;border:1px dashed var(--line);border-radius:12px}
.esq2-cruces h3,.esq2-idea h3{font:600 .8rem var(--sans);text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:0 0 6px}
.esq2-cruces ul{margin:0;padding-left:1.1em}
.esq2-cruces li{margin:3px 0}
.esq2-cruces em{color:var(--c);font-style:normal;font-weight:600}
.esq2-xrel{display:block;color:var(--muted);font-size:.9rem}
.esq2-idea{margin:14px 0 0;padding:12px 14px;border-radius:12px;background:var(--surface-2);border-left:4px solid var(--c)}
.esq2-idea p{margin:0}
.esq2-old{margin:14px 0 0;text-align:right}
/* 4 ramas: 2 × 2 (con 3 + 1 quedaba una columna huérfana) */
@media (min-width:521px){.esq2-ramas[data-n="4"]{grid-template-columns:repeat(2,1fr)}}
@media (max-width:520px){.esq2{font-size:15.5px}.esq2-ramas{grid-template-columns:1fr}}
@media print{.esq2-old{display:none}.esq2-rama{break-inside:avoid}}
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
  /* solo los bloques que tienen esquemas en esta web (en la de 1.º no salen Antigua/Moderna/…) */
  const have = ["A", "B", "C", "F1"].filter(function (b){ return Object.keys(ESQUEMAS).some(function (k){ return ESQUEMAS[k].block === b; }); });
  if (have.length < 2){ box.innerHTML = ""; esqBlock = "all"; return; }
  if (esqBlock !== "all" && have.indexOf(esqBlock) < 0) esqBlock = have[0];
  box.innerHTML = '<div class="fgroup"><span class="flabel">Blokea</span>' +
    ["all"].concat(have).map(function (b){
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

/* ---- Esquema v2: HTML propio a partir de e.v2 (ver el formato al final de esquemas.js).
   Se prefiere al mermaid cuando existe; el mermaid sigue disponible con «Ver el diagrama anterior». */
let esqShowOld = false;
function esqEsc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function esqNodo(n, top){
  const hijos = Array.isArray(n.c) && n.c.length ? '<ul class="esq2-hijos">' + n.c.map(function (h){ return "<li>" + esqNodo(h, false) + "</li>"; }).join("") + "</ul>" : "";
  const body = (n.rel ? '<span class="esq2-rel">' + esqEsc(n.rel) + "</span>" : "") +
    '<div class="esq2-t">' + esqEsc(n.t) + "</div>" +
    (n.d ? '<p class="esq2-d">' + esqEsc(n.d) + "</p>" : "") +
    (n.a ? '<p class="esq2-a">' + esqEsc(n.a) + "</p>" : "") + hijos;
  return top ? '<li class="esq2-rama' + (n.k ? " esq2-k" : "") + '">' + body + "</li>" : '<div class="' + (n.k ? "esq2-k" : "") + '">' + body + "</div>";
}
function esqV2Html(e){
  const v = e.v2;
  return '<div class="esq2" data-s="' + esqEsc(e.subject) + '">' +
    (v.pregunta ? '<p class="esq2-q">' + esqEsc(v.pregunta) + "</p>" : "") +
    '<div class="esq2-root">' + esqEsc(v.raiz) + "</div>" +
    (v.raiz_d ? '<p class="esq2-root-d">' + esqEsc(v.raiz_d) + "</p>" : "") +
    '<ul class="esq2-ramas" data-n="' + (v.ramas || []).length + '">' + (v.ramas || []).map(function (r){ return esqNodo(r, true); }).join("") + "</ul>" +
    (Array.isArray(v.cruces) && v.cruces.length ? '<div class="esq2-cruces"><h3>Adarren arteko erlazioak</h3><ul>' +
      v.cruces.map(function (x){
        /* castellano: «A rel B» se lee de corrido; en euskera (verbo al final, declinación en B) el
           molde no cabe: «A → B», con la relación aparte */
        return document.documentElement.lang === "eu"
          ? "<li><em>" + esqEsc(x.de) + '</em> → <em>' + esqEsc(x.a) + '</em><span class="esq2-xrel">' + esqEsc(x.rel) + "</span></li>"
          : "<li><em>" + esqEsc(x.de) + "</em> " + esqEsc(x.rel) + " <em>" + esqEsc(x.a) + "</em></li>"; }).join("") + "</ul></div>" : "") +
    (v.idea ? '<div class="esq2-idea"><h3>Ideia gakoa</h3><p>' + esqEsc(v.idea) + "</p></div>" : "") +
    '<p class="esq2-old"><button class="btn ghost" id="esqold">Ikusi aurreko diagrama</button></p></div>';
}

function drawEsq(){
  const st = document.getElementById("esqsvg");
  const head = document.getElementById("esqhead");
  const e = ESQUEMAS[esqKey];
  if (!e || !st) return;
  esqInjectCss();
  const col = e.subject === "fil" ? "var(--fil)" : e.subject === "ipc" ? "var(--ipc)" : "var(--hf)";
  if (head) head.innerHTML = '<span class="kick" style="color:' + col + '">' + e.tema + '</span><h2>' + e.title + '</h2>';
  st.classList.toggle("v2", !!(e.v2 && !esqShowOld));
  if (st.parentNode) st.parentNode.classList.toggle("v2", !!(e.v2 && !esqShowOld));
  if (e.v2 && !esqShowOld){
    st.innerHTML = esqV2Html(e);
    const b = document.getElementById("esqold");
    if (b) b.addEventListener("click", function (){ esqShowOld = true; drawEsq(); });
    return;
  }
  if (e.v2 && esqShowOld && !document.getElementById("esqnew")){
    /* botón de vuelta, encima del mermaid */
    st.insertAdjacentHTML("beforebegin", '<p class="esq2-old" id="esqnewwrap"><button class="btn ghost" id="esqnew">Ikusi eskema berria</button></p>');
    document.getElementById("esqnew").addEventListener("click", function (){ esqShowOld = false; const w = document.getElementById("esqnewwrap"); if (w) w.remove(); drawEsq(); });
  }
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
  /* el filtro de bloque sigue al esquema abierto (enlace profundo, buscador…) */
  if (esqBlock !== "all" && ESQUEMAS[k].block && ESQUEMAS[k].block !== esqBlock){ esqBlock = ESQUEMAS[k].block; renderEsqFilter(); }
  esqShowOld = false;
  const w = document.getElementById("esqnewwrap"); if (w) w.remove();
  renderEsqChips();
  drawEsq();
}

renderEsqFilter();
renderEsqChips();
/* El dibujo inicial se dispara al abrir la vista Esquemas (js/lazy_libs.js inyecta
   mermaid entonces). Aquí solo se dibuja ya si mermaid estuviera presente, para no
   arrancar el bucle de reintento cuando la carga es perezosa. */
if (typeof mermaid !== "undefined" || (ESQUEMAS[esqKey] && ESQUEMAS[esqKey].v2)) drawEsq();

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
