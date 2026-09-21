"use strict";
/* ===== Eudaimonía ===== juego de la ética de Aristóteles ===== depende de: juego_aristoteles.js, store.js ===== */

const ARI = { char: null, a:0, c:0, b:0, phr:0, round:0, deck:[], answered:false, dead:false };
function ariBox(){ return document.getElementById("aribox"); }
function ariEud(){ return ARI.a + ARI.c + ARI.b; }
function ariShuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function ariEsc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function ariImg(id){ return JUEGO_ARIS.meta.imgBase + id + ".jpg"; }

/* ---------- elección de personaje ---------- */
function renderAriStart(){
  const box = ariBox(); if(!box) return;
  const cards = JUEGO_ARIS.chars.map(c =>
    '<button class="ari-char" data-char="' + c.id + '">' +
      '<div class="ari-portrait"><img loading="lazy" src="' + ariImg("char-" + c.id) + '" alt="' + ariEsc(c.name) + '"><span class="ari-orient">' + c.orient + '</span></div>' +
      '<div class="ari-char-b"><div class="ari-char-h"><b>' + c.name + '</b></div>' +
        '<div class="ari-stats"><span>🧠<b>' + c.alma + '</b></span><span>🏋️<b>' + c.cuerpo + '</b></span><span>💰<b>' + c.bienes + '</b></span><span>🧭<b>' + c.phronesis + '</b></span></div>' +
        '<div class="ari-traits"><span class="ari-vir">' + c.virtud + '</span><span class="ari-deb">' + c.debilidad + '</span></div>' +
        '<div class="ari-frase">«' + c.frase + '»</div></div>' +
    '</button>').join("");
  box.innerHTML = '<div class="ari-wrap">' +
    '<div class="ari-col-h">Elige tu personaje · ' + JUEGO_ARIS.meta.rounds + ' dilemas · si la eudaimonía cae a 0, es el fin</div>' +
    '<div class="ari-chars">' + cards + '</div></div>';
  box.querySelectorAll("[data-char]").forEach(b => b.addEventListener("click", () => ariStart(b.dataset.char)));
}

/* ---------- partida ---------- */
function ariStart(id){
  const c = JUEGO_ARIS.chars.find(x => x.id===id);
  ARI.char=c; ARI.a=c.alma; ARI.c=c.cuerpo; ARI.b=c.bienes; ARI.phr=c.phronesis; ARI.round=0; ARI.dead=false;
  ARI.deck = ariShuffle(JUEGO_ARIS.dilemmas).slice(0, JUEGO_ARIS.meta.rounds);
  ariRenderDilemma();
}

function ariHud(){
  const low = ariEud() <= 8;
  return '<div class="ari-hud">' +
    '<span class="ari-who"><img class="ari-mini" src="' + ariImg("char-" + ARI.char.id) + '" alt=""> ' + ARI.char.name + '</span>' +
    '<span class="ari-stat">Ronda <b>' + (ARI.round+1) + '</b>/' + JUEGO_ARIS.meta.rounds + '</span>' +
    '<span class="ari-goods">🧠<b id="ariA">' + ARI.a + '</b> 🏋️<b id="ariC">' + ARI.c + '</b> 💰<b id="ariB">' + ARI.b + '</b></span>' +
    '<span class="ari-eud' + (low?" low":"") + '">🌿 <b id="ariEud">' + ariEud() + '</b></span>' +
    '<span class="ari-stat">🧭 <b id="ariPhr">' + ARI.phr + '</b></span>' +
  '</div>';
}

function ariRenderDilemma(){
  const d = ARI.deck[ARI.round]; ARI.answered=false;
  const opts = d.opts.map((o,i) => '<button class="ari-opt" data-i="' + i + '"><span class="k">' + "ABCD"[i] + '</span><span class="ari-ot">' + ariEsc(o.t) + ariPreview(o) + (o.risk?' <span class="ari-risk">azar 🎲</span>':'') + '</span></button>').join("");
  ariBox().innerHTML = '<div class="ari-wrap">' + ariHud() +
    '<div class="ari-card"><div class="ari-virtue">' + ariEsc(d.virtue) + '</div>' +
      '<p class="ari-sit">' + ariEsc(d.sit) + '</p>' +
      '<div class="ari-opts">' + opts + '</div>' +
      '<div class="ari-res" id="ariRes"></div>' +
      '<div class="ari-foot"><button class="ari-next" id="ariNext" hidden></button></div>' +
    '</div></div>';
  ariBox().querySelectorAll(".ari-opt").forEach(b => b.addEventListener("click", () => ariChoose(+b.dataset.i)));
  document.getElementById("ariNext").addEventListener("click", ariNext);
}

// vista previa de los efectos de una opción (pequeña, en el botón)
function ariPreview(o){
  const p = [];
  [["a","🧠"],["c","🏋️"],["b","💰"],["phr","🧭"]].forEach(([k,em]) => { if(o[k]) p.push('<span class="' + (o[k]>0?"up":"down") + '">' + (o[k]>0?"+":"") + o[k] + em + '</span>'); });
  return p.length ? ' <span class="ari-pv">' + p.join(" ") + '</span>' : "";
}

function ariApply(o){ ARI.a += o.a||0; ARI.c += o.c||0; ARI.b += o.b||0; ARI.phr = Math.max(0, ARI.phr + (o.phr||0)); }

function ariChoose(i){
  if(ARI.answered) return; ARI.answered=true;
  const d = ARI.deck[ARI.round], o = d.opts[i];
  const opts = [...document.querySelectorAll(".ari-opt")];
  opts.forEach((b,j) => { b.disabled=true; if(j!==i) b.classList.add("dim"); });
  opts[i].classList.add("chosen");
  ariApply(o);
  let html = '<div class="ari-line"><b>Tu decisión:</b> ' + ariEsc(o.t) + '</div>';
  // riesgo (dado)
  if(o.risk){
    const p = Math.min(0.85, 0.30 + ARI.phr*0.06); const ok = Math.random() < p;
    const eff = ok ? { a:2, b:1 } : { a:-3, c:-1 };
    ariApply(eff);
    html += '<div class="ari-dado ' + (ok?"win":"lose") + '">🎲 <b>El azar ' + (ok?"te favorece":"te es adverso") + '</b>' + (ARI.phr>=6?' <span class="ari-hint">(tu prudencia inclina la suerte)</span>':'') + ariDelta(eff) + '</div>';
  }
  // carta de azar (destacada)
  if(Math.random() < JUEGO_ARIS.chanceProb){
    const cc = JUEGO_ARIS.chance[Math.floor(Math.random()*JUEGO_ARIS.chance.length)];
    ariApply(cc);
    html += '<div class="ari-chance-card ' + (cc.bad?"bad":"good") + '">' +
      (cc.img ? '<img class="ari-chance-img" src="' + ariImg(cc.img) + '" alt="">' : '<div class="ari-chance-ph">' + (cc.bad?"🃏":"🎴") + '</div>') +
      '<div class="ari-chance-t"><span class="ari-chance-tag">🎲 Carta de azar</span><b>' + ariEsc(cc.t) + '</b><p>' + ariEsc(cc.d) + '</p>' + ariDelta(cc) + '</div></div>';
  }
  ariRefreshHud();
  ARI.dead = ariEud() <= 0;
  const res = document.getElementById("ariRes"); res.innerHTML = html; res.classList.add("show");
  const nx = document.getElementById("ariNext");
  nx.textContent = ARI.dead ? "Ver el final ✝" : (ARI.round === JUEGO_ARIS.meta.rounds-1 ? "Ver balance" : "Siguiente dilema →");
  nx.hidden = false;
}

function ariRefreshHud(){
  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  set("ariA",ARI.a); set("ariC",ARI.c); set("ariB",ARI.b); set("ariPhr",ARI.phr);
  const e = document.getElementById("ariEud"); if(e){ e.textContent=ariEud(); const wrap=e.closest(".ari-eud"); if(wrap){ wrap.classList.add("bump"); wrap.classList.toggle("low", ariEud()<=8); setTimeout(()=>wrap.classList.remove("bump"),260); } }
}

function ariDelta(o){
  const p=[]; [["a","🧠"],["c","🏋️"],["b","💰"],["phr","🧭"]].forEach(([k,em]) => { if(o[k]) p.push('<span class="' + (o[k]>0?"up":"down") + '">' + (o[k]>0?"+":"") + o[k] + em + '</span>'); });
  return ' <span class="ari-d">' + (p.length?p.join(" "):"—") + '</span>';
}

function ariNext(){ if(ARI.dead){ ariResult(); return; } ARI.round++; if(ARI.round >= JUEGO_ARIS.meta.rounds) ariResult(); else ariRenderDilemma(); }

/* ---------- balance final ---------- */
function ariBand(eud){ return JUEGO_ARIS.bands.find(b => eud >= b.min) || JUEGO_ARIS.bands[JUEGO_ARIS.bands.length-1]; }
function ariResult(){
  const eud = Math.max(0, ariEud()); const band = ARI.dead ? JUEGO_ARIS.bands[JUEGO_ARIS.bands.length-1] : ariBand(eud);
  const key="aula-eudaimonia-best"; const best=store.get(key,{}); const prev=best[ARI.char.id]||0;
  const record = !ARI.dead && eud>prev; if(record){ best[ARI.char.id]=eud; store.set(key,best); }
  const q = JUEGO_ARIS.reflect[Math.floor(Math.random()*JUEGO_ARIS.reflect.length)];
  ariBox().innerHTML = '<div class="ari-wrap"><div class="ari-result' + (ARI.dead?" dead":"") + '">' +
    '<img class="ari-result-img" src="' + ariImg("char-" + ARI.char.id) + '" alt="">' +
    '<div class="ari-badge">' + band.emoji + '</div>' +
    '<div class="ari-rank">' + band.label + '</div>' +
    '<div class="ari-final">' + eud + ' <span>eudaimonía</span></div>' +
    '<p class="ari-stats2">' + ARI.char.name + ' · 🧠' + ARI.a + ' 🏋️' + ARI.c + ' 💰' + ARI.b + ' · 🧭' + ARI.phr +
      (ARI.dead ? ' · cayó en la ronda ' + (ARI.round+1) : ' · ' + (record ? '¡tu mejor vida hasta ahora! 🎉' : 'mejor con ' + ARI.char.name + ': ' + Math.max(prev,eud))) + '</p>' +
    '<blockquote class="ari-reflect">Para pensar: ' + ariEsc(q) + '</blockquote>' +
    '<div class="ari-actions"><button class="btn2 primary" id="ariAgain">Otra vida</button>' +
      '<button class="btn2" id="ariHome">Cambiar de personaje</button></div>' +
  '</div></div>';
  document.getElementById("ariAgain").addEventListener("click", () => ariStart(ARI.char.id));
  document.getElementById("ariHome").addEventListener("click", renderAriStart);
}

/* ---------- init ---------- */
function initAri(){ if(typeof JUEGO_ARIS==="undefined") return; renderAriStart(); }
document.addEventListener("DOMContentLoaded", initAri);
(function(){ const nav=document.getElementById("tabs"); if(nav) nav.addEventListener("click", e => { const b=e.target.closest("button"); if(b && b.dataset.view==="eudaimonia") renderAriStart(); }); })();
