import { mount, render, setIsLogging } from 'matul'
import { AppComp } from './comp/AppComp'

setIsLogging(false)
mount(document.getElementById('root')!, AppComp)
render()

window.addEventListener('load', async () => {
	try {
		await navigator.serviceWorker.register(
			new URL('../service-worker.ts', import.meta.url),
			{ type: 'module' },
		)
		console.log(`[rbzbv7] Service worker registered.`)
	} catch (e) {
		console.error(`[rbzbux]`, e)
	}
})
