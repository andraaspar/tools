(()=>{let e=[],a="";e=["index.html","manifest.webmanifest","icon.5f0bb6aa.svg","index.ccb6d87f.css","index.875da919.js"],a="abe3a743",self.addEventListener("install",(t=>{t.waitUntil((async()=>{const t=await caches.open(a);await t.addAll(e)}))})),self.addEventListener("activate",(e=>{e.waitUntil((async()=>{const e=await caches.keys();await Promise.all(e.map((e=>e!==a&&caches.delete(e))))}))})),self.addEventListener("fetch",(e=>{e.respondWith((async()=>{const a=await caches.match(e.request);return a||fetch(e.request)})())}))})();