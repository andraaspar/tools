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
	;(event as FetchEvent).respondWith(
		(async () => {
			const responseFromCache = await caches.match(
				(event as FetchEvent).request,
			)
			if (responseFromCache) {
				return responseFromCache
			}
			return fetch((event as FetchEvent).request)
		})(),
	)
})
