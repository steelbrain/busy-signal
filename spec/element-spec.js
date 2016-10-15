/* @flow */

import Element from '../lib/element'

describe('Element', function() {
  let element

  beforeEach(function() {
    element = new Element()
    spyOn(element, 'setTooltip').andCallThrough()
    spyOn(element, 'setBusy').andCallThrough()
  })
  afterEach(function() {
    element.dispose()
  })

  it('sets a title properly', function() {
    element.update(['Hello'], [])
    expect(element.setBusy).toHaveBeenCalledWith(true)
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>Current:</strong><br>Hello')
  })
  it('escapes the given texts', function() {
    element.update(['<div>'], [])
    expect(element.setBusy).toHaveBeenCalledWith(true)
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>Current:</strong><br>&lt;div&gt;')
  })
  it('shows idle message when nothing is provided', function() {
    element.update([], [])
    expect(element.setBusy).toHaveBeenCalledWith(false)
    expect(element.setTooltip).toHaveBeenCalledWith('Idle')
  })
  it('shows only history when current is not present', function() {
    element.update([], [{ title: 'Yo', duration: '1m' }])
    expect(element.setBusy).toHaveBeenCalledWith(false)
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>History:</strong><br>Yo ( duration: 1m )')
  })
  it('shows both history and current when both are present', function() {
    element.update(['Hey'], [{ title: 'Yo', duration: '1m' }])
    expect(element.setBusy).toHaveBeenCalledWith(true)
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>History:</strong><br>Yo ( duration: 1m )<br><strong>Current:</strong><br>Hey')
  })
})
