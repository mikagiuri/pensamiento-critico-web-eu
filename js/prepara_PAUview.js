"use strict";
/* ===== Vista de Prepara PAU ===== depende de: prepara_PAU.js =====
   (25-10-2026, queja del profesor: «no tienes ni idea de cómo navegarla»). Antes: 23 chips sueltos y la primera guía
   abierta. Ahora, al entrar, un índice de 6 grupos plegables en el orden del examen; cada guía es un enlace
   #prepara_PAU/<clave> (pasa por el enrutado de app.js, así funcionan «atrás», el buscador y el itinerario), con
   miga, vuelta al índice y anterior/siguiente. Propuesta y decisiones: 1_vivo\_bandeja\2026-10-25\prepara_pau\.
   Los textos de interfaz de aquí se traducen con web_i18n/ui/<lang>.json (cada uno, una cadena entera). */

let pauKey = null;   // guía abierta (null = índice); la leen itinerario.js y resume.js

// Los 6 grupos y su orden de uso. Una clave que no esté aquí sale en un grupo final («Otras guías»).
const PAU_GRUPOS = [
  { t: "Ezagutu azterketa", d: "Nolakoa den proba, zer puntuatzen den eta zer atera den.", g: [
    ["estructura", "Hasteko"], ["guia-valora", "Nola zuzentzen den"], ["guia-modelos-nivel5", "Nola zuzentzen den"],
    ["modelos", "Azterketa ofiziala"], ["guia-examenes", "Azterketa ofiziala"], ["que-cae-mas", "Estatistika"]] },
  { t: "1. ariketa · Testu-ulermena", d: "4 puntu: laburpena (1.1) eta alderaketa edo azalpena (1.2).", g: [
    ["ejercicio1", "Zer eskatzen duten"], ["guia-resumen", "Metodoa"], ["guia-comparacion", "Metodoa"], ["guia-explicacion", "Metodoa"],
    ["guia-modelos-ej1", "Ebatzia"]], mas: ["comentario", "egile bakoitzaren adibide ebatziak"] },
  { t: "2. ariketa · Disertazioa", d: "3 puntu: alde, aurka eta zure iritzia.", g: [
    ["guia-disertacion", "Metodoa"], ["guia-modelos-dis", "Ebatzia"]], mas: ["disertaciones", "gida bat egile bakoitzeko eta dilemak"] },
  { t: "3. ariketa · Filosofiaren Historia berriz pentsatzen", d: "3 puntu: Filosofiaren Historiako gai bat azaltzea.", g: [
    ["ejercicio3", "Zer eskatzen duten"], ["guia-tema", "Metodoa"], ["comparativas-temas", "Gaikako errepasoa"], ["guia-modelos-ej3", "Ebatzia"]] },
  { t: "Bost irakurgaiak", d: "Zer testu-atal sartzen diren eta nondik datozen aipuak.", g: [
    ["guia-fragmentos", "Testu-atalak"], ["guia-bibliografia", "Iturriak"]], mas: ["lecturas", "testu osoak, beren gidarekin"] },
  { t: "Praktikatu: simulakroak", d: "Azterketa osoak, 2026ko formatuan.", g: [
    ["simulacros-intro", "Nola erabili"], ["simulacro1", "Simulakroa"], ["simulacro2", "Simulakroa"], ["simulacro3", "Simulakroa"], ["simulacro4", "Simulakroa"]] }
];

function pauEsc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); }
function pauNav(id){ const b = document.querySelector('#tabs button[data-view="' + id + '"]'); return b ? b.textContent.replace(/\s+/g, " ").trim() : ""; }
// Grupos con las guías que existen en esta web (cada build lleva las suyas). Ninguna se oculta: las que tratan lo mismo
// que Comentario, Disertaciones o Lecturas tienen otro texto (medido el 25-10), y el grupo enlaza esa sección («Ver también»).
function pauGrupos(){
  const puestas = new Set(), out = [];
  PAU_GRUPOS.forEach(gr => {
    const g = gr.g.filter(([k]) => PAU[k]); g.forEach(([k]) => puestas.add(k));
    if (g.length) out.push(Object.assign({}, gr, { g }));
  });
  const resto = Object.keys(PAU).filter(k => !puestas.has(k)).map(k => [k, ""]);
  if (resto.length) out.push({ t: "Beste gida batzuk", d: "", g: resto });
  return out;
}
function pauLista(){ return pauGrupos().flatMap((gr, gi) => gr.g.map(([k]) => ({ k, gi }))); }

function pauPartes(){
  const sec = document.getElementById("prepara_PAU"); if (!sec) return {};
  // el contenedor de los chips pasa a ser el índice; sin la clase «chips», compacto.js no lo pliega en el móvil
  const idx = document.getElementById("pauchips");
  if (idx && idx.classList.contains("chips")) { idx.className = "pau-indice"; idx.removeAttribute("role"); idx.removeAttribute("aria-label"); }
  const lay = sec.querySelector(".theory-layout");
  // la miga va antes del bloque índice + guía (en el móvil, «En esta guía» se pliega encima del texto)
  let miga = document.getElementById("paumiga");
  if (!miga && lay) { miga = document.createElement("p"); miga.id = "paumiga"; miga.className = "pau-miga"; lay.parentNode.insertBefore(miga, lay); }
  return { sec, idx, lay, miga, body: document.getElementById("paubody"), toc: document.getElementById("pautoc") };
}

function pauIndice(){
  const { idx, lay, miga } = pauPartes(); if (!idx) return;
  pauKey = null;
  if (miga) miga.hidden = true;
  idx.innerHTML = '<p class="pau-pista">' + pauEsc("Lehen aldia? Joan ordenan, 1etik 6ra.") + '</p>' +
    pauGrupos().map((gr, i) =>
      '<details class="pau-grupo"><summary><span class="pau-n">' + (i + 1) + '</span><span class="pau-gt"><b>' + pauEsc(gr.t) + '</b>' +
      (gr.d ? '<span>' + pauEsc(gr.d) + '</span>' : '') + '</span><span class="pau-cuenta">' + gr.g.length + '</span></summary><ol>' +
      gr.g.map(([k, tipo]) => '<li><a href="#prepara_PAU/' + pauEsc(k) + '">' + pauEsc(PAU[k].title) + '</a>' + (tipo ? ' <span class="pau-tipo">' + pauEsc(tipo) + '</span>' : '') + '</li>').join("") +
      '</ol>' + (gr.mas && document.getElementById(gr.mas[0]) ? '<p class="pau-mas">' + pauEsc("Ikus, gainera,") + ' <a href="#' + gr.mas[0] + '">' + pauEsc(pauNav(gr.mas[0])) + '</a>: ' + pauEsc(gr.mas[1]) + '.</p>' : '') +
      '</details>').join("");
  idx.hidden = false; if (lay) lay.hidden = true;
}

function loadPau(k){
  if (!k || !PAU[k]) { pauIndice(); return; }
  const { idx, lay, miga, body, toc } = pauPartes(); if (!body) return;
  pauKey = k;
  const p = PAU[k], lista = pauLista(), i = lista.findIndex(x => x.k === k), grupos = pauGrupos();
  const gr = i >= 0 ? grupos[lista[i].gi] : null, ant = lista[i - 1], sig = lista[i + 1], nav = pauNav("prepara_PAU");
  if (miga) { miga.innerHTML = '<a href="#prepara_PAU">← ' + pauEsc(nav) + '</a>' + (gr ? ' <span>› ' + (lista[i].gi + 1) + '. ' + pauEsc(gr.t) + '</span>' : ''); miga.hidden = false; }
  body.innerHTML = '<div class="theory-head"><span class="kick" style="color:var(--' + p.subject + ')">' + p.kick + '</span><h1>' + p.title + '</h1></div>' + p.html +
    ((ant || sig) ? '<nav class="pau-pasos">' +
      (ant ? '<a href="#prepara_PAU/' + pauEsc(ant.k) + '"><small>← ' + pauEsc("Aurrekoa") + '</small>' + pauEsc(PAU[ant.k].title) + '</a>' : '<span></span>') +
      (sig ? '<a class="pau-sig" href="#prepara_PAU/' + pauEsc(sig.k) + '"><small>' + pauEsc("Hurrengoa") + ' →</small>' + pauEsc(PAU[sig.k].title) + '</a>' : '') + '</nav>' : '');
  const hs = [...body.querySelectorAll("h2")];
  hs.forEach((h, j) => { h.id = "ph-" + j; });
  if (toc) toc.innerHTML = '<div class="toc-title">Gida honetan</div><ol>' +
    hs.map((h, j) => '<li><a href="#ph-' + j + '">' + h.textContent + '</a></li>').join("") + '</ol>';
  if (idx) idx.hidden = true; if (lay) lay.hidden = false;
}

// #prepara_PAU sin clave (menú, «← Prepara PAU», atrás del navegador) = el índice
window.addEventListener("hashchange", () => { if (location.hash === "#prepara_PAU") pauIndice(); });
pauIndice();
