import { describe, it, expect, beforeEach } from 'vitest'
import { useRefHistory } from '../src/composables/useRefHistory'
import { ref, nextTick } from 'vue'

describe('useRefHistory', () => {
    it.todo('stores the history of the source value', async () => {})

    it.todo('does NOT include the current value in history', async () => {})

    it.todo('stores the history ordered from newest to oldest', async () => {})

    it.todo(
        'removes the oldest record(s) when the history reaches the capacity',
        async () => {},
    )

    it.todo(
        'allows capacity as a getter (callback function) and dynamically update history when capacity changes',
        async () => {},
    )

    it.todo(
        'allows capacity as a ref and dynamically update history when capacity changes',
        async () => {},
    )

    it.todo(
        'sets the data source back to the previous value on undo',
        async () => {},
    )

    it.todo(
        'sets the data source to one record forward in history on redo',
        async () => {},
    )
})
