import { manifest, version } from '@parcel/service-worker'

const SW_SELF = self as any as ServiceWorkerGlobalScope
const cacheName = `tools-${version}`

SW_SELF.addEventListener('install', (event) => {
	console.log(`[rc6ig4] [INSTALL] ${version}`, manifest)
	event.waitUntil(
		(async () => {
			const cache = await caches.open(cacheName)
			await cache.addAll(manifest)
		})(),
	)
})
SW_SELF.addEventListener('activate', (event) => {
	console.log(`[rc6if6] [ACTIVATE] ${version}`)
	event.waitUntil(
		(async () => {
			const keys = await caches.keys()
			await Promise.all(
				keys.map((key) => key !== cacheName && caches.delete(key)),
			)
		})(),
	)
})
SW_SELF.addEventListener('fetch', (event) => {
	event.respondWith(
		(async () => {
			const requestPath = event.request.url.replace(
				SW_SELF.registration.scope,
				'',
			)

			const responseFromCache =
				requestPath === ''
					? await caches.match('index.html')
					: await caches.match(event.request)
			if (responseFromCache) {
				console.log(`[rc1cz1] [CACHE] ${version} ${event.request.url}`)
				return responseFromCache
			} else {
				console.log(`[rc1d3c] [FETCH] ${version} ${event.request.url}`)
				return fetch(event.request)
			}
		})(),
	)
})

console.log(`[rc6ie5] Service Worker initialized.`)
