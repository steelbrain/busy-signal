/* @flow */

import type Provider from './provider'

export type Signal = {
  key: string,
  title: string,
  priority: number,
}

export type SignalInternal = {
  title: string,
  priority: number,
  provider: Provider,
  timeAdded: number,
  timeRemoved: ?number,
}
