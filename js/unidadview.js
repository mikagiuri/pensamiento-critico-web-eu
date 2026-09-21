"use strict";
/* ===== Banco por unidad =====
   Agrega en una sola página, para cada unidad (tema), los recursos que ya
   existen dispersos por la web: teoría, materiales, lecturas, recursos
   (media) y un test por unidad. No crea datos nuevos: es una capa de
   agregación sobre THEORY, MATERIALS, LECTURAS, QUIZZES y MEDIA_TEMAS.
   Permite pasar de "leer por pestaña" a "estudiar por tema", el modelo de
   banco por unidad (inspiración: REA de Canarias). */

/* ---- Asociar cada tema (1..27) con las claves que le corresponden ---- */
const UNIDADES = {
  // Bloque A (temas 1-10)
  1: { teoria: "hf-historicidad", lectura: null, quiz: "hf-t1-historicidad" },
  2: { teoria: "hf-metodos", lectura: null, quiz: "hf-t2-metodos" },
  3: { teoria: "hf-mito", lectura: null, quiz: "preso" },
  4: { teoria: "hf-preso", lectura: null, quiz: "preso" },
  5: { teoria: "hf-sofistas", lectura: null, quiz: "preso" },
  6: { teoria: "hf-platon", lectura: "hf-platon", quiz: "plat-antro" },
  7: { teoria: "hf-antropologia", lectura: null, quiz: "plat-antro" },
  8: { teoria: "hf-etica", lectura: null, quiz: "ltfh-A8" },
  9: { teoria: "hf-politica", lectura: null, quiz: "ltfh-A9" },
  10: { teoria: "hf-helenismo", lectura: null, quiz: "ltfh-A10" },
  // Bloque B (temas 11-17)
  11: { teoria: "hf-medieval", lectura: null, quiz: "ltfh-B1" },
  12: { teoria: "hf-fe-razon", lectura: null, quiz: "hf-t12-fe-razon" },
  13: { teoria: "hf-modernidad", lectura: null, quiz: "ltfh-B3" },
  14: { teoria: "hf-racionalismo", lectura: null, quiz: "ltfh-BD" },
  15: { teoria: "hf-metafisica", lectura: null, quiz: "ltfh-B5" },
  16: { teoria: "hf-contrato", lectura: null, quiz: "ltfh-B6" },
  17: { teoria: "hf-utilitarismo", lectura: null, quiz: "ltfh-B7" },
  // Bloque C (temas 18-27)
  18: { teoria: "hf-ilustracion", lectura: null, quiz: "ltfh-C1" },
  19: { teoria: "hf-kant", lectura: null, quiz: "ltfh-CK" },
  20: { teoria: "hf-etica-deber", lectura: null, quiz: "hf-t20-etica-deber" },
  21: { teoria: "hf-sospecha", lectura: null, quiz: "ltfh-C4" },
  22: { teoria: "hf-capitalismo", lectura: null, quiz: "ltfh-CM" },
  23: { teoria: "hf-posmodernidad", lectura: null, quiz: "ltfh-C6" },
  24: { teoria: "hf-analitica", lectura: null, quiz: "ltfh-C7" },
  25: { teoria: "hf-existencialismo", lectura: null, quiz: "ltfh-C8" },
  26: { teoria: "hf-beauvoir", lectura: null, quiz: "ltfh-C9" },
  27: { teoria: "hf-siglo21", lectura: null, quiz: "ltfh-C10" },
};

const UNIDAD_BLOCKS = { A: "A blokea · Antzinakoa", B: "B blokea · Erdi Arokoa-Modernoa", C: "C blokea · Garaikidea" };

function unidadBlockOf(t){
  if (t >= 1 && t <= 10) return "A";
  if (t >= 11 && t <= 17) return "B";
  if (t >= 18 && t <= 27) return "C";
  return null;
}

let unidadBlock = "A";
let unidadKey = 6;  /* unidad visible; se sincroniza con los chips */

function renderUnidadFilter(){
  const box = document.getElementById("unidadfilter");
  if (!box) return;
  const btns = ["all", "A", "B", "C"].map(b =>
    '<button class="fbtn" data-block="' + b + '" aria-pressed="' + (b === unidadBlock) + '">' +
    (b === "all" ? "Bloke guztiak" : UNIDAD_BLOCKS[b]) + '</button>'
  ).join("");
  box.innerHTML = '<div class="fgroup"><span class="flabel">Blokea</span>' + btns + '</div>';
  box.querySelectorAll("[data-block]").forEach(b => b.addEventListener("click", () => {
    unidadBlock = b.dataset.block;
    renderUnidadFilter();
    renderUnidadChips();
  }));
}

function renderUnidadChips(){
  const box = document.getElementById("unidadchips");
  if (!box) return;
  const temas = Object.keys(UNIDADES).map(Number)
    .filter(t => unidadBlock === "all" || unidadBlockOf(t) === unidadBlock)
    .sort((a, b) => a - b);
  box.innerHTML = temas
    .map(t => '<button class="chip" data-unidad="' + t + '" aria-pressed="' + (t === unidadKey) + '">Tema ' + t + '</button>').join("");
  box.querySelectorAll("[data-unidad]").forEach(b => b.addEventListener("click", () => {
    unidadKey = +b.dataset.unidad;
    renderUnidadChips();
    renderUnidadBody();
  }));
}

/* ---- Título de un tema desde THEORY ---- */
function unidadTitle(t){
  const k = UNIDADES[t].teoria;
  const item = THEORY[k];
  if (!item) return "Tema " + t;
  return "Tema " + t + " · " + item.title;
}

function renderUnidadBody(){
  const body = document.getElementById("unidadbody");
  if (!body) return;
  const t = unidadKey, u = UNIDADES[t];
  const title = unidadTitle(t);
  const block = UNIDAD_BLOCKS[unidadBlockOf(t)] || "";
  const color = t <= 10 ? "hf" : (t <= 17 ? "hf" : "hf");

  /* Recursos media (vídeos/infografías) de este tema */
  const media = MEDIA_TEMAS.filter(e => e.t === t).map(e => {
    const v = (e.v || []).map(x => '<li class="m-v">🎬 ' + x + '</li>').join("");
    const i = (e.i || []).map(x => '<li class="m-v">🖼️ ' + x + '</li>').join("");
    return (v || i) ? '<ul class="mlist">' + v + i + '</ul>' : '<p class="muted">Baliabide multimediak zerrendatu gabe</p>';
  }).join("") || '<p class="muted">Baliabide multimediak zerrendatu gabe</p>';

  /* Test por unidad */
  const quizKey = u.quiz;
  const quizBtn = quizKey && QUIZZES[quizKey]
    ? '<button class="btn" data-go="cuestionarios" data-arg="' + quizKey + '">Hacer el cuestionario: ' + QUIZZES[quizKey].name + ' →</button>'
    : '<p class="muted">Testa: betetzeko</p>';

  /* Enlazar otras vistas para esta teoría */
  const links = [];
  if (u.lectura && LECTURAS[u.lectura]) links.push('<button class="btn" data-go="lecturas" data-arg="' + u.lectura + '">Irakurri testua</button>');
  if (u.teoria && THEORY[u.teoria]) links.push('<button class="btn" data-go="teoria" data-arg="' + u.teoria + '">Teoria osoa</button>');
  const leadTxt = '<p class="lead">' + (THEORY[u.teoria] ? THEORY[u.teoria].title : "") + ' — toda esta unidad en una sola página.</p>';

  body.innerHTML =
    '<div class="theory-head"><span class="kick" style="color:var(--hf)">' + block + '</span><h1>' + title + '</h1></div>' +
    '<div class="unidad-actions">' + leadTxt +
    (links.join(" ") ? '<div class="toolrow">' + links.join(" ") + '</div>' : '') + '</div>' +
    '<h2>Baliabide multimedia</h2>' + media +
    '<h2>Errepasoko testa</h2>' + quizBtn;

  /* eventos de navegación a otras vistas */
  body.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => {
    const go = b.dataset.go, arg = b.dataset.arg;
    show(go);
    if (go === "lecturas") loadLectura(arg);
    if (go === "teoria") loadTheory(arg);
    if (go === "cuestionarios") loadQuiz(arg);
  }));

  const toc = document.getElementById("unidadtoc");
  if (toc){
    const hs = [...body.querySelectorAll("h2")];
    hs.forEach((h, i) => { h.id = "uh-" + i; });
    toc.innerHTML = '<div class="toc-title">Unitate honetan</div><ol>' +
      hs.map((h, i) => '<li><a href="#uh-' + i + '">' + h.textContent + '</a></li>').join("") + '</ol>';
  }
}

renderUnidadFilter();
renderUnidadChips();
renderUnidadBody();
