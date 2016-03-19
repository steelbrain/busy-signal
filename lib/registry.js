'use babel'

/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import Provider from './provider'
import type { Disposable } from 'atom'

export default class Registry {
  emitter: Emitter;
  providers: Set<Provider>;
  subscriptions: CompositeDisposable;

  constructor() {
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
      return b.priority - a.priority
    }).map(function(item) {
      return item.title
    })
  }
  onDidUpdate(callback: Function): Disposable {
    return this.emitter.on('did-update', callback)
  }
  // Private method
  dispose() {
    this.subscriptions.dispose()
  }
}
