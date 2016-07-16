/* @flow */

import Provider from '../lib/provider'

describe('Provider', function() {
  let provider

  beforeEach(function() {
    provider = new Provider()
  })
  afterEach(function() {
    provider.dispose()
  })

  it('has a working way of setting, removing and emptying titles', function() {
    expect(provider.texts.size).toBe(0)
    provider.add('Hey')
    expect(provider.texts.size).toBe(1)
    const _ = Array.from(provider.texts)[0]
    expect(_.title).toBe('Hey')

    provider.remove('Hey')
    expect(provider.texts.size).toBe(0)
    provider.add('Wow')
    expect(provider.texts.size).toBe(1)
    provider.clear()
    expect(provider.texts.size).toBe(0)
  })

  it('emits events properly', function() {
    const change = jasmine.createSpy('change')
    const dispose = jasmine.createSpy('dispose')

    provider.onDidChange(change)
    provider.onDidDestroy(dispose)

    provider.add('Hey')
    provider.remove('Hey')
    provider.clear()
    provider.add('Hey')
    provider.clear()

    provider.dispose()

    expect(change).toHaveBeenCalled()
    expect(dispose).toHaveBeenCalled()
    expect(change.calls.length).toBe(4)
    expect(dispose.calls.length).toBe(1)
  })
})
