"use strict";
/* ===== «Rincón de lógica» de 2.º ESO: el juego sucio de Schopenhauer (08-10) =====
   Vista #juegosucio. Datos en juegosucio.js (JUEGO_SUCIO): cada estratagema con su ilustración (grabados, litografías
   y cuadros de dominio público: Daumier, Goya, Hogarth, Gillray), su pie, la explicación sencilla, el nombre técnico,
   un ejemplo de instituto en forma de chat y cómo pararla. Enlace profundo: #juegosucio/<id>. */

const JS_TXT = {   /* textos de interfaz: cadenas enteras (así las traduce web_i18n/ui/<lang>.json) */
  estratagema: "{n}. estratagema", tecnico: "Izen teknikoa:", parar: "Nola geldiarazi:", ejemplo: "Adibide bat",
  trampa: "Tranpa egiten du", otra: "Beste pertsona"
};
const jsT = (k, v) => String(JS_TXT[k] || k).replace(/\{(\w+)\}/g, (_, x) => (v && v[x] != null ? v[x] : ""));

const jsBox = () => document.getElementById("juegosuciobox");
function jsTarjeta(e){
  const chat = (e.dialogo || []).map(d => {
    const truco = d.k === "zorro";
    return '<p class="js-msg ' + (truco ? "js-msg-truco" : "js-msg-otra") + '"><span class="js-quien">' + jsT(truco ? "trampa" : "otra") + "</span>" + d.t + "</p>";
  }).join("");
  return '<article class="js-card" id="js-' + e.id + '">' +
    '<figure class="js-obra"><img src="' + e.img + '"' + (e.w ? ' width="' + e.w + '" height="' + e.h + '"' : "") + ' alt="" loading="lazy" decoding="async"><figcaption><span class="js-autor">' + e.obra + "</span> " + e.pie + "</figcaption></figure>" +
    '<div class="js-texto"><p class="js-n">' + jsT("estratagema", { n: e.n }) + "</p><h3>" + e.titulo + "</h3>" +
    '<p class="js-tecnico">' + jsT("tecnico") + " <strong>" + e.tecnico + "</strong></p><p>" + e.que + "</p>" +
    '<div class="js-chat" aria-label="' + jsT("ejemplo") + '">' + chat + "</div>" +
    '<p class="js-defensa"><strong>' + jsT("parar") + "</strong> " + e.defensa + "</p></div></article>";
}
function jsRender(){
  const box = jsBox(); if (!box || typeof JUEGO_SUCIO === "undefined" || box.dataset.jsHecho) return;
  box.dataset.jsHecho = "1";
  const J = JUEGO_SUCIO;
  box.innerHTML = '<div class="js-cabecera"><figure class="js-retrato"><img src="media/juegosucio/schopenhauer.jpg" alt="" decoding="async"><figcaption>' + J.retrato + "</figcaption></figure>" +
    '<div><p class="js-intro">' + J.intro + '</p><p class="js-pista">' + J.pista + "</p></div></div>" +
    '<div class="js-grid">' + J.estratagemas.map(jsTarjeta).join("") + "</div>";
}
function loadJuegoSucio(arg){
  jsRender();
  if (arg){ const el = document.getElementById("js-" + arg); if (el) el.scrollIntoView({ block: "start" }); }
}
if (jsBox()) jsRender();
