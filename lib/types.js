/* @flow */

import type Provider from './provider'

export type SignalInternal = {
  title: string,
  priority: number,
  provider: Provider,
  timeAdded: number,
  timeRemoved: ?number,
}
