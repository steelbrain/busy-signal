/* @flow */

import type Provider from './provider'

export type Signal = {
  title: string,
  priority: number,
  provider: Provider,
  timeAdded: number,
  timeRemoved: ?number,
}
