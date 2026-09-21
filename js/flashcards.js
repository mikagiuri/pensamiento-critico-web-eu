"use strict";
/* ===== Tarjetas (flashcards) ===== depende de: store.js, data.js ===== */

let deckKey = Object.keys(DECKS)[0];
let order = [];
let pos = 0;
let flipped = false;
let deckSubject = "all";
let deckBlock = "all";
const known = store.get("aula-known", {});

const cardEl = document.getElementById("card");

const DECK_SUBJECTS = { fil: "Filosofia 1.", hf: "Filosofiaren Historia", ipc: "Pentsamendu kritikoa" };
const DECK_BLOCKS = { A: "A blokea · Antzinakoa", B: "B blokea · Erdi Arokoa-Modernoa", C: "C blokea · Garaikidea" };

function renderDeckFilter(){
  const box = document.getElementById("deckfilter");
  const subjBtns = ["all", "fil", "hf", "ipc"].map(s =>
    '<button class="fbtn" data-subj="' + s + '" aria-pressed="' + (s === deckSubject) + '">' +
    (s === "all" ? "Guztiak" : DECK_SUBJECTS[s]) + '</button>'
  ).join("");
  let blockBtns = "";
  if (deckSubject === "hf"){
    blockBtns = ["all", "A", "B", "C"].map(b =>
      '<button class="fbtn" data-block="' + b + '" aria-pressed="' + (b === deckBlock) + '">' +
      (b === "all" ? "Bloke guztiak" : DECK_BLOCKS[b]) + '</button>'
    ).join("");
  }
  box.innerHTML = '<div class="fgroup"><span class="flabel">Ikasgaia</span>' + subjBtns + '</div>' +
    (blockBtns ? '<div class="fgroup"><span class="flabel">Blokea</span>' + blockBtns + '</div>' : '');
  box.querySelectorAll("[data-subj]").forEach(b => b.addEventListener("click", () => {
    deckSubject = b.dataset.subj;
    if (deckSubject !== "hf") deckBlock = "all";
    renderDeckFilter();
    renderDeckChips();
  }));
  box.querySelectorAll("[data-block]").forEach(b => b.addEventListener("click", () => {
    deckBlock = b.dataset.block;
    renderDeckFilter();
    renderDeckChips();
  }));
}

function renderDeckChips(){
  const box = document.getElementById("deckchips");
  const entries = Object.entries(DECKS).filter(([k, d]) => {
    if (deckSubject !== "all" && d.subject !== deckSubject) return false;
    if (deckSubject === "hf" && deckBlock !== "all" && d.block !== deckBlock) return false;
    return true;
  });
  box.innerHTML = entries
    .map(([k, d]) => `<button class="chip" data-deck="${k}" aria-pressed="${k === deckKey}">${d.name}</button>`).join("");
  box.querySelectorAll("[data-deck]").forEach(b => b.addEventListener("click", () => loadDeck(b.dataset.deck)));
}

function loadDeck(k){
  deckKey = k;
  order = DECKS[k].cards.map((_, i) => i);
  pos = 0; flipped = false;
  renderDeckChips();
  drawCard();
}

function drawCard(){
  const deck = DECKS[deckKey], idx = order[pos], c = deck.cards[idx];
  document.getElementById("deckname").textContent = deck.name;
  document.getElementById("fccount").textContent = (pos + 1) + " / " + deck.cards.length;
  document.getElementById("fcemoji").textContent = c[0];
  document.getElementById("fcfront").textContent = c[1];
  document.getElementById("fcback").textContent = c[2];
  flipped = false; cardEl.classList.remove("flipped");
  const kk = deckKey + ":" + idx, on = !!known[kk];
  const kb = document.getElementById("fcknown");
  kb.classList.toggle("on", on); kb.textContent = on ? "✓ Badakit" : "Badakit";
  const learned = order.filter(i => known[deckKey + ":" + i]).length;
  document.getElementById("fcprog").style.width = (learned / deck.cards.length * 100) + "%";
}

function flip(){ flipped = !flipped; cardEl.classList.toggle("flipped", flipped); }
function move(d){ const n = DECKS[deckKey].cards.length; pos = (pos + d + n) % n; drawCard(); }

cardEl.addEventListener("click", flip);
document.getElementById("fcnext").addEventListener("click", () => move(1));
document.getElementById("fcprev").addEventListener("click", () => move(-1));
document.getElementById("fcshuf").addEventListener("click", () => {
  for (let i = order.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  pos = 0; drawCard();
});
document.getElementById("fcknown").addEventListener("click", () => {
  const kk = deckKey + ":" + order[pos];
  known[kk] = !known[kk]; if (!known[kk]) delete known[kk];
  store.set("aula-known", known); drawCard();
});
document.addEventListener("keydown", e => {
  if (!document.getElementById("tarjetas").classList.contains("active")) return;
  if (e.code === "Space"){ e.preventDefault(); flip(); }
  else if (e.key === "ArrowRight") move(1);
  else if (e.key === "ArrowLeft") move(-1);
});

renderDeckFilter();
loadDeck(deckKey);
