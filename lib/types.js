/* @flow */

import type Provider from './provider'

export type SignalInternal = {
  key: string,
  title: string,
  provider: Provider,
  timeStarted: number,
  timeStopped: ?number,
}
