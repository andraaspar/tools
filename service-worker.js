(()=>{let e=[],a="";e=["index.html","manifest.webmanifest","icon.6dd73fb0.svg","index.6d11b6fc.css","index.64d3966f.js"],a="0fde78dc",self.addEventListener("install",(t=>{t.waitUntil((async()=>{const t=await caches.open(a);await t.addAll(e)}))})),self.addEventListener("activate",(e=>{e.waitUntil((async()=>{const e=await caches.keys();await Promise.all(e.map((e=>e!==a&&caches.delete(e))))}))})),self.addEventListener("fetch",(e=>{e.respondWith((async()=>{const a=await caches.match(e.request);return a||fetch(e.request)})())}))})();