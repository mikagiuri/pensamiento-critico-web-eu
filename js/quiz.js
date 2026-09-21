"use strict";
/* ===== Cuestionarios ===== depende de: store.js, data.js ===== */

let quizKey = Object.keys(QUIZZES)[0];
let qpos = 0, qscore = 0, qdone = false;
let quizSubject = "all";
let quizBlock = "all";

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

function loadQuiz(k){ quizKey = k; qpos = 0; qscore = 0; qdone = false; renderQuizChips(); drawQuiz(); }

function drawQuiz(){
  const quiz = QUIZZES[quizKey], box = document.getElementById("quizbox");

  if (qdone){
    const bestMap = store.get("aula-best", {});
    const prevBest = bestMap[quizKey] || 0;
    const total = quiz.items.length;
    box.innerHTML = `<div class="q-result"><p class="eyebrow">Emaitza</p>
      <div class="big">${qscore} / ${total}</div>
      <p class="best">Nabigatzaile honetako markarik onena: ${Math.max(prevBest, qscore)} / ${total}</p>
      <div style="margin-top:20px"><button class="btn" id="qretry">Errepikatu</button></div></div>`;
    document.getElementById("qretry").addEventListener("click", () => loadQuiz(quizKey));
    if (qscore > prevBest){ bestMap[quizKey] = qscore; store.set("aula-best", bestMap); }
    return;
  }

  const it = quiz.items[qpos];
  box.innerHTML = `<div class="q-top"><span>${qpos + 1}. galdera · guztira ${quiz.items.length}</span><span class="score">Asmatuak: ${qscore}</span></div>
    <div class="q-card">
      <div class="q-num">${quiz.name}</div>
      <p class="q-text">${it.q}</p>
      <div class="opts" id="opts">${it.o.map((o, i) => `<button class="opt" data-i="${i}"><span class="k">${"ABCD"[i]}</span><span>${o}</span></button>`).join("")}</div>
      <div class="fb" id="fb"></div>
      <div class="q-foot"><button class="btn hide" id="qnext">${qpos === quiz.items.length - 1 ? "Ikusi emaitza" : "Hurrengoa →"}</button></div>
    </div>`;

  const opts = [...box.querySelectorAll(".opt")];
  opts.forEach(op => op.addEventListener("click", () => {
    const i = +op.dataset.i;
    opts.forEach(o => { o.disabled = true; o.classList.add("dim"); });
    op.classList.remove("dim");
    if (i === it.a){ op.classList.add("correct"); qscore++; }
    else { op.classList.add("wrong"); opts[it.a].classList.remove("dim"); opts[it.a].classList.add("correct"); }
    const fb = document.getElementById("fb");
    fb.innerHTML = "<b>" + (i === it.a ? "Correcto. " : "La correcta es " + "ABCD"[it.a] + ". ") + "</b>" + it.fb;
    fb.classList.add("show");
    document.getElementById("qnext").classList.remove("hide");
  }));

  document.getElementById("qnext").addEventListener("click", () => {
    if (qpos === quiz.items.length - 1){ qdone = true; } else { qpos++; }
    drawQuiz();
  });
}

renderQuizFilter();
loadQuiz(quizKey);
