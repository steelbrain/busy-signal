'use babel'

/* @flow */

import BusySignal from './main'

module.exports = {
  activate() {
    this.instance = new BusySignal()
  },
  consumeStatusBar(statusBar: Object) {
    this.instance.attach(statusBar)
  },
  deactivate() {
    this.instance.dispose()
  }
}
