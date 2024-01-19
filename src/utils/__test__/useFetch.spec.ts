import { useFetch } from '@/utils/useFetch'
import { describe, expect, it } from 'vitest'

describe('useFetch', async () => {
  it.skip('default request', async () => {
    useFetch('https://test.mock/useFetch/default').then(res => {
      const { data } = res
      expect(data.value).toEqual({
        msg: 'hey'
      })
    })
  })

  it('default request await', async () => {
    const { data } = await useFetch('https://test.mock/useFetch/default')
    expect(data.value).toEqual({
      msg: 'hey'
    })
  })
})
