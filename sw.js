/* Fonctionnement hors connexion : l'appli s'ouvre même sans réseau au champ.
   Changez VERSION à chaque mise en ligne pour que les téléphones prennent la nouvelle version. */
const VERSION = 'smartgarden-v7';
const COQUILLE = ['./', 'index.html', 'css/styles.css', 'js/config.js', 'js/app.js', 'js/cloud.js', 'manifest.webmanifest', 'img/favicon.svg', 'img/icon-192.png', 'img/icon-512.png', 'confidentialite.html'];

self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(COQUILLE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Supabase, polices : réseau direct
  if (url.pathname.includes('/data/')) {
    // Données : réseau d'abord (les plus récentes), copie locale si pas de réseau
    e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copie)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  // Appli : copie locale d'abord, mise à jour en arrière-plan
  e.respondWith(caches.match(e.request).then(local => {
    const reseau = fetch(e.request).then(r => { if (r.ok) { const copie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copie)); } return r; }).catch(() => local);
    return local || reseau;
  }));
});
