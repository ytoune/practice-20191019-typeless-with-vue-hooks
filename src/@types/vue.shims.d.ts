declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}
declare module 'vue-hooks' {
	import Vue from 'vue'
	export default any
	export const hooks: any
	export const withHooks: (
		fn: (h: Vue.CreateElement) => Vue.VNode,
	) => Vue.VueConstructor<Vue>
	export const useMemo: <T>(f: () => T, p: any[]) => T
}
declare module 'vue-context-api' {
	export default any
}
