"use strict";
/* ===== Vista de mapas conceptuales ===== depende de: maps.js + markmap (autoloader) =====
   Markmap se carga por CDN (markmap-autoloader). Aquí usamos su API
   (window.markmap.Transformer / Markmap) para dibujar bajo demanda. */

let mapKey = Object.keys(MAPS)[0];
let _mm = null, _tf = null, _pending = false;
let mapMode = "mm";   /* (08-10) "mm" = Markmap interactivo · "cuad" = cuadrícula compacta (js/esq_grid.js, vecindad 8) */
let mapSubject = "all", mapBlock = "all";

const MAP_SUBJECTS = { fil: "Filosofia 1.", hf: "Filosofiaren Historia", ipc: "Pentsamendu kritikoa" };
const MAP_BLOCKS = { A: "Antzinakoa", B: "Erdi Arokoa-Modernoa", C: "Garaikidea" };
/* Bloque de cada mapa de HF (los de Filosofía 1.º no llevan bloque). */
const MAP_BLOCK = {
  "map-presocraticos":"A","map-sofistas-socrates":"A","map-platon":"A","map-aristoteles":"A","map-helenismo":"A","map-etica-clasica":"A","map-politica-clasica":"A",
  "map-san-agustin":"B","map-medieval":"B","map-renacimiento":"B","map-descartes":"B","map-sustancias-modernas":"B","map-contrato-social":"B","map-utilitarismo-liberalismo":"B","map-kant":"B","map-critica-razon-pura":"B","map-ilustracion-modernidad":"B",
  "map-nietzsche":"C","map-hegel":"C","map-ideologia":"C","map-maestros-sospecha":"C","map-critica-capitalismo":"C","map-postmodernidad":"C","map-filosofia-lenguaje":"C","map-existencialismo":"C","map-feminismo-beauvoir":"C"
};

function renderMapFilter(){
  const box = document.getElementById("mapfilter");
  if (!box) return;
  const subjBtns = ["all", "fil", "hf", "ipc"].map(s =>
    '<button class="fbtn" data-subj="' + s + '" aria-pressed="' + (s === mapSubject) + '">' +
    (s === "all" ? "Guztiak" : MAP_SUBJECTS[s]) + '</button>').join("");
  let blockBtns = "";
  if (mapSubject === "hf"){
    blockBtns = ["all", "A", "B", "C"].map(b =>
      '<button class="fbtn" data-block="' + b + '" aria-pressed="' + (b === mapBlock) + '">' +
      (b === "all" ? "Bloke guztiak" : MAP_BLOCKS[b]) + '</button>').join("");
  }
  box.innerHTML = '<div class="fgroup"><span class="flabel">Ikasgaia</span>' + subjBtns + '</div>' +
    (blockBtns ? '<div class="fgroup"><span class="flabel">Blokea</span>' + blockBtns + '</div>' : '');
  box.querySelectorAll("[data-subj]").forEach(b => b.addEventListener("click", () => {
    mapSubject = b.dataset.subj;
    if (mapSubject !== "hf") mapBlock = "all";
    renderMapFilter(); renderMapChips();
  }));
  box.querySelectorAll("[data-block]").forEach(b => b.addEventListener("click", () => {
    mapBlock = b.dataset.block;
    renderMapFilter(); renderMapChips();
  }));
}

function renderMapChips(){
  const box = document.getElementById("mapchips");
  const entries = Object.entries(MAPS).filter(([k, m]) => {
    if (mapSubject !== "all" && m.subject !== mapSubject) return false;
    if (mapSubject === "hf" && mapBlock !== "all" && MAP_BLOCK[k] !== mapBlock) return false;
    return true;
  });
  box.innerHTML = entries
    .map(([k, m]) => `<button class="chip" data-mp="${k}" aria-pressed="${k === mapKey}">${m.title}</button>`).join("");
  box.querySelectorAll("[data-mp]").forEach(b => b.addEventListener("click", () => loadMap(b.dataset.mp)));
}

function _ready(){
  const mk = window.markmap;
  return mk && typeof mk.Transformer === "function" && mk.Markmap && typeof mk.Markmap.create === "function";
}

function drawMap(){
  const m = MAPS[mapKey];
  if (!m) return;
  const head = document.getElementById("maphead");
  if (head) head.innerHTML = '<span class="kick" style="color:var(--' + m.subject + ')">' + m.tema + '</span><h2>' + m.title + '</h2>';
  /* pestañas Interactivo / Cuadrícula (la cuadrícula solo si está cargado esq_grid.js) */
  const svgEl = document.getElementById("mapsvg");
  let gridEl = document.getElementById("mapgrid");
  if (head && typeof EsqGrid !== "undefined"){
    if (!gridEl && svgEl){ gridEl = document.createElement("div"); gridEl.id = "mapgrid"; svgEl.insertAdjacentElement("afterend", gridEl); }
    head.insertAdjacentHTML("beforeend", '<div class="esq2-tabs" role="group" aria-label="Vista del mapa">' +
      [["mm", "Interaktiboa"], ["cuad", "Sareta"]].map(function (x){ return '<button class="fbtn" data-mm="' + x[0] + '" aria-pressed="' + (mapMode === x[0]) + '">' + x[1] + "</button>"; }).join("") + "</div>");
    head.querySelectorAll("[data-mm]").forEach(function (b){ b.addEventListener("click", function (){ mapMode = b.dataset.mm; drawMap(); }); });
  }
  const cuad = mapMode === "cuad" && gridEl && typeof EsqGrid !== "undefined";
  if (svgEl) svgEl.style.display = cuad ? "none" : "";
  if (gridEl){ gridEl.style.display = cuad ? "" : "none"; if (cuad){ EsqGrid.render({ subject: m.subject, v2: EsqGrid.fromMarkmap(m.md) }, gridEl); return; } }

  if (!_ready()){                 // Markmap aún cargando desde el CDN: reintentar
    if (_pending) return;
    _pending = true;
    const mk = window.markmap;
    const again = () => { _pending = false; drawMap(); };
    if (mk && mk.autoLoader && mk.autoLoader.ready && typeof mk.autoLoader.ready.then === "function") mk.autoLoader.ready.then(again, () => setTimeout(again, 200));
    else setTimeout(again, 200);
    return;
  }

  const mk = window.markmap;
  if (!_tf) _tf = new mk.Transformer();
  const data = _tf.transform(m.md).root;
  const svg = document.getElementById("mapsvg");
  if (!_mm) _mm = mk.Markmap.create(svg, { autoFit: false, initialExpandLevel: 3, colorFreezeLevel: 2, spacingVertical: 6, spacingHorizontal: 90, paddingX: 16, duration: 250 }, data);
  else _mm.setData(data);
  requestAnimationFrame(() => { try { _mm.fit(); } catch (e) {} });
}

function loadMap(k){
  if (!(k in MAPS)) return;
  mapKey = k;
  renderMapChips();
  drawMap();
}

renderMapFilter();
renderMapChips();
/* Forzar que el autoloader cargue sus dependencias (d3, markmap-view, markmap-lib)
   aunque no haya elementos .markmap que auto-renderizar. */
(function(){
  const al = window.markmap && window.markmap.autoLoader;
  if (al && typeof al.renderAll === "function") { try { al.renderAll(); } catch (e) {} }
})();
/* Redibujar/ajustar al entrar en la pestaña Mapas (la vista está oculta al cargar,
   así que el primer dibujo se hace cuando ya es visible y tiene tamaño). */
(function(){
  const tab = document.querySelector('#tabs [data-view="mapas"]');
  if (tab) tab.addEventListener("click", () => requestAnimationFrame(drawMap));
})();
