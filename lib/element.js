'use babel'

/* @flow */

import type { Disposable } from 'atom'

const ICON = '\uf087'
const MESSAGE_IDLE = 'Idle'

export class SignalElement extends HTMLElement {
  tooltip: Disposable;

  createdCallback() {
    this.setBusy(false)
    this.setTooltip(MESSAGE_IDLE)
    this.textContent = ICON
    this.classList.add('inline-block')
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
      title
    })
  }
  dispose() {
    this.tooltip.dispose()
  }
}

const element = document.registerElement('busy-signal', {
  prototype: SignalElement.prototype
})

export default element
