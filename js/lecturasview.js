"use strict";
/* ===== Vista de lecturas ===== depende de: lecturas.js ===== */

let lecturaKey = Object.keys(LECTURAS)[0];
let lecturaBlock = "A";  /* bloque concreto por defecto, nunca «Todos los bloques» */

const LECTURA_BLOCKS = { A: "A blokea · Antzinakoa", B: "B blokea · Erdi Arokoa-Modernoa", C: "C blokea · Garaikidea" };

function blockOf(t){
  const m = (t.tema || "").match(/Tema (\d+)/);
  if (!m) return null;
  const n = +m[1];
  if (n >= 1 && n <= 10) return "A";
  if (n >= 11 && n <= 17) return "B";
  if (n >= 18 && n <= 27) return "C";
  return null;
}

function renderLecturaFilter(){
  const box = document.getElementById("lecturafilter");
  const blockBtns = ["all", "A", "B", "C"].map(b =>
    '<button class="fbtn" data-block="' + b + '" aria-pressed="' + (b === lecturaBlock) + '">' +
    (b === "all" ? "Bloke guztiak" : LECTURA_BLOCKS[b]) + '</button>'
  ).join("");
  box.innerHTML = '<div class="fgroup"><span class="flabel">Blokea</span>' + blockBtns + '</div>';
  box.querySelectorAll("[data-block]").forEach(b => b.addEventListener("click", () => {
    lecturaBlock = b.dataset.block;
    renderLecturaFilter();
    renderLecturaChips();
  }));
}

function renderLecturaChips(){
  const box = document.getElementById("lecturachips");
  const entries = Object.entries(LECTURAS).filter(([k, t]) =>
    lecturaBlock === "all" || blockOf(t) === lecturaBlock
  );
  box.innerHTML = entries
    .map(([k, t]) => '<button class="chip" data-lec="' + k + '" aria-pressed="' + (k === lecturaKey) + '">' + t.title + '</button>').join("");
  box.querySelectorAll("[data-lec]").forEach(b => b.addEventListener("click", () => loadLectura(b.dataset.lec)));
}

function loadLectura(k){
  lecturaKey = k;
  renderLecturaChips();
  const t = LECTURAS[k], body = document.getElementById("lecturabody");
  if (!t || !body) return;
  const relHtml = (typeof relatedStripHtml === "function") ? relatedStripHtml(k, "lecturas") : "";
  body.innerHTML = '<div class="theory-head"><span class="kick" style="color:var(--' + t.subject + ')">' + t.tema + '</span><h1>' + t.title + '</h1></div>' + relHtml + t.html;
  if (typeof wireRelated === "function") wireRelated(body);
  // Enlazar con el comentario de texto guiado si existe la vista
  const comentBtn = document.getElementById("comentariolink");
  if (comentBtn) comentBtn.style.display = "inline-flex";
  const hs = [...body.querySelectorAll("h2")];
  hs.forEach((h, i) => { h.id = "lh-" + i; });
  const toc = document.getElementById("ltoc");
  toc.innerHTML = '<div class="toc-title">Irakurgai honetan</div><ol>' +
    hs.map((h, i) => '<li><a href="#lh-' + i + '">' + h.textContent + '</a></li>').join("") + '</ol>';
}

if (document.getElementById("lecturabody")){   // solo si la vista de Lecturas existe (no en la web de 2.º ESO)
  renderLecturaFilter();
  if (lecturaKey) loadLectura(lecturaKey);
}
