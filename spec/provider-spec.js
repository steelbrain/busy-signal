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

  it('emits add event properly', function() {
    let timesTriggered = 0

    provider.onDidAdd(function({ title, priority }) {
      if (timesTriggered === 0) {
        expect(title).toBe('First')
        expect(priority).toBe(10)
      } else if (timesTriggered === 1) {
        expect(title).toBe('Second')
        expect(priority).toBe(20)
      } else if (timesTriggered === 2) {
        expect(title).toBe('Third')
        expect(priority).toBe(30)
      } else {
        expect(false).toBe(true)
      }
      timesTriggered++
    })
    expect(timesTriggered).toBe(0)
    provider.add('First', 10)
    expect(timesTriggered).toBe(1)
    provider.add('Second', 20)
    expect(timesTriggered).toBe(2)
    provider.add('Third', 30)
    expect(timesTriggered).toBe(3)
  })
  it('emits remove event properly', function() {
    let timesTriggered = 0

    provider.onDidRemove(function(title) {
      if (timesTriggered === 0) {
        expect(title).toBe('First')
      } else if (timesTriggered === 1) {
        expect(title).toBe('Second')
      } else if (timesTriggered === 2) {
        expect(title).toBe('Third')
      } else {
        expect(false).toBe(true)
      }
      timesTriggered++
    })

    expect(timesTriggered).toBe(0)
    provider.remove('First')
    expect(timesTriggered).toBe(1)
    provider.remove('Second')
    expect(timesTriggered).toBe(2)
    provider.remove('Third')
    expect(timesTriggered).toBe(3)
  })
  it('emits clear event properly', function() {
    let timesTriggered = 0

    provider.onDidClear(function() {
      timesTriggered++
    })

    expect(timesTriggered).toBe(0)
    provider.clear()
    expect(timesTriggered).toBe(1)
    provider.clear()
    expect(timesTriggered).toBe(2)
    provider.clear()
    expect(timesTriggered).toBe(3)
    provider.clear()
    expect(timesTriggered).toBe(4)
  })
  it('emits destroy event properly', function() {
    let timesTriggered = 0

    provider.onDidDispose(function() {
      timesTriggered++
    })

    expect(timesTriggered).toBe(0)
    provider.dispose()
    expect(timesTriggered).toBe(1)
    provider.dispose()
    expect(timesTriggered).toBe(1)
    provider.dispose()
    expect(timesTriggered).toBe(1)
    provider.dispose()
    expect(timesTriggered).toBe(1)
  })
})
