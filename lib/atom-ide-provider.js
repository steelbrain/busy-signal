/* @flow */

// eslint-disable-next-line import/no-unresolved
import type { BusySignalOptions, BusyMessage } from "atom-ide/busy-signal";
import type Provider from "./provider";

export class AtomIdeProvider {
  createProvider: () => Provider;
  messages: Set<BusyMessage> = new Set();

  constructor(createProvider: () => Provider) {
    this.createProvider = createProvider;
  }

  async reportBusyWhile<T>(
    title: string,
    f: () => Promise<T>,
    options?: BusySignalOptions
  ): Promise<T> {
    const busyMessage = this.reportBusy(title, options);
    try {
      return await f();
    } finally {
      busyMessage.dispose();
    }
  }

  reportBusy(title: string, options?: BusySignalOptions): BusyMessage {
    const provider = this.createProvider();

    let providerOptions = null;
    if (options) {
      providerOptions = {
        onlyForFile: options.onlyForFile,
        onDidClick: options.onDidClick
      };
    }

    provider.add(title, providerOptions);

    const busyMessage = {
      setTitle: (newTitle: string) => {
        provider.changeTitle(newTitle, title);
      },
      dispose: () => {
        provider.dispose();
        this.messages.delete(busyMessage);
      }
    };
    this.messages.add(busyMessage);

    return busyMessage;
  }

  dispose(): void {
    this.messages.forEach(msg => {
      msg.dispose();
    });
    this.messages.clear();
  }
}
