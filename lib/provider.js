/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import type { Disposable } from 'atom'

export default class Provider {
  texts: Set<string>;
  emitter: Emitter;
  subscriptions: CompositeDisposable;

  constructor() {
    this.texts = new Set()
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  // Public
  add(title: string, priority: number = 100) {
    this.emitter.emit('did-add', { title, priority })
  }
  // Public
  remove(title: string) {
    this.emitter.emit('did-remove', title)
  }
  // Public
  clear() {
    this.emitter.emit('did-clear')
  }
  onDidAdd(callback: ((status: { title: string, priority:number }) => any)): Disposable {
    return this.emitter.on('did-add', callback)
  }
  onDidRemove(callback: ((title: string) => any)): Disposable {
    return this.emitter.on('did-remove', callback)
  }
  onDidClear(callback: (() => any)): Disposable {
    return this.emitter.on('did-clear', callback)
  }
  onDidDestroy(callback: Function): Disposable {
    return this.emitter.on('did-destroy', callback)
  }
  dispose() {
    this.emitter.emit('did-destroy')
    this.subscriptions.dispose()
  }
}
