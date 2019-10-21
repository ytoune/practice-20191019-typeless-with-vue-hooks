<template>
	<div>
		<p>count: {{ count }}</p>
		<p><button @click="countUp">+1</button></p>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { useActions } from 'typeless'
import { useModule, CounterActions, getCounterState } from '~/store'

@Component({
	//@ts-ignore
	hooks() {
		useModule()
		const acts = useActions(CounterActions)
		const state = getCounterState.useState()
		const count = state.count || 0
		const countUp = acts.startCount
		const countReset = acts.resetCount
		return { count, countUp, countReset }
	},
})
export default class CountUp extends Vue {
	count!: number
	countUp!: Function
}
</script>
