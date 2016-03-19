'use babel'

/* @flow */

import { CompositeDisposable } from 'atom'
import disposify from 'disposify'
import SignalElement from './element'
import Registry from './registry'

export default class BusySignal {
  element: SignalElement;
  registry: Registry;
  subscriptions: CompositeDisposable;

  constructor() {
    this.element = new SignalElement()
    this.registry = new Registry()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.element)
    this.subscriptions.add(this.registry)

    this.registry.onDidUpdate(() => {
      this.element.setTitles(this.registry.getTitles())
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
