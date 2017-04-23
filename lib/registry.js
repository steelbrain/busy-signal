/* @flow */

import ms from 'ms'
import { CompositeDisposable, Emitter } from 'atom'
import type { Disposable } from 'atom'

import Provider from './provider'
import type { SignalInternal } from './types'

export default class Registry {
  emitter: Emitter
  providers: Set<Provider>
  itemsActive: Array<SignalInternal>
  itemsHistory: Array<SignalInternal>
  subscriptions: CompositeDisposable

  constructor() {
    this.emitter = new Emitter()
    this.providers = new Set()
    this.itemsActive = []
    this.itemsHistory = []
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  // Public method
  create(): Provider {
    const provider = new Provider()
    provider.onDidAdd((status) => {
      this.statusAdd(provider, status)
    })
    provider.onDidRemove((title) => {
      this.statusRemove(provider, title)
    })
    provider.onDidClear(() => {
      this.statusClear(provider)
    })
    provider.onDidDispose(() => {
      this.statusClear(provider)
      this.providers.delete(provider)
    })
    this.providers.add(provider)
    return provider
  }
  statusAdd(provider: Provider, status: { title: string, priority: number }): void {
    for (let i = 0; i < this.itemsActive.length; i++) {
      const entry = this.itemsActive[i]
      if (entry.title === status.title && entry.provider === provider) {
        // Item already exists, ignore
        break
      }
    }

    this.itemsActive.push({
      title: status.title,
      priority: status.priority,
      provider,
      timeAdded: Date.now(),
      timeRemoved: null,
    })
    this.emitter.emit('did-update')
  }
  statusRemove(provider: Provider, title: string): void {
    for (let i = 0; i < this.itemsActive.length; i++) {
      const entry = this.itemsActive[i]
      if (entry.provider === provider && entry.title === title) {
        this.pushIntoHistory(i, entry)
        this.emitter.emit('did-update')
        break
      }
    }
  }
  statusClear(provider: Provider): void {
    let triggerUpdate = false
    for (let i = 0; i < this.itemsActive.length; i++) {
      const entry = this.itemsActive[i]
      if (entry.provider === provider) {
        this.pushIntoHistory(i, entry)
        triggerUpdate = true
        i--
      }
    }
    if (triggerUpdate) {
      this.emitter.emit('did-update')
    }
  }
  pushIntoHistory(index: number, item: SignalInternal): void {
    item.timeRemoved = Date.now()
    this.itemsActive.splice(index, 1)
    this.itemsHistory = this.itemsHistory.concat([item]).slice(-1000)
  }
  getActiveTitles(): Array<string> {
    return this.itemsActive.slice().sort(function(a, b) {
      return a.priority - b.priority
    }).map(i => i.title)
  }
  getOldTitles(): Array<{ title: string, duration: string }> {
    const toReturn = []
    const history = this.itemsHistory
    const activeTitles = this.getActiveTitles()
    const mergedTogether = history.map(i => i.title).concat(activeTitles)

    for (let i = 0, length = history.length; i < length; i++) {
      const item = history[i]
      if (mergedTogether.lastIndexOf(item.title) === i) {
        toReturn.push({
          title: item.title,
          duration: ms(item.timeRemoved && item.timeRemoved - item.timeAdded),
        })
      }
    }

    return toReturn
  }
  onDidUpdate(callback: Function): Disposable {
    return this.emitter.on('did-update', callback)
  }
  dispose() {
    this.subscriptions.dispose()
    for (const provider of this.providers) {
      provider.dispose()
    }
  }
}
