/* @flow */

import escape from 'escape-html'
import type { Disposable } from 'atom'

const ICON = '\uf087'
const MESSAGE_IDLE = 'Idle'

export class SignalElement extends HTMLElement {
  tooltip: Disposable;

  createdCallback() {
    this.update([], [])
    this.textContent = ICON
    this.classList.add('inline-block')
  }
  update(titles: Array<string>, history: Array<string>) {
    this.setBusy(!!titles.length)
    let historyMessage = null
    if (history.length) {
      historyMessage = `<strong>History:</strong><br>${history.map(escape).join('<br>')}`
    }
    let titlesMessage = null
    if (titles.length) {
      titlesMessage = titles.map(escape).join('<br>')
    }
    if (historyMessage) {
      if (titlesMessage) {
        this.setTooltip(`${historyMessage}<br><strong>Current:</strong><br>${titlesMessage}`)
      } else {
        this.setTooltip(historyMessage)
      }
    } else if (titlesMessage) {
      this.setTooltip(titlesMessage)
    } else {
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
