/* @flow */

import BusySignal from './main'
import type SignalRegistry from './registry'

module.exports = {
  activate() {
    this.instance = new BusySignal()
  },
  consumeStatusBar(statusBar: Object) {
    this.instance.attach(statusBar)
  },
  providerRegistry(): SignalRegistry {
    return this.instance.registry
  },
  deactivate() {
    this.instance.dispose()
  },
}
