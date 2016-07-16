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
    element.update(['Hello'])
    expect(element.setBusy).toHaveBeenCalledWith(true)
    expect(element.setTooltip).toHaveBeenCalledWith('Hello')
  })
  it('escapes the given texts', function() {
    element.update(['<div>'])
    expect(element.setBusy).toHaveBeenCalledWith(true)
    expect(element.setTooltip).toHaveBeenCalledWith('&lt;div&gt;')
  })
})
