'use babel'

/* @flow */

import { CompositeDisposable } from 'atom'
import disposify from 'disposify'
import SignalElement from './element'
import SignalRegistry from './signal-registry'

export default class BusySignal {
  element: SignalElement;
  registry: SignalRegistry;
  subscriptions: CompositeDisposable;

  constructor() {
    this.element = new SignalElement()
    this.registry = new SignalRegistry()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.element)
    this.subscriptions.add(this.registry)

    this.registry.onDidUpdate(() => {
      console.log('Provider updated')
    })
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
