'use babel'

/* @flow */

import { CompositeDisposable } from 'atom'
import type { Disposable } from 'atom'

const ICON_BUSY = '\uf087'
const ICON_IDLE = '\uf06d'
const MESSAGE_IDLE = 'Idle'

export class SignalElement extends HTMLElement {
  tooltip: Disposable;
  subscriptions: CompositeDisposable;

  createdCallback() {
    this.subscriptions = new CompositeDisposable()
    this.setBusy(false)
    this.setTooltip(MESSAGE_IDLE)
    this.classList.add('inline-block')
  }
  setBusy(busy: boolean) {
    if (busy) {
      this.textContent = ICON_BUSY
      this.classList.add('busy')
      this.classList.remove('idle')
    } else {
      this.textContent = ICON_IDLE
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
    this.subscriptions.dispose()
    this.tooltip.dispose()
  }
}

const element = document.registerElement('busy-signal', {
  prototype: SignalElement.prototype
})

export default element
