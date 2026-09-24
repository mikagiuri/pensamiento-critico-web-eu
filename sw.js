"use strict";
/* ===== Service Worker — Aula de Filosofía (PWA offline) =====
   Estrategia: precache mínimo del «app shell» + stale-while-revalidate en runtime,
   para que tras la primera visita toda la web (teoría, css, js, imágenes, fuentes y
   los CDN de mapas/esquemas ya visitados) funcione sin conexión.
   ⚠ Sube VERSION al desplegar cambios para invalidar la caché antigua. */
const VERSION = "v9-2026-09-24";
// Bachillerato y 2.º ESO se sirven en el MISMO origen (mikagiuri.github.io) bajo
// subrutas distintas. La caché debe ser única por sitio o una web desalojaría la
// de la otra: derivamos el prefijo del scope del propio service worker.
const SITE = (new URL(self.registration.scope).pathname).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root";
const PREFIX = "aula-" + SITE + "-";
const CACHE = PREFIX + VERSION;
const CORE = ["./", "./index.html", "./manifest.webmanifest",
  "./media/icons/icon-192.png", "./media/icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(
      ks.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Navegaciones (abrir/refrescar): red primero; si no hay conexión, el index cacheado.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }
  // Resto de recursos (css/js/img/fuentes/CDN): stale-while-revalidate.
  e.respondWith(
    caches.open(CACHE).then(cache => cache.match(req).then(hit => {
      const net = fetch(req).then(res => {
        // cachea respuestas propias (ok) y de terceros (opacas: fuentes, CDN)
        if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    }))
  );
});
