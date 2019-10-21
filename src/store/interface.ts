import { createModule } from 'typeless'
import { CounterSymbol } from './symbol'

export interface CounterState {
	isLoading: boolean
	count: number
}

export const [useModule, CounterActions, getCounterState] = createModule(
	CounterSymbol,
)
	.withActions({
		startCount: null,
		resetCount: null,
		countDone: (count: number) => ({ payload: { count } }),
	})
	.withState<CounterState>()
