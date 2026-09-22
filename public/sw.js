/* ============================================================
   SERVICE WORKER
   Un worker que el navegador ejecuta EN SEGUNDO PLANO, aparte de la
   página. Actúa como un proxy: puede interceptar todas las peticiones
   de la app y responderlas desde la caché. Eso es lo que permite que
   la app funcione sin internet.

   Ojo: aquí NO existe `window` ni `document`. Solo `self`.
   ============================================================ */

/* ============================================================
   SERVICE WORKER - OFFLINE READY
   ============================================================ */

   const VERSION = "v8";
   const SHELL_CACHE = `hype-sneakers-shell-${VERSION}`;
   const DATA_CACHE = `hype-sneakers-data-${VERSION}`;

// Lista limpia de assets (asegúrate de que todos estos archivos existan en tu proyecto)
const SHELL_ASSETS = [
    "/",
    "/index.html",
    "/catalog.html",
    "/offline.html",
    "/css/styles.css",
    "/js/main.js",
    "/js/catalog.js",
    "/js/pwa.js",
    "/js/services/api.js",
    "/js/ui/ui.js",
    "/manifest.webmanifest",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-512-maskable.png"
];

/* ---- 1. INSTALL: Guarda el App Shell ---- */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE).then(async (cache) => {
            // Usamos addAll individual o con manejo para ver si alguno falla
            for (const asset of SHELL_ASSETS) {
                try {
                    await cache.add(new Request(asset, { cache: "reload" }));
                } catch (err) {
                    console.warn(`⚠️ No se pudo cachear el asset: ${asset}`, err);
                }
            }
        }).then(() => self.skipWaiting())
    );
});

/* ---- 2. ACTIVATE: Limpia cachés viejas ---- */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== SHELL_CACHE && key !== DATA_CACHE)
                    .map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

/* ---- 3. FETCH: Intercepta peticiones ---- */
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    // API: Network First
    if (url.pathname.startsWith("/api/")) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Resto de la app: Cache First
    event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
    const cache = await caches.open(DATA_CACHE);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;

        return new Response(JSON.stringify({ error: "Sin conexión y sin datos en caché" }), {
            status: 503,
            headers: { "Content-Type": "application/json" }
        });
    }
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        // Solo guardamos si la respuesta es válida
        if (response && response.status === 200 && response.type === 'basic') {
            const cache = await caches.open(SHELL_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Si no hay red y es una página web, devolvemos el offline.html guardado en caché
        if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
            const offline = await caches.match("/offline.html");
            if (offline) return offline;
        }
        return Response.error();
    }
}