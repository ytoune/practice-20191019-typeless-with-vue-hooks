<template>
	<div>
		<p>hello, world!</p>
		<CountUp></CountUp>
		<CountUp></CountUp>
		<CountReset></CountReset>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { CountUp, CountReset } from '~/comps'

@Component({ components: { CountUp, CountReset } })
export default class App extends Vue {}
</script>
