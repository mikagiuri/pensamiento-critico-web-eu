"use strict";
/* ===== La República ===== juego de diseño de la ciudad de Platón (v4) =====
   Diseñas una ciudad con perfiles (+/−). Cada persona tiene TRES VIRTUDES del alma:
   Sabiduría-Justicia (SJ ⚖️), Valentía (V 🛡️) y Templanza (T 🍷). Coste = suma de las 3.
     · Guardián: las tres virtudes ≥4  (444 → máx. 555)
     · Guerrero: valentía y templanza ≥4  (x44 → máx. 355)
     · Productor: templanza ≥4  (xx4 → máx. 335)
   La PRODUCCIÓN 🌾 NO es una virtud: es un stat DE LA CIUDAD. Solo la generan los
   productores (cada uno alimenta a 2 personas) y debe cubrir a toda la población.
   Luego, tantos turnos como cartas del mazo (Real 8 / Fácil 7), fundados en
   Platón/Aristóteles, con penalizaciones graduadas y ULTRAEXIGENTES (un diseño
   casi perfecto también cae), eventos positivos, eventos que MATAN ciudadanos,
   penalización creciente a las ciudades de menos de 30 habitantes y CARTAS DEL
   DESTINO (peste, guerra, terremoto, muerte del fundador): sucesos inevitables
   que golpean a cualquier ciudad — la fortuna/necesidad que ni la polis justa
   evita. El mazo siempre incluye varias (Real 3 / Fácil 2). Las acciones son
   la tabla de salvación de quien diseñó mal. */

const REP_ARM0 = 10, REP_START = 10, REP_TARGET = 30;   // armonía: empieza en 10 (referencia de la barra); NO tiene techo, puede subir por encima
const REP_FATE = ["peste","guerra","terremoto","fundador"];   // cartas del destino (daño inevitable)
const REP_AP0 = 6;
const REP_OUT = 2;   // cada productor alimenta (produce para) 2 personas
const REP_MODES = {
  facil: { name:"Fácil", budget:265, ratio:false, deck:7 },
  real:  { name:"Real",  budget:225, ratio:true,  deck:8 }
};
const REP_ROSTER = {
  Z: [ { id:"z_recto", name:"Guardianes rectos", sj:4,v:4,t:4, note:"las tres virtudes al mínimo" },
       { id:"z_sabio", name:"Guardianes sabios", sj:5,v:4,t:4, note:"más sabiduría-justicia" },
       { id:"z_pleno", name:"Guardianes plenos", sj:5,v:5,t:5, note:"virtud máxima" } ],
  G: [ { id:"g_tropa", name:"Guerreros", sj:1,v:4,t:4, note:"lo básico" },
       { id:"g_vet", name:"Veteranos", sj:2,v:5,t:4, note:"curtidos" },
       { id:"g_heroe", name:"Héroes", sj:3,v:5,t:5, note:"los mejores" } ],
  E: [ { id:"labriego", name:"Labriegos", sj:1,v:1,t:4, note:"el pueblo que trabaja" },
       { id:"diligente", name:"Productores diligentes", sj:2,v:2,t:5, note:"templados y laboriosos" } ]
};
const REP_IMG = "media/juegos/platon/";
const REP_ACTS = [
  { id:"moviliza", name:"Movilización", ap:2, img:"ac-agoge", d:"Un productor se forma como guerrero.", ok:()=>rep.t.E.n>1,
    run:()=>{ repMove("E","G",1); } },
  { id:"heroismo", name:"Heroísmo", ap:1, img:"ac-heroismo", d:"Este turno, los guerreros valen ×1,5.", ok:()=>!rep.t.hero, run:()=>{ rep.t.hero=true; } },
  { id:"educacion", name:"Reforma educativa", ap:1, img:"ac-ejemplo", d:"Los guardianes ganan sabiduría-justicia (+3).", run:()=>{ rep.t.Z.sj+=3; if(rep.t.Z.max<5)rep.t.Z.max=5; rep.t.Z.just=rep.t.Z.n; } },
  { id:"cosecha", name:"Impulso a la producción", ap:1, img:"ac-vida", d:"La ciudad produce más alimento (+8 producción).", run:()=>{ rep.t.prodBonus=(rep.t.prodBonus||0)+8; } },
  { id:"purga", name:"Purga de corruptos", ap:2, img:"ac-politica", d:"Recuperas 1 punto de armonía.", run:()=>{ rep.armonia=Math.round((rep.armonia+1)*10)/10; } }
];

const rep = repFresh();
function repFresh(){ return { mode:"real", acciones:"si", cnt:{}, armonia:REP_START, turn:0, turns:8, deck:[], resolved:false, nZ:0,nG:0,nE:0, t:null, ap:0, apTurn:0, used:new Set(), log:[], turnActs:[], designText:"" }; }
function repBox(){ return document.getElementById("repbox"); }
function cost(c){ return c.sj+c.v+c.t; }
function repShuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

// ---- estado de la ciudad diseñada ----
function repCompute(){
  const cls={}; let pts=0;
  ["Z","G","E"].forEach(k=>{ let n=0,sj=0,v=0,t=0,max=0,just=0;
    REP_ROSTER[k].forEach(c=>{ const q=rep.cnt[c.id]||0; if(q){ n+=q; pts+=cost(c)*q; sj+=c.sj*q; v+=c.v*q; t+=c.t*q; max=Math.max(max,c.sj); if(c.sj>=5)just+=q; } });
    cls[k]={n,sj,v,t,max,just}; });
  rep.nZ=cls.Z.n; rep.nG=cls.G.n; rep.nE=cls.E.n; rep._cls=cls;
  const pop=cls.Z.n+cls.G.n+cls.E.n, prod=REP_OUT*cls.E.n;
  return { nZ:cls.Z.n, nG:cls.G.n, nE:cls.E.n, pop, pts, prod };
}
function repLegal(){
  const s=repCompute(); const m=REP_MODES[rep.mode]; const errs=[];
  if(s.nZ<1||s.nG<1||s.nE<1) errs.push("Debe haber al menos un guardián, un guerrero y un productor.");
  if(s.pts>m.budget) errs.push("Te pasas del presupuesto ("+s.pts+"/"+m.budget+" puntos).");
  if(m.ratio && s.nE < 2*(s.nZ+s.nG)) errs.push("Regla de Platón: los productores ("+s.nE+") deben ser ≥ 2×(guardianes+guerreros) = "+2*(s.nZ+s.nG)+".");
  return { ok:errs.length===0, errs, s };
}

// ---- durante la partida: totales derivados y muertes ----
function T(){ return rep.t; }
function repPop(){ return rep.t.Z.n+rep.t.G.n+rep.t.E.n; }
function repNGeff(){ return rep.t.hero ? rep.t.G.n*1.5 : rep.t.G.n; }
function repSum(stat){ return rep.t.Z[stat]+rep.t.G[stat]+rep.t.E[stat]; }
function repProd(){ return REP_OUT*rep.t.E.n + (rep.t.prodBonus||0); }   // producción de la CIUDAD (solo productores)
function repKill(cls,n){ const c=rep.t[cls]; if(c.n<=0)return 0; const k=Math.min(n,c.n); const f=(c.n-k)/c.n;
  c.sj*=f; c.v*=f; c.t*=f; c.just=Math.round(c.just*f); c.n-=k; return k; }
function repMove(a,b,n){ const A=rep.t[a],B=rep.t[b]; if(A.n<n)return; const proto=REP_ROSTER[b][0];
  const fa=(A.n-n)/A.n; A.sj*=fa;A.v*=fa;A.t*=fa; A.n-=n;
  B.n+=n; B.sj+=proto.sj*n; B.v+=proto.v*n; B.t+=proto.t*n; }

/* ================= EVENTOS (v4) — d: cambio de armonía (± ); kill:{cls,n}; ================= */
const F=Math.floor;
const REP_EVENTS = [
  // — negativos graduados (Platón, República) —
  { id:"rebelion", name:"Rebelión de los productores", src:"Rep. IV", img:"ev-matxinada",
    threat:"Demasiados productores frente a los guerreros: X = (productores − guerreros) ÷ 4.",
    effect:()=>{ const x=F(Math.max(0,rep.t.E.n-rep.t.G.n)/4); return { d:-x, msg:x?("Revuelta: −"+x):"La masa está contenida." }; } },
  { id:"golpe", name:"Golpe de estado", src:"Rep. VIII", img:"ev-golpe",
    threat:"Un ejército muy superior al gobierno da un golpe (mata a un guardián).",
    effect:()=>{ if(repNGeff()>rep.t.Z.n*3){ const k=repKill("Z",1); return { d:-3, msg:"¡Golpe! −3 y muere "+k+" guardián." }; }
      if(rep.t.G.n>rep.t.Z.n*2) return { d:-1, msg:"Tensión militar: −1." }; return { d:0, msg:"El ejército respeta al gobierno." }; } },
  { id:"corrupcion", name:"Corrupción", src:"Rep. I", img:"ev-corrupcion",
    threat:"Pierdes 1 punto por cada guardián que no sea plenamente justo (SJ<5).",
    effect:()=>{ const x=rep.t.Z.n-rep.t.Z.just; return { d:-x, msg:x?("−"+x+" por guardianes poco justos"):"Todos tus guardianes son justos." }; } },
  { id:"caverna", name:"Sombras en la caverna", src:"Rep. VII", img:"ev-sabiduria",
    threat:"Si la sabiduría-justicia media de la polis es baja (<3,8), sigue entre sombras.",
    effect:()=>{ const avg=repSum("sj")/Math.max(1,repPop()); return avg<3.8 ? { d:-2, msg:"Ignorancia: −2." } : { d:0, msg:"La ciudad busca la luz." }; } },
  // — Aristóteles / muertes / tamaño —
  { id:"ataque", name:"Ataque exterior", src:"Pol. VII", img:"ev-ataque",
    threat:"Si hay pocos defensores (guerreros < productores ÷ 2,5), el enemigo entra y mata.",
    effect:()=>{ if(repNGeff() < rep.t.E.n/2.5){ const k=repKill("G",F(rep.t.G.n/4))+repKill("E",F(rep.t.E.n/12)); return { d:-2, msg:"Invasión: −2"+(k?" y mueren "+k+" ciudadanos.":".") }; } return { d:0, msg:"La defensa aguanta." }; } },
  { id:"peste", name:"La peste", src:"Destino", img:"ev-hambruna", fate:true,
    threat:"Una epidemia se ceba en la masa: mata a parte de los productores y guerreros.",
    effect:()=>{ const k=repKill("E",F(rep.t.E.n/5))+repKill("G",F(rep.t.G.n/8)); return { d:-2, msg:"Peste: −2 y mueren "+k+" ciudadanos." }; } },
  { id:"hambruna", name:"Hambruna", src:"Pol. I", img:"ev-hambruna",
    threat:"Sin un margen de producción holgado (excedente < 10% de la población), hay hambre y muertes.",
    effect:()=>{ const margin=repPop()*0.1, surplus=repProd()-repPop(); if(surplus<margin){ const x=F((margin-surplus)/3)||1, k=repKill("E",F(Math.max(0,-surplus)/6)); return { d:-x, msg:"Hambre: −"+x+(k?" y mueren "+k+" productores.":".") }; } return { d:0, msg:"La producción alimenta a la ciudad." }; } },
  { id:"menguada", name:"Ciudad menguada", src:"Pol. I", img:"ev-ataque",
    threat:"Una polis pequeña no se basta a sí misma: cuanto menos de 30 habitantes, peor (÷2).",
    effect:()=>{ const x=F(Math.max(0,REP_TARGET-repPop())/2); return { d:-x, msg:x?("Debilidad ("+repPop()+" hab.): −"+x):"Ciudad autosuficiente." }; } },
  // — positivos —
  { id:"alianza", name:"Alianza comercial", src:"Rep.", img:"ev-corrupcion",
    threat:"Si los productores son la mayoría (≥60%), florece el comercio.",
    effect:()=>{ return rep.t.E.n >= 0.6*repPop() ? { d:2, msg:"Comercio próspero: +2." } : { d:0, msg:"Sin mayoría productora." }; } },
  { id:"victoria", name:"Victoria militar", src:"—", img:"ev-golpe",
    threat:"Un ejército fuerte (guerreros ≥ guardianes ×3) gana una guerra.",
    effect:()=>{ return repNGeff() >= rep.t.Z.n*3 ? { d:1, msg:"Victoria: +1." } : { d:0, msg:"Sin fuerza para vencer." }; } },
  { id:"reforma", name:"Reforma justa", src:"Rep.", img:"ev-sabiduria",
    threat:"Si tus guardianes son plenamente justos (SJ medio ≥5), recuperas armonía.",
    effect:()=>{ return (rep.t.Z.sj/Math.max(1,rep.t.Z.n))>=5 ? { d:2, msg:"Buen gobierno: +2." } : { d:0, msg:"Falta justicia plena arriba." }; } },
  { id:"cosecha", name:"Cosecha abundante", src:"—", img:"ev-hambruna",
    threat:"Si la ciudad produce de sobra (excedente ≥ 40% de la población), hay bonanza.",
    effect:()=>{ return (repProd()-repPop()) >= repPop()*0.4 ? { d:2, msg:"Excedente: +2." } : { d:0, msg:"Sin excedente notable." }; } },
  // — Atenas y su historia (contexto de Platón y Aristóteles) —
  { id:"delos", name:"Liga de Delos", src:"Historia", img:"ev-delos",
    threat:"Con una flota fuerte (guerreros ≥ productores ÷ 2,5), los aliados pagan tributo; si no, se sublevan.",
    effect:()=>{ return repNGeff() >= rep.t.E.n/2.5 ? { d:2, msg:"Tributo de los aliados: +2." } : { d:-1, msg:"Los aliados se sublevan: −1." }; } },
  { id:"esparta", name:"Invasión de Esparta", src:"Guerra del Peloponeso", img:"ev-esparta",
    threat:"Esparta arrasa los campos. Si los defensores son escasos (guerreros < productores ÷ 3), es una masacre.",
    effect:()=>{ if(repNGeff() < rep.t.E.n/3){ const k=repKill("E",F(rep.t.E.n/8))+repKill("G",F(rep.t.G.n/6)); return { d:-3, msg:"Devastación: −3 y mueren "+k+" ciudadanos." }; } return { d:-1, msg:"Resistes tras las murallas: −1." }; } },
  { id:"socrates", name:"Juicio a Sócrates", src:"Apología", img:"ev-socrates",
    threat:"La ciudad juzga a su hombre más sabio. Sin un guardián plenamente sabio (SJ 5), lo condena.",
    effect:()=>{ return rep.t.Z.max>=5 ? { d:1, msg:"La sabiduría lo absuelve: +1." } : { d:-2, msg:"Condenan al más sabio: −2." }; } },
  { id:"pericles", name:"La ambición de Pericles", src:"Historia", img:"ev-pericles",
    threat:"Un líder brillante emprende grandes obras. Con guardianes templados (templanza media ≥4,5) es un siglo de oro; sin mesura, hybris.",
    effect:()=>{ const tavg=rep.t.Z.t/Math.max(1,rep.t.Z.n); return tavg>=4.5 ? { d:2, msg:"Siglo de oro de Pericles: +2." } : { d:-2, msg:"Ambición desmedida (hybris): −2." }; } },
  { id:"sofistas", name:"Auge de los sofistas", src:"Gorgias", img:"ev-sofistas",
    threat:"Maestros de la retórica seducen a la juventud. Si menos de 3/4 de tus guardianes son plenamente justos, vencen.",
    effect:()=>{ return rep.t.Z.just >= rep.t.Z.n*0.75 ? { d:1, msg:"Los filósofos los refutan: +1." } : { d:-2, msg:"El relativismo corrompe: −2." }; } },
  { id:"timocracia", name:"Timocracia", src:"Rep. VIII", img:"ev-timocracia",
    threat:"Si los guerreros superan en 1,5× a los guardianes, el honor sustituye a la razón.",
    effect:()=>{ return rep.t.G.n > rep.t.Z.n*1.5 ? { d:-2, msg:"La ciudad degenera en timocracia: −2." } : { d:1, msg:"La razón sigue al mando: +1." }; } },
  { id:"oraculo", name:"Oráculo inquietante", src:"Delfos", img:"ev-oraculo",
    threat:"La Pitia pronuncia un presagio ambiguo. El destino, esta vez, no depende de tu ciudad.",
    effect:()=>{ return rep.rng<0.55 ? { d:-2, msg:"Presagio funesto: −2." } : { d:1, msg:"Presagio favorable: +1." }; } },
  // — CARTAS DEL DESTINO (inevitables: golpean a cualquier ciudad, se diseñe como se diseñe) —
  { id:"guerra", name:"Guerra prolongada", src:"Destino", img:"ev-guerra", fate:true,
    threat:"Ninguna ciudad se libra de la guerra: desgasta a la polis y cuesta vidas de guerreros.",
    effect:()=>{ const k=repKill("G",F(rep.t.G.n/8)); return { d:-2, msg:"La guerra desangra la ciudad: −2"+(k?" y caen "+k+" guerreros.":".") }; } },
  { id:"terremoto", name:"Terremoto", src:"Destino", img:"ev-terremoto", fate:true,
    threat:"La tierra tiembla sin avisar: derriba y mata sin distinguir clases.",
    effect:()=>{ const k=repKill("E",F(rep.t.E.n/10))+repKill("Z",F(rep.t.Z.n/12)); return { d:-2, msg:"Se derrumba la ciudad: −2"+(k?" y mueren "+k+" personas.":".") }; } },
  { id:"fundador", name:"Muerte del fundador", src:"Destino", img:"ev-fundador", fate:true,
    threat:"Muere quien fundó la ciudad: la sucesión abre una crisis que a nadie perdona.",
    effect:()=>{ return { d:-2, msg:"Crisis de sucesión: −2." }; } }
];

/* ---------- setup ---------- */
function renderRepStart(){
  const box=repBox(); if(!box) return; Object.assign(rep, repFresh());
  box.innerHTML='<div class="rep-wrap"><div class="rep-modes-pick" id="repModes"></div>'+
    '<div class="rep-design"><div class="rep-roster" id="repRoster"></div><aside class="rep-summary" id="repSummary"></aside></div></div>';
  drawRepModes(); drawRepRoster(); drawRepSummary();
}
function drawRepModes(){
  document.getElementById("repModes").innerHTML=
    '<span class="flabel">Dificultad</span>'+Object.entries(REP_MODES).map(([k,m])=>'<button class="pbtn" data-mode="'+k+'" aria-pressed="'+(k===rep.mode)+'">'+m.name+'</button>').join("")+
    '<span class="flabel" style="margin-left:.8rem">Acciones</span><button class="pbtn" data-acc="si" aria-pressed="'+(rep.acciones==="si")+'">Con acciones</button><button class="pbtn" data-acc="no" aria-pressed="'+(rep.acciones==="no")+'">Sin acciones</button>'+
    '<button class="pbtn rep-rnd" id="repRandom">🎲 Aleatoria</button>'+
    (repHistLoad().length?'<button class="pbtn rep-hist-open" id="repHistOpen">📚 Partidas ('+repHistLoad().length+')</button>':'');
  document.querySelectorAll("#repModes [data-mode]").forEach(b=>b.addEventListener("click",()=>{ rep.mode=b.dataset.mode; drawRepModes(); drawRepSummary(); }));
  document.querySelectorAll("#repModes [data-acc]").forEach(b=>b.addEventListener("click",()=>{ rep.acciones=b.dataset.acc; drawRepModes(); }));
  const rnd=document.getElementById("repRandom"); if(rnd) rnd.addEventListener("click",repRandom);
  const ho=document.getElementById("repHistOpen"); if(ho) ho.addEventListener("click",renderRepHistory);
}
function statPips(c){ return '<span class="rep-pips">⚖️'+c.sj+' 🛡️'+c.v+' 🍷'+c.t+' <em>· '+cost(c)+'</em></span>'; }
function drawRepRoster(){
  const sec=(title,list)=>'<div class="rep-rsec"><h3>'+title+'</h3>'+list.map(c=>{ const n=rep.cnt[c.id]||0;
    return '<div class="rep-rrow prod"><div class="rep-rname">'+c.name+' <span class="rep-note">'+c.note+'</span><br>'+statPips(c)+'</div>'+
      '<div class="rep-step"><button data-esub="'+c.id+'">−</button><span class="n">'+n+'</span><button data-eadd="'+c.id+'">+</button></div></div>'; }).join("")+'</div>';
  document.getElementById("repRoster").innerHTML =
    sec("🦉 Guardianes <span class=\"rep-floor\">las tres virtudes ≥4</span>",REP_ROSTER.Z)+
    sec("🛡️ Guerreros <span class=\"rep-floor\">valentía y templanza ≥4</span>",REP_ROSTER.G)+
    sec("🌾 Productores <span class=\"rep-floor\">templanza ≥4 · alimentan la ciudad</span>",REP_ROSTER.E);
  document.querySelectorAll("#repRoster [data-eadd]").forEach(b=>b.addEventListener("click",()=>{ const id=b.dataset.eadd; rep.cnt[id]=(rep.cnt[id]||0)+1; drawRepRoster(); drawRepSummary(); }));
  document.querySelectorAll("#repRoster [data-esub]").forEach(b=>b.addEventListener("click",()=>{ const id=b.dataset.esub; if(rep.cnt[id]>0){ rep.cnt[id]--; drawRepRoster(); drawRepSummary(); } }));
}
function drawRepSummary(){
  const { ok, errs, s }=repLegal(); const m=REP_MODES[rep.mode]; const fed=s.prod>=s.pop;
  document.getElementById("repSummary").innerHTML=
    '<div class="rep-sum-h">Tu ciudad</div>'+
    '<div class="rep-sum-row"><span>Población</span><b class="'+(s.pop>=REP_TARGET?"ok":"")+'">'+s.pop+(s.pop<REP_TARGET?' <small>(&lt;30: penaliza)</small>':'')+'</b></div>'+
    '<div class="rep-sum-row"><span>Puntuak</span><b class="'+(s.pts<=m.budget?"ok":"bad")+'">'+s.pts+' / '+m.budget+'</b></div>'+
    '<div class="rep-sum-classes"><span>🦉 '+s.nZ+'</span><span>🛡️ '+s.nG+'</span><span>🌾 '+s.nE+'</span></div>'+
    '<div class="rep-sum-row"><span>🌾 Producción</span><b class="'+(fed?"ok":"bad")+'">'+s.prod+' <small>vs '+s.pop+' comen</small></b></div>'+
    (m.ratio?'<div class="rep-sum-row"><span>Proporción</span><b class="'+(s.nE>=2*(s.nZ+s.nG)?"ok":"bad")+'">prod ≥ 2×élite</b></div>':'')+
    '<div class="rep-fate-note">🎴 Ojo: el mundo es exigente. Además de los eventos que castigan un mal diseño (ahora más duros), el mazo trae <b>cartas del destino</b> —peste, guerra, terremoto, muerte del fundador— que golpean a cualquier ciudad. Ni el diseño perfecto está a salvo; las <b>acciones</b> son tu tabla de salvación.</div>'+
    (ok?'<button class="rep-play" id="repPlay">Fundar la república →</button>':'<ul class="rep-errs">'+errs.map(e=>'<li>'+e+'</li>').join("")+'</ul>');
  const p=document.getElementById("repPlay"); if(p) p.addEventListener("click",repStart);
}
function repRandom(){
  const m=REP_MODES[rep.mode], pick=arr=>arr[Math.floor(Math.random()*arr.length)];
  for(let a=0;a<200;a++){ rep.cnt={};
    [REP_ROSTER.Z,REP_ROSTER.G,REP_ROSTER.E].forEach(arr=>{ rep.cnt[pick(arr).id]=1; });
    for(let g=0;g<300;g++){ const s=repCompute(); if(s.pts>=m.budget-6) break;
      const r=Math.random(), cls=r<0.7?REP_ROSTER.E:(r<0.86?REP_ROSTER.G:REP_ROSTER.Z); const c=pick(cls);
      if(s.pts+cost(c)>m.budget) continue; rep.cnt[c.id]=(rep.cnt[c.id]||0)+1; }
    if(repLegal().ok){ drawRepRoster(); drawRepSummary(); return; } }
  rep.cnt={}; rep.cnt[REP_ROSTER.Z[0].id]=1; rep.cnt[REP_ROSTER.G[0].id]=1; rep.cnt[REP_ROSTER.E[0].id]=6;
  drawRepRoster(); drawRepSummary();
}

/* ---------- turnos ---------- */
function repStart(){
  const s0=repCompute(); const c=rep._cls; rep.armonia=REP_START; rep.turn=0; rep.ap=(rep.acciones==="si")?REP_AP0:0;
  // crónica: instantánea del diseño inicial
  const parts=[]; ["Z","G","E"].forEach(k=>REP_ROSTER[k].forEach(p=>{ const q=rep.cnt[p.id]||0; if(q) parts.push(q+"× "+p.name); }));
  rep.designText=parts.join(", ")+" — "+s0.pop+" hab., "+s0.pts+" pts";
  rep.log=[];
  const n=REP_MODES[rep.mode].deck;   // Real 8 · Fácil 7 — cada carta es un turno
  rep.turns=n;
  const nFate=(rep.mode==="real")?3:2;                                  // cartas del destino inevitables por partida
  const forced=repShuffle(REP_FATE).slice(0,nFate).concat("menguada");  // + «Ciudad menguada» siempre presente
  const forcedSet=new Set(forced);
  const pool=REP_EVENTS.filter(e=>!forcedSet.has(e.id)).map(e=>e.id);   // el resto: eventos condicionales variados
  const rest=repShuffle(pool).slice(0, Math.max(0, n-forced.length));
  rep.deck=repShuffle(rest.concat(forced));
  rep.t={ Z:Object.assign({},c.Z), G:Object.assign({},c.G), E:Object.assign({},c.E), hero:false, prodBonus:0 };
  repRenderTurn();
}
function repFmt(n){ n=Math.round(n*10)/10; return Number.isInteger(n)?n:n.toFixed(1); }
function repRenderTurn(){
  rep.resolved=false; rep.apTurn=0; rep.used=new Set(); rep.turnActs=[]; rep.t.hero=false;
  rep.rng=Math.random();   // azar fijo del turno (oráculo): igual en previsualización y resolución
  const ev=REP_EVENTS.find(e=>e.id===rep.deck[rep.turn]);
  repBox().innerHTML='<div class="rep-wrap">'+
    '<div class="rep-hud"><span class="stat">Turno <b>'+(rep.turn+1)+'</b>/'+rep.turns+'</span>'+
      '<span class="stat" title="Empiezas en 10, pero no hay techo: puedes acumular por encima.">⚖️ Armonía <b id="repArm">'+repFmt(rep.armonia)+'</b></span>'+
      (rep.acciones==="si"?'<span class="stat">🔧 AP <b id="repAp">'+rep.ap+'</b></span>':'')+'</div>'+
    '<div class="rep-arm'+(rep.armonia<=4?' low':'')+(rep.armonia>REP_ARM0?' over':'')+'"><i style="width:'+Math.min(100,Math.max(0,rep.armonia/REP_ARM0*100))+'%"></i></div>'+
    '<div class="rep-classes" id="repClasses"></div>'+
    '<div class="rep-city" id="repCity"></div>'+
    '<div class="rep-event reveal" id="repEvent"></div>'+
    (rep.acciones==="si"?'<div class="rep-actions-h">Acciones (máx. 2 este turno)</div><div class="rep-acts" id="repActs"></div>':'')+
    '<div class="rep-resolve"><button id="repResolve">Afrontar el evento →</button></div></div>';
  repDrawTurn(ev);
  document.getElementById("repResolve").addEventListener("click",()=>repResolve(ev));
}
function repDrawTurn(ev){
  document.getElementById("repClasses").innerHTML=[
    { em:"🦉", l:"Guardianes", c:rep.t.Z.n }, { em:"🛡️", l:"Guerreros", c:rep.t.G.n+(rep.t.hero?" ×1,5":"") }, { em:"🌾", l:"Productores", c:rep.t.E.n }
  ].map(x=>'<div class="rep-class"><div class="c">'+x.em+' '+x.c+'</div><div class="l">'+x.l+'</div></div>').join("");
  // stat de CIUDAD: producción vs población
  const prod=repProd(), pop=repPop(), sur=prod-pop;
  const city=document.getElementById("repCity");
  if(city) city.innerHTML='<span class="rep-cstat">🌾 Producción <b>'+prod+'</b></span>'+
    '<span class="rep-cstat">👥 Comen <b>'+pop+'</b></span>'+
    '<span class="rep-cstat rep-sur '+(sur<0?"bad":"ok")+'">'+(sur<0?"⚠ déficit ":"✓ excedente +")+Math.abs(sur)+'</span>';
  // previsualizar el efecto sin aplicarlo (clonando rep.t)
  const snap=JSON.parse(JSON.stringify(rep.t)); const pre=ev.effect(); rep.t=snap;
  const good=pre.d>0, bad=pre.d<0; const evb=document.getElementById("repEvent");
  evb.classList.toggle("danger",bad); evb.classList.toggle("safe",!bad);
  evb.innerHTML='<img class="rep-ev-img" src="'+REP_IMG+ev.img+'.jpg" alt="">'+
    '<div class="rep-ev-body"><span class="rep-ev-tag'+(ev.fate?' fate':'')+'">'+(ev.fate?'🎴 Carta del destino · inevitable':'🃏 Evento del turno'+(ev.src&&ev.src!=="—"?' · '+ev.src:''))+'</span><h3>'+ev.name+'</h3>'+
    '<div class="threat">'+ev.threat+'</div>'+
    '<div class="rep-status '+(bad?"bad":good?"good":"ok")+'">'+(bad?"⚠ ":good?"✓ ":"• ")+pre.msg+'</div></div>';
  if(rep.acciones==="si"){ const acts=document.getElementById("repActs");
    acts.innerHTML=REP_ACTS.map(a=>{ const dis=rep.apTurn>=2||rep.used.has(a.id)||rep.ap<a.ap||(a.ok&&!a.ok());
      return '<button class="rep-act" data-act="'+a.id+'"'+(dis?" disabled":"")+'>'+(a.img?'<span class="rep-act-art"><img src="'+REP_IMG+a.img+'.jpg" alt=""></span>':'')+'<span class="rep-act-b"><b>'+a.name+' <span class="ap">'+a.ap+' AP</span></b><span class="d">'+a.d+'</span></span></button>'; }).join("");
    acts.querySelectorAll("[data-act]").forEach(b=>b.addEventListener("click",()=>repDoAct(b.dataset.act,ev))); }
}
function repDoAct(id,ev){ const a=REP_ACTS.find(x=>x.id===id);
  if(rep.apTurn>=2||rep.used.has(id)||rep.ap<a.ap||(a.ok&&!a.ok())) return;
  a.run(); rep.ap-=a.ap; rep.apTurn++; rep.used.add(id); rep.turnActs.push(a.name);
  const ael=document.getElementById("repAp"); if(ael)ael.textContent=rep.ap;
  const arm=document.getElementById("repArm"); if(arm)arm.textContent=repFmt(rep.armonia);
  document.querySelector("#republica .rep-arm > i").style.width=Math.min(100,Math.max(0,rep.armonia/REP_ARM0*100))+"%";
  repDrawTurn(ev); }
function repResolve(ev){
  if(rep.resolved) return; rep.resolved=true;
  const before=rep.armonia;
  const r=ev.effect(); const after=Math.round((before+r.d)*10)/10; rep.armonia=after;   // sin techo
  rep.log.push({ n:rep.turn+1, ev:ev.name, src:ev.src, fate:!!ev.fate, msg:r.msg, acts:rep.turnActs.slice(), before, after, Z:rep.t.Z.n, G:rep.t.G.n, E:rep.t.E.n });
  rep.turn++;
  if(rep.turn>=rep.turns || rep.armonia<=0 || repPop()<3) repResult(); else repRenderTurn();
}
/* ---------- crónica de la partida ---------- */
function repChronicleText(){
  const m=REP_MODES[rep.mode]; const L=[
    "CRÓNICA DE MI REPÚBLICA — Aula de Filosofía · IES Martín de Bertendona",
    "Partida: "+(rep.gameName||"(sin nombre)"),
    "Modo: "+m.name+" · "+(rep.acciones==="si"?"con acciones":"sin acciones"),
    "Diseño inicial: "+rep.designText, ""];
  rep.log.forEach(e=>{
    L.push("Turno "+e.n+" — "+e.ev+(e.src&&e.src!=="—"?" ("+e.src+")":"")+(e.fate?" [carta del destino]":""));
    L.push("   Resultado: "+e.msg);
    if(e.acts.length) L.push("   Tus acciones: "+e.acts.join(", "));
    L.push("   Armonía "+repFmt(e.before)+" → "+repFmt(e.after)+"  ·  ciudad "+e.Z+"/"+e.G+"/"+e.E+" (guardianes/guerreros/productores)");
    L.push("");
  });
  L.push("DESENLACE: "+(rep._rank||"—")+" — "+repFmt(Math.max(0,rep.armonia))+" de armonía (base "+REP_ARM0+") tras "+rep.log.length+" turnos vividos.");
  return L.join("\n");
}
function repDownloadText(txt,name){
  try{ const blob=new Blob([txt],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=(name||"cronica")+".txt";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),2000);
  }catch(e){}
}
/* nombre de archivo único y legible: mi-republica-<ciudad>-AAAA-MM-DD-HHMM */
function repFileSlug(s){ return String(s||"").normalize("NFKD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40); }
function repStamp(ts){ const d=ts?new Date(ts):new Date(); const p=n=>String(n).padStart(2,"0"); return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+"-"+p(d.getHours())+p(d.getMinutes()); }
function repChronicleFilename(name,ts){ const s=repFileSlug(name); return "mi-republica"+(s?"-"+s:"")+"-"+repStamp(ts); }
function repDownloadChronicle(){ repDownloadText(repChronicleText(),repChronicleFilename(rep.gameName||rep._defaultName)); }
/* ---------- historial de partidas (localStorage) ---------- */
const REP_HIST_KEY="aula-republica-hist", REP_HIST_MAX=12;
function repHistLoad(){ try{ const h=store.get(REP_HIST_KEY,[]); return Array.isArray(h)?h:[]; }catch(e){ return []; } }
function repHistPush(rec){ try{ const h=repHistLoad(); h.unshift(rec); while(h.length>REP_HIST_MAX) h.pop(); store.set(REP_HIST_KEY,h); }catch(e){} }
/* ---- exportar / importar historial (JSON, para llevarlo entre equipos) ---- */
function repExportHistory(){
  const h=repHistLoad();
  if(!h.length){ alert("Todavía no hay partidas guardadas que exportar."); return; }
  const data={ app:"aula-republica", version:1, exportado:new Date().toISOString(), partidas:h };
  try{ const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download="republica-partidas-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),2000);
  }catch(e){ alert("No se ha podido generar el archivo."); }
}
function repImportHistoryFile(file){
  if(!file) return;
  const rd=new FileReader();
  rd.onload=function(){
    let data; try{ data=JSON.parse(rd.result); }catch(e){ alert("El archivo no es un JSON válido."); return; }
    const arr = Array.isArray(data) ? data : (data && Array.isArray(data.partidas) ? data.partidas : null);
    if(!arr){ alert("El archivo no contiene partidas de La República."); return; }
    const valid=arr.filter(r=>r && typeof r==="object" && typeof r.text==="string");
    if(!valid.length){ alert("El archivo no contiene ninguna partida válida."); return; }
    const cur=repHistLoad();
    const seen={}; cur.forEach(r=>{ if(r&&r.ts!=null) seen[r.ts]=true; });
    const nuevos=valid.filter(r=> r.ts==null || !seen[r.ts]);
    if(!nuevos.length){ alert("Esas partidas ya estaban en este equipo. No se ha añadido ninguna."); return; }
    let merged=cur.concat(nuevos);
    merged.sort((a,b)=>(b.ts||0)-(a.ts||0));
    while(merged.length>REP_HIST_MAX) merged.pop();
    store.set(REP_HIST_KEY,merged);
    alert("Importadas "+nuevos.length+" partida(s). Se conservan las "+REP_HIST_MAX+" más recientes.");
    renderRepHistory();
  };
  rd.onerror=function(){ alert("No se ha podido leer el archivo."); };
  rd.readAsText(file);
}
function repEsc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
const REP_NAMES=["Calípolis","Magnesia","Nueva Atenas","Politeia","Eunomía","Kalonia","Aristópolis","Ciudad del Sol","Sofópolis","Areté"];
function repDefaultName(){ return REP_NAMES[Math.floor(Math.random()*REP_NAMES.length)]; }
function repHistSetLatestName(name){
  const nm=(name||"").trim().slice(0,40)||rep._defaultName||"(sin nombre)"; rep.gameName=nm;
  try{ const h=repHistLoad(); if(h.length){ h[0].name=nm; h[0].text=repChronicleText(); store.set(REP_HIST_KEY,h); } }catch(e){}
}
function renderRepHistory(){
  const box=repBox(); if(!box) return; const h=repHistLoad();
  box.innerHTML='<div class="rep-wrap"><div class="rep-hist">'+
    '<div class="rep-hist-top"><button class="btn2" id="repHistBack">← Volver a diseñar</button><h3>📚 Partidas guardadas</h3>'+
      '<span class="rep-hist-io">'+(h.length?'<button class="btn2" id="repHistExport" title="Descarga todas tus partidas en un archivo JSON para guardarlas o llevarlas a otro equipo">⬆️ Exportar</button>':'')+'<button class="btn2" id="repHistImport" title="Carga partidas desde un archivo JSON exportado (se añaden a las de este equipo, sin borrarlas)">⬇️ Importar</button>'+(h.length?'<button class="btn2" id="repHistClear" title="Borra todas las partidas guardadas en este navegador (no afecta a los archivos exportados)">🗑️ Borrar todo</button>':'')+'</span>'+
      '<input type="file" id="repHistFile" accept="application/json,.json" style="display:none">'+
      '</div>'+
    (h.length? h.map((r,i)=>'<details class="rep-hist-item"><summary><span class="rep-hist-badge">'+r.emoji+'</span> '+(r.name?'<b class="rep-hist-name">'+repEsc(r.name)+'</b> · ':'')+r.rank+' · ⚖ '+r.arm+' · '+r.turns+' turnos · '+r.mode+(r.acc==="no"?" (sin acciones)":"")+' · <span class="rep-hist-date">'+r.date+'</span></summary>'+
        '<pre class="rep-hist-text">'+repEsc(r.text)+'</pre>'+
        '<div class="rep-hist-btns"><button class="btn2" data-hcopy="'+i+'">📋 Copiar</button><button class="btn2" data-hdl="'+i+'">💾 Descargar</button></div></details>').join("")
      : '<p class="rep-hist-empty">Aún no has terminado ninguna partida. Juega una y quedará guardada aquí (se conservan las últimas '+REP_HIST_MAX+').</p>')+
    '</div></div>';
  document.getElementById("repHistBack").addEventListener("click",renderRepStart);
  const clr=document.getElementById("repHistClear"); if(clr) clr.addEventListener("click",()=>{ if(confirm("¿Borrar todas las partidas guardadas?")){ store.set(REP_HIST_KEY,[]); renderRepHistory(); } });
  const exp=document.getElementById("repHistExport"); if(exp) exp.addEventListener("click",repExportHistory);
  const imp=document.getElementById("repHistImport"), fi=document.getElementById("repHistFile");
  if(imp&&fi){ imp.addEventListener("click",()=>fi.click()); fi.addEventListener("change",()=>{ repImportHistoryFile(fi.files&&fi.files[0]); fi.value=""; }); }
  box.querySelectorAll("[data-hcopy]").forEach(b=>b.addEventListener("click",()=>{ const r=repHistLoad()[+b.dataset.hcopy]; if(r&&navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(r.text).then(()=>{ const o=b.textContent; b.textContent="✓ ¡Copiada!"; setTimeout(()=>{b.textContent=o;},1400); }).catch(()=>{}); } }));
  box.querySelectorAll("[data-hdl]").forEach(b=>b.addEventListener("click",()=>{ const r=repHistLoad()[+b.dataset.hdl]; if(r) repDownloadText(r.text,repChronicleFilename(r.name,r.ts)); }));
}
function repCopyChronicle(btn){
  const txt=repChronicleText();
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(()=>{ const o=btn.textContent; btn.textContent="✓ ¡Copiada!"; setTimeout(()=>{btn.textContent=o;},1600); }).catch(()=>{}); }
}
function repResult(){
  const a=rep.armonia; let emoji,rank;
  if(a<=0||repPop()<3){ emoji="💥"; rank="La república colapsa"; }
  else if(a>=8){ emoji="🏛️"; rank="República armónica"; }
  else if(a>=5){ emoji="⚖️"; rank="República estable"; }
  else { emoji="⚠️"; rank="República frágil, pero en pie"; }
  rep._rank=rank;
  const key="aula-republica-best"; const best=store.get(key,0); const record=a>best; if(record) store.set(key,a);
  // guardar en el historial del navegador (con nombre por defecto, editable después)
  rep._defaultName=repDefaultName(); rep.gameName=rep._defaultName;
  const ts=Date.now(); let fecha; try{ fecha=new Date(ts).toLocaleString("es-ES",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}); }catch(e){ fecha=new Date(ts).toLocaleString(); }
  repHistPush({ ts, date:fecha, name:rep.gameName, emoji, rank, mode:REP_MODES[rep.mode].name, acc:rep.acciones, arm:repFmt(Math.max(0,a)), turns:rep.log.length, text:repChronicleText() });
  const qs=["¿Qué muestra este juego sobre la necesidad de equilibrio en la sociedad de Platón?",
    "¿Qué riesgos trae el poder excesivo de cada clase social?",
    "¿Es cierto, como decía Platón, que sin gobernantes filósofos no puede salvarse la sociedad?",
    "¿Merece la pena una ciudad justa si para lograrla hay que renunciar a la igualdad entre clases?"];
  const chronicle=rep.log.map(e=>{ const s=e.after-e.before, cls=s<0?"bad":s>0?"good":"ok";
    return '<li class="rep-cr-item'+(e.fate?" fate":"")+'"><div class="rep-cr-h"><span class="rep-cr-n">T'+e.n+'</span><b>'+e.ev+'</b>'+(e.fate?' <span class="rep-cr-badge">destino</span>':'')+'<span class="rep-cr-arm '+cls+'">'+repFmt(e.before)+'→'+repFmt(e.after)+'</span></div>'+
      '<div class="rep-cr-msg">'+e.msg+'</div>'+
      (e.acts.length?'<div class="rep-cr-acts">🔧 '+e.acts.join(", ")+'</div>':'')+'</li>'; }).join("");
  repBox().innerHTML='<div class="rep-wrap"><div class="rep-result">'+
    '<div class="rep-badge">'+emoji+'</div><div class="rep-rank">'+rank+'</div>'+
    '<div class="rep-final">'+repFmt(Math.max(0,a))+' <span>de armonía</span></div>'+
    '<p class="rep-pop">'+rep.log.length+' turnos vividos · ciudad final '+rep.t.Z.n+'/'+rep.t.G.n+'/'+rep.t.E.n+' · '+(rep.acciones==="si"?"con acciones":"sin acciones")+' · '+(record?"¡tu mejor república! 🎉":"mejor marca: "+repFmt(Math.max(best,a)))+'</p>'+
    '<div class="rep-name"><label for="repName">🏷️ Nombre de esta partida</label><input id="repName" type="text" maxlength="40" value="'+repEsc(rep.gameName)+'" placeholder="Ponle nombre a tu república"></div>'+
    '<div class="rep-chronicle"><div class="rep-cr-title">📜 Crónica de tu república</div><ol class="rep-cr-list">'+chronicle+'</ol></div>'+
    '<div class="rep-save"><button class="btn2" id="repSave">💾 Guardar crónica (.txt)</button><button class="btn2" id="repCopy">📋 Copiar crónica</button><button class="btn2" id="repHistView">📚 Ver historial</button></div>'+
    '<blockquote class="rep-reflect">Para pensar: '+qs[Math.floor(Math.random()*qs.length)]+'</blockquote>'+
    '<div class="rep-actions2"><button class="btn2 primary" id="repAgain">Diseñar otra ciudad</button></div></div></div>';
  document.getElementById("repAgain").addEventListener("click",renderRepStart);
  const sv=document.getElementById("repSave"); if(sv) sv.addEventListener("click",repDownloadChronicle);
  const cp=document.getElementById("repCopy"); if(cp) cp.addEventListener("click",()=>repCopyChronicle(cp));
  const hv=document.getElementById("repHistView"); if(hv) hv.addEventListener("click",renderRepHistory);
  const nm=document.getElementById("repName"); if(nm){ nm.addEventListener("input",()=>repHistSetLatestName(nm.value)); nm.addEventListener("focus",()=>nm.select()); }
}
function initRep(){ renderRepStart(); }
document.addEventListener("DOMContentLoaded", initRep);
(function(){ const nav=document.getElementById("tabs"); if(nav) nav.addEventListener("click", e=>{ const b=e.target.closest("button"); if(b && b.dataset.view==="republica") renderRepStart(); }); })();
