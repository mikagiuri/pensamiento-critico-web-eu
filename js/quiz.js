"use strict";
/* ===== Cuestionarios ===== depende de: store.js, data.js ===== */

let quizKey = Object.keys(QUIZZES)[0];
let qpos = 0, qscore = 0, qdone = false;
let quizSubject = "all";
let quizBlock = "all";
let quizPool = [];          // items en juego (todo el cuestionario o solo los fallados)
let quizOrder = [];         // orden barajado de índices sobre quizPool
let quizOptOrder = [];      // orden barajado de las opciones de la pregunta actual
let quizFailed = [];        // items fallados en esta partida (para «Repasar las que fallé»)
let quizReviewing = false;  // true si repasamos solo los fallos (no toca la mejor marca)

function quizShuffle(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const QUIZ_SUBJECTS = { fil: "Filosofia 1.", hf: "Filosofiaren Historia", ipc: "Pentsamendu kritikoa" };
const QUIZ_BLOCKS = { A: "A blokea · Antzinakoa", B: "B blokea · Erdi Arokoa-Modernoa", C: "C blokea · Garaikidea" };

function renderQuizFilter(){
  const box = document.getElementById("quizfilter");
  const subjBtns = ["all", "fil", "hf", "ipc"].map(s =>
    '<button class="fbtn" data-subj="' + s + '" aria-pressed="' + (s === quizSubject) + '">' +
    (s === "all" ? "Guztiak" : QUIZ_SUBJECTS[s]) + '</button>'
  ).join("");
  let blockBtns = "";
  if (quizSubject === "hf"){
    blockBtns = ["all", "A", "B", "C"].map(b =>
      '<button class="fbtn" data-block="' + b + '" aria-pressed="' + (b === quizBlock) + '">' +
      (b === "all" ? "Bloke guztiak" : QUIZ_BLOCKS[b]) + '</button>'
    ).join("");
  }
  box.innerHTML = '<div class="fgroup"><span class="flabel">Ikasgaia</span>' + subjBtns + '</div>' +
    (blockBtns ? '<div class="fgroup"><span class="flabel">Blokea</span>' + blockBtns + '</div>' : '');
  box.querySelectorAll("[data-subj]").forEach(b => b.addEventListener("click", () => {
    quizSubject = b.dataset.subj;
    if (quizSubject !== "hf") quizBlock = "all";
    renderQuizFilter();
    renderQuizChips();
  }));
  box.querySelectorAll("[data-block]").forEach(b => b.addEventListener("click", () => {
    quizBlock = b.dataset.block;
    renderQuizFilter();
    renderQuizChips();
  }));
}

function renderQuizChips(){
  const box = document.getElementById("quizchips");
  const entries = Object.entries(QUIZZES).filter(([k, q]) => {
    if (quizSubject !== "all" && q.subject !== quizSubject) return false;
    if (quizSubject === "hf" && quizBlock !== "all" && q.block !== quizBlock) return false;
    return true;
  });
  box.innerHTML = entries
    .map(([k, q]) => `<button class="chip" data-quiz="${k}" aria-pressed="${k === quizKey}">${q.name}</button>`).join("");
  box.querySelectorAll("[data-quiz]").forEach(b => b.addEventListener("click", () => loadQuiz(b.dataset.quiz)));
}

function loadQuiz(k){ quizKey = k; quizReviewing = false; quizPool = QUIZZES[k].items; renderQuizChips(); startQuizRun(); }
function startQuizRun(){ qpos = 0; qscore = 0; qdone = false; quizFailed = []; quizOrder = quizShuffle(quizPool.map((_, i) => i)); drawQuiz(); }

function drawQuiz(){
  const quiz = QUIZZES[quizKey], box = document.getElementById("quizbox");

  if (qdone){
    const total = quizPool.length;
    let bestLine = "";
    if (!quizReviewing){
      const bestMap = store.get("aula-best", {});
      const prevBest = bestMap[quizKey] || 0;
      if (qscore > prevBest){ bestMap[quizKey] = qscore; store.set("aula-best", bestMap); }
      bestLine = `<p class="best">Nabigatzaile honetako markarik onena: ${Math.max(prevBest, qscore)} / ${total}</p>`;
    }
    const reviewBtn = quizFailed.length
      ? `<button class="btn" id="qreview">Repasar las que fallé (${quizFailed.length})</button>` : "";
    box.innerHTML = `<div class="q-result"><p class="eyebrow">${quizReviewing ? "Repaso" : "Emaitza"}</p>
      <div class="big">${qscore} / ${total}</div>
      ${bestLine}
      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn" id="qretry">Errepikatu</button>${reviewBtn}</div></div>`;
    document.getElementById("qretry").addEventListener("click", () => loadQuiz(quizKey));
    const rv = document.getElementById("qreview");
    if (rv) rv.addEventListener("click", () => { const fails = quizFailed.slice(); quizReviewing = true; quizPool = fails; startQuizRun(); });
    return;
  }

  const total = quizPool.length;
  const it = quizPool[quizOrder[qpos]];
  quizOptOrder = quizShuffle(it.o.map((_, i) => i));
  box.innerHTML = `<div class="q-top"><span>Pregunta ${qpos + 1} de ${total}</span><span class="score">Asmatuak: ${qscore}</span></div>
    <div class="q-card">
      <div class="q-num">${quiz.name}</div>
      <p class="q-text">${it.q}</p>
      <div class="opts" id="opts">${quizOptOrder.map((orig, disp) => `<button class="opt" data-i="${orig}"><span class="k">${"ABCD"[disp]}</span><span>${it.o[orig]}</span></button>`).join("")}</div>
      <div class="fb" id="fb"></div>
      <div class="q-foot"><button class="btn hide" id="qnext">${qpos === total - 1 ? "Ikusi emaitza" : "Hurrengoa →"}</button></div>
    </div>`;

  const opts = [...box.querySelectorAll(".opt")];
  const correctBtn = opts.find(o => +o.dataset.i === it.a);
  const correctLetter = "ABCD"[quizOptOrder.indexOf(it.a)];
  opts.forEach(op => op.addEventListener("click", () => {
    const i = +op.dataset.i;
    opts.forEach(o => { o.disabled = true; o.classList.add("dim"); });
    op.classList.remove("dim");
    if (i === it.a){ op.classList.add("correct"); qscore++; }
    else { op.classList.add("wrong"); if (correctBtn){ correctBtn.classList.remove("dim"); correctBtn.classList.add("correct"); } quizFailed.push(it); }
    const fb = document.getElementById("fb");
    fb.innerHTML = "<b>" + (i === it.a ? "Correcto. " : "La correcta es " + correctLetter + ". ") + "</b>" + it.fb;
    fb.classList.add("show");
    document.getElementById("qnext").classList.remove("hide");
  }));

  document.getElementById("qnext").addEventListener("click", () => {
    if (qpos === quizPool.length - 1){ qdone = true; } else { qpos++; }
    drawQuiz();
  });
}

renderQuizFilter();
loadQuiz(quizKey);
