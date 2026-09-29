"use strict";
/* ===== Colores de época y de rama en toda la web (30-09-2026) =====
   Idea del profesor: la distinción por color que ya usa «Ilustres» (y el eje cronológico) vale para toda la web,
   y quita monotonía a la ficha de la materia. En Historia de la Filosofía cada tema tiene época:
   1-10 Antigua · 11-12 Medieval · 13 Renacimiento · 14-17 Moderna · 18-20 Ilustración · 21-27 Contemporánea.
   En Filosofía 1.º cada tema (salvo el 1, introductorio) tiene rama: 2 Antropología · 3 Conocimiento · 4 Lógica ·
   5 Ética · 6 Política · 7 Estética. Los colores (--e-ant…--e-con y --r-ant…--r-est) están en styles.css, en :root,
   con su versión para oscuro; el atributo data-ep / data-rama de un elemento fija su --e / --r. Este módulo:
   · marca con data-ep (HF) o data-rama (Filosofía 1.º) los chips de Teoría, Tarjetas, Cuestionarios, Infografías,
     Mapas, Esquemas, Lecturas y Comentarios, y la cabecera del tema abierto en Teoría (los deduce con
     Itinerario.temaOf, itinerario.js);
   · lo mantiene al día con un MutationObserver (las vistas repintan sus chips con innerHTML).
   Pensamiento crítico no tiene épocas ni ramas: no se toca. Sin textos. */
(function(){
  var EPOCAS = [["ant", 1, 10], ["med", 11, 12], ["ren", 13, 13], ["mod", 14, 17], ["ilu", 18, 20], ["con", 21, 27]];
  function epocaDeTema(n){ for (var i = 0; i < EPOCAS.length; i++) if (n >= EPOCAS[i][1] && n <= EPOCAS[i][2]) return EPOCAS[i][0]; return null; }
  /* Filosofía 1.º: rama de cada tema (el 1, introductorio, no tiene). */
  var RAMAS = { 2: "ant", 3: "con", 4: "log", 5: "eti", 6: "pol", 7: "est" };
  function ramaDeTema(n){ return RAMAS[n] || null; }
  function G(name){ try { return (0, eval)("typeof " + name + " !== 'undefined' ? " + name + " : undefined"); } catch (e){ return undefined; } }
  var COLL = { th: ["teoria", "THEORY"], deck: ["tarjetas", "DECKS"], quiz: ["cuestionarios", "QUIZZES"], ig: ["infografias", "INFOGRAFIAS"], map: ["mapas", "MAPS"], esq: ["esquemas", "ESQUEMAS"], lec: ["lecturas", "LECTURAS"], com: ["comentario", "COMENTARIO"] };
  /* color de un recurso según su materia: época (HF) o rama (Filosofía 1.º) */
  function colorDe(go, key){
    var It = window.Itinerario, cname = null;
    for (var a in COLL) if (COLL[a][0] === go) cname = COLL[a][1];
    var c = cname ? G(cname) : null, o = c && c[key];
    if (!It || !o) return { ep: null, rama: null };
    var n = It.temaOf(go, key, o);
    if (typeof n !== "number") return { ep: null, rama: null };
    if (o.subject === "hf") return { ep: epocaDeTema(n), rama: null };
    if (o.subject === "fil") return { ep: null, rama: ramaDeTema(n) };
    return { ep: null, rama: null };
  }
  function mark(el, go, key){
    var c = colorDe(go, key);
    if (c.ep) el.setAttribute("data-ep", c.ep); else el.removeAttribute("data-ep");
    if (c.rama) el.setAttribute("data-rama", c.rama); else el.removeAttribute("data-rama");
  }
  var pending = false;
  function refresh(){
    pending = false;
    for (var a in COLL){
      var go = COLL[a][0];
      document.querySelectorAll(".chip[data-" + a + "]").forEach(function(el){ mark(el, go, el.getAttribute("data-" + a)); });
    }
    /* cabecera del tema abierto en Teoría y sus tarjetas de tema anterior/siguiente */
    var head = document.querySelector("#theorybody .theory-head"), k = G("theoryKey");
    if (head && k != null) mark(head, "teoria", k);
    document.querySelectorAll("#theorybody .fin-pn-card[data-iarg]").forEach(function(el){ mark(el, "teoria", el.getAttribute("data-iarg")); });
  }
  function schedule(){ if (pending) return; pending = true; setTimeout(refresh, 0); }
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  window.Epocas = { epocaDeTema: epocaDeTema, EPOCAS: EPOCAS };
  window.Ramas = { ramaDeTema: ramaDeTema, RAMAS: RAMAS };
  refresh();
})();
