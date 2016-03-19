'use babel'

/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import type { Disposable } from 'atom'
import type { BusySignal$Signal } from './types'

export default class Provider {
  texts: Set<BusySignal$Signal>;
  emitter: Emitter;
  subscriptions: CompositeDisposable;

  constructor() {
    this.texts = new Set()
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  add(title: string, priority: number = 100) {
    this.texts.add({ title, priority })
    this.emitter.emit('did-change')
  }
  remove(title: string) {
    for (const entry of this.texts) {
      if (entry.title === title) {
        this.texts.delete(entry)
        this.emitter.emit('did-change')
        break
      }
    }
  }
  clear() {
    if (this.texts.size) {
      this.texts.clear()
      this.emitter.emit('did-change')
    }
  }
  onDidChange(callback: Function): Disposable {
    return this.emitter.on('did-change', callback)
  }
  onDidDestroy(callback: Function): Disposable {
    return this.emitter.on('did-destroy', callback)
  }
  dispose() {
    this.emitter.emit('did-destroy')
    this.subscriptions.dispose()
  }
}
