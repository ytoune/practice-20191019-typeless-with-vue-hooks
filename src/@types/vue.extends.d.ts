import Vue from 'vue'

declare module 'vue/types/options' {
	export interface ComponentOptions<V extends Vue> {
		hooks?: () => object
	}
}
