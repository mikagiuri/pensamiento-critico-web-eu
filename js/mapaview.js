"use strict";
/* ===== Mapa de la web (11-10-2026) =====
   Petición del profesor: un mapa de la web dentro de la propia web. Se abre desde el pie («Mapa de la web», #mapa).
   Se construye al cargar a partir del menú (#tabs) tal como lo deja cada build, así que cada web publicada
   (Filosofía 1.º, HF, ESO, y sus traducciones) muestra solo sus secciones, en el orden del menú, con una línea
   de qué hay en cada una y, cuando se puede contar, cuántos elementos tiene. Debajo, los temas de cada materia
   con sus exploraciones (de Itinerario.temasDe) y, dentro de Ilustres, las fichas de época.
   Los textos van en MAPA_TXT y MAPA_DESC (se traducen con el diccionario de interfaz ui/<lang>.json). */
const MAPA_TXT = {
  secciones: "Atalak", temas: "Ikasgai bakoitzeko gaiak", tema: "{n}. gaia", exploraciones: "Esplorazioak",
  epocas: "Aroen fitxak", otras: "Beste atal batzuk", elementos: "elementu"
};
const MAPA_SUBJ = { fil: "Filosofia, Batxilergoko 1. maila", hf: "Filosofiaren Historia, Batxilergoko 2. maila", ipc: "Pentsamendu kritikoa, DBH 2" };
const MAPA_DESC = {
  inicio: "Tailerraren azala, hiru ikasgaiekin eta ordutegiarekin.",
  fil: "Ikasgaiaren fitxa: gaiak, baliabideak eta nola ikasi.",
  hf: "Ikasgaiaren fitxa: gaiak, baliabideak eta nola ikasi.",
  ipc: "Ikasgaiaren fitxa: unitateak, baliabideak eta nola ikasi.",
  sesiones: "Klaseko saio bakoitzean egiten dena.",
  calendario: "Ikasturteko datak, ebaluazioak eta azterketak.",
  tiempo: "Gai bakoitzaren denbora-banaketa.",
  teoria: "Gai bakoitzeko apunteak, haratago joateko esplorazioekin.",
  clases: "Pentsamendu kritikoa ikastaroa, saioz saio.",
  materiales: "Deskargatzeko fitxak, jarduerak eta dokumentuak.",
  cuentos: "Pentsatzeko ipuinak, beren galderekin.",
  tarjetas: "Errepasatzeko txartelak: galdera aurrean, erantzuna atzean.",
  reto: "Denboraren aurkako galderak, jolasean errepasatzeko.",
  parejas: "Memoria-jokoa: lotu kontzeptu bakoitza bere bikotearekin.",
  glosario: "Gai bakoitzeko kontzeptuak, beren definizio eta jatorriarekin.",
  ilustres: "Pentsalarien biografiak eta aro bakoitzeko fitxak.",
  citas: "Filosofoen esaldi ospetsuak, azalduta.",
  adagios: "Latinezko eta grekozko lema klasikoak, eta filosofoen esaldi ospetsuak: zer esan nahi duten eta noiz erabili.",
  duelo: "Ordenagailuaren aurkako eztabaida: harrapatu bere falaziak edo erantzun arrazoi sendoagoekin, patxada galdu gabe.",
  epocas: "Aro bakoitzaren fitxak, Antzinako Greziatik gaur egunera, bakoitza bere kosmosaren irudiarekin.",
  polemicas: "Garai berean bizi izan ziren eta elkarren aurka aritu ziren pentsalariak: aukeratu norekin zoazen eta zergatik.",
  perseguidos: "Beren ideiengatik zigortutako filosofoak eta zientzialariak: zer gertatu zen eta zer kontatu ohi den gaizki.",
  comunidades: "Pentsalarien eskolak eta zirkuluak, eta biltzen ziren lekuak.",
  mundo: "Gela mundua balitz: planetaren datuak, zure ikasgelan.",
  camino: "Zer egin aukeratzen duzun eta ondorioak ikusten dituzun istorioak.",
  eudaimonia: "Zoriontasunari buruzko jokoa, Aristotelesen arabera.",
  republica: "Platonen hiri ideala antolatzeko jokoa.",
  rayuela: "Aurkitu kontraesana filosofoen testuetan.",
  nudos: "Errazak dirudite, baina ez dira: hainbat buruhauste.",
  dilemas: "Kasu zailak, zer dagoen ondo eztabaidatzeko.",
  logica: "Egia-taulak, silogismoak, oposizio-karratua, diagramak eta laborategia: egia-zuhaitzak, irudien munduak, erlazioak eta frogapenak.",
  leibniz: "Leibniz eta haren asmakizunak: kalkulagailua, sistema bitarra eta kalkulua.",
  palabra: "Hitzaren artea: poetika, erretorika eta topikoak, Aristotelesengandik gaurko literaturara, antzerkira eta publizitatera.",
  afectos: "Spinozaren afektuak: pozetik eta tristuratik nola sortzen diren, eta zergatik egiten gaituen aske haiek ulertzeak.",
  universo: "Aristotelesen unibertsoa: lau elementuak, gorputzen erorketa, arima eta izaki bizidunak, eta zientzia modernoak ireki zituen arrakalak.",
  infografias: "Gai bakoitza irudi batean laburbilduta.",
  galeria: "Gaietako artelanak eta ilustrazioak.",
  mapas: "Gaien kontzeptu-mapak.",
  cronogramas: "Egileen eta aroen denbora-lerroak.",
  genealogias: "Nork nori eragin zion: maisuak, ikasleak eta aurkariak.",
  esquemas: "Gai bakoitzeko ideia nagusien eskemak.",
  esqautor: "Laburpen bat egile bakoitzeko, USErako.",
  diapositivas: "Gaien aurkezpenak.",
  rescritura: "Ikasi testu bat zure hitzekin berridazten.",
  pistas: "Pixkanaka irekitzen diren pistak dituzten buruhausteak.",
  cuestionarios: "Gai bakoitzeko test motako galderak, zuzenketarekin.",
  juegosucio: "Eztabaidako tranpak, haiek ezagutzeko.",
  unidad: "Unitate bateko galdera guztiak, batera.",
  rubricas: "Lanak eta azterketak nola zuzentzen diren.",
  evidencias: "Iazko ikasturteko ikaskuntza-ebidentziak.",
  recursos: "Kanpoko estekak eta tresnak.",
  pau: "Nolakoa den unibertsitatera sartzeko proba.",
  comentario: "Nola egiten den testu-iruzkina, ebatzitako adibideekin.",
  disertaciones: "Nola idazten den disertazioa, ereduekin.",
  lecturas: "Egileen testuak, irakurri eta iruzkintzeko.",
  tutoria: "Tutoretzako materialak.",
  signos: "Zeinu-hizkuntzako ikastaroa."
};
/* cuántos elementos tiene cada sección (si su colección está cargada en esta web) */
const MAPA_CUENTA = { tarjetas: "DECKS", cuestionarios: "QUIZZES", glosario: "GLOSARIO", ilustres: "ILUSTRES", citas: "CITAS", adagios: "ADAGIOS", polemicas: "POLEMICAS", perseguidos: "PERSEGUIDOS", comunidades: "COMUNIDADES",
  infografias: "INFOGRAFIAS", mapas: "MAPS", esquemas: "ESQUEMAS", cronogramas: "CRONOGRAMAS", genealogias: "GENEALOGIAS", lecturas: "LECTURAS",
  galeria: "GALERIA", dilemas: "DILEMAS", disertaciones: "DISERTACIONES", nudos: "NUDOS", pistas: "PISTAS", materiales: "MATERIALS" };
function mapaG(name){ try { return (0, eval)("typeof " + name + " !== 'undefined' ? " + name + " : undefined"); } catch (e){ return undefined; } }
function mapaEsc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function mapaStrip(s){ return String(s == null ? "" : s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
function mapaCuenta(v){
  if (v === "teoria"){ const It = window.Itinerario; return It && It.temasDe ? ["fil", "hf", "ipc"].reduce((n, s) => n + It.temasDe(s, true).length, 0) : 0; }
  const c = MAPA_CUENTA[v] && mapaG(MAPA_CUENTA[v]);
  return c ? (Array.isArray(c) ? c.length : Object.keys(c).length) : 0;
}
function mapaItem(el){
  if (el.tagName === "A") return '<li><a class="mapa-a" href="' + mapaEsc(el.getAttribute("href")) + '" target="_blank" rel="noopener">' + mapaEsc(mapaStrip(el.innerHTML)) + '</a></li>';
  const v = el.dataset.view; if (!v || v === "mapa" || !document.getElementById(v)) return "";
  const n = mapaCuenta(v), extra = v === "ilustres" ? mapaEpocas() : "";
  return '<li><button type="button" class="mapa-a" data-igo="' + mapaEsc(v) + '" data-iarg="">' + mapaEsc(mapaStrip(el.textContent)) + '</button>' +
    (n ? ' <span class="mapa-n" title="' + n + " " + MAPA_TXT.elementos + '">' + n + '</span>' : '') +
    (MAPA_DESC[v] ? '<span class="mapa-d">' + mapaEsc(MAPA_DESC[v]) + '</span>' : '') + extra + '</li>';
}
function mapaEpocas(){
  const EF = mapaG("EPOCAS_FICHAS"); if (!EF || typeof iluNombreFicha !== "function") return "";
  return '<span class="mapa-sub"><b>' + MAPA_TXT.epocas + ':</b> ' + Object.keys(EF).map(k =>
    '<button type="button" class="mapa-a" data-igo="ilustres" data-iarg="epoca-' + k + '">' + mapaEsc(iluNombreFicha(k)) + '</button>').join(" · ") + '</span>';
}
function mapaTemas(){
  const It = window.Itinerario, T = mapaG("THEORY"); if (!It || !It.temasDe || !T) return "";
  const lab = k => { const o = T[k], n = It.temaOf("teoria", k, o); return (o.sigla ? o.sigla + " · " : typeof n === "number" ? MAPA_TXT.tema.replace("{n}", n) + " · " : "") + mapaStrip(o.title); };
  const lnk = k => '<button type="button" class="mapa-a" data-igo="teoria" data-iarg="' + mapaEsc(k) + '">' + mapaEsc(lab(k)) + '</button>';
  const exp = k => mapaStrip(T[k].title).replace(/^(Exploración|Esplorazioa|Exploration|Anexo|Eranskina|Annexe|Annex|Appendix|استكشاف)\s*[-–:]\s*/, "");
  return ["fil", "hf", "ipc"].map(s => {
    const ks = It.temasDe(s); if (!ks.length) return "";
    const todos = It.temasDe(s, true), anexos = todos.filter(k => It.esAnexo && It.esAnexo(T[k]));
    return '<div class="mapa-grupo"><h3>' + mapaEsc(MAPA_SUBJ[s]) + '</h3><ol class="mapa-temas">' + ks.map(k => {
      const n = It.temaOf("teoria", k, T[k]), ex = T[k].sigla ? [] : anexos.filter(a => T[a].temaN === n);
      return '<li>' + lnk(k) + (ex.length ? '<details class="mapa-exp"><summary>' + MAPA_TXT.exploraciones + ' (' + ex.length + ')</summary><ul>' +
        ex.map(a => '<li><button type="button" class="mapa-a" data-igo="teoria" data-iarg="' + mapaEsc(a) + '">' + mapaEsc(exp(a)) + '</button></li>').join("") + '</ul></details>' : '') + '</li>';
    }).join("") + '</ol></div>';
  }).join("");
}
function renderMapa(){
  const box = document.getElementById("mapabox"), tabs = document.getElementById("tabs"); if (!box || !tabs) return;
  const grupos = [], sueltos = [];
  [...tabs.children].forEach(el => {
    if (el.classList.contains("navsec")){
      const g = el.querySelector(".navgroup"), items = [...el.querySelectorAll(".navmenu > button, .navmenu > a")].map(mapaItem).join("");
      if (items) grupos.push('<div class="mapa-grupo"><h3>' + mapaEsc(mapaStrip(g ? g.textContent : "")) + '</h3><ul class="mapa-lista">' + items + '</ul></div>');
    } else if (el.matches("button[data-view], a")) sueltos.push(mapaItem(el));
  });
  const s = sueltos.join("");
  box.innerHTML = '<h2 class="sec">' + MAPA_TXT.secciones + '</h2><div class="mapa-cols">' +
    (s ? '<div class="mapa-grupo"><h3>' + MAPA_TXT.otras + '</h3><ul class="mapa-lista">' + s + '</ul></div>' : '') + grupos.join("") + '</div>' +
    (function(){ const t = mapaTemas(); return t ? '<h2 class="sec">' + MAPA_TXT.temas + '</h2><div class="mapa-cols">' + t + '</div>' : ""; })();
}
document.addEventListener("DOMContentLoaded", () => { try { renderMapa(); } catch (e){} });
