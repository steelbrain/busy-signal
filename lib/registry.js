/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import type { Disposable } from 'atom'
import Provider from './provider'

export default class Registry {
  history: Array<string>;
  emitter: Emitter;
  providers: Set<Provider>;
  subscriptions: CompositeDisposable;

  constructor() {
    this.history = []
    this.emitter = new Emitter()
    this.providers = new Set()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  create(): Provider {
    const provider = new Provider()
    provider.onDidChange(() => {
      this.emitter.emit('did-update')
    })
    provider.onDidDestroy(() => {
      this.subscriptions.remove(provider)
      this.providers.delete(provider)
      this.emitter.emit('did-change')
    })
    this.subscriptions.add(provider)
    this.providers.add(provider)
    return provider
  }
  getTitles(): Array<string> {
    let texts = []
    for (const provider of this.providers) {
      texts = texts.concat(Array.from(provider.texts))
    }
    return texts.sort(function(a, b) {
      return a.priority - b.priority
    }).map(function(item) {
      return item.title
    })
  }
  getHistory(): Array<string> {
    return this.history
  }
  updateHistory(): void {
    this.history = this.history.concat(this.getTitles()).slice(-5)
  }
  onDidUpdate(callback: Function): Disposable {
    return this.emitter.on('did-update', callback)
  }
  // Private method
  dispose() {
    this.subscriptions.dispose()
  }
}
