'use babel'

/* @flow */

import { CompositeDisposable } from 'atom'
import disposify from 'disposify'
import SignalElement from './element'

export default class BusySignal {
  element: SignalElement;
  subscriptions: CompositeDisposable;

  constructor() {
    this.element = new SignalElement()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.element)
  }
  attach(statusBar: Object) {
    this.subscriptions.add(disposify(statusBar.addRightTile({
      item: this.element,
      priority: 500
    })))
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
