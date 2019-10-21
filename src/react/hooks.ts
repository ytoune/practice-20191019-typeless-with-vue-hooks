/**
 * fork from
 * https://github.com/yyx990803/vue-hooks
 * https://github.com/TotooriaHyperion/vue-hooks
 * https://github.com/zephraph/vue-context-api
 */

let currentInstance: any = null
let isMounting = false
let callIndex = 0

function ensureCurrentInstance() {
	if (!currentInstance) {
		throw new Error(
			`invalid hooks call: hooks can only be called in a function passed to withHooks.`,
		)
	}
}

export function useState(initial: any) {
	ensureCurrentInstance()
	const id = ++callIndex
	const state = currentInstance.$data._state
	const updater = (newValue: any) => {
		state[id] = newValue
	}
	if (isMounting) {
		currentInstance.$set(state, id, initial)
	}
	return [state[id], updater]
}

export const useReducer = (reducer: any, initialState: any) => {
	const [s, update] = useState(initialState)
	const dispatch = (action: any) => {
		update(reducer(s, action))
	}
	return [s, dispatch]
}

export const useLayoutEffect = useEffect

function Provider(context: any, defaultValue: any) {
	return {
		name: 'Provider',
		props: {
			value: {
				default: () => defaultValue,
			},
		},
		created(this: any) {
			if (this.value !== undefined) {
				context.value = this.value
			}
		},
		watch: {
			value(v: any) {
				context.value = v
			},
		},
		render(this: any, h: any) {
			return this.$slots.default[0]
		},
	}
}

const getcontext = '#context'

export const createContext = (defaultValue: any) => {
	const context = {}
	return {
		[getcontext]: context,
		Provider: Provider(context, defaultValue),
		// Consumer: Consumer(context)
		Consumer: null,
	}
}

export function useContext(context: any) {
	// ensureCurrentInstance()
	return context[getcontext].value
	// const map =
	// 	currentInstance[getcontext] || (currentInstance[getcontext] = new WeakMap())
	// return currentInstance[contextName]
}

export function useMemo(factory: () => any, deps: any[]) {
	ensureCurrentInstance()
	const id = ++callIndex
	if (!currentInstance._memoizeStore[id]) {
		currentInstance._memoizeStore[id] = {
			deps: [],
			result: factory(),
		}
	} else {
		const record = currentInstance._memoizeStore[id]
		const { deps: prevDeps } = record
		record.deps = deps
		if (!deps || deps.some((d, i) => d !== prevDeps[i])) {
			record.result = factory()
		}
	}
	return currentInstance._memoizeStore[id].result
}

export function useCallback(cb: Function, deps: any[]) {
	return useMemo(() => cb, deps)
}

export function useEffect(rawEffect: () => any, deps: any[]) {
	ensureCurrentInstance()
	const id = ++callIndex
	if (isMounting) {
		const cleanup: { (): void; current?: any } = () => {
			const { current } = cleanup
			if (current) {
				current()
				cleanup.current = null
			}
		}
		const effect: {
			(this: { effect: () => void; cleanup: () => void; deps: any }): void
			current?: any
		} = function() {
			const { current } = effect
			if (current) {
				cleanup.current = current.call(this)
				effect.current = null
			}
		}
		effect.current = rawEffect

		currentInstance._effectStore[id] = {
			effect,
			cleanup,
			deps,
		}

		currentInstance.$on('hook:mounted', effect)
		currentInstance.$on('hook:destroyed', cleanup)
		if (!deps || deps.length > 0) {
			currentInstance.$on('hook:updated', effect)
		}
	} else {
		const record = currentInstance._effectStore[id]
		const { effect, cleanup, deps: prevDeps = [] } = record
		record.deps = deps
		if (!deps || deps.some((d: any, i: string | number) => d !== prevDeps[i])) {
			cleanup()
			effect.current = rawEffect
		}
	}
}

export function useRef(initial: boolean) {
	ensureCurrentInstance()
	const id = ++callIndex
	const { _refsStore: refs } = currentInstance
	return isMounting ? (refs[id] = { current: initial }) : refs[id]
}

export function useData(initial: any) {
	const id = ++callIndex
	const state = currentInstance.$data._state
	if (isMounting) {
		currentInstance.$set(state, id, initial)
	}
	return state[id]
}

export function useMounted(fn: any) {
	useEffect(fn, [])
}

export function useDestroyed(fn: any) {
	useEffect(() => fn, [])
}

export function useUpdated(fn: () => any, deps: any) {
	const isMount = useRef(true)
	useEffect(() => {
		if (isMount.current) {
			isMount.current = false
		} else {
			return fn()
		}
	}, deps)
}

export function useWatch(getter: any, cb: any, options: any) {
	ensureCurrentInstance()
	if (isMounting) {
		currentInstance.$watch(getter, cb, options)
	}
}

export function useComputed(getter: () => any) {
	ensureCurrentInstance()
	const id = ++callIndex
	const store = currentInstance._computedStore
	if (isMounting) {
		store[id] = getter()
		currentInstance.$watch(
			getter,
			(val: any) => {
				store[id] = val
			},
			{ sync: true },
		)
	}
	return store[id]
}

export function withHooks(render: (arg0: any, arg1: any, arg2: any) => any) {
	return {
		data() {
			return {
				_state: {},
			}
		},
		created(this: any) {
			this._effectStore = {}
			this._refsStore = {}
			this._computedStore = {}
			this._memoizeStore = {}
		},
		render(this: any, h: any) {
			callIndex = 0
			currentInstance = this
			isMounting = !this._vnode
			const ret = render(h, this.$attrs, this.$props)
			currentInstance = null
			return ret
		},
	}
}

export function hooks(Vue: {
	mixin: (arg0: {
		beforeCreate(this: any): void
		beforeMount(this: any): void
	}) => void
}) {
	Vue.mixin({
		beforeCreate() {
			const { hooks, data } = this.$options
			if (hooks) {
				this._effectStore = {}
				this._refsStore = {}
				this._computedStore = {}
				this._memoizeStore = {}
				this.$options.data = function() {
					const ret = data ? data.call(this) : {}
					ret._state = {}
					return ret
				}
			}
		},
		beforeMount() {
			const { hooks, render } = this.$options
			if (hooks && render) {
				this._currentHooks = hooks
				if (!this._hooked) {
					this._hooked = true
					this.$options.render = function(h: any) {
						callIndex = 0
						currentInstance = this
						isMounting = !this._vnode
						const hookProps = this._currentHooks(this.$props, this)
						Object.assign(this._self, hookProps)
						const ret = render.call(this, h)
						currentInstance = null
						return ret
					}
				}
			}
		},
	})
}
