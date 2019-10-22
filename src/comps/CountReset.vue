<template>
	<div>
		<p><button @click="countReset">reset</button></p>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { useActions } from 'typeless'
import { useModule, CounterActions, getCounterState } from '~/store'

@Component({
	hooks() {
		useModule()
		const acts = useActions(CounterActions)
		const state = getCounterState.useState()
		const count = state.count || 0
		const countReset = acts.resetCount
		return { count, countReset }
	},
})
export default class CountReset extends Vue {
	count!: number
	countReset!: Function
}
</script>
