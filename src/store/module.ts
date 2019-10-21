import { of, delay, takeUntil, waitForType } from 'typeless/rx'

import { useModule, CounterActions as acts } from './interface'

const key = 'my:count'

useModule
	.epic()
	.on(acts.startCount, (_, { action$ }) =>
		of(acts.countDone(1)).pipe(
			delay(500),
			takeUntil(action$.pipe(waitForType(acts.resetCount))),
		),
	)

useModule
	.reducer({
		isLoading: false,
		count: Number(localStorage.getItem(key)),
	})
	.on(acts.startCount, state => {
		state.isLoading = true
	})
	.on(acts.resetCount, state => {
		state.isLoading = false
		state.count = 0
		localStorage.setItem(key, state.count + '')
	})
	.on(acts.countDone, (state, { count }) => {
		state.isLoading = false
		state.count += count
		localStorage.setItem(key, state.count + '')
	})
