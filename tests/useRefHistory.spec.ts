import { describe, it, expect } from 'vitest'
import { useRefHistory } from '../src/composables/useRefHistory'
import { nextTick, shallowRef } from 'vue'

enum Theme {
    Light = 'light',
    Dark = 'dark',
}

describe('useRefHistory', () => {
    it('stores the history of the source value', async () => {
        const theme = shallowRef<string>(Theme.Light)
        const { history } = useRefHistory(theme)

        theme.value = Theme.Dark
        await nextTick()

        expect(history.value).toEqual([
            { value: Theme.Light, timestamp: expect.any(Number) },
        ])
    })

    it('does NOT include the current value in history', async () => {
        const theme = shallowRef<string>(Theme.Light)
        const { history } = useRefHistory(theme)

        theme.value = Theme.Dark
        await nextTick()

        theme.value = Theme.Dark
        await nextTick()

        expect(history.value).toEqual([
            { value: Theme.Light, timestamp: expect.any(Number) },
        ])
    })

    it('stores the history ordered from newest to oldest', async () => {
        const theme = shallowRef<string>(Theme.Light)
        const { history } = useRefHistory(theme)

        theme.value = Theme.Dark
        await nextTick()

        theme.value = Theme.Light
        await nextTick()

        expect(history.value[0].timestamp).toBeGreaterThanOrEqual(
            history.value[1].timestamp,
        )
    })

    it('removes the oldest record(s) when the history reaches the capacity', async () => {
        const theme = shallowRef<string>(Theme.Light)
        const { history } = useRefHistory(theme, 1)

        theme.value = Theme.Dark
        await nextTick()

        expect(history.value.length).toBe(1)
    })

    it('allows capacity as a getter (callback function) and dynamically update history when capacity changes', async () => {
        const theme = shallowRef<string>(Theme.Light)
        const capacity = shallowRef<number>(2)
        const { history } = useRefHistory(theme, () => capacity.value)

        theme.value = Theme.Dark
        await nextTick()

        capacity.value = 1
        await nextTick()

        expect(history.value.length).toBe(1)
    })

    it('allows capacity as a ref and dynamically update history when capacity changes', async () => {
        const theme = shallowRef<string>(Theme.Light)
        const capacity = shallowRef<number>(2)
        const { history } = useRefHistory(theme, capacity)

        theme.value = Theme.Dark
        await nextTick()

        capacity.value = 1
        await nextTick()

        expect(history.value.length).toBe(1)
    })

    it('sets the data source back to the previous value on undo', async () => {
        const initialValue = Theme.Light
        const theme = shallowRef<string>(initialValue)
        const { history, undo } = useRefHistory(theme)

        theme.value = Theme.Dark
        await nextTick()

        undo()
        await nextTick()

        expect(history.value.length).toBe(0)
    })

    it('sets the data source to one record forward in history on redo', async () => {
        const initialValue = Theme.Light
        const theme = shallowRef<string>(initialValue)
        const { history, undo, redo } = useRefHistory(theme)

        theme.value = Theme.Dark
        await nextTick()

        undo()
        await nextTick()

        expect(history.value.length).toBe(0)

        redo()
        await nextTick()

        expect(history.value.length).toBe(1)
        expect(history.value[0].value).equals(Theme.Light)
    })
})
