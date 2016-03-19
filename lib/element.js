'use babel'

/* @flow */

import type { Disposable } from 'atom'

const ICON = '\uf087'
const MESSAGE_IDLE = 'Idle'

export class SignalElement extends HTMLElement {
  tooltip: Disposable;

  createdCallback() {
    this.setTitles([])
    this.textContent = ICON
    this.classList.add('inline-block')
  }
  setTitles(titles: Array<string>) {
    if (titles.length) {
      this.setBusy(true)
      this.setTooltip(titles.join('<br>'))
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
