'use babel'

/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import ProviderSingleLine from './provider-single-line'
import ProviderMultiLine from './provider-multi-line'
import type { Disposable } from 'atom'

export default class SignalRegistry {
  emitter: Emitter;
  providers: Set<ProviderSingleLine | ProviderMultiLine>;
  subscriptions: CompositeDisposable;

  constructor() {
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  create(singleLine: boolean = false): ProviderSingleLine | ProviderMultiLine {
    let provider
    if (singleLine) {
      provider = new ProviderSingleLine()
    } else {
      provider = new ProviderMultiLine()
    }
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
  onDidUpdate(callback: Function): Disposable {
    return this.emitter.on('did-update', callback)
  }
  // Private method
  dispose() {
    this.subscriptions.dispose()
  }
}