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

  describe('handling of providers', function() {
    it('registers providers properly and clears them out when they die', function() {
      const provider = registry.create()
      expect(registry.providers.has(provider)).toBe(true)
      provider.dispose()
      expect(registry.providers.has(provider)).toBe(false)
    })
    it('emits update event properly', function() {
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
    it('adds and returns sorted titles', function() {
      const provider = registry.create()
      provider.add('Hey', 200)
      provider.add('Wow', 199)
      provider.add('Hello', 300)
      expect(registry.getActiveTitles()).toEqual(['Wow', 'Hey', 'Hello'])
    })
    it('adds removed ones to history', function() {
      const provider = registry.create()
      provider.add('Hey', 100)
      provider.add('Boy', 100)
      expect(registry.getActiveTitles()).toEqual(['Hey', 'Boy'])
      expect(registry.getOldTitles()).toEqual([])

      provider.remove('Hey')
      expect(registry.getActiveTitles()).toEqual(['Boy'])
      expect(registry.getOldTitles()).toEqual([{ title: 'Hey', duration: '0s' }])
    })
    it('adds cleared ones to history', function() {
      const provider = registry.create()
      provider.add('Hello')
      provider.add('World')

      expect(registry.getActiveTitles()).toEqual(['Hello', 'World'])
      expect(registry.getOldTitles()).toEqual([])

      provider.clear()
      expect(registry.getActiveTitles()).toEqual([])
      expect(registry.getOldTitles()).toEqual([{ title: 'Hello', duration: '0s' }, { title: 'World', duration: '0s' }])
    })
  })
  describe('getOldTitles', function() {
    it('excludes active ones from history', function() {
      const provider = registry.create()
      provider.add('Yo CJ')
      provider.add('Murica')
      provider.remove('Yo CJ')
      provider.remove('Murica')
      provider.add('Yo CJ')

      expect(registry.getOldTitles()).toEqual([{ title: 'Murica', duration: '0s' }])
    })
    it('excludes duplicates and only returns the last one', function() {
      const provider = registry.create()

      provider.add('Some')
      provider.add('Things')
      provider.remove('Some')
      provider.remove('Things')
      provider.add('Some')
      provider.remove('Some')

      expect(registry.getOldTitles()).toEqual([{ title: 'Things', duration: '0s' }, { title: 'Some', duration: '0s' }])
    })
    it('respects itemsToShowInHistory', function() {
      const provider = registry.create()
      for (let i = 0; i < 50; i++) {
        provider.add(i.toString())
      }
      provider.clear()

      atom.config.set('busy-signal.itemsToShowInHistory', 1)
      expect(registry.getOldTitles().length).toBe(1)
      atom.config.set('busy-signal.itemsToShowInHistory', 5)
      expect(registry.getOldTitles().length).toBe(5)
      atom.config.set('busy-signal.itemsToShowInHistory', 10)
      expect(registry.getOldTitles().length).toBe(10)
    })
  })
})
