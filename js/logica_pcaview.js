"use strict";
/* ===== «Rincón de lógica» de 2.º ESO: el juego sucio de Schopenhauer (08-10) =====
   Vista #logica_pca. Datos en logica_pca.js (JUEGO_SUCIO): cada estratagema con su ilustración (grabados, litografías
   y cuadros de dominio público: Daumier, Goya, Hogarth, Gillray), su pie, la explicación sencilla, el nombre técnico,
   un ejemplo de instituto en forma de chat y cómo pararla. Enlace profundo: #logica_pca/<id>. */

const JS_TXT = {   /* textos de interfaz: cadenas enteras (así las traduce web_i18n/ui/<lang>.json) */
  estratagema: "{n}. estratagema", tecnico: "Izen teknikoa:", parar: "Nola geldiarazi:", ejemplo: "Adibide bat",
  trampa: "Tranpa egiten du", otra: "Beste pertsona"
};
const jsT = (k, v) => String(JS_TXT[k] || k).replace(/\{(\w+)\}/g, (_, x) => (v && v[x] != null ? v[x] : ""));

const jsBox = () => document.getElementById("logica_pcabox");
function jsTarjeta(e){
  const chat = (e.dialogo || []).map(d => {
    const truco = d.k === "zorro";
    return '<p class="lp-msg ' + (truco ? "lp-msg-truco" : "lp-msg-otra") + '"><span class="lp-quien">' + jsT(truco ? "trampa" : "otra") + "</span>" + d.t + "</p>";
  }).join("");
  /* (22-10) título y explicación ANTES del cuadro, para que se sepa qué buscar en él; el cuadro es opcional (sin img, no sale) */
  const obra = e.img ? '<figure class="lp-obra"><img src="' + e.img + '"' + (e.w ? ' width="' + e.w + '" height="' + e.h + '"' : "") + ' alt="" loading="lazy" decoding="async"><figcaption><span class="lp-autor">' + (e.obra || "") + "</span> " + (e.pie || "") + "</figcaption></figure>" : "";
  return '<article class="lp-card' + (obra ? "" : " lp-sin-obra") + '" id="js-' + e.id + '">' +
    '<div class="lp-texto lp-cabeza"><p class="lp-n">' + jsT("estratagema", { n: e.n }) + "</p><h3>" + e.titulo + "</h3>" +
    '<p class="lp-tecnico">' + jsT("tecnico") + " <strong>" + e.tecnico + "</strong></p><p>" + e.que + "</p></div>" +
    obra +
    '<div class="lp-texto"><div class="lp-chat" aria-label="' + jsT("ejemplo") + '">' + chat + "</div>" +
    '<p class="lp-defensa"><strong>' + jsT("parar") + "</strong> " + e.defensa + "</p></div></article>";
}
function jsRender(){
  const box = jsBox(); if (!box || typeof JUEGO_SUCIO === "undefined" || box.dataset.jsHecho) return;
  box.dataset.jsHecho = "1";
  const J = JUEGO_SUCIO;
  box.innerHTML = '<div class="lp-cabecera"><figure class="lp-retrato"><img src="media/logica_pca/schopenhauer.jpg" alt="" decoding="async"><figcaption>' + J.retrato + "</figcaption></figure>" +
    '<div><p class="lp-intro">' + J.intro + '</p><p class="lp-pista">' + J.pista + "</p></div></div>" +
    '<div class="lp-grid">' + J.estratagemas.map(jsTarjeta).join("") + "</div>";
}
function loadJuegoSucio(arg){
  jsRender();
  if (arg){ const el = document.getElementById("js-" + arg); if (el) el.scrollIntoView({ block: "start" }); }
}
if (jsBox()) jsRender();
