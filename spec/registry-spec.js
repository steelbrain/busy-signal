/* @flow */

import Registry from '../lib/registry'

describe('Registry', function() {
  let registry

  beforeEach(function() {
    registry = new Registry()
  })
  afterEach(function() {
    registry.dispose()
  })

  it('registers providers properly and clears them out when they die', function() {
    const provider = registry.create()
    expect(registry.providers.has(provider)).toBe(true)
    provider.dispose()
    expect(registry.providers.has(provider)).toBe(false)
  })
  it('emits events properly', function() {
    const provider = registry.create()
    const update = jasmine.createSpy('update')
    registry.onDidUpdate(update)
    expect(update).not.toHaveBeenCalled()
    provider.add('Hey')
    provider.remove('Hey')
    provider.clear()
    expect(update).toHaveBeenCalled()
    expect(update.calls.length).toBe(2)
  })
  it('sorts and all when we try to get titles', function() {
    const provider = registry.create()
    provider.add('Hey', 200)
    provider.add('Wow', 199)
    provider.add('Hello', 300)
    expect(registry.getTitles()).toEqual(['Wow', 'Hey', 'Hello'])
  })
  describe('getHistory', function() {
    // NOTE: Sorry, had to make one spec instead of multiple because every other step depends on result of previous
    it('gives past history, doesnt give out items that are shown, doesnt give out duplicate history items, shows latest items at the end', function() {
      const provider = registry.create()
      provider.add('Yo CJ')
      expect(registry.getHistory()).toEqual([])
      provider.clear()
      expect(registry.getHistory()).toEqual(['Yo CJ'])
      provider.add('Yo CJ')
      expect(registry.getHistory()).toEqual([])
      provider.clear()
      expect(registry.getHistory()).toEqual(['Yo CJ'])
      provider.add('Some')
      expect(registry.getHistory()).toEqual(['Yo CJ'])
      provider.clear()
      expect(registry.getHistory()).toEqual(['Yo CJ', 'Some'])
      provider.add('Yo CJ')
      expect(registry.getHistory()).toEqual(['Some'])
      provider.clear()
      expect(registry.getHistory()).toEqual(['Some', 'Yo CJ'])
    })
  })
})
