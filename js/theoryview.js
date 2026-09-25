"use strict";
/* ===== Vista de teoría ===== depende de: theory.js ===== */

let theoryKey = Object.keys(THEORY)[0];
let theorySubject = "all";
let theoryBlock = "all";

const THEORY_SUBJECTS = { fil: "Filosofia 1.", hf: "Filosofiaren Historia", ipc: "Pentsamendu kritikoa" };
const THEORY_BLOCKS = { A: "A blokea · Antzinakoa", B: "B blokea · Erdi Arokoa-Modernoa", C: "C blokea · Garaikidea" };

function blockOf(t){
  /* «Tema 19» en castellano; «19. gaia» en euskera (antes, en la web vasca, el filtro de bloque vaciaba la lista) */
  const m = (t.tema || "").match(/Tema (\d+)|(\d+)\. gaia/);
  if (!m) return null;
  const n = +(m[1] || m[2]);
  if (n >= 1 && n <= 10) return "A";
  if (n >= 11 && n <= 17) return "B";
  if (n >= 18 && n <= 27) return "C";
  return null;
}

function renderTheoryFilter(){
  const box = document.getElementById("theoryfilter");
  const subjBtns = ["all", "fil", "hf", "ipc"].map(s =>
    '<button class="fbtn" data-subj="' + s + '" aria-pressed="' + (s === theorySubject) + '">' +
    (s === "all" ? "Guztiak" : THEORY_SUBJECTS[s]) + '</button>'
  ).join("");
  let blockBtns = "";
  if (theorySubject === "hf"){
    blockBtns = ["all", "A", "B", "C"].map(b =>
      '<button class="fbtn" data-block="' + b + '" aria-pressed="' + (b === theoryBlock) + '">' +
      (b === "all" ? "Bloke guztiak" : THEORY_BLOCKS[b]) + '</button>'
    ).join("");
  }
  box.innerHTML = '<div class="fgroup"><span class="flabel">Ikasgaia</span>' + subjBtns + '</div>' +
    (blockBtns ? '<div class="fgroup"><span class="flabel">Blokea</span>' + blockBtns + '</div>' : '');
  box.querySelectorAll("[data-subj]").forEach(b => b.addEventListener("click", () => {
    theorySubject = b.dataset.subj;
    if (theorySubject !== "hf") theoryBlock = "all";
    renderTheoryFilter();
    renderTheoryChips();
  }));
  box.querySelectorAll("[data-block]").forEach(b => b.addEventListener("click", () => {
    theoryBlock = b.dataset.block;
    renderTheoryFilter();
    renderTheoryChips();
  }));
}

function renderTheoryChips(){
  const box = document.getElementById("theorychips");
  const entries = Object.entries(THEORY).filter(([k, t]) => {
    if (theorySubject !== "all" && t.subject !== theorySubject) return false;
    if (theorySubject === "hf" && theoryBlock !== "all" && blockOf(t) !== theoryBlock) return false;
    return true;
  });
  box.innerHTML = entries
    .map(([k, t]) => '<button class="chip" data-th="' + k + '" aria-pressed="' + (k === theoryKey) + '">' + t.title + '</button>').join("");
  box.querySelectorAll("[data-th]").forEach(b => b.addEventListener("click", () => loadTheory(b.dataset.th)));
}

/* Mapa curado: infografía de autor → nº de tema del currículo de HF.
   Da a esas infografías (con clave de persona, sin campo `tema`) un ancla al temario para
   que la tira «De este tema» las enlace con su teoría/lectura.
   EDITABLE: para cambiar el tema de un autor, edita aquí su nº (ver los títulos en theory.js).
   Los autores sin tema propio en el temario se anclan al más afín (criterio del profesorado):
   Aristóteles→8 (ética; alt. 7/9), Locke/Spinoza→14 (empirismo/racionalismo; alt. 16/17/15),
   Schopenhauer→23 (precursor de Nietzsche; alt. 21), Hegel→21 (idealismo→Marx; el más forzado),
   Arendt→27 (sociedad actual; alt. 25). */
const TEMA_ALIAS = {
  "hf-presocraticos": 4, "hf-socrates": 5, "hf-aristoteles": 8, "hf-agustin": 12,
  "hf-tomas": 12, "hf-descartes": 14, "hf-hume": 14, "hf-locke": 14, "hf-spinoza": 14,
  "hf-maquiavelo": 16, "hf-hobbes": 16, "hf-rousseau": 16, "hf-marx": 21, "hf-freud": 21,
  "hf-hegel": 21, "hf-nietzsche": 23, "hf-schopenhauer": 23, "hf-sartre": 25, "hf-arendt": 27
};

/* ===== Enlaces contextuales «De este tema» (compartido por Teoría, Lecturas e Infografías) =====
   Reúne los recursos del MISMO tema sin cambiar la navegación: reutiliza el mapa curado
   UNIDADES (HF) y la coincidencia directa de clave (Filosofía e infografías). `self` es la
   vista actual, que se excluye para no enlazar a sí misma. typeof-guards por el orden de carga. */
function relatedFor(key, self){
  const out = [];
  const has = (o, k) => typeof o !== "undefined" && o && o[k];
  const add = (go, arg, label) => { if (arg && go !== self && !out.some(r => r.go === go)) out.push({ go, arg, label }); };
  if (typeof UNIDADES !== "undefined"){
    for (const n of Object.keys(UNIDADES)){
      const u = UNIDADES[n];
      if (u && (u.teoria === key || u.lectura === key)){
        add("unidad", n, "Ikusi gai osoa →");
        if (u.teoria && has(THEORY, u.teoria)) add("teoria", u.teoria, "Teoria");
        if (u.quiz && has(QUIZZES, u.quiz)) add("cuestionarios", u.quiz, "Galdetegia");
        if (u.lectura && has(LECTURAS, u.lectura)) add("lecturas", u.lectura, "Irakurri testua");
        break;
      }
    }
  }
  /* typeof-guards obligatorios: estos objetos globales (const) se cargan DESPUÉS de este
     archivo, y nombrar el identificador antes de existir lanza ReferenceError (no basta con
     has(): el argumento se evalúa antes de la llamada). El && cortocircuita sin tocarlo. */
  if (typeof THEORY !== "undefined" && THEORY[key]) add("teoria", key, "Teoria");
  if (typeof QUIZZES !== "undefined" && QUIZZES[key]) add("cuestionarios", key, "Galdetegia");
  if (typeof LECTURAS !== "undefined" && LECTURAS[key]) add("lecturas", key, "Irakurri testua");
  if (typeof INFOGRAFIAS !== "undefined" && INFOGRAFIAS[key]) add("infografias", key, "Infografia");
  /* Fallback por tema (mismo nº de tema y misma materia): conecta las lecturas e infografías
     "de paquete" con su teoría/cuestionario aunque no compartan clave. */
  const src = (typeof THEORY !== "undefined" && THEORY[key]) ||
              (typeof LECTURAS !== "undefined" && LECTURAS[key]) ||
              (typeof QUIZZES !== "undefined" && QUIZZES[key]) ||
              (typeof INFOGRAFIAS !== "undefined" && INFOGRAFIAS[key]) || null;
  if (src){
    const temaN = o => { if (!o) return null; if (typeof o.tema === "number") return o.tema;
      const m = String(o.tema || "").match(/Tema\s+(\d+)/); return m ? +m[1] : null; };
    let tn = temaN(src);
    if (tn == null && typeof TEMA_ALIAS !== "undefined" && TEMA_ALIAS[key] != null) tn = TEMA_ALIAS[key];
    const subj = src.subject;
    if (tn != null){
      const firstBy = coll => { if (typeof coll === "undefined" || !coll) return null;
        return Object.keys(coll).find(kk => kk !== key && coll[kk].subject === subj && temaN(coll[kk]) === tn) || null; };
      add("teoria", firstBy(typeof THEORY !== "undefined" ? THEORY : null), "Teoria");
      add("cuestionarios", firstBy(typeof QUIZZES !== "undefined" ? QUIZZES : null), "Galdetegia");
      add("lecturas", firstBy(typeof LECTURAS !== "undefined" ? LECTURAS : null), "Irakurri testua");
      add("infografias", firstBy(typeof INFOGRAFIAS !== "undefined" ? INFOGRAFIAS : null), "Infografia");
    }
  }
  return out;
}

function relatedStripHtml(key, self){
  const rel = relatedFor(key, self);
  if (!rel.length) return "";
  return '<div class="toolrow related-row" style="margin:.1rem 0 1.1rem"><span class="flabel" style="align-self:center">Gai honi buruz:</span>' +
    rel.map(r => '<button class="btn" data-go="' + r.go + '" data-arg="' + r.arg + '">' + r.label + '</button>').join(" ") + '</div>';
}

function goRelated(go, arg){
  if (typeof show === "function") show(go);
  if (go === "cuestionarios" && typeof loadQuiz === "function") loadQuiz(arg);
  else if (go === "lecturas" && typeof loadLectura === "function") loadLectura(arg);
  else if (go === "infografias" && typeof loadInfografia === "function") loadInfografia(arg);
  else if (go === "teoria" && typeof loadTheory === "function") loadTheory(arg);
  else if (go === "unidad" && typeof unidadKey !== "undefined"){
    unidadKey = +arg;
    if (typeof renderUnidadChips === "function") renderUnidadChips();
    if (typeof renderUnidadBody === "function") renderUnidadBody();
  }
}

function wireRelated(container){
  (container || document).querySelectorAll(".related-row [data-go]").forEach(b => b.addEventListener("click", () => goRelated(b.dataset.go, b.dataset.arg)));
}

function loadTheory(k){
  theoryKey = k;
  /* los filtros siguen al tema abierto (enlace profundo, buscador…): antes, con el tema 19 abierto,
     seguía marcado «Bloque A» (el que preselecciona navctx.js) */
  const tk = THEORY[k];
  if (tk){
    let cambia = false;
    if (theorySubject !== "all" && tk.subject && theorySubject !== tk.subject){ theorySubject = tk.subject; theoryBlock = "all"; cambia = true; }
    const bk = blockOf(tk);
    if (theorySubject === "hf" && theoryBlock !== "all" && bk && bk !== theoryBlock){ theoryBlock = bk; cambia = true; }
    if (cambia && document.getElementById("theoryfilter")) renderTheoryFilter();
  }
  renderTheoryChips();
  const t = THEORY[k], body = document.getElementById("theorybody");
  const relHtml = (typeof relatedStripHtml === "function") ? relatedStripHtml(k, "teoria") : "";
  body.innerHTML = '<div class="theory-head"><span class="kick" style="color:var(--' + t.subject + ')">' + t.tema + '</span><h1>' + t.title + '</h1></div>' + relHtml + t.html;
  if (typeof wireRelated === "function") wireRelated(body);
  const hs = [...body.querySelectorAll("h2")];
  hs.forEach((h, i) => { h.id = "th-" + i; });
  body.querySelectorAll(".figimg").forEach(img => img.addEventListener("click", () => openLightbox(img.src)));
  const toc = document.getElementById("toc");
  toc.innerHTML = '<div class="toc-title">Gai honetan</div><ol>' +
    hs.map((h, i) => '<li><a href="#th-' + i + '">' + h.textContent + '</a></li>').join("") + '</ol>';
}

renderTheoryFilter();
loadTheory(theoryKey);
