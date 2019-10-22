import './prepare'

import Vue from 'vue'
import App from './App.vue'

import { TypelessContext, defaultRegistry } from 'typeless'

const main = () => {
	const el = document.querySelector('main')
	if (!el) return
	// TypelessContext['#context'].value = { registry: defaultRegistry }
	const value = { registry: defaultRegistry }
	new Vue({
		el,
		render(h) {
			return h(TypelessContext.Provider, { props: { value } }, [h(App)])
		},
	})
}

try {
	main()
} catch (x) {
	console.log('# something happens.')
	console.error(x)
}
