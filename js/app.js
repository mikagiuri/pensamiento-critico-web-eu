"use strict";
/* ===== Arranque: navegación, tema, horario y materias =====
   depende de: store.js, data.js, y de las funciones globales
   loadDeck() / loadQuiz() (flashcards.js, quiz.js, cargados antes). */

/* ----- navegación entre vistas ----- */
const tabs = document.getElementById("tabs");
const views = [...document.querySelectorAll(".view")];
function activeViewId(){ const v = views.find(v => v.classList.contains("active")); return v ? v.id : null; }

function show(id){
  views.forEach(v => v.classList.toggle("active", v.id === id));
  /* «estás aquí»: marca TODOS los botones de vista, también los de dentro de los
     desplegables. Al hacerlo, se reactiva el resaltado del grupo (regla :has de mobile.css)
     y el del botón (styles.css), que antes eran código muerto porque solo se marcaban
     los hijos directos de la barra. */
  tabs.querySelectorAll("button[data-view]").forEach(b =>
    b.setAttribute("aria-current", b.dataset.view === id ? "true" : "false"));
  /* deep-linking: refleja la vista en la URL (enlace compartible; persiste al refrescar). */
  if (id && ("#" + id) !== location.hash){ try { location.hash = id; } catch (e){} }
  window.scrollTo(0, 0);
  /* accesibilidad: lleva el foco al encabezado de la vista para que el cambio se anuncie. */
  const v = document.getElementById(id), h = v && v.querySelector("h1");
  if (h){ h.setAttribute("tabindex", "-1"); try { h.focus({ preventScroll: true }); } catch (e){ try { h.focus(); } catch (_){} } }
}
tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) show(b.dataset.view); });

/* enrutado por hash: enlaces directos, refrescar y atrás/adelante del navegador */
function viewIdFromHash(){
  const id = (location.hash || "").replace(/^#/, "");
  const el = id && document.getElementById(id);
  return (el && el.classList.contains("view")) ? id : null;
}
function routeFromHash(){ const id = viewIdFromHash(); if (id && id !== activeViewId()) (window.show || show)(id); }
window.addEventListener("hashchange", routeFromHash);
/* enrutado inicial tras cargar todos los scripts (para pasar por el show() ya envuelto por navctx) */
document.addEventListener("DOMContentLoaded", routeFromHash);

/* ----- tema claro / oscuro / sistema ----- */
const themeBtn = document.getElementById("theme");
function applyTheme(t){
  if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
  else document.documentElement.removeAttribute("data-theme");
}
function themeIcon(t){ return t === "light" ? "☀" : t === "dark" ? "☾" : "◐"; }
let theme = store.get("aula-theme", "system");
applyTheme(theme);
themeBtn.textContent = themeIcon(theme);
themeBtn.addEventListener("click", () => {
  theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
  store.set("aula-theme", theme);
  applyTheme(theme);
  themeBtn.textContent = themeIcon(theme);
});

/* ----- imprimir / guardar en PDF (la vista activa, sin cabecera ni filtros) ----- */
const printBtn = document.getElementById("printbtn");
if (printBtn) printBtn.addEventListener("click", () => window.print());

/* ----- horario ----- */
(function buildWeek(){
  const tb = document.getElementById("weekbody");
  WEEK.forEach(row => {
    const tr = document.createElement("tr");
    const th = document.createElement("td"); th.className = "h"; th.textContent = row[0]; tr.appendChild(th);
    for (let i = 1; i < 6; i++){
      const td = document.createElement("td"), c = row[i];
      if (Array.isArray(c)){ const s = document.createElement("span"); s.className = "pill " + c[0]; s.textContent = c[1]; td.appendChild(s); }
      else td.innerHTML = '<span style="color:var(--muted)">·</span>';
      tr.appendChild(td);
    }
    tb.appendChild(tr);
  });
})();

/* ----- portada dinámica: «Esta semana (X–Y)» según el calendario ----- */
(function dynamicPortada(){
  if (typeof SEMANAS === "undefined" || !SEMANAS.length) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const fri = function (iso){ const p = iso.split("-").map(Number); const d = new Date(p[0], p[1] - 1, p[2]); d.setDate(d.getDate() + 4); return d; };
  let sem = SEMANAS[SEMANAS.length - 1];
  for (const w of SEMANAS){ if (fri(w.iso) >= today){ sem = w; break; } }
  const h = document.querySelector('#inicio .sec-head h2.sec');
  if (h) h.textContent = "Aste hau" + " (" + sem.ini + " – " + sem.fin + ")";
})();

/* ----- vistas de materia ----- */
/* Mapa de recursos de una materia: por cada tipo de contenido, cuántos elementos
   hay de esa materia. Da al hub un índice navegable de todo lo disponible (además
   de los enlaces curados de s.tools). Guardas typeof por si un build no trae alguna
   colección. Al pulsar una ficha, navctx.js preselecciona la materia en esa vista. */
function subjectResourceMap(subjId){
  const defs = [
    ["teoria", "Teoria", typeof THEORY !== "undefined" ? THEORY : null],
    ["lecturas", "Irakurgaiak", typeof LECTURAS !== "undefined" ? LECTURAS : null],
    ["cuestionarios", "Galdetegiak", typeof QUIZZES !== "undefined" ? QUIZZES : null],
    ["tarjetas", "Txartelak", typeof DECKS !== "undefined" ? DECKS : null],
    ["infografias", "Infografiak", typeof INFOGRAFIAS !== "undefined" ? INFOGRAFIAS : null],
    ["esquemas", "Eskemak", typeof ESQUEMAS !== "undefined" ? ESQUEMAS : null],
    ["mapas", "Mapak", typeof MAPS !== "undefined" ? MAPS : null],
    ["materiales", "Materialak", typeof MATERIALS !== "undefined" ? MATERIALS : null]
  ];
  return defs.map(([go, label, coll]) => {
    if (!coll) return null;
    const n = Object.keys(coll).filter(k => coll[k] && coll[k].subject === subjId).length;
    return n ? { go, label, n } : null;
  }).filter(Boolean);
}

function renderSubjects(){
  Object.entries(SUBJECTS).forEach(([id, s]) => {
    const el = document.getElementById(id);
    const mats = s.mats.map(m => {
      const inner = `<h4>${m[0]}</h4><p>${m[1]}</p><span class="tag">${m[2]}</span>`;
      return m[3] ? `<div class="mat mat-link" data-mat="${m[3]}" role="button" tabindex="0">${inner}</div>` : `<div class="mat">${inner}</div>`;
    }).join("");
    const tools = s.tools.length
      ? `<div class="toolrow">${s.tools.map(t => `<button class="btn" data-go="${t[1]}" data-arg="${t[2]}">${t[0]} →</button>`).join("")}</div>`
      : "";
    const resMap = subjectResourceMap(id);
    const hub = resMap.length
      ? `<div class="sec-head"><h2 class="sec">Arakatu ikasgaia</h2><p>Eskuragarri dagoen guztia, motaren arabera. Sakatu irekitzeko.</p></div>
      <div class="hubmap" style="--c:${s.color}">${resMap.map(r => `<button class="hubtile" data-hub="${r.go}"><span class="hubtile-n">${r.n}</span><span class="hubtile-l">${r.label}</span></button>`).join("")}</div>`
      : "";
    el.innerHTML = `<div class="subhead" style="--c:${s.color}"><span class="kick">${s.kick}</span><h1>${s.name}</h1></div>
      <p class="lead">${s.intro}</p>
      ${hub}
      <div class="sec-head"><h2 class="sec">Materialak</h2></div>
      <div class="mats">${mats}</div>${tools}`;
  });
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => {
    const go = b.dataset.go, arg = b.dataset.arg;
    show(go);
    if (go === "tarjetas") loadDeck(arg);
    if (go === "cuestionarios") loadQuiz(arg);
    if (go === "teoria") loadTheory(arg);
    if (go === "materiales") loadMaterial(arg);
    if (go === "mapas") loadMap(arg);
  }));
  /* Fichas del hub: solo cambian de vista; navctx.js preselecciona la materia. */
  document.querySelectorAll("[data-hub]").forEach(b => b.addEventListener("click", () => show(b.dataset.hub)));
  document.querySelectorAll("[data-mat]").forEach(b => b.addEventListener("click", () => {
    show("materiales");
    loadMaterial(b.dataset.mat);
  }));
}
renderSubjects();

/* Inicio: las tarjetas de materia abren su hub «Explora la materia». Antes el único
   acceso era el cajón «Materias» del menú (ya retirado): ahora entra por donde el
   usuario mira. navctx.js preselecciona la materia al hacer show(). */
document.querySelectorAll(".courses [data-view]").forEach(card => {
  const go = () => show(card.dataset.view);
  card.addEventListener("click", go);
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
  });
});
