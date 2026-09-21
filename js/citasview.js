"use strict";
/* ===== Vista Citas ===== depende de: citas.js =====
   Frases célebres de la filosofía, con filtro por época. Estilos propios con tokens de tema. */
(function(){
  if (typeof CITAS === "undefined") return;

  const EPOCAS = { antigua: "Antzinakoa", medieval: "Erdi Arokoa", moderna: "Modernoa", contemporanea: "Garaikidea" };
  const CSS = ''
    + '#citas .citgrid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr)); gap:14px; margin-top:14px; }'
    + '#citas .citcard{ background:var(--surface); border:1px solid var(--line); border-left:4px solid var(--accent); '
    + '  border-radius:12px; padding:18px 18px 15px; display:flex; flex-direction:column; gap:10px; box-shadow:var(--shadow); }'
    + '#citas .cit-q{ font-family:var(--serif,Georgia,serif); font-style:italic; font-size:1.08rem; line-height:1.45; color:var(--ink); margin:0; }'
    + '#citas .cit-q::before{ content:"\\201C"; color:var(--accent); font-size:1.3em; line-height:0; vertical-align:-0.25em; margin-right:.05em; }'
    + '#citas .cit-src{ margin-top:auto; font-size:.9rem; }'
    + '#citas .cit-a{ font-weight:600; color:var(--ink); }'
    + '#citas .cit-o{ color:var(--muted); font-style:italic; }'
    + '#citas .citcount{ color:var(--muted); font-size:13px; margin:10px 0 0; }'
    + '@media (max-width:520px){ #citas .citgrid{ grid-template-columns:1fr; } }';
  let cssDone = false;
  function injectCss(){ if (cssDone) return; const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); cssDone = true; }

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  let citEpoca = "all";

  function citFiltered(){ return CITAS.filter(function (c){ return citEpoca === "all" || c.e === citEpoca; }); }

  function renderCitFilter(){
    const box = document.getElementById("citasfilter");
    if (!box) return;
    injectCss();
    box.innerHTML = '<div class="fgroup"><span class="flabel">Garaia</span>' +
      ["all", "antigua", "medieval", "moderna", "contemporanea"].map(function (e){
        return '<button class="fbtn" data-ce="' + e + '" aria-pressed="' + (e === citEpoca) + '">' +
          (e === "all" ? "Guztiak" : EPOCAS[e]) + '</button>'; }).join("") + '</div>';
    box.querySelectorAll("[data-ce]").forEach(function (b){ b.addEventListener("click", function (){
      citEpoca = b.dataset.ce; renderCitFilter(); renderCitBody(); }); });
  }

  function renderCitBody(){
    const body = document.getElementById("citasbody");
    if (!body) return;
    const list = citFiltered();
    body.innerHTML = '<div class="citgrid">' + list.map(function (c){
      return '<figure class="citcard"><blockquote class="cit-q">' + esc(c.c) + '</blockquote>' +
        '<figcaption class="cit-src"><span class="cit-a">' + esc(c.a) + '</span>' +
        (c.o ? ', <span class="cit-o">' + esc(c.o) + '</span>' : '') + '</figcaption></figure>';
    }).join("") + '</div>' +
    '<p class="citcount">' + list.length + (list.length === 1 ? " aipu" : " aipu") + '.</p>';
  }

  function initCitas(){ if (!document.getElementById("citasbody")) return; renderCitFilter(); renderCitBody(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initCitas);
  else initCitas();
})();
