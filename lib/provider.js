/* @flow */

import getUUID4 from 'uuid4'
import { CompositeDisposable, Emitter } from 'atom'
import type { Disposable } from 'atom'

export default class Provider {
  id: string;
  emitter: Emitter;
  subscriptions: CompositeDisposable;

  constructor() {
    this.id = getUUID4()
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  // Public
  add(title: string) {
    this.emitter.emit('did-add', title)
  }
  // Public
  remove(title: string) {
    this.emitter.emit('did-remove', title)
  }
  // Public
  clear() {
    this.emitter.emit('did-clear')
  }
  onDidAdd(callback: ((title: string) => any)): Disposable {
    return this.emitter.on('did-add', callback)
  }
  onDidRemove(callback: ((title: string) => any)): Disposable {
    return this.emitter.on('did-remove', callback)
  }
  onDidClear(callback: (() => any)): Disposable {
    return this.emitter.on('did-clear', callback)
  }
  onDidDispose(callback: Function): Disposable {
    return this.emitter.on('did-dispose', callback)
  }
  dispose() {
    this.emitter.emit('did-dispose')
    this.subscriptions.dispose()
  }
}
