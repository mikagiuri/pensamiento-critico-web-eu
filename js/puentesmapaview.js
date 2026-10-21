"use strict";
/* ===== Puentes 1.º ↔ 2.º como PLANO DE METRO (21-10-2026) ===== SOLO WEB LOCAL DEL PROFESOR
   Fuera de los builds del alumnado: NAV_DROP, DEAD y check_builds.sh.
   Reutiliza el formato del plano de metro de Genealogías (diacronía): cada LÍNEA de color es un
   tema de 1.º; sus ESTACIONES son los temas de 2.º (Historia de la Filosofía) donde ese tema
   reaparece, colocados en el orden cronológico del temario, con bandas de época arriba. Un tema de
   2.º al que llegan varias líneas de 1.º es un TRANSBORDO (cápsula vertical). Los temas de 2.º sin
   línea se rotulan en gris («sin equivalente»); los temas de 1.º sin continuación (Lógica, Estética)
   van aparte, debajo.
   Lee en vivo THEORY (theory.js) y window.Itinerario.PUENTES (itinerario.js): no duplica datos, se
   actualiza solo al añadir o quitar puentes. El script va DESPUÉS de itinerario.js en index.html. */
(function(){
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* temas principales de cada materia (no exploraciones), en el orden del curso.
     ORDEN_HF es además el orden CRONOLÓGICO: es el eje de estaciones del plano. */
  var ORDEN_FIL = ["fil-t1", "fil-t2", "fil-t3", "fil-metafisica", "fil-t4", "fil-t5", "fil-t6", "fil-t7"];
  var ORDEN_HF = ["hf-historicidad", "hf-metodos", "hf-mito", "hf-preso", "hf-sofistas", "hf-platon",
    "hf-antropologia", "hf-etica", "hf-politica", "hf-helenismo", "hf-medieval", "hf-fe-razon",
    "hf-modernidad", "hf-racionalismo", "hf-metafisica", "hf-contrato", "hf-utilitarismo", "hf-ilustracion",
    "hf-kant", "hf-etica-deber", "hf-sospecha", "hf-capitalismo", "hf-posmodernidad", "hf-analitica",
    "hf-existencialismo", "hf-beauvoir", "hf-siglo21"];

  /* temas de 2.º que, por el temario, no tienen homólogo en 1.º: no es un hueco, se marca «sin equivalente». */
  var HF_SIN_EQUIV = { "hf-historicidad": 1, "hf-metodos": 1, "hf-posmodernidad": 1, "hf-analitica": 1, "hf-existencialismo": 1, "hf-siglo21": 1, "hf-descartes-makro": 1 };
  /* temas de 1.º sin puente que el profesor ya sabe que no tienen homólogo claro en 2.º */
  var FIL_SIN_EQUIV = { "fil-t4": 1, "fil-t7": 1 };

  /* Edad histórica de cada tema de 2.º, para las bandas de época (periodización estándar). */
  var ERA = {
    "hf-historicidad": "intro", "hf-metodos": "intro",
    "hf-mito": "antigua", "hf-preso": "antigua", "hf-sofistas": "antigua", "hf-platon": "antigua",
    "hf-antropologia": "antigua", "hf-etica": "antigua", "hf-politica": "antigua", "hf-helenismo": "antigua",
    "hf-medieval": "medieval", "hf-fe-razon": "medieval",
    "hf-modernidad": "moderna", "hf-racionalismo": "moderna", "hf-metafisica": "moderna", "hf-contrato": "moderna",
    "hf-utilitarismo": "moderna", "hf-ilustracion": "moderna", "hf-kant": "moderna", "hf-etica-deber": "moderna",
    "hf-sospecha": "contemp", "hf-capitalismo": "contemp", "hf-posmodernidad": "contemp", "hf-analitica": "contemp",
    "hf-existencialismo": "contemp", "hf-beauvoir": "contemp", "hf-siglo21": "contemp"
  };
  var ERA_LAB = { intro: "Sarrera", antigua: "Edad Antigua", medieval: "Edad Media", moderna: "Aro Modernoa", contemp: "Edad Contemporánea" };
  /* clave de color de época (CSS data-b), como en Genealogías; «intro» sin color */
  var ERA_B = { antigua: "ant", medieval: "med", moderna: "mod", contemp: "con" };

  /* un color por cada tema (línea) de 1.º, para seguir el mismo tema cuando reaparece en varias estaciones */
  var FIL_COL = {
    "fil-t1": "#4e79a7", "fil-t2": "#59a14f", "fil-t3": "#d1495b", "fil-metafisica": "#b07aa1",
    "fil-t4": "#9c755f", "fil-t5": "#e8a93b", "fil-t6": "#e2763b", "fil-t7": "#4f9d9a"
  };
  /* nombre corto de cada línea (tema de 1.º) para la columna de la izquierda */
  var FIL_SHORT = {
    "fil-t1": "Zer da filosofia?", "fil-t2": "Zer da gizakia?", "fil-t3": "Zer ezagut dezakegu?",
    "fil-metafisica": "La realidad (Metafísica)", "fil-t4": "Logika eta argudiaketa",
    "fil-t5": "Etikaren galderak", "fil-t6": "La vida en sociedad", "fil-t7": "¿Qué es el arte? (Estética)"
  };

  function titulo(key){ try { var o = THEORY[key]; return o ? String(o.title || key) : key; } catch (e){ return key; } }
  function numTema(key){ try { var m = String((THEORY[key] || {}).tema || "").match(/Tema\s+([0-9]+)/); return m ? m[1] : ""; } catch (e){ return ""; } }
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
  function filShort(f){ return FIL_SHORT[f] || titulo(f); }
  function hfShort(h){
    var t = titulo(h).split(/[:：]/)[0];
    if (t.length > 26) t = t.slice(0, 25).replace(/\s+\S*$/, "") + "…";
    var num = numTema(h);
    return (num ? "T" + num + " · " : "") + t;
  }

  if (!document.getElementById("pmapacss")){
    var st = document.createElement("style"); st.id = "pmapacss";
    st.textContent = [
      "#puentes{--pm-ant:#8F6600;--pm-med:#8A4B84;--pm-mod:#0A76A0;--pm-con:#267A5B}",
      "#puentes .pm-resumen{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}",
      "#puentes .pm-chip{border:1px solid var(--line,#ccc);background:var(--surface,transparent);border-radius:10px;padding:7px 13px;font-size:.92em}",
      "#puentes .pm-chip b{font-size:1.15em}",
      "#puentes .pm-leyenda{font-size:.9em;opacity:.85;margin:4px 0 10px}",
      "#puentes .pm-leyenda code{font-size:.9em}",
      /* leyenda de líneas = conmutadores (como Genealogías) */
      "#puentes .pm-legend{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 12px}",
      "#puentes .pm-legend .flabel{margin-inline-end:4px;font-size:.85em;opacity:.8}",
      "#puentes .pm-leg{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13px;color:var(--ink,inherit);background:var(--surface-2,transparent);border:1px solid var(--line-soft,var(--line,#ccc));border-radius:999px;padding:4px 10px;cursor:pointer}",
      "#puentes .pm-leg i{width:16px;height:6px;border-radius:3px;display:inline-block;flex:none}",
      "#puentes .pm-leg[aria-pressed=\"false\"]{opacity:.45;text-decoration:line-through}",
      "#puentes .pm-leg[aria-pressed=\"false\"] i{filter:grayscale(1)}",
      "#puentes .pm-leg-all{color:var(--muted,#888)}",
      "#puentes .pm-leg:focus-visible{outline:2px solid var(--accent,#48c);outline-offset:2px}",
      "#puentes .pm-hint{color:var(--muted,#888);font-size:12px;margin:0 0 6px}",
      /* lienzo del plano, a casi todo el ancho de la pantalla */
      "#puentes .pm-scroll{overflow-x:auto;border:1px solid var(--line,#ccc);border-radius:14px;background:var(--surface,transparent);width:calc(100vw - 32px);max-width:1800px;position:relative;left:50%;transform:translateX(-50%)}",
      "#puentes .pm-svg{display:block}",
      "#puentes .pm-era{fill:var(--e);opacity:.85}",
      "#puentes .pm-era-lbl{fill:#fff;font-family:var(--sans,sans-serif);font-size:11px;font-weight:700;letter-spacing:.04em}",
      "#puentes .pm-era-band{fill:var(--e);opacity:.05}",
      "#puentes [data-b=\"ant\"]{--e:var(--pm-ant)} #puentes [data-b=\"med\"]{--e:var(--pm-med)} #puentes [data-b=\"mod\"]{--e:var(--pm-mod)} #puentes [data-b=\"con\"]{--e:var(--pm-con)}",
      "#puentes .pm-track{stroke-width:7;stroke-linecap:round;fill:none}",
      "#puentes .pm-guide{stroke-width:2;stroke-dasharray:2 5;opacity:.5;fill:none}",
      "#puentes .pm-line-lbl{font-family:var(--sans,sans-serif);font-size:12.5px;font-weight:700}",
      "#puentes .pm-xfer{fill:var(--surface,#fff);stroke:var(--muted,#888);stroke-width:1.5;opacity:.9}",
      "#puentes .pm-st{cursor:pointer}",
      "#puentes .pm-st circle{fill:var(--surface,#fff);stroke-width:3.5}",
      "#puentes .pm-st:hover circle,#puentes .pm-st:focus circle{fill:var(--ink,#222)}",
      "#puentes .pm-st:focus{outline:none}",
      "#puentes .pm-col{font-family:var(--sans,sans-serif);font-size:11.5px;cursor:pointer;text-anchor:start}",
      "#puentes .pm-col.pm-ok{fill:var(--ink,#222)}",
      "#puentes .pm-col.pm-neu{fill:var(--muted,#888);opacity:.8}",
      "#puentes .pm-col.pm-falta{fill:var(--bad,#c0392b);font-weight:700}",
      "#puentes .pm-col:hover{text-decoration:underline}",
      /* layout vertical: 2.º = espina cronológica, 1.º = columnas */
      "#puentes .pm-erav{fill:var(--e);opacity:.85}",
      "#puentes .pm-erav-lbl{fill:#fff;font-family:var(--sans,sans-serif);font-size:11px;font-weight:700;letter-spacing:.04em}",
      "#puentes .pm-colh{font-family:var(--sans,sans-serif);font-size:12px;font-weight:700;cursor:pointer}",
      "#puentes .pm-colh:hover{text-decoration:underline}",
      "#puentes .pm-colguide{stroke-width:1;opacity:.12}",
      "#puentes .pm-spine{stroke:var(--muted,#888);stroke-width:3}",
      "#puentes .pm-spine-lbl{font-family:var(--sans,sans-serif);font-size:12px;font-weight:700;fill:var(--muted,#888)}",
      "#puentes .pm-hflbl{font-family:var(--sans,sans-serif);font-size:11px;cursor:pointer}",
      "#puentes .pm-hflbl.pm-ok{fill:var(--ink,#222)}",
      "#puentes .pm-hflbl.pm-neu{fill:var(--muted,#888);opacity:.75}",
      "#puentes .pm-hflbl.pm-falta{fill:var(--bad,#c0392b);font-weight:700}",
      "#puentes .pm-hflbl:hover{text-decoration:underline}",
      "#puentes .pm-sdot{fill:var(--surface,#fff);stroke:var(--muted,#888);stroke-width:2.5}",
      "#puentes .pm-sdot.pm-ok{stroke:var(--ink,#222)}",
      "#puentes .pm-sdot.pm-neu{stroke:var(--muted,#888);opacity:.6}",
      "#puentes .pm-sdot.pm-falta{stroke:var(--bad,#c0392b)}",
      "#puentes .pm-branch{stroke-width:3;fill:none;opacity:.85}",
      "#puentes .pm-svg.pm-focus [data-line]:not(.on){opacity:.14}",
      "#puentes .pm-none{margin:18px 0}",
      /* temas de 1.º sin lugar en la línea histórica */
      "#puentes .pm-resto{border:1px solid var(--line,#ccc);border-radius:12px;padding:12px 14px;margin:16px 0 0}",
      "#puentes .pm-resto h3{margin:0 0 6px}",
      "#puentes .pm-resto ul{margin:4px 0 0;padding-inline-start:18px}",
      "#puentes .pm-resto li{margin:4px 0}",
      "@media (prefers-color-scheme:dark){:root:not([data-theme=\"light\"]) #puentes{--pm-ant:#E3B23C;--pm-med:#C48ABF;--pm-mod:#5BC3EA;--pm-con:#6FCBA6}:root:not([data-theme=\"light\"]) #puentes .pm-era-lbl,:root:not([data-theme=\"light\"]) #puentes .pm-erav-lbl{fill:#111}}",
      ":root[data-theme=\"dark\"] #puentes{--pm-ant:#E3B23C;--pm-med:#C48ABF;--pm-mod:#5BC3EA;--pm-con:#6FCBA6}",
      ":root[data-theme=\"dark\"] #puentes .pm-era-lbl,:root[data-theme=\"dark\"] #puentes .pm-erav-lbl{fill:#111}"
    ].join("\n");
    document.head.appendChild(st);
  }

  var hidden = {};   // temas de 1.º (líneas) ocultos

  function buildData(){
    var P = (window.Itinerario && window.Itinerario.PUENTES) || null;
    if (!P || typeof THEORY === "undefined") return null;
    var fil = ORDEN_FIL.filter(function(k){ return THEORY[k]; });
    var hf = ORDEN_HF.filter(function(k){ return THEORY[k]; });
    var byHf = {}; hf.forEach(function(h){ byHf[h] = {}; });
    fil.forEach(function(f){
      (P[f] || []).forEach(function(b){
        if (!byHf.hasOwnProperty(b.k)) return;
        (byHf[b.k][f] = byHf[b.k][f] || { filKey: f }).txtFwd = b.txt;
      });
    });
    hf.forEach(function(h){
      (P[h] || []).forEach(function(b){
        if (ORDEN_FIL.indexOf(b.k) < 0) return;
        (byHf[h][b.k] = byHf[h][b.k] || { filKey: b.k }).txtBack = b.txt;
      });
    });
    var usados = {}, totalVinculos = 0, estacionesOk = 0, estacionesFalta = [];
    hf.forEach(function(h){
      var pz = fil.filter(function(f){ return byHf[h][f]; });
      totalVinculos += pz.length;
      pz.forEach(function(f){ usados[f] = 1; });
      if (pz.length) estacionesOk++;
      else if (!HF_SIN_EQUIV[h]) estacionesFalta.push(h);
    });
    var connected = fil.filter(function(f){ return usados[f]; });
    var filSinLugar = fil.filter(function(f){ return !usados[f]; });
    return { fil: fil, hf: hf, byHf: byHf, connected: connected, filSinLugar: filSinLugar,
      totalVinculos: totalVinculos, estacionesOk: estacionesOk, estacionesFalta: estacionesFalta };
  }

  function metroSvg(d){
    var fil = d.fil, hf = d.hf, byHf = d.byHf;
    var cols = d.connected.filter(function(f){ return !hidden[f]; });   // columnas = temas de 1.º
    if (!cols.length) return '<p class="lead pm-none">No hay ningún tema de 1.º activo: púlsalo en la leyenda para verlo.</p>';
    var rows = hf;   // la espina vertical = la Historia de la Filosofía de 2.º, en orden cronológico
    var DX = 140, DY = 36, SX = 300, X0 = SX + 34, Y0 = 104, padR = 30, padB = 28;
    var colX = function(ci){ return X0 + ci * DX + DX / 2; };
    var rowY = function(ri){ return Y0 + ri * DY; };
    var W = X0 + cols.length * DX + padR, H = Y0 + rows.length * DY + padB;
    var colOf = {}; cols.forEach(function(f, ci){ colOf[f] = ci; });

    var s = '<svg class="pm-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Puentes: la Historia de la Filosofía de 2.º y los temas de 1.º que reaparecen">';
    // bandas de época: franjas horizontales (la espina de 2.º baja en el tiempo)
    var i = 0;
    while (i < rows.length){
      var e = ERA[rows[i]] || "", j = i + 1;
      while (j < rows.length && (ERA[rows[j]] || "") === e) j++;
      var ya = rowY(i) - DY / 2, yb = rowY(j - 1) + DY / 2, b = ERA_B[e] || "", lab = ERA_LAB[e] || "";
      s += '<rect class="pm-era-band" data-b="' + esc(b) + '" x="30" y="' + ya + '" width="' + (W - 34) + '" height="' + (yb - ya - 2) + '"/>';
      s += '<rect class="pm-erav" data-b="' + esc(b) + '" x="4" y="' + ya + '" width="18" height="' + (yb - ya - 2) + '" rx="5"/>';
      if (yb - ya > 60 && lab) s += '<text class="pm-erav-lbl" transform="translate(17,' + ((ya + yb) / 2) + ') rotate(-90)" text-anchor="middle">' + esc(lab) + '</text>';
      i = j;
    }
    // columnas = temas de 1.º: guía vertical tenue + encabezado de color
    cols.forEach(function(f, ci){
      var x = colX(ci), col = FIL_COL[f] || "#888";
      s += '<line class="pm-colguide" data-line="' + esc(f) + '" x1="' + x + '" y1="' + (Y0 - 14) + '" x2="' + x + '" y2="' + (H - 10) + '" stroke="' + col + '"/>';
      s += '<text class="pm-colh" data-line="' + esc(f) + '" data-key="' + esc(f) + '" tabindex="0" role="link" x="' + x + '" y="' + (Y0 - 30) + '" text-anchor="middle" fill="' + col + '">' + esc(filShort(f)) + '</text>';
    });
    // espina = la línea de 2.º (vertical, cronológica)
    s += '<text class="pm-spine-lbl" x="30" y="' + (Y0 - 30) + '">2.º · Historia de la Filosofía (orden cronológico ↓)</text>';
    s += '<line class="pm-spine" x1="' + SX + '" y1="' + rowY(0) + '" x2="' + SX + '" y2="' + rowY(rows.length - 1) + '"/>';
    // cada tema de 2.º: estación en la espina, etiqueta y ramas de color a sus temas de 1.º
    rows.forEach(function(h, ri){
      var y = rowY(ri);
      var piezas = cols.filter(function(f){ return byHf[h][f]; });
      var stcls = piezas.length ? "pm-ok" : (HF_SIN_EQUIV[h] ? "pm-neu" : "pm-falta");
      s += '<text class="pm-hflbl ' + stcls + '" data-key="' + esc(h) + '" tabindex="0" role="link" x="' + (SX - 12) + '" y="' + (y + 4) + '" text-anchor="end" aria-label="' + esc(titulo(h)) + '">' + esc(hfShort(h)) + '</text>';
      s += '<circle class="pm-sdot ' + stcls + '" cx="' + SX + '" cy="' + y + '" r="5"/>';
      piezas.forEach(function(f){
        var x = colX(colOf[f]), col = FIL_COL[f] || "#888", p = byHf[h][f], tx = p && (p.txtFwd || p.txtBack);
        s += '<g class="pm-br" data-line="' + esc(f) + '">' +
          '<path class="pm-branch" d="M' + SX + ',' + y + ' L' + x + ',' + y + '" stroke="' + col + '"/>' +
          '<g class="pm-st" data-line="' + esc(f) + '" data-key="' + esc(h) + '" tabindex="0" role="link" aria-label="' + esc(titulo(h)) + '">' +
          '<circle cx="' + x + '" cy="' + y + '" r="6" stroke="' + col + '"/>' +
          '<title>' + esc(etiqueta(h) + " · " + titulo(h) + (tx ? "\n" + tx : "")) + '</title></g></g>';
      });
    });
    return s + '</svg>';
  }

  function render(){
    var cont = document.getElementById("puentesbody");
    if (!cont) return;
    var d = buildData();
    if (!d){ cont.innerHTML = '<p>No se han podido leer los datos (THEORY / Itinerario.PUENTES). ¿Falta algún build?</p>'; return; }

    var resumen = '<div class="pm-resumen">' +
      '<span class="pm-chip">2.º: <b>' + d.hf.length + '</b> temas en la línea histórica</span>' +
      '<span class="pm-chip"><b>' + d.connected.length + '</b> temas de 1.º (columnas)</span>' +
      '<span class="pm-chip"><b>' + d.totalVinculos + '</b> paradas (vínculos)</span>' +
      '<span class="pm-chip">2.º: <b>' + d.estacionesOk + '</b>/' + d.hf.length + ' temas que vuelven a 1.º</span>' +
      '<span class="pm-chip" style="color:var(--bad,#c0392b)">Huecos por rellenar: <b>' + d.estacionesFalta.length + '</b></span>' +
      '<span class="pm-chip">Temas de 1.º sin continuación: <b>' + d.filSinLugar.length + '</b></span>' +
      '</div>';
    var leyenda = '<p class="pm-leyenda">Plano al estilo <strong>Genealogiak</strong>: la <strong>espina vertical</strong> es la Historia de la Filosofía de 2.º en orden cronológico (de la Antigua, arriba, a la Contemporánea, abajo), con las <strong>bandas de época</strong>. Cada <strong>columna de color</strong> es un tema de 1.º; una <strong>parada de color</strong> en un tema de 2.º marca que ahí se retoma ese tema de 1.º. El <strong>color que se repite</strong> hacia abajo deja ver lo semejante en los dos cursos. En gris, los temas de 2.º <strong>sin equivalente</strong> en 1.º (no es un hueco). Pulsa una estación o un tema para abrirlo. Se lee en vivo de <code>itinerario.js</code> eta <code>theory.js</code>.</p>';

    var legend = '<div class="pm-legend" role="group" aria-label="Temas de 1.º (columnas)"><span class="flabel">Temas de 1.º</span>' +
      d.connected.map(function(f){
        return '<button type="button" class="pm-leg" data-fil="' + esc(f) + '" aria-pressed="' + (!hidden[f]) + '" title="' + esc(titulo(f)) + '">' +
          '<i style="background:' + (FIL_COL[f] || "#888") + '"></i><span>' + esc(filShort(f)) + '</span></button>';
      }).join("") +
      '<button type="button" class="pm-leg pm-leg-all" data-fil="all">Guztiak</button>' +
      '<button type="button" class="pm-leg pm-leg-all" data-fil="none">Bat ere ez</button></div>';

    var hint = '<p class="pm-hint">↓ La línea de 2.º baja en el tiempo (Antigua → Contemporánea); desliza en horizontal si no caben todas las columnas de 1.º.</p>';
    var stage = '<div class="pm-scroll">' + metroSvg(d) + '</div>';

    var resto = '';
    if (d.filSinLugar.length){
      resto = '<div class="pm-resto"><h3>Temas de 1.º sin lugar en la línea histórica</h3>' +
        '<p class="pm-leyenda" style="margin:0">Temas de 1.º que no cuelgan de ningún punto cronológico de 2.º:</p><ul>' +
        d.filSinLugar.map(function(f){
          var marca = FIL_SIN_EQUIV[f] ? ' <span style="opacity:.65">(sin equivalente claro)</span>'
            : ' <span style="color:var(--bad,#c0392b)">(parece tener homólogo: candidato a puente)</span>';
          return '<li><span style="color:' + (FIL_COL[f] || "#888") + ';font-weight:700">' + esc(etiqueta(f)) + '</span> — ' + esc(titulo(f)) + marca + '</li>';
        }).join("") + '</ul></div>';
    }

    cont.innerHTML = resumen + leyenda + legend + hint + stage + resto;
  }

  /* ---- interacción ---- */
  document.addEventListener("click", function(e){
    if (!e.target.closest) return;
    var leg = e.target.closest("#puentes .pm-leg[data-fil]");
    if (leg){
      var k = leg.dataset.fil, d = buildData();
      if (k === "all"){ (d ? d.connected : []).forEach(function(f){ delete hidden[f]; }); }
      else if (k === "none"){ (d ? d.connected : []).forEach(function(f){ hidden[f] = 1; }); }
      else { hidden[k] ? delete hidden[k] : (hidden[k] = 1); }
      render();
      var again = document.querySelector('#puentes .pm-leg[data-fil="' + k + '"]'); if (again) again.focus();
      return;
    }
    var nav = e.target.closest("#puentes [data-key]");
    if (nav){ var key = nav.dataset.key; if (key) location.hash = "#teoria/" + key; }
  });
  document.addEventListener("keydown", function(e){
    var nav = e.target.closest && e.target.closest("#puentes [data-key]");
    if (nav && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); var key = nav.dataset.key; if (key) location.hash = "#teoria/" + key; }
  });
  /* resaltar una línea al pasar por ella (el resto se atenúa) */
  document.addEventListener("mouseover", function(e){
    var svg = e.target.closest && e.target.closest("#puentes .pm-svg"); if (!svg) return;
    var g = e.target.closest("[data-line]"), id = g ? g.dataset.line : null;
    svg.classList.toggle("pm-focus", !!id);
    svg.querySelectorAll("[data-line]").forEach(function(x){ x.classList.toggle("on", x.dataset.line === id); });
  });
  document.addEventListener("mouseout", function(e){
    var svg = e.target.closest && e.target.closest("#puentes .pm-svg");
    if (svg && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("#puentes .pm-svg"))) svg.classList.remove("pm-focus");
  });

  render();
  var origShow = window.show;
  if (typeof origShow === "function"){
    window.show = function(id){ origShow.apply(this, arguments); if (id === "puentes") try { render(); } catch (e){} };
  }
})();
