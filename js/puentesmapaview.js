"use strict";
/* ===== Mapa de puentes 1.º ↔ 2.º (20-10-2026) ===== SOLO WEB LOCAL DEL PROFESOR
   Fuera de los builds del alumnado: NAV_DROP, DEAD y check_builds.sh.
   Panel de coordinación: muestra TODOS los puentes «Lo volverás a ver en 2.º» / «Ya lo viste en 1.º»
   que hay entre Filosofía de 1.º y la Historia de la Filosofía de 2.º, y señala dónde faltan.
   Lee los datos en vivo de THEORY (theory.js) y window.Itinerario.PUENTES (itinerario.js): no duplica nada,
   así que se actualiza solo cuando se añaden o quitan puentes. */
(function(){
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* temas principales de cada materia (no exploraciones): en el orden del curso */
  var ORDEN_FIL = ["fil-t1", "fil-t2", "fil-t3", "fil-metafisica", "fil-t4", "fil-t5", "fil-t6", "fil-t7"];
  var ORDEN_HF = ["hf-historicidad", "hf-metodos", "hf-mito", "hf-preso", "hf-sofistas", "hf-platon",
    "hf-antropologia", "hf-etica", "hf-politica", "hf-helenismo", "hf-medieval", "hf-fe-razon",
    "hf-modernidad", "hf-racionalismo", "hf-metafisica", "hf-contrato", "hf-utilitarismo", "hf-ilustracion",
    "hf-kant", "hf-etica-deber", "hf-sospecha", "hf-capitalismo", "hf-posmodernidad", "hf-analitica",
    "hf-existencialismo", "hf-beauvoir", "hf-siglo21"];

  /* temas de 2.º que, por el temario, no tienen homólogo en 1.º: no es un hueco, se marca «sin equivalente».
     El resto de 2.º sin puente SÍ es un hueco por rellenar. */
  var HF_SIN_EQUIV = { "hf-historicidad": 1, "hf-metodos": 1, "hf-posmodernidad": 1, "hf-analitica": 1, "hf-existencialismo": 1, "hf-siglo21": 1, "hf-descartes-makro": 1 };
  /* temas de 1.º sin puente que el profesor ya sabe que no tienen homólogo claro en 2.º */
  var FIL_SIN_EQUIV = { "fil-t4": 1, "fil-t7": 1 };

  function titulo(key){
    try { var o = THEORY[key]; if (!o) return key; return String(o.title || key); } catch (e){ return key; }
  }
  function etiqueta(key){
    try {
      var o = THEORY[key]; if (!o) return key;
      if (o.sigla) return o.sigla;
      var m = String(o.tema || "").match(/Tema\s+([0-9]+)/);
      if (m) return (o.subject === "fil" ? "1.º · T" : "2.º · T") + m[1];
      m = String(o.tema || "").match(/·\s*([^·]+)$/);
      return (o.subject === "fil" ? "1.º · " : "2.º · ") + (m ? m[1].trim() : key);
    } catch (e){ return key; }
  }

  if (!document.getElementById("pmapacss")){
    var st = document.createElement("style"); st.id = "pmapacss";
    st.textContent = [
      "#puentes .pm-resumen{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 20px}",
      "#puentes .pm-chip{border:1px solid var(--line,#ccc);background:var(--card,transparent);border-radius:10px;padding:8px 14px;font-size:.95em}",
      "#puentes .pm-chip b{font-size:1.15em}",
      "#puentes .pm-col h2{margin:1.4em 0 .4em}",
      "#puentes .pm-tema{border:1px solid var(--line,#ccc);border-radius:12px;padding:12px 14px;margin:10px 0}",
      "#puentes .pm-tema.ok{border-inline-start:5px solid var(--ok,#3a8a4e)}",
      "#puentes .pm-tema.falta{border-inline-start:5px solid var(--bad,#c0392b)}",
      "#puentes .pm-tema.neutro{border-inline-start:5px solid var(--line,#999);opacity:.72}",
      "#puentes .pm-cab{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between}",
      "#puentes .pm-key{font-weight:700}",
      "#puentes .pm-tag{font-size:.8em;opacity:.7}",
      "#puentes .pm-estado{font-size:.82em;border-radius:20px;padding:2px 10px;white-space:nowrap}",
      "#puentes .pm-estado.ok{background:var(--ok-bg,rgba(60,140,80,.15));color:var(--ok,#3a8a4e)}",
      "#puentes .pm-estado.falta{background:rgba(192,57,43,.14);color:var(--bad,#c0392b)}",
      "#puentes .pm-estado.neutro{background:var(--soft,rgba(128,128,128,.12));opacity:.85}",
      "#puentes .pm-dest{margin:8px 0 0;padding:0;list-style:none}",
      "#puentes .pm-dest li{margin:5px 0;padding-inline-start:16px;position:relative}",
      "#puentes .pm-dest li::before{content:'\\2192';position:absolute;inset-inline-start:0;opacity:.6}",
      "#puentes .pm-dest .d-tit{opacity:.85}",
      "#puentes .pm-dest .d-txt{display:block;font-size:.9em;opacity:.7;padding-inline-start:16px}",
      "#puentes .pm-falta-txt{margin:6px 0 0;font-size:.92em;color:var(--bad,#c0392b)}",
      "#puentes .pm-leyenda{font-size:.9em;opacity:.8;margin:6px 0 18px}",
      "@media(min-width:900px){#puentes .pm-cols{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function destinoHtml(subject, arr){
    return '<ul class="pm-dest">' + arr.map(function(x){
      return '<li><span class="d-tit">' + esc(etiqueta(x.k)) + ' — ' + esc(x.tit || titulo(x.k)) + '</span>' +
        (x.txt ? '<span class="d-txt">' + esc(x.txt) + '</span>' : '') + '</li>';
    }).join("") + '</ul>';
  }

  function temaCard(subject, key, P, sinEquiv){
    var arr = P[key] || [];
    var tiene = arr.length > 0;
    var noAplica = !!sinEquiv[key];
    var cls = tiene ? "ok" : (noAplica ? "neutro" : "falta");
    var estado = tiene ? '<span class="pm-estado ok">' + arr.length + (arr.length === 1 ? " puente" : " puentes") + '</span>'
      : (noAplica ? '<span class="pm-estado neutro">sin equivalente en ' + (subject === "fil" ? "2.º" : "1.º") + '</span>'
        : '<span class="pm-estado falta">FALTA PUENTE</span>');
    var cuerpo = tiene ? destinoHtml(subject, arr)
      : (noAplica ? '' : '<p class="pm-falta-txt">Este tema no tiene puente a ' + (subject === "fil" ? "2.º" : "1.º") + ' y parece tener homólogo. Candidato a rellenar.</p>');
    return '<div class="pm-tema ' + cls + '"><div class="pm-cab"><span class="pm-key">' + esc(etiqueta(key)) +
      '</span>' + estado + '</div><div class="pm-tag">' + esc(key) + ' · ' + esc(titulo(key)) + '</div>' + cuerpo + '</div>';
  }

  function render(){
    var cont = document.getElementById("puentesbody");
    if (!cont) return;
    var P = (window.Itinerario && window.Itinerario.PUENTES) || null;
    if (!P || typeof THEORY === "undefined"){
      cont.innerHTML = '<p>No se han podido leer los datos (THEORY / Itinerario.PUENTES). ¿Falta algún build?</p>';
      return;
    }
    var fil = ORDEN_FIL.filter(function(k){ return THEORY[k]; });
    var hf = ORDEN_HF.filter(function(k){ return THEORY[k]; });
    var filOk = fil.filter(function(k){ return (P[k] || []).length; }).length;
    var hfOk = hf.filter(function(k){ return (P[k] || []).length; }).length;
    var filFalta = fil.filter(function(k){ return !(P[k] || []).length && !FIL_SIN_EQUIV[k]; });
    var hfFalta = hf.filter(function(k){ return !(P[k] || []).length && !HF_SIN_EQUIV[k]; });
    var totalPares = fil.reduce(function(n, k){ return n + (P[k] || []).length; }, 0);

    var resumen = '<div class="pm-resumen">' +
      '<span class="pm-chip"><b>' + totalPares + '</b> puentes en total</span>' +
      '<span class="pm-chip">1.º: <b>' + filOk + '</b>/' + fil.length + ' temas con puente</span>' +
      '<span class="pm-chip">2.º: <b>' + hfOk + '</b>/' + hf.length + ' temas con puente</span>' +
      '<span class="pm-chip" style="color:var(--bad,#c0392b)">Huecos por rellenar: <b>' + (filFalta.length + hfFalta.length) + '</b></span>' +
      '</div>';
    var leyenda = '<p class="pm-leyenda"><strong>Verde</strong>: el tema tiene puente. <strong>Rojo</strong>: falta y parece tener homólogo. <strong>Gris</strong>: sin equivalente claro en la otra materia (no es un hueco). Se lee en vivo de la web: al añadir un puente en <code>itinerario.js</code>, este mapa se actualiza solo.</p>';

    var colFil = '<div class="pm-col"><h2>Filosofía 1.º → 2.º</h2>' +
      fil.map(function(k){ return temaCard("fil", k, P, FIL_SIN_EQUIV); }).join("") + '</div>';
    var colHf = '<div class="pm-col"><h2>Historia de la Filosofía 2.º → 1.º</h2>' +
      hf.map(function(k){ return temaCard("hf", k, P, HF_SIN_EQUIV); }).join("") + '</div>';

    var faltaResumen = "";
    if (filFalta.length || hfFalta.length){
      faltaResumen = '<div class="pm-tema falta"><div class="pm-cab"><span class="pm-key">Dónde faltan puentes</span></div>' +
        '<ul class="pm-dest">' +
        filFalta.map(function(k){ return '<li><span class="d-tit">' + esc(etiqueta(k)) + ' — ' + esc(titulo(k)) + '</span></li>'; }).join("") +
        hfFalta.map(function(k){ return '<li><span class="d-tit">' + esc(etiqueta(k)) + ' — ' + esc(titulo(k)) + '</span></li>'; }).join("") +
        '</ul></div>';
    } else {
      faltaResumen = '<div class="pm-tema ok"><div class="pm-cab"><span class="pm-key">No falta ningún puente con homólogo claro.</span></div></div>';
    }

    cont.innerHTML = resumen + leyenda + faltaResumen + '<div class="pm-cols">' + colFil + colHf + '</div>';
  }

  render();
  var origShow = window.show;
  if (typeof origShow === "function"){
    window.show = function(id){ origShow.apply(this, arguments); if (id === "puentes") try { render(); } catch (e){} };
  }
})();
