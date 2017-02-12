/* @flow */

import escape from 'escape-html'
import type { Disposable } from 'atom'

const MESSAGE_IDLE = 'Idle'

export class SignalElement extends HTMLElement {
  tooltip: Disposable;
  activatedLast: ?number;
  deactivateTimer: ?number;

  // $FlowIgnore: Flow has invalid typing of createdCallback
  createdCallback() {
    this.update([], [])
    this.classList.add('inline-block')
    this.classList.add('loading-spinner-tiny')
  }
  update(titles: Array<string>, history: Array<{ title: string, duration: string }>) {
    this.setBusy(!!titles.length)
    const tooltipMessage = []
    if (history.length) {
      tooltipMessage.push('<strong>History:</strong>', history.map(function(item) {
        return `${escape(item.title)} ( duration: ${item.duration} )`
      }).join('<br>'))
    }
    if (titles.length) {
      tooltipMessage.push('<strong>Current:</strong>', titles.map(escape).join('<br>'))
    }
    if (tooltipMessage.length) {
      this.setTooltip(tooltipMessage.join('<br>'))
    } else {
      this.setTooltip(MESSAGE_IDLE)
    }
  }
  setBusy(busy: boolean) {
    if (busy) {
      this.classList.add('busy')
      this.classList.remove('idle')
      this.activatedLast = Date.now()
      clearTimeout(this.deactivateTimer)
    } else {
      // The logic below makes sure that busy signal is shown for at least 1 second
      const timeNow = Date.now()
      const timeThen = this.activatedLast || 0
      const timeDifference = timeNow - timeThen
      if (timeDifference < 1000) {
        this.deactivateTimer = setTimeout(() => this.setBusy(false), timeDifference + 100)
      } else {
        this.classList.add('idle')
        this.classList.remove('busy')
      }
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
