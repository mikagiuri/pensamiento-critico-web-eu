"use strict";
/* ===== Galería · retratos de museo (dominio público) ===== push a GALERIA
   Los retratos que antes salían en la tira «Retratos y obras» (retratosview.js, ya retirada) al final
   de la teoría pasan ahora a la Galería, en el grupo «Retrato · museo», sin duplicar lo ya existente.
   Bloque por época, como galeria_retratos2.js. */
const RETRATOS_BLOQUE = {
  "Sokrates": "A", "Platon": "A", "Aristoteles": "A", "Hipatia de Alejandría": "A", "Aspasia": "A", "Alcibíades": "A",
  "Alejandro Magno": "A", "Diógenes": "A", "Epikuro": "A", "Seneka": "A", "Marco Aurelio": "A",
  "La Escuela de Atenas": "A", "La muerte de Sócrates": "A", "La Academia de Platón": "A", "La alegoría de la caverna": "A", "El oráculo de Delfos": "A",
  "Agustin Hiponakoa": "B", "Tomas Akinokoa": "B", "Averroes": "B", "Descartes": "B", "Spinoza": "B", "John Locke": "B",
  "David Hume": "B", "Rousseau": "B", "Kant": "B", "Hegel": "B", "Karl Marx": "B", "Nietzsche": "B", "Schopenhauer": "B",
  "John Stuart Mill": "B", "Nicolás Copérnico": "B", "Galileo Galilei": "B", "Isaac Newton": "B", "Charles Darwin": "B",
  "Mary Wollstonecraft": "B", "Olympe de Gouges": "B", "Marie Curie": "B", "Rosalind Franklin": "B",
  "Simone de Beauvoir": "C", "Hannah Arendt": "C", "Ortega y Gasset": "C", "María Zambrano": "C", "Wittgenstein": "C",
  "Ernst Cassirer": "C", "Karl Popper": "C", "Thomas Kuhn": "C", "Albert Einstein": "C", "William James": "C", "John Dewey": "C"
};
try {
  if (typeof RETRATOS !== "undefined" && Array.isArray(RETRATOS) && typeof GALERIA !== "undefined" && Array.isArray(GALERIA)) {
    const ya = new Set(GALERIA.map(function (g) { return String(g.t || "").toLowerCase().trim(); }));
    const yaF = new Set(GALERIA.map(function (g) { return g.f; }));
    RETRATOS.forEach(function (r) {
      const nom = r.name;
      if (!nom || ya.has(nom.toLowerCase().trim())) return;   // duplicado: ya está en la Galería
      if (yaF.has(r.file)) return;   // (25-10) y por la ruta: en fr y ar el título traducido no coincide y el retrato salía dos veces
      GALERIA.push({
        f: r.file,
        t: nom,
        pie: [r.title, (r.artist && r.artist !== "Desconocido" && r.artist !== "Unknown author") ? r.artist : "", r.license, "Wikimedia Commons"].filter(Boolean).join(" · "),
        bloque: RETRATOS_BLOQUE[nom] || "B",
        unidad: "Retrato · museo (dominio público)",
        ia: false
      });
    });
  }
} catch (e) {}
