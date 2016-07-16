'use babel'

/* @flow */

import escape from 'escape-html'
import type { Disposable } from 'atom'

const ICON = '\uf087'
const MESSAGE_IDLE = 'Idle'

export class SignalElement extends HTMLElement {
  tooltip: Disposable;

  createdCallback() {
    this.update([])
    this.textContent = ICON
    this.classList.add('inline-block')
  }
  update(titles: Array<string>) {
    if (titles.length) {
      this.setBusy(true)
      this.setTooltip(titles.map(escape).join('<br>'))
    } else {
      this.setBusy(false)
      this.setTooltip(MESSAGE_IDLE)
    }
  }
  setBusy(busy: boolean) {
    if (busy) {
      this.classList.add('busy')
      this.classList.remove('idle')
    } else {
      this.classList.add('idle')
      this.classList.remove('busy')
    }
  }
  setTooltip(title: string) {
    if (this.tooltip) {
      this.tooltip.dispose()
    }
    this.tooltip = atom.tooltips.add(this, {
      title: `<div style="text-align: left;">${title}</div>`,
    })
  }
  dispose() {
    this.tooltip.dispose()
  }
}

const element = document.registerElement('busy-signal', {
  prototype: SignalElement.prototype,
})

export default element
