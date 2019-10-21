import Vue from 'vue'

export const unstable_batchedUpdates = (fn: () => void) => {
	fn()
	for (const tmp of list) tmp.$forceUpdate()
}
export const batchedUpdates = unstable_batchedUpdates

const list: any[] = []

Vue.use(function(Vue: any) {
	Vue.mixin({
		beforeCreate() {
			list.push(this)
		},
		beforeDestroy() {
			const i = list.indexOf(this)
			if (~i) {
				list.splice(i, 1)
			}
		},
	})
})
