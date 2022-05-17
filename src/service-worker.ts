import { manifest, version } from '@parcel/service-worker'

self.addEventListener('install', (event) => {
	;(event as ExtendableEvent).waitUntil(async () => {
		const cache = await caches.open(version)
		await cache.addAll(manifest)
	})
})
self.addEventListener('activate', (event) => {
	;(event as ExtendableEvent).waitUntil(async () => {
		const keys = await caches.keys()
		await Promise.all(keys.map((key) => key !== version && caches.delete(key)))
	})
})
self.addEventListener('fetch', (event) => {
	const e = event as FetchEvent
	e.respondWith(
		(async () => {
			const responseFromCache = await caches.match(e.request)
			if (responseFromCache) {
				console.log(`[rc1cz1] [CACHE] ${e.request.url}`)
				return responseFromCache
			} else {
				console.log(`[rc1d3c] [FETCH] ${e.request.url}`)
				return fetch(e.request)
			}
		})(),
	)
})
