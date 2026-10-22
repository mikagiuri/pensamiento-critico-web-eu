"use strict";
/* ===== Puentes 1.º → 2.º como ÁRBOL DE PROGRESIÓN / TECH TREE (22-10-2026) ===== SOLO WEB LOCAL DEL PROFESOR
   Fuera de los builds del alumnado: NAV_DROP, DEAD y check_builds.sh.
   Idea del profesor: abajo, LOS CIMIENTOS (los temas de 1.º, lo que ya se ha aprendido); hacia arriba,
   todo lo que en 2.º se DESBLOQUEA y se profundiza gracias a esos cimientos, en orden histórico
   (Antigua → Contemporánea, de abajo arriba). De cada cimiento suben «cables» de color hasta los
   temas de 2.º que permite; cada cable es un puente y lleva su explicación, que aparece en el panel
   al pasar el ratón (o al enfocar con el teclado). Cada nodo es una caja con nombre legible; al pulsar
   se abre el tema.
   Lee en vivo THEORY (theory.js) y window.Itinerario.PUENTES (itinerario.js): no duplica datos, se
   actualiza solo al añadir o quitar puentes. El script va DESPUÉS de itinerario.js en index.html. */
(function(){
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* temas principales de cada materia (no exploraciones), en el orden del curso.
     ORDEN_HF es además el orden CRONOLÓGICO, que da la altura de cada tema en el árbol. */
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

  /* Edad histórica de cada tema de 2.º: da el nivel (fila) del árbol. */
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
  /* niveles del árbol, de abajo (cimientos) arriba (lo más reciente) */
  var NIVELES = ["base", "intro", "antigua", "medieval", "moderna", "contemp"];
  var NIVEL_LAB = { base: "1.º · Los cimientos", intro: "2.º · Introducción", antigua: "Edad Antigua", medieval: "Edad Media", moderna: "Aro Modernoa", contemp: "Edad Contemporánea" };
  /* clave de color de época (CSS data-b); «intro» y «base» sin color de época */
  var ERA_B = { antigua: "ant", medieval: "med", moderna: "mod", contemp: "con" };

  /* un color por cada cimiento (tema de 1.º): es el color del cable que sube de él */
  var FIL_COL = {
    "fil-t1": "#4e79a7", "fil-t2": "#59a14f", "fil-t3": "#d1495b", "fil-metafisica": "#b07aa1",
    "fil-t4": "#9c755f", "fil-t5": "#e8a93b", "fil-t6": "#e2763b", "fil-t7": "#4f9d9a"
  };
  /* nombre corto de cada cimiento (tema de 1.º) */
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
    if (t.length > 30) t = t.slice(0, 29).replace(/\s+\S*$/, "") + "…";
    var num = numTema(h);
    return (num ? "T" + num + " · " : "") + t;
  }
  /* parte un rótulo en varias líneas para la caja (corta por palabras, última línea con … si sobra) */
  function wrap(txt, maxc, maxlines){
    var words = String(txt).split(/\s+/), lines = [], cur = "";
    for (var i = 0; i < words.length; i++){
      var t = cur ? cur + " " + words[i] : words[i];
      if (t.length <= maxc || !cur) cur = t; else { lines.push(cur); cur = words[i]; }
    }
    if (cur) lines.push(cur);
    if (lines.length > maxlines){
      lines = lines.slice(0, maxlines);
      lines[maxlines - 1] = lines[maxlines - 1].replace(/\s+\S*$/, "") + "…";
    }
    return lines;
  }

  if (!document.getElementById("pmapacss")){
    var st = document.createElement("style"); st.id = "pmapacss";
    st.textContent = [
      "#puentes{--pm-ant:#8F6600;--pm-med:#8A4B84;--pm-mod:#0A76A0;--pm-con:#267A5B}",
      "#puentes .pm-resumen{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}",
      "#puentes .pm-chip{border:1px solid var(--line,#ccc);background:var(--surface,transparent);border-radius:10px;padding:7px 13px;font-size:.92em}",
      "#puentes .pm-chip b{font-size:1.15em}",
      "#puentes .pm-leyenda{font-size:.9em;opacity:.9;margin:4px 0 10px;max-width:70rem}",
      "#puentes .pm-leyenda code{font-size:.9em}",
      /* leyenda de cimientos = conmutadores */
      "#puentes .pm-legend{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 10px}",
      "#puentes .pm-legend .flabel{margin-inline-end:4px;font-size:.85em;opacity:.8}",
      "#puentes .pm-leg{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13px;color:var(--ink,inherit);background:var(--surface-2,transparent);border:1px solid var(--line-soft,var(--line,#ccc));border-radius:999px;padding:4px 10px;cursor:pointer}",
      "#puentes .pm-leg i{width:16px;height:6px;border-radius:3px;display:inline-block;flex:none}",
      "#puentes .pm-leg[aria-pressed=\"false\"]{opacity:.45;text-decoration:line-through}",
      "#puentes .pm-leg[aria-pressed=\"false\"] i{filter:grayscale(1)}",
      "#puentes .pm-leg-all{color:var(--muted,#888)}",
      "#puentes .pm-leg:focus-visible{outline:2px solid var(--accent,#48c);outline-offset:2px}",
      "#puentes .pm-hint{color:var(--muted,#888);font-size:12px;margin:0 0 6px}",
      /* lienzo del árbol, a casi todo el ancho de la pantalla */
      "#puentes .pm-scroll{overflow-x:auto;border:1px solid var(--line,#ccc);border-radius:14px;background:var(--surface,transparent);width:calc(100vw - 32px);max-width:1800px;position:relative;left:50%;transform:translateX(-50%)}",
      "#puentes .pm-svg{display:block}",
      /* bandas de nivel */
      "#puentes .pm-band{fill:var(--e,transparent);opacity:.06}",
      "#puentes .pm-band-base{fill:var(--muted,#888);opacity:.08}",
      "#puentes .pm-strip{fill:var(--e,var(--muted,#888));opacity:.85}",
      "#puentes .pm-strip-base{fill:var(--muted,#888);opacity:.5}",
      "#puentes .pm-nivlbl{fill:#fff;font-family:var(--sans,sans-serif);font-size:11px;font-weight:700;letter-spacing:.04em}",
      "#puentes .pm-nivlbl-base{fill:var(--muted,#888)}",
      "#puentes [data-b=\"ant\"]{--e:var(--pm-ant)} #puentes [data-b=\"med\"]{--e:var(--pm-med)} #puentes [data-b=\"mod\"]{--e:var(--pm-mod)} #puentes [data-b=\"con\"]{--e:var(--pm-con)}",
      /* cables (puentes) */
      "#puentes .pm-edge{fill:none;stroke-width:2.4;opacity:.22;stroke-linecap:round}",
      "#puentes .pm-svg.pm-focus .pm-edge{opacity:.05}",
      "#puentes .pm-svg.pm-focus .pm-edge.on{opacity:1;stroke-width:3.6}",
      /* nodos (cajas) */
      "#puentes .pm-node{cursor:pointer}",
      "#puentes .pm-node .pm-box{stroke-width:2;rx:9}",
      "#puentes .pm-node text{font-family:var(--sans,sans-serif);font-size:12px}",
      "#puentes .pm-fnode .pm-box{stroke-width:2.5}",
      "#puentes .pm-hnode .pm-box{fill:var(--surface,#fff);stroke:var(--line,#bbb)}",
      "#puentes .pm-hnode.pm-neu .pm-box{stroke-dasharray:4 3;opacity:.85}",
      "#puentes .pm-hnode.pm-falta .pm-box{stroke:var(--bad,#c0392b);stroke-dasharray:4 3}",
      "#puentes .pm-node text{fill:var(--ink,#222)}",
      "#puentes .pm-node:hover .pm-box,#puentes .pm-node:focus .pm-box{filter:brightness(1.05)}",
      "#puentes .pm-node:focus{outline:none}",
      "#puentes .pm-node:focus .pm-box{stroke:var(--accent,#48c);stroke-width:3}",
      "#puentes .pm-svg.pm-focus .pm-node:not(.on){opacity:.28}",
      "#puentes .pm-ubase{fill:var(--muted,#888);font-family:var(--sans,sans-serif);font-size:11px;font-weight:700;opacity:.7}",
      /* panel de explicación */
      "#puentes .pm-detalle{border:1px solid var(--line,#ccc);border-radius:12px;padding:12px 15px;margin:12px 0 0;min-height:70px;background:var(--surface,transparent)}",
      "#puentes .pm-detalle h4{margin:0 0 4px;font-size:1.02em}",
      "#puentes .pm-detalle .pm-tag{font-size:.72em;font-weight:700;letter-spacing:.04em;text-transform:uppercase;border-radius:999px;padding:2px 8px;margin-inline-start:8px;vertical-align:middle;background:var(--surface-2,#eee);color:var(--muted,#777)}",
      "#puentes .pm-detalle .pm-open{font-size:.85em;margin-inline-start:8px;cursor:pointer;color:var(--accent,#2a6)}",
      "#puentes .pm-detalle .pm-open:hover{text-decoration:underline}",
      "#puentes .pm-detalle ul{margin:6px 0 0;padding:0;list-style:none}",
      "#puentes .pm-detalle li{margin:7px 0;padding-inline-start:12px;border-inline-start:3px solid var(--line,#ccc)}",
      "#puentes .pm-detalle .pm-fchip{display:inline-block;font-weight:700;font-size:.9em;margin-inline-end:6px}",
      "#puentes .pm-detalle .pm-txt{color:var(--ink,#333)}",
      "#puentes .pm-detalle .pm-def{color:var(--muted,#888)}",
      /* temas de 1.º sin continuación */
      "#puentes .pm-resto{border:1px solid var(--line,#ccc);border-radius:12px;padding:12px 14px;margin:16px 0 0}",
      "#puentes .pm-resto h3{margin:0 0 6px}",
      "#puentes .pm-resto ul{margin:4px 0 0;padding-inline-start:18px}",
      "#puentes .pm-resto li{margin:4px 0}",
      "@media (prefers-color-scheme:dark){:root:not([data-theme=\"light\"]) #puentes{--pm-ant:#E3B23C;--pm-med:#C48ABF;--pm-mod:#5BC3EA;--pm-con:#6FCBA6}:root:not([data-theme=\"light\"]) #puentes .pm-nivlbl{fill:#111}}",
      ":root[data-theme=\"dark\"] #puentes{--pm-ant:#E3B23C;--pm-med:#C48ABF;--pm-mod:#5BC3EA;--pm-con:#6FCBA6}",
      ":root[data-theme=\"dark\"] #puentes .pm-nivlbl{fill:#111}"
    ].join("\n");
    document.head.appendChild(st);
  }

  var hidden = {};   // cimientos (temas de 1.º) ocultos
  var DATA = null;   // último buildData(), para el panel

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

  /* lista de cimientos (visibles) en que se apoya un tema de 2.º, en el orden de 1.º */
  function foundationsOf(d, h){
    return d.connected.filter(function(f){ return !hidden[f] && d.byHf[h][f]; });
  }

  function treeSvg(d){
    var cols = d.connected.filter(function(f){ return !hidden[f]; });   // cimientos activos (base)
    if (!cols.length) return '<p class="lead">No hay ningún cimiento activo: púlsalo en la leyenda para verlo.</p>';

    var BW = 158, BH = 48, GX = 18, slot = BW + GX, rowGap = 72, pitch = BH + rowGap;
    var padL = 24, padR = 30, padT = 26, padB = 22;

    // niveles presentes (de abajo arriba): base + épocas con temas
    var niveles = NIVELES.filter(function(n){
      if (n === "base") return true;
      return d.hf.some(function(h){ return (ERA[h] || "") === n; });
    });
    var itemsOf = function(n){
      if (n === "base") return cols.slice();
      return d.hf.filter(function(h){ return (ERA[h] || "") === n; });
    };
    var maxCount = 0;
    niveles.forEach(function(n){ maxCount = Math.max(maxCount, itemsOf(n).length); });

    var W = padL + padR + maxCount * slot;
    var H = padT + niveles.length * pitch - rowGap + padB;
    var nivIdx = {}; niveles.forEach(function(n, i){ nivIdx[n] = i; });  // 0 = base (abajo)
    var cyOf = function(i){ return H - padB - BH / 2 - i * pitch; };

    // posiciones de la base (cimientos): fijan el carril x de cada cable
    var laneX = {};
    (function(){
      var items = cols, tierW = items.length * slot, x0 = (W - tierW) / 2;
      items.forEach(function(f, j){ laneX[f] = x0 + j * slot + slot / 2; });
    })();

    // colocación de cada tema de 2.º en su nivel: ordenado por la x media de sus cimientos (menos cruces)
    var posOf = {};   // key -> {x,y,niv}
    niveles.forEach(function(n){
      if (n === "base"){
        cols.forEach(function(f){ posOf[f] = { x: laneX[f], y: cyOf(0), niv: n }; });
        return;
      }
      var items = itemsOf(n).slice();
      items.sort(function(a, b){
        var fa = foundationsOf(d, a), fb = foundationsOf(d, b);
        var ka = fa.length ? fa.reduce(function(s, f){ return s + laneX[f]; }, 0) / fa.length : W + d.hf.indexOf(a);
        var kb = fb.length ? fb.reduce(function(s, f){ return s + laneX[f]; }, 0) / fb.length : W + d.hf.indexOf(b);
        if (ka !== kb) return ka - kb;
        return d.hf.indexOf(a) - d.hf.indexOf(b);
      });
      var tierW = items.length * slot, x0 = (W - tierW) / 2, y = cyOf(nivIdx[n]);
      items.forEach(function(h, j){ posOf[h] = { x: x0 + j * slot + slot / 2, y: y, niv: n }; });
    });

    var s = '<svg class="pm-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Árbol de progresión: los cimientos de 1.º abajo y lo que se profundiza en 2.º hacia arriba">';

    // bandas de nivel + etiqueta lateral
    niveles.forEach(function(n, i){
      var cy = cyOf(i), band = BH + 46, yb = cy - band / 2, b = ERA_B[n] || "";
      if (n === "base"){
        s += '<rect class="pm-band-base" x="26" y="' + yb + '" width="' + (W - 30) + '" height="' + band + '"/>';
        s += '<rect class="pm-strip-base" x="4" y="' + yb + '" width="16" height="' + band + '" rx="5"/>';
        s += '<text class="pm-nivlbl pm-nivlbl-base" transform="translate(16,' + cy + ') rotate(-90)" text-anchor="middle">' + esc(NIVEL_LAB[n]) + '</text>';
      } else {
        s += '<rect class="pm-band" data-b="' + esc(b) + '" x="26" y="' + yb + '" width="' + (W - 30) + '" height="' + band + '"/>';
        s += '<rect class="pm-strip" data-b="' + esc(b) + '" x="4" y="' + yb + '" width="16" height="' + band + '" rx="5"/>';
        s += '<text class="pm-nivlbl" data-b="' + esc(b) + '" transform="translate(16,' + cy + ') rotate(-90)" text-anchor="middle">' + esc(NIVEL_LAB[n]) + '</text>';
      }
    });

    // cables: de cada cimiento (arriba de su caja) al tema de 2.º que desbloquea (abajo de su caja)
    d.hf.forEach(function(h){
      var ph = posOf[h]; if (!ph) return;
      foundationsOf(d, h).forEach(function(f){
        var pf = posOf[f]; if (!pf) return;
        var x1 = pf.x, y1 = pf.y - BH / 2, x2 = ph.x, y2 = ph.y + BH / 2, dy = (y1 - y2) * 0.42;
        s += '<path class="pm-edge" data-f="' + esc(f) + '" data-h="' + esc(h) + '" stroke="' + (FIL_COL[f] || "#888") + '" d="M' + x1 + ',' + y1 + ' C' + x1 + ',' + (y1 - dy) + ' ' + x2 + ',' + (y2 + dy) + ' ' + x2 + ',' + y2 + '"/>';
      });
    });

    // nodos de 2.º (cajas), con franja de cimientos en que se apoyan
    function box(key, cx, cy, lines, cls, extra, fill, stroke, strip){
      var x = cx - BW / 2, y = cy - BH / 2;
      var g = '<g class="pm-node ' + cls + '" data-key="' + esc(key) + '" ' + extra + ' tabindex="0" role="link" aria-label="' + esc(titulo(key)) + '">';
      g += '<rect class="pm-box" x="' + x + '" y="' + y + '" width="' + BW + '" height="' + BH + '" rx="9"' + (fill ? ' fill="' + fill + '"' : '') + (stroke ? ' stroke="' + stroke + '"' : '') + '/>';
      if (strip && strip.length){
        var sw = BW / strip.length;
        strip.forEach(function(col, k){
          g += '<rect x="' + (x + k * sw) + '" y="' + (y + BH - 5) + '" width="' + sw + '" height="5" fill="' + col + '"/>';
        });
      }
      var ly = cy - (lines.length - 1) * 7 + 4;
      g += '<text text-anchor="middle" x="' + cx + '" y="' + ly + '">';
      lines.forEach(function(ln, k){ g += '<tspan x="' + cx + '" dy="' + (k ? 14 : 0) + '">' + esc(ln) + '</tspan>'; });
      g += '</text></g>';
      return g;
    }

    d.hf.forEach(function(h){
      var ph = posOf[h]; if (!ph) return;
      var fs = foundationsOf(d, h);
      var cls = fs.length ? "pm-hnode" : (HF_SIN_EQUIV[h] ? "pm-hnode pm-neu" : "pm-hnode pm-falta");
      var strip = fs.map(function(f){ return FIL_COL[f] || "#888"; });
      s += box(h, ph.x, ph.y, wrap(hfShort(h), 22, 2), cls, 'data-h="' + esc(h) + '"', null, null, strip);
    });

    // nodos de 1.º (cimientos) en la base
    cols.forEach(function(f){
      var pf = posOf[f], col = FIL_COL[f] || "#888";
      s += box(f, pf.x, pf.y, wrap(filShort(f), 20, 2), "pm-fnode", 'data-f="' + esc(f) + '"', col + "22", col, null);
      s += '<text class="pm-ubase" text-anchor="middle" x="' + pf.x + '" y="' + (pf.y + BH / 2 + 14) + '">' + esc(etiqueta(f)) + '</text>';
    });

    return s + '</svg>';
  }

  function panelDefault(){
    return '<div class="pm-detalle" id="pm-detalle"><h4>Pasa el ratón por un tema o un cimiento</h4>' +
      '<p class="pm-def" style="margin:4px 0 0">Abajo, los <strong>cimientos de 1.º</strong>; arriba, lo que en 2.º se <strong>profundiza</strong> gracias a ellos, por épocas. ' +
      'Al pasar por encima verás aquí la explicación de cada puente. Pulsa un nodo para abrir el tema.</p></div>';
  }
  function panelFil(d, f){
    var desbloquea = d.hf.filter(function(h){ return d.byHf[h][f]; });
    var li = desbloquea.map(function(h){ return '<li><span class="pm-fchip">' + esc(hfShort(h)) + '</span></li>'; }).join("");
    return '<h4><span class="pm-fchip" style="color:' + (FIL_COL[f] || "#888") + '">' + esc(titulo(f)) + '</span>' +
      '<span class="pm-tag">cimiento · 1.º</span>' +
      '<span class="pm-open" data-key="' + esc(f) + '" role="button" tabindex="0">abrir el tema ↗</span></h4>' +
      '<p class="pm-def" style="margin:4px 0 0">Desde este cimiento se profundiza en 2.º en:</p>' +
      (li ? '<ul>' + li + '</ul>' : '<p class="pm-def">—</p>');
  }
  function panelHf(d, h){
    var fs = d.connected.filter(function(f){ return d.byHf[h][f]; });   // todos (aunque estén ocultos)
    var head = '<h4>' + esc(etiqueta(h)) + ' · ' + esc(titulo(h)) +
      '<span class="pm-open" data-key="' + esc(h) + '" role="button" tabindex="0">abrir el tema ↗</span></h4>';
    if (!fs.length){
      var nota = HF_SIN_EQUIV[h] ? "Tema que entra nuevo en 2.º: no tiene homólogo en 1.º." : "Aún sin puente a ningún cimiento de 1.º (candidato a hueco por rellenar).";
      return head + '<p class="pm-def" style="margin:4px 0 0">' + esc(nota) + '</p>';
    }
    var li = fs.map(function(f){
      var p = d.byHf[h][f], tx = p && (p.txtFwd || p.txtBack);
      return '<li><span class="pm-fchip" style="color:' + (FIL_COL[f] || "#888") + '">' + esc(filShort(f)) + '</span>' +
        '<span class="pm-txt">' + (tx ? esc(tx) : '<span class="pm-def">(sin texto)</span>') + '</span></li>';
    }).join("");
    return head + '<p class="pm-def" style="margin:4px 0 0">Se apoya en estos cimientos de 1.º:</p><ul>' + li + '</ul>';
  }
  function setPanel(html){ var el = document.getElementById("pm-detalle"); if (el) el.innerHTML = html; }

  function render(){
    var cont = document.getElementById("puentesbody");
    if (!cont) return;
    var d = buildData(); DATA = d;
    if (!d){ cont.innerHTML = '<p>No se han podido leer los datos (THEORY / Itinerario.PUENTES). ¿Falta algún build?</p>'; return; }

    var resumen = '<div class="pm-resumen">' +
      '<span class="pm-chip"><b>' + d.connected.length + '</b> cimientos (1.º)</span>' +
      '<span class="pm-chip"><b>' + d.hf.length + '</b> temas de 2.º en el árbol</span>' +
      '<span class="pm-chip"><b>' + d.totalVinculos + '</b> puentes (cables)</span>' +
      '<span class="pm-chip">2.º apoyados en 1.º: <b>' + d.estacionesOk + '</b>/' + d.hf.length + '</span>' +
      '<span class="pm-chip" style="color:var(--bad,#c0392b)">Huecos por rellenar: <b>' + d.estacionesFalta.length + '</b></span>' +
      '<span class="pm-chip">Cimientos sin continuación: <b>' + d.filSinLugar.length + '</b></span>' +
      '</div>';
    var leyenda = '<p class="pm-leyenda"><strong>Árbol de progresión.</strong> Abajo, <strong>los cimientos</strong> (los temas de 1.º, lo que ya se ha aprendido). Hacia arriba, todo lo que en 2.º se <strong>desbloquea y se profundiza</strong> gracias a ellos, ordenado por épocas (Antigua abajo → Contemporánea arriba). De cada cimiento sube un <strong>cable de su color</strong> hasta cada tema de 2.º que permite; la <strong>franja de colores</strong> bajo cada caja de 2.º dice sobre qué cimientos se sostiene. En gris discontinuo, los temas de 2.º <strong>sin homólogo</strong> en 1.º; en rojo, los que aún no tienen puente. Pasa el ratón para leer la explicación de cada puente abajo; pulsa un nodo para abrir el tema.</p>';

    var legend = '<div class="pm-legend" role="group" aria-label="Cimientos de 1.º"><span class="flabel">Cimientos (1.º)</span>' +
      d.connected.map(function(f){
        return '<button type="button" class="pm-leg" data-fil="' + esc(f) + '" aria-pressed="' + (!hidden[f]) + '" title="' + esc(titulo(f)) + '">' +
          '<i style="background:' + (FIL_COL[f] || "#888") + '"></i><span>' + esc(filShort(f)) + '</span></button>';
      }).join("") +
      '<button type="button" class="pm-leg pm-leg-all" data-fil="all">Guztiak</button>' +
      '<button type="button" class="pm-leg pm-leg-all" data-fil="none">Bat ere ez</button></div>';

    var hint = '<p class="pm-hint">↑ Hacia arriba se profundiza (más reciente); desliza en horizontal si no caben todos los temas.</p>';
    var stage = '<div class="pm-scroll">' + treeSvg(d) + '</div>';

    var resto = '';
    if (d.filSinLugar.length){
      resto = '<div class="pm-resto"><h3>Cimientos de 1.º sin continuación en 2.º</h3>' +
        '<p class="pm-leyenda" style="margin:0">Temas de 1.º que todavía no sostienen ningún tema de 2.º:</p><ul>' +
        d.filSinLugar.map(function(f){
          var marca = FIL_SIN_EQUIV[f] ? ' <span style="opacity:.65">(sin equivalente claro)</span>'
            : ' <span style="color:var(--bad,#c0392b)">(parece tener homólogo: candidato a puente)</span>';
          return '<li><span style="color:' + (FIL_COL[f] || "#888") + ';font-weight:700">' + esc(etiqueta(f)) + '</span> — ' + esc(titulo(f)) + marca + '</li>';
        }).join("") + '</ul></div>';
    }

    cont.innerHTML = resumen + leyenda + legend + hint + stage + panelDefault() + resto;
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
    if (e.key !== "Enter" && e.key !== " ") return;
    var nav = e.target.closest && e.target.closest("#puentes [data-key]");
    if (nav){ e.preventDefault(); var key = nav.dataset.key; if (key) location.hash = "#teoria/" + key; }
  });
  /* panel + resaltado al pasar el ratón o enfocar un nodo/cable */
  function focusOn(target){
    var svg = target && target.closest && target.closest("#puentes .pm-svg"); if (!svg || !DATA) return;
    var g = target.closest("[data-f],[data-h]"); if (!g) return;
    var f = g.dataset.f, h = g.dataset.h;
    svg.classList.add("pm-focus");
    svg.querySelectorAll(".pm-edge,.pm-node").forEach(function(x){
      var on;
      if (h) on = (x.dataset.h === h) || (x.classList.contains("pm-fnode") && DATA.byHf[h] && DATA.byHf[h][x.dataset.f]);
      else on = (x.dataset.f === f) || (x.dataset.h && DATA.byHf[x.dataset.h] && DATA.byHf[x.dataset.h][f]);
      x.classList.toggle("on", !!on);
    });
    if (h) setPanel(panelHf(DATA, h)); else if (f) setPanel(panelFil(DATA, f));
  }
  function focusOff(related){
    var svg = document.querySelector("#puentes .pm-svg");
    if (svg && !(related && related.closest && related.closest("#puentes .pm-svg"))) svg.classList.remove("pm-focus");
  }
  document.addEventListener("mouseover", function(e){ if (e.target.closest && e.target.closest("#puentes .pm-svg")) focusOn(e.target); });
  document.addEventListener("mouseout", function(e){ if (e.target.closest && e.target.closest("#puentes .pm-svg")) focusOff(e.relatedTarget); });
  document.addEventListener("focusin", function(e){ if (e.target.closest && e.target.closest("#puentes .pm-node")) focusOn(e.target); });

  render();
  var origShow = window.show;
  if (typeof origShow === "function"){
    window.show = function(id){ origShow.apply(this, arguments); if (id === "puentes") try { render(); } catch (e){} };
  }
})();
